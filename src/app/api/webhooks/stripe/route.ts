import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendStripePaymentConfirmedEmails } from '@/lib/email/order-email';
import { stripe } from '@/lib/stripe/server';
import { decrementStockForPaidOrder } from '@/lib/supabase/fulfillment';
import { updateSupabaseOrder } from '@/lib/supabase/orders';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret || !stripe) return NextResponse.json({ error: 'Webhook non configurato' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ error: 'Firma Stripe non valida' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await updateSupabaseOrder({
        orderId,
        status: 'paid',
        paymentStatus: 'paid',
        fulfillmentStatus: 'ready_to_prepare',
        shippingStatus: 'not_ready',
        stripeCheckoutSessionId: session.id,
        internalNotes: `Pagamento Stripe confermato. Sessione: ${session.id}`
      });
      await decrementStockForPaidOrder(orderId);
      await sendStripePaymentConfirmedEmails(orderId);
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await updateSupabaseOrder({
        orderId,
        status: 'cancelled',
        paymentStatus: 'failed',
        fulfillmentStatus: 'blocked',
        stripeCheckoutSessionId: session.id,
        internalNotes: `Checkout Stripe scaduto. Sessione: ${session.id}`
      });
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata?.orderId;
    if (orderId) {
      await updateSupabaseOrder({
        orderId,
        paymentStatus: 'failed',
        fulfillmentStatus: 'blocked',
        internalNotes: `Pagamento Stripe fallito. PaymentIntent: ${paymentIntent.id}`
      });
    }
  }

  return NextResponse.json({ received: true });
}
