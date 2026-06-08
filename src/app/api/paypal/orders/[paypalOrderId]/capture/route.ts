import { NextResponse } from 'next/server';
import { z } from 'zod';
import { capturePayPalCheckoutOrder } from '@/lib/paypal/checkout';
import { isPayPalConfigured } from '@/lib/paypal/server';

const captureSchema = z.object({
  orderId: z.string().min(1).optional()
});

export async function POST(request: Request, { params }: { params: Promise<{ paypalOrderId: string }> }) {
  if (!isPayPalConfigured()) {
    return NextResponse.json({ error: 'PayPal non configurato' }, { status: 501 });
  }

  const { paypalOrderId } = await params;
  const payload = captureSchema.safeParse(await request.json().catch(() => ({})));
  if (!payload.success) {
    return NextResponse.json({ error: 'Dati capture PayPal non validi' }, { status: 400 });
  }

  try {
    const capture = await capturePayPalCheckoutOrder(paypalOrderId, payload.data.orderId);
    return NextResponse.json(capture);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Errore capture PayPal' }, { status: 500 });
  }
}
