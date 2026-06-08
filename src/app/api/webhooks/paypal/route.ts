import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { paypalRequest } from '@/lib/paypal/server';
import { updateSupabaseOrder } from '@/lib/supabase/orders';

type PayPalWebhookEvent = {
  id?: string;
  event_type?: string;
  resource?: {
    id?: string;
    status?: string;
    custom_id?: string;
    invoice_id?: string;
  };
};

type PayPalWebhookVerification = {
  verification_status?: 'SUCCESS' | 'FAILURE';
};

export async function POST(request: Request) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    return NextResponse.json({ error: 'Webhook PayPal non configurato' }, { status: 400 });
  }

  const body = await request.json().catch(() => null) as PayPalWebhookEvent | null;
  if (!body) return NextResponse.json({ error: 'Payload PayPal non valido' }, { status: 400 });

  const requestHeaders = await headers();
  const verification = await paypalRequest<PayPalWebhookVerification>({
    path: '/v1/notifications/verify-webhook-signature',
    body: {
      auth_algo: requestHeaders.get('paypal-auth-algo'),
      cert_url: requestHeaders.get('paypal-cert-url'),
      transmission_id: requestHeaders.get('paypal-transmission-id'),
      transmission_sig: requestHeaders.get('paypal-transmission-sig'),
      transmission_time: requestHeaders.get('paypal-transmission-time'),
      webhook_id: webhookId,
      webhook_event: body
    }
  });

  if (verification.verification_status !== 'SUCCESS') {
    return NextResponse.json({ error: 'Firma webhook PayPal non valida' }, { status: 400 });
  }

  const internalOrderId = body.resource?.custom_id ?? body.resource?.invoice_id;
  if (internalOrderId && body.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
    await updateSupabaseOrder({
      orderId: internalOrderId,
      status: 'paid',
      paymentStatus: 'paid',
      fulfillmentStatus: 'ready_to_prepare',
      shippingStatus: 'not_ready',
      internalNotes: `Pagamento PayPal confermato da webhook. Capture: ${body.resource?.id ?? 'n/d'}`
    });
  }

  if (internalOrderId && body.event_type === 'PAYMENT.CAPTURE.DENIED') {
    await updateSupabaseOrder({
      orderId: internalOrderId,
      paymentStatus: 'failed',
      fulfillmentStatus: 'blocked',
      internalNotes: `Pagamento PayPal negato da webhook. Capture: ${body.resource?.id ?? 'n/d'}`
    });
  }

  return NextResponse.json({ received: true });
}
