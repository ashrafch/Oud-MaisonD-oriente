import type { CartItem, CustomerDraft, Order } from '@/lib/cart/store';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { getSupabaseProducts } from './catalog';
import { getSupabaseCoupons } from './coupons';

export type AdminOrder = Order & {
  customerId?: string;
  customerValue?: number;
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
};

type OrderRow = {
  id: string;
  customer_id: string | null;
  status: Order['status'];
  total_amount: number | string;
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
    const product = products.find((entry) => entry.id === item.productId);
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
    couponCode: normalizedCoupon
  };

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: customer.id,
      status: 'new',
      payment_status: 'manual_pending',
      fulfillment_status: 'new',
      total_amount: total,
      currency: 'EUR',
      internal_notes: JSON.stringify(notes)
    })
    .select('id, created_at')
    .single();
  if (orderError) throw orderError;

  const orderItems = input.items.map((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return {
      order_id: order.id,
      product_id: item.productId,
      product_name: product?.name ?? item.productId,
      quantity: item.quantity,
      unit_price: product?.price ?? 0
    };
  });

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) throw itemsError;

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

function mapOrderRow(row: OrderRow): AdminOrder {
  const notes = parseNotes(row.internal_notes);
  return {
    id: row.id,
    customerId: row.customer_id ?? undefined,
    createdAt: row.created_at,
    status: row.status,
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
      quantity: item.quantity
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
