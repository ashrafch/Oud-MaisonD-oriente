import { readJsonBody } from '@/lib/security/json-body';
import { guardPublicRequest } from '@/lib/security/request-guard';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createPayPalCheckoutOrder } from '@/lib/paypal/checkout';
import { isPayPalConfigured } from '@/lib/paypal/server';

const paypalOrderSchema = z.object({
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
  const blocked = await guardPublicRequest(request, 'paypal-create', 20);
  if (blocked) return blocked;
  if (!isPayPalConfigured()) {
    return NextResponse.json({ error: 'PayPal non configurato' }, { status: 501 });
  }

  const payload = paypalOrderSchema.safeParse(await readJsonBody(request).catch(() => null));
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
