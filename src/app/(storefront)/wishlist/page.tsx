import { WishlistClient } from '@/components/storefront/wishlist-client';
import { getSupabaseProducts } from '@/lib/supabase/catalog';

export default async function Page() {
  const products = await getSupabaseProducts();
  return <WishlistClient initialProducts={products} />;
}
