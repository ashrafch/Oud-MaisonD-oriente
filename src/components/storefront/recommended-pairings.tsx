import { ProductCard } from '@/components/product/product-card';
import type { Product } from '@/types/catalog';

export function RecommendedPairings({ product, products }: { product: Product; products: Product[] }) {
  const pairings = products
    .filter((item) => item.id !== product.id && item.stock > 0)
    .map((item) => {
      // Punteggio per categorie condivise (stessa famiglia / stesso gender)
      const shared = item.categories.filter((c) => product.categories.includes(c)).length;
      let score = shared * 2;
      if (item.brand === product.brand) score += 1;
      if (item.tags.includes('bestseller')) score += 0.5;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.item);

  if (!pairings.length) return null;

  return (
    <section className="mt-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-oud">Rituale consigliato</p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Abbina e completa</h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-ink/60">Fragranze della stessa famiglia olfattiva selezionate per te dal nostro catalogo.</p>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pairings.map((item) => <ProductCard key={item.id} product={item} />)}
      </div>
    </section>
  );
}
