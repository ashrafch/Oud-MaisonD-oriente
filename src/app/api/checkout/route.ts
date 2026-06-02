import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe/checkout';

export async function POST() {
  const session = await createCheckoutSession();
  if (session.url) return NextResponse.redirect(session.url, { status: 303 });
  return NextResponse.json({ error: 'Stripe Checkout non configurato' }, { status: 501 });
}
