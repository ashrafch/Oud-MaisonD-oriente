import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProductCard } from '@/components/product/product-card';
import { getSupabaseCategories, getSupabaseProducts } from '@/lib/supabase/catalog';

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getSupabaseCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

type CategoryPageProps = { params: Promise<{ slug: string }> };

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [categories, products] = await Promise.all([
    getSupabaseCategories(),
    getSupabaseProducts()
  ]);
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const items = products.filter((product) => product.categories.includes(category.slug));
  return (
    <section className="container py-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-oud">Categoria</p>
      <h1 className="mt-2 font-serif text-5xl">{category.name}</h1>
      <p className="mt-4 max-w-2xl text-ink/65">{category.description}</p>
      {items.length ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="mt-8 rounded border border-ink/10 bg-white p-6">
          <p className="text-sm text-ink/65">Al momento non ci sono prodotti in questa categoria.</p>
          <Link href="/products" className="boutique-text-link mt-3">Scopri tutti i profumi</Link>
        </div>
      )}
    </section>
  );
}
