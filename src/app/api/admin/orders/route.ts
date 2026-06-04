import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdminApiSession } from '@/lib/admin/auth';
import { getSupabaseOrders, updateSupabaseOrder } from '@/lib/supabase/orders';
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
