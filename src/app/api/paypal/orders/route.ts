import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createPayPalCheckoutOrder } from '@/lib/paypal/checkout';
import { isPayPalConfigured } from '@/lib/paypal/server';

const paypalOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().positive()
  })).min(1),
  customer: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(5),
    address: z.string().min(3),
    city: z.string().min(2),
    zip: z.string().min(3),
    notes: z.string().optional()
  }),
  couponCode: z.string().optional(),
  subtotal: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  shipping: z.number().nonnegative(),
  total: z.number().nonnegative()
});

export async function POST(request: Request) {
  if (!isPayPalConfigured()) {
    return NextResponse.json({ error: 'PayPal non configurato' }, { status: 501 });
  }

  const payload = paypalOrderSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) {
    return NextResponse.json({ error: 'Dati checkout PayPal non validi' }, { status: 400 });
  }

  try {
    const order = await createPayPalCheckoutOrder(payload.data);
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Errore creazione ordine PayPal' }, { status: 500 });
  }
}
