import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe/checkout';
import { createSupabaseOrder } from '@/lib/supabase/orders';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (body?.mode === 'manual_order') {
    try {
      const order = await createSupabaseOrder(body);
      return NextResponse.json({ order });
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : 'Errore creazione ordine' }, { status: 500 });
    }
  }

  const session = await createCheckoutSession();
  if (session.url) return NextResponse.redirect(session.url, { status: 303 });
  return NextResponse.json({ error: 'Stripe Checkout non configurato' }, { status: 501 });
}
