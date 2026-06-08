import type { CartItem, CustomerDraft, Order } from '@/lib/cart/store';
import { sendOrderEmails } from '@/lib/email/order-email';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { getSupabaseProducts } from './catalog';
import { getSupabaseCoupons } from './coupons';

export type AdminOrder = Omit<Order, 'items'> & {
  customerId?: string;
  customerValue?: number;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  shippingStatus?: string;
  trackingCode?: string;
  internalNotes?: string;
  items: AdminOrderItem[];
};

export type AdminOrderItem = CartItem & {
  productName?: string;
  unitPrice?: number;
};

type OrderNotes = {
  address?: string;
  city?: string;
  zip?: string;
  notes?: string;
  subtotal?: number;
  discount?: number;
  shipping?: number;
  couponCode?: string;
  paymentProvider?: 'manual' | 'stripe' | 'paypal';
  paymentReference?: string;
};

type OrderRow = {
  id: string;
  customer_id: string | null;
  status: Order['status'];
  payment_status: string | null;
  fulfillment_status: string | null;
  shipping_status: string | null;
  total_amount: number | string;
  tracking_code: string | null;
  internal_notes: string | null;
  created_at: string;
  customers?: {
    email: string;
    full_name: string | null;
    phone: string | null;
  } | null;
  order_items?: {
    product_id: string | null;
    product_name: string;
    quantity: number;
    unit_price: number | string;
  }[];
};

export async function createSupabaseOrder(input: {
  items: CartItem[];
  customer: CustomerDraft;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  status?: Order['status'];
  paymentStatus?: string;
  fulfillmentStatus?: string;
  paymentProvider?: 'manual' | 'stripe' | 'paypal';
  paymentReference?: string;
  skipEmails?: boolean;
}) {
  const supabase = createSupabaseServiceClient() as any;
  if (!supabase) throw new Error('Supabase service client non configurato');

  const email = input.customer.email.trim().toLowerCase();
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .upsert({
      email,
      full_name: input.customer.fullName,
      phone: input.customer.phone,
      updated_at: new Date().toISOString()
    }, { onConflict: 'email' })
    .select('id')
    .single();
  if (customerError) throw customerError;

  const products = await getSupabaseProducts({ includeHidden: true });
  const coupons = await getSupabaseCoupons();
  const subtotal = input.items.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId || entry.slug === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  const normalizedCoupon = input.couponCode?.trim().toUpperCase() ?? '';
  const coupon = coupons.find((entry) => entry.active && entry.code.toUpperCase() === normalizedCoupon);
  const discount = coupon?.type === 'percent' ? subtotal * (coupon.value / 100) : coupon?.type === 'fixed' ? coupon.value : 0;
  const shipping = subtotal - discount >= 79 || subtotal === 0 ? 0 : 6.9;
  const total = Math.max(0, subtotal - discount + shipping);

  const notes: OrderNotes = {
    address: input.customer.address,
    city: input.customer.city,
    zip: input.customer.zip,
    notes: input.customer.notes,
    subtotal,
    discount,
    shipping,
    couponCode: normalizedCoupon,
    paymentProvider: input.paymentProvider ?? 'manual',
    paymentReference: input.paymentReference
  };

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: customer.id,
      status: input.status ?? 'new',
      payment_status: input.paymentStatus ?? 'manual_pending',
      fulfillment_status: input.fulfillmentStatus ?? 'new',
      total_amount: total,
      currency: 'EUR',
      internal_notes: JSON.stringify(notes)
    })
    .select('id, created_at')
    .single();
  if (orderError) throw orderError;

  const orderItems = input.items.map((item) => {
    const product = products.find((entry) => entry.id === item.productId || entry.slug === item.productId);
    return {
      order_id: order.id,
      product_id: isUuid(item.productId) ? item.productId : product && isUuid(product.id) ? product.id : null,
      product_name: product?.name ?? item.productId,
      quantity: item.quantity,
      unit_price: product?.price ?? 0
    };
  });

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) throw itemsError;

  if (!input.skipEmails) {
    await sendOrderEmails({
      orderId: order.id,
      customer: input.customer,
      items: input.items,
      products,
      subtotal,
      discount,
      shipping,
      total
    });
  }

  return { id: order.id as string, createdAt: order.created_at as string };
}

export async function getSupabaseOrders(): Promise<AdminOrder[]> {
  const supabase = createSupabaseServiceClient() as any;
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('orders')
    .select('*, customers(email, full_name, phone), order_items(product_id, product_name, quantity, unit_price)')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return (data as OrderRow[]).map(mapOrderRow);
}

export async function updateSupabaseOrderStatus(orderId: string, status: Order['status']) {
  const supabase = createSupabaseServiceClient() as any;
  if (!supabase) throw new Error('Supabase service client non configurato');
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);
  if (error) throw error;
}

export async function updateSupabaseOrder(input: {
  orderId: string;
  status?: Order['status'];
  paymentStatus?: string;
  fulfillmentStatus?: string;
  shippingStatus?: string;
  trackingCode?: string;
  internalNotes?: string;
}) {
  const supabase = createSupabaseServiceClient() as any;
  if (!supabase) throw new Error('Supabase service client non configurato');

  const update: Record<string, string | null> = { updated_at: new Date().toISOString() };
  if (input.status) update.status = input.status;
  if (input.paymentStatus !== undefined) update.payment_status = input.paymentStatus;
  if (input.fulfillmentStatus !== undefined) update.fulfillment_status = input.fulfillmentStatus;
  if (input.shippingStatus !== undefined) update.shipping_status = input.shippingStatus;
  if (input.trackingCode !== undefined) update.tracking_code = input.trackingCode || null;

  if (input.internalNotes !== undefined) {
    const existing = await getOrderNotes(input.orderId);
    update.internal_notes = JSON.stringify({ ...existing, notes: input.internalNotes });
  }

  const { error } = await supabase.from('orders').update(update).eq('id', input.orderId);
  if (error) throw error;
}

async function getOrderNotes(orderId: string): Promise<OrderNotes> {
  const supabase = createSupabaseServiceClient() as any;
  if (!supabase) return {};
  const { data } = await supabase
    .from('orders')
    .select('internal_notes')
    .eq('id', orderId)
    .single();
  return parseNotes(data?.internal_notes ?? null);
}

function mapOrderRow(row: OrderRow): AdminOrder {
  const notes = parseNotes(row.internal_notes);
  return {
    id: row.id,
    customerId: row.customer_id ?? undefined,
    createdAt: row.created_at,
    status: row.status,
    paymentStatus: row.payment_status ?? undefined,
    fulfillmentStatus: row.fulfillment_status ?? undefined,
    shippingStatus: row.shipping_status ?? undefined,
    trackingCode: row.tracking_code ?? undefined,
    internalNotes: notes.notes,
    subtotal: notes.subtotal ?? Number(row.total_amount),
    discount: notes.discount ?? 0,
    shipping: notes.shipping ?? 0,
    total: Number(row.total_amount),
    customer: {
      fullName: row.customers?.full_name ?? '',
      email: row.customers?.email ?? '',
      phone: row.customers?.phone ?? '',
      address: notes.address ?? '',
      city: notes.city ?? '',
      zip: notes.zip ?? '',
      notes: notes.notes
    },
    items: (row.order_items ?? []).map((item) => ({
      productId: item.product_id ?? item.product_name,
      productName: item.product_name,
      quantity: item.quantity,
      unitPrice: Number(item.unit_price)
    }))
  };
}

function parseNotes(value: string | null): OrderNotes {
  if (!value) return {};
  try {
    return JSON.parse(value) as OrderNotes;
  } catch {
    return { notes: value };
  }
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
