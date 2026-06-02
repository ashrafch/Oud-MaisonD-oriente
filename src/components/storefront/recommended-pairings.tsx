import { ProductCard } from '@/components/product/product-card';
import { products } from '@/data/catalog';
import type { Product } from '@/types/catalog';

export function RecommendedPairings({ product }: { product: Product }) {
  const pairings = products
    .filter((item) => item.id !== product.id)
    .filter((item) => item.category === 'bakhoor' || item.tags.includes('gift') || item.category === product.category)
    .slice(0, 3);

  return (
    <section className="mt-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-oud">Rituale consigliato</p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Abbina e completa</h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-ink/60">Suggerimenti cross-sell per aumentare valore medio ordine e rendere l’esperienza più boutique.</p>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pairings.map((item) => <ProductCard key={item.id} product={item} />)}
      </div>
    </section>
  );
}
