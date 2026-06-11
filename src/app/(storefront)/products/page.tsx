import { ProductCatalogClient } from '@/components/storefront/product-catalog-client';
import { getSupabaseCategories, getSupabaseProducts } from '@/lib/supabase/catalog';

export const revalidate = 60;

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getSupabaseProducts(),
    getSupabaseCategories()
  ]);

  return (
    <section className="container py-12">
      <ProductCatalogClient initialProducts={products} initialCategories={categories} />
    </section>
  );
}
