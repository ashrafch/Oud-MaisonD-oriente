import { createSupabaseServiceClient } from './server';

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
  if (!supabase) return ['Catalogo non disponibile'];

  const uuids = items.filter((item) => isUuid(item.productId)).map((item) => item.productId);
  const slugs = items.filter((item) => !isUuid(item.productId)).map((item) => item.productId);
  let products: ProductStockRow[] = [];

  if (uuids.length) {
    const { data } = await supabase.from('products').select('id, slug, name, stock, status').is('deleted_at', null).in('id', uuids);
    if (data) products = [...products, ...(data as ProductStockRow[])];
  }
  if (slugs.length) {
    const { data } = await supabase.from('products').select('id, slug, name, stock, status').is('deleted_at', null).in('slug', slugs);
    if (data) products = [...products, ...(data as ProductStockRow[])];
  }

  const outOfStock: string[] = [];
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId || p.slug === item.productId);
    if (!product) { outOfStock.push('Prodotto non disponibile'); continue; }
    const quantity = items.filter((entry) => entry.productId === product.id || entry.productId === product.slug)
      .reduce((sum, entry) => sum + entry.quantity, 0);
    if (product.status !== 'published' || Number(product.stock ?? 0) < quantity) {
      outOfStock.push(product.name);
    }
  }

  return outOfStock.length ? outOfStock : null;
}

export async function decrementStockForPaidOrder(orderId: string) {
  await applyOrderStock(orderId, false);
}

export async function restoreStockForRefundedOrder(orderId: string) {
  await applyOrderStock(orderId, true);
}

async function applyOrderStock(orderId: string, restore: boolean) {
  const supabase = createSupabaseServiceClient();
  if (!supabase) throw new Error("Supabase service client non configurato");
  const rpc = supabase.rpc.bind(supabase) as unknown as (
    name: 'apply_order_stock', args: { p_order_id: string; p_restore: boolean }
  ) => PromiseLike<{ error: { message: string } | null }>;
  const { error } = await rpc('apply_order_stock', { p_order_id: orderId, p_restore: restore });
  if (error) throw error;
}
