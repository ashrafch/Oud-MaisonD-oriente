import { CartClient } from '@/components/storefront/cart-client';
import { getSupabaseProducts } from '@/lib/supabase/catalog';

export default async function CartPage() {
  const products = await getSupabaseProducts();
  return <CartClient initialProducts={products} />;
}
