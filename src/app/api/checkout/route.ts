import { readJsonBody } from '@/lib/security/json-body';
import { guardPublicRequest } from '@/lib/security/request-guard';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createCheckoutSession } from '@/lib/stripe/checkout';
import { checkStockAvailability } from '@/lib/supabase/fulfillment';
import { createSupabaseOrder } from '@/lib/supabase/orders';

const checkoutSchema = z.object({
  mode: z.enum(['manual_order', 'stripe_checkout']).optional(),
  items: z.array(z.object({
    productId: z.string().min(1).max(200),
    quantity: z.number().int().positive().max(100)
  })).min(1).max(50),
  customer: z.object({
    fullName: z.string().min(2).max(200),
    email: z.string().email(),
    phone: z.string().min(5).max(40),
    address: z.string().min(3).max(300),
    city: z.string().min(2).max(150),
    zip: z.string().min(3).max(20),
    notes: z.string().max(2000).optional()
  }),
  couponCode: z.string().optional(),
  subtotal: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  shipping: z.number().nonnegative(),
  total: z.number().nonnegative()
});

export async function POST(request: Request) {
  const blocked = await guardPublicRequest(request, 'checkout', 20);
  if (blocked) return blocked;
  const body = checkoutSchema.safeParse(await readJsonBody(request).catch(() => null));
  if (!body.success) return NextResponse.json({ error: 'Dati checkout non validi' }, { status: 400 });

  const outOfStock = await checkStockAvailability(body.data.items);
  if (outOfStock) {
    return NextResponse.json(
      { error: `Disponibilita insufficiente: ${outOfStock.join(', ')}`, outOfStock },
      { status: 409 }
    );
  }

  if (body.data.mode === 'manual_order') {
    try {
      const order = await createSupabaseOrder(body.data);
      return NextResponse.json({ order });
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : 'Errore creazione ordine' }, { status: 500 });
    }
  }

  if (body.data.mode === 'stripe_checkout') {
    try {
      const session = await createCheckoutSession({ ...body.data, siteUrl: new URL(request.url).origin });
      if (session.url) return NextResponse.json(session);
      return NextResponse.json({ error: 'Stripe Checkout non configurato' }, { status: 501 });
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : 'Errore checkout Stripe' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Modalita checkout non valida' }, { status: 400 });
}
