import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret || !stripe) return NextResponse.json({ error: 'Webhook non configurato' }, { status: 400 });
  const event = stripe.webhooks.constructEvent(body, signature, secret);
  if (event.type === 'checkout.session.completed') {
    // TODO: creare ordine, aggiornare inventario, inviare email conferma.
  }
  return NextResponse.json({ received: true });
}
