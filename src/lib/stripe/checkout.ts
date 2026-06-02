import { products } from '@/data/catalog';
import { stripe } from './server';

export async function createCheckoutSession() {
  if (!stripe) return { url: null };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${siteUrl}/checkout/success`,
    cancel_url: `${siteUrl}/checkout/cancel`,
    line_items: products.slice(0, 2).map((product) => ({
      quantity: 1,
      price_data: {
        currency: 'eur',
        unit_amount: Math.round(product.price * 100),
        product_data: { name: product.name, description: product.shortDescription }
      }
    })),
    metadata: { cart_source: 'mvp_seed' }
  });
}
