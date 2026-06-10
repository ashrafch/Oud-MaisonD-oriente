import type { CartItem, CustomerDraft } from '@/lib/cart/store';
import { createSupabaseOrder } from '@/lib/supabase/orders';
import { getSupabaseProducts } from '@/lib/supabase/catalog';
import { stripe } from './server';

type StripeCheckoutInput = {
  items: CartItem[];
  customer: CustomerDraft;
  couponCode?: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  siteUrl?: string;
};

export async function createCheckoutSession(input: StripeCheckoutInput) {
  if (!stripe) return { url: null };
  const siteUrl = input.siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const internalOrder = await createSupabaseOrder({
    ...input,
    status: 'new',
    paymentStatus: 'pending',
    fulfillmentStatus: 'new',
    paymentProvider: 'stripe',
    skipEmails: true
  });

  const products = await getSupabaseProducts({ includeHidden: true });
  const productSummary = input.items
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId || entry.slug === item.productId);
      return `${product?.name ?? item.productId} x ${item.quantity}`;
    })
    .join(', ');

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: input.customer.email,
    success_url: `${siteUrl}/checkout/success?order=${internalOrder.id}&payment=stripe&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout/cancel?order=${internalOrder.id}`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(internalOrder.total * 100),
          product_data: {
            name: 'Ordine OUDE Maison D Oriente',
            description: productSummary.slice(0, 500)
          }
        }
      }
    ],
    metadata: {
      orderId: internalOrder.id,
      paymentProvider: 'stripe'
    },
    payment_intent_data: {
      metadata: {
        orderId: internalOrder.id,
        paymentProvider: 'stripe'
      }
    }
  });

  return { url: session.url, orderId: internalOrder.id };
}
