import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendOrderPreparingEmail, sendOrderRefundedEmail, sendOrderShippedEmail } from '@/lib/email/order-email';
import { stripe } from '@/lib/stripe/server';
import { requireAdminApiSession } from '@/lib/admin/auth';
import { restoreStockForRefundedOrder } from '@/lib/supabase/fulfillment';
import { createSupabaseOrder, getSupabaseOrders, updateSupabaseOrder } from '@/lib/supabase/orders';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { Order } from '@/lib/cart/store';

const statuses: Order['status'][] = ['new', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded'];
const paymentStatuses = ['manual_pending', 'pending', 'paid', 'failed', 'refunded'] as const;
const fulfillmentStatuses = ['new', 'ready_to_prepare', 'preparing', 'packed', 'completed', 'blocked'] as const;
const shippingStatuses = ['not_ready', 'pickup_ready', 'waiting_courier', 'shipped', 'delivered', 'returned'] as const;

const updateOrderSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(statuses as [Order['status'], ...Order['status'][]]).optional(),
  paymentStatus: z.enum(paymentStatuses).optional(),
  fulfillmentStatus: z.enum(fulfillmentStatuses).optional(),
  shippingStatus: z.enum(shippingStatuses).optional(),
  trackingCode: z.string().trim().max(120).optional(),
  internalNotes: z.string().trim().max(1200).optional()
});

const refundActionSchema = z.object({
  orderId: z.string().min(1),
  action: z.literal('refund')
});

const createOrderSchema = z.object({
  action: z.literal('create'),
  customer: z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().default(''),
    address: z.string().default(''),
    zip: z.string().default(''),
    city: z.string().default(''),
    notes: z.string().default('')
  }),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1)
  })).min(1),
  paymentMethod: z.enum(['manual', 'cash', 'bank_transfer']).default('manual'),
  paymentStatus: z.enum(['manual_pending', 'paid']).default('manual_pending'),
  internalNotes: z.string().optional(),
  sendEmail: z.boolean().default(true)
});

export async function GET() {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return unauthorized();
    const orders = await getSupabaseOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return unauthorized();
    const payload = updateOrderSchema.safeParse(await request.json());
    if (!payload.success) return NextResponse.json({ error: 'Dati ordine non validi' }, { status: 400 });

    await updateSupabaseOrder(payload.data);

    const { orderId, status, trackingCode } = payload.data;
    if (status === 'preparing') {
      void sendOrderPreparingEmail(orderId).catch((err) => console.error('Preparing email failed', err));
    }
    if (status === 'shipped') {
      void sendOrderShippedEmail(orderId).catch((err) => console.error('Shipped email failed', err));
    }
    if (trackingCode && !status) {
      // Tracking code saved: if order is already shipped, resend is blocked by idempotency flag
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return unauthorized();

    const body = await request.json() as Record<string, unknown>;

    if (body.action === 'create') {
      const parsed = createOrderSchema.safeParse(body);
      if (!parsed.success) return NextResponse.json({ error: 'Dati ordine non validi' }, { status: 400 });
      const { customer, items, paymentMethod, paymentStatus, internalNotes, sendEmail } = parsed.data;
      const paymentLabel = { manual: 'Manuale', cash: 'Contanti', bank_transfer: 'Bonifico' }[paymentMethod];
      const noteText = internalNotes ? `Metodo: ${paymentLabel}. ${internalNotes}` : `Metodo: ${paymentLabel}`;
      const result = await createSupabaseOrder({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        customer,
        subtotal: 0,
        discount: 0,
        shipping: 0,
        total: 0,
        paymentProvider: 'manual',
        paymentStatus,
        status: paymentStatus === 'paid' ? 'paid' : 'new',
        fulfillmentStatus: paymentStatus === 'paid' ? 'ready_to_prepare' : 'new',
        skipEmails: !sendEmail
      });
      await updateSupabaseOrder({ orderId: result.id, internalNotes: noteText });
      return NextResponse.json({ ok: true, orderId: result.id });
    }

    const payload = refundActionSchema.safeParse(body);
    if (!payload.success) return NextResponse.json({ error: 'Parametri non validi' }, { status: 400 });

    const { orderId } = payload.data;
    const supabase = createSupabaseServiceClient() as any;
    if (!supabase) return NextResponse.json({ error: 'Supabase non disponibile' }, { status: 503 });

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, stripe_checkout_session_id, payment_status, total_amount')
      .eq('id', orderId)
      .single();
    if (orderError || !order) return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 });
    if (order.payment_status === 'refunded') {
      return NextResponse.json({ error: 'Ordine già rimborsato' }, { status: 409 });
    }

    if (stripe && order.stripe_checkout_session_id) {
      const session = await stripe.checkout.sessions.retrieve(order.stripe_checkout_session_id as string);
      const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : null;
      if (paymentIntentId) {
        await stripe.refunds.create({ payment_intent: paymentIntentId });
      }
    }

    await updateSupabaseOrder({
      orderId,
      status: 'refunded',
      paymentStatus: 'refunded',
      fulfillmentStatus: 'blocked',
      internalNotes: 'Rimborso elaborato da pannello admin.'
    });

    await restoreStockForRefundedOrder(orderId);
    await sendOrderRefundedEmail(orderId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

function unauthorized() {
  return NextResponse.json({ error: 'Accesso admin richiesto' }, { status: 401 });
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Errore ordini Supabase';
}
