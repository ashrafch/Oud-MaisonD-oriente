import type { CartItem, CustomerDraft } from '@/lib/cart/store';
import { createSupabaseOrder, updateSupabaseOrder } from '@/lib/supabase/orders';
import { getSupabaseProducts } from '@/lib/supabase/catalog';
import { paypalAmount, paypalRequest } from './server';

type PayPalCreateInput = {
  items: CartItem[];
  customer: CustomerDraft;
  couponCode?: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
};

type PayPalCreateResponse = {
  id: string;
  status: string;
};

type PayPalCaptureResponse = {
  id: string;
  status: string;
  purchase_units?: {
    payments?: {
      captures?: { id: string; status: string }[];
    };
  }[];
};

export async function createPayPalCheckoutOrder(input: PayPalCreateInput) {
  const internalOrder = await createSupabaseOrder({
    ...input,
    status: 'new',
    paymentStatus: 'pending',
    fulfillmentStatus: 'new',
    paymentProvider: 'paypal',
    skipEmails: true
  });

  const products = await getSupabaseProducts({ includeHidden: true });
  const purchaseItems = input.items.map((item) => {
    const product = products.find((entry) => entry.id === item.productId || entry.slug === item.productId);
    return {
      name: (product?.name ?? item.productId).slice(0, 127),
      quantity: String(item.quantity),
      unit_amount: {
        currency_code: 'EUR',
        value: paypalAmount(product?.price ?? 0)
      }
    };
  });

  const paypalOrder = await paypalRequest<PayPalCreateResponse>({
    path: '/v2/checkout/orders',
    body: {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: internalOrder.id,
          custom_id: internalOrder.id,
          invoice_id: internalOrder.id,
          shipping: {
            name: {
              full_name: input.customer.fullName
            },
            address: {
              address_line_1: input.customer.address,
              admin_area_2: input.customer.city,
              postal_code: input.customer.zip,
              country_code: 'IT'
            }
          },
          amount: {
            currency_code: 'EUR',
            value: paypalAmount(internalOrder.total),
            breakdown: {
              item_total: { currency_code: 'EUR', value: paypalAmount(internalOrder.subtotal) },
              discount: { currency_code: 'EUR', value: paypalAmount(internalOrder.discount) },
              shipping: { currency_code: 'EUR', value: paypalAmount(internalOrder.shipping) }
            }
          },
          items: purchaseItems
        }
      ],
      application_context: {
        brand_name: 'OUDE Maison D Oriente',
        shipping_preference: 'SET_PROVIDED_ADDRESS',
        user_action: 'PAY_NOW'
      }
    }
  });

  await updateSupabaseOrder({
    orderId: internalOrder.id,
    paymentStatus: 'pending',
    internalNotes: `Pagamento PayPal in attesa. PayPal order: ${paypalOrder.id}`
  });

  return { paypalOrderId: paypalOrder.id, orderId: internalOrder.id };
}

export async function capturePayPalCheckoutOrder(paypalOrderId: string, orderId?: string) {
  const capture = await paypalRequest<PayPalCaptureResponse>({
    path: `/v2/checkout/orders/${paypalOrderId}/capture`,
    body: {}
  });

  const isCompleted = capture.status === 'COMPLETED';
  if (orderId) {
    await updateSupabaseOrder({
      orderId,
      status: isCompleted ? 'paid' : 'new',
      paymentStatus: isCompleted ? 'paid' : 'pending',
      fulfillmentStatus: isCompleted ? 'ready_to_prepare' : 'new',
      shippingStatus: 'not_ready',
      internalNotes: `PayPal capture ${capture.id}: ${capture.status}`
    });
  }

  return { status: capture.status, orderId };
}
