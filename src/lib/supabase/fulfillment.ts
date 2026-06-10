import { createSupabaseServiceClient } from './server';

type OrderItemRow = {
  product_id: string | null;
  product_name: string;
  quantity: number;
};

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
