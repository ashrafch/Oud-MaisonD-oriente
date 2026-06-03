import { ProductCatalogClient } from '@/components/storefront/product-catalog-client';
import { getSupabaseCategories, getSupabaseProducts } from '@/lib/supabase/catalog';

export default async function Page() {
  const [products, categories] = await Promise.all([
    getSupabaseProducts(),
    getSupabaseCategories()
  ]);

  return <section className="container py-12"><ProductCatalogClient initialProducts={products} initialCategories={categories} /></section>;
}
