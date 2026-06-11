import { createSupabaseServiceClient } from './server';

type OrderItemRow = {
  product_id: string | null;
  product_name: string;
  quantity: number;
};

type ProductStockRow = {
  id: string;
  slug: string | null;
  name: string;
  stock: number | null;
  status: string | null;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function checkStockAvailability(
  items: { productId: string; quantity: number }[]
): Promise<string[] | null> {
  const supabase = createSupabaseServiceClient() as any;
  if (!supabase) return null;

  const uuids = items.filter((item) => isUuid(item.productId)).map((item) => item.productId);
  const slugs = items.filter((item) => !isUuid(item.productId)).map((item) => item.productId);
  let products: ProductStockRow[] = [];

  if (uuids.length) {
    const { data } = await supabase.from('products').select('id, slug, name, stock, status').in('id', uuids);
    if (data) products = [...products, ...(data as ProductStockRow[])];
  }
  if (slugs.length) {
    const { data } = await supabase.from('products').select('id, slug, name, stock, status').in('slug', slugs);
    if (data) products = [...products, ...(data as ProductStockRow[])];
  }

  const outOfStock: string[] = [];
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId || p.slug === item.productId);
    if (!product) continue;
    if (product.status === 'sold_out' || Number(product.stock ?? 0) < item.quantity) {
      outOfStock.push(product.name);
    }
  }

  return outOfStock.length ? outOfStock : null;
}

export async function decrementStockForPaidOrder(orderId: string) {
  const supabase = createSupabaseServiceClient() as any;
  if (!supabase) throw new Error('Supabase service client non configurato');

  const movementNote = `ordine:${orderId}`;
  const { data: existingMovements } = await supabase
    .from('inventory_movements')
    .select('id')
    .eq('reason', 'vendita')
    .eq('note', movementNote)
    .limit(1);
  if (existingMovements?.length) return { skipped: true };

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('product_id, product_name, quantity')
    .eq('order_id', orderId);
  if (itemsError) throw itemsError;

  for (const item of (items ?? []) as OrderItemRow[]) {
    if (!item.product_id) continue;

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('stock')
      .eq('id', item.product_id)
      .single();
    if (productError) throw productError;

    const nextStock = Math.max(0, Number(product.stock ?? 0) - item.quantity);
    const update: Record<string, string | number> = {
      stock: nextStock,
      updated_at: new Date().toISOString()
    };
    if (nextStock === 0) update.status = 'sold_out';

    const { error: updateError } = await supabase
      .from('products')
      .update(update)
      .eq('id', item.product_id);
    if (updateError) throw updateError;

    const { error: movementError } = await supabase.from('inventory_movements').insert({
      product_id: item.product_id,
      quantity_delta: -item.quantity,
      reason: 'vendita',
      note: movementNote
    });
    if (movementError) throw movementError;
  }

  return { skipped: false };
}

export async function restoreStockForRefundedOrder(orderId: string) {
  const supabase = createSupabaseServiceClient() as any;
  if (!supabase) throw new Error('Supabase service client non configurato');

  const movementNote = `ordine:${orderId}`;

  const { data: existingRestoration } = await supabase
    .from('inventory_movements')
    .select('id')
    .eq('reason', 'rimborso')
    .eq('note', movementNote)
    .limit(1);
  if (existingRestoration?.length) return { skipped: true };

  const { data: saleMovements } = await supabase
    .from('inventory_movements')
    .select('id')
    .eq('reason', 'vendita')
    .eq('note', movementNote)
    .limit(1);
  if (!saleMovements?.length) return { skipped: true };

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('product_id, product_name, quantity')
    .eq('order_id', orderId);
  if (itemsError) throw itemsError;

  for (const item of (items ?? []) as OrderItemRow[]) {
    if (!item.product_id) continue;

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('stock, status')
      .eq('id', item.product_id)
      .single();
    if (productError) throw productError;

    const nextStock = Number(product.stock ?? 0) + item.quantity;
    const update: Record<string, string | number> = {
      stock: nextStock,
      updated_at: new Date().toISOString()
    };
    if (product.status === 'sold_out') update.status = 'active';

    const { error: updateError } = await supabase
      .from('products')
      .update(update)
      .eq('id', item.product_id);
    if (updateError) throw updateError;

    const { error: movementError } = await supabase.from('inventory_movements').insert({
      product_id: item.product_id,
      quantity_delta: item.quantity,
      reason: 'rimborso',
      note: movementNote
    });
    if (movementError) throw movementError;
  }

  return { skipped: false };
}
