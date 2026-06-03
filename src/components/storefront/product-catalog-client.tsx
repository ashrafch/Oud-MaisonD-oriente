'use client';

import { useEffect, useMemo, useState } from 'react';
import { ProductCard } from '@/components/product/product-card';
import { ProductQuickViewDialog } from '@/components/storefront/product-quick-view-dialog';
import { getStoredProducts, useCartStore } from '@/lib/cart/store';
import type { Category, Product } from '@/types/catalog';

type ProductCatalogClientProps = {
  initialProducts: Product[];
  initialCategories: Category[];
};

export function ProductCatalogClient({ initialProducts, initialCategories }: ProductCatalogClientProps) {
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sort, setSort] = useState('recommended');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | undefined>();
  const [products] = useState(() => getStoredProducts(initialProducts));
  const syncProducts = useCartStore((state) => state.syncProducts);

  useEffect(() => {
    syncProducts(products);
  }, [products, syncProducts]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesQuery = !normalizedQuery || [product.name, product.brand, product.shortDescription, product.notes.top.join(' '), product.notes.heart.join(' '), product.notes.base.join(' ')].join(' ').toLowerCase().includes(normalizedQuery);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      return matchesQuery && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'stock') return a.stock - b.stock;
      if (sort === 'new') return Number(b.tags.includes('nuovo')) - Number(a.tags.includes('nuovo'));
      return Number(b.tags.includes('bestseller')) - Number(a.tags.includes('bestseller'));
    });
  }, [products, query, selectedCategories, sort]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((current) => current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]);
  };

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-oud">Catalogo</p>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Profumi arabi selezionati</h1>
        </div>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cerca per nome, note o brand" className="min-h-11 w-full rounded border border-ink/12 bg-white px-4 text-sm md:max-w-sm" />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr] lg:gap-8">
        <aside className="rounded border border-ink/10 bg-white p-5">
          <p className="font-semibold">Filtri</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3 lg:grid-cols-1">
            {initialCategories.map((category) => (
              <label key={category.slug} className="flex items-center gap-2">
                <input checked={selectedCategories.includes(category.slug)} onChange={() => toggleCategory(category.slug)} type="checkbox" /> {category.name}
              </label>
            ))}
          </div>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="mt-5 min-h-11 w-full rounded border border-ink/12 bg-cream px-3 text-sm">
            <option value="recommended">Ordina: consigliati</option>
            <option value="price-asc">Prezzo crescente</option>
            <option value="price-desc">Prezzo decrescente</option>
            <option value="new">Nuovi arrivi</option>
            <option value="stock">Stock basso</option>
          </select>
        </aside>
        {visibleProducts.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visibleProducts.map((product) => <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />)}
          </div>
        ) : (
          <div className="rounded border border-dashed border-ink/20 bg-white p-10 text-center">
            <p className="font-serif text-3xl">Nessun profumo trovato</p>
            <p className="mt-2 text-sm text-ink/60">Prova a togliere un filtro o cercare una nota olfattiva diversa.</p>
          </div>
        )}
      </div>
      <ProductQuickViewDialog product={quickViewProduct} onClose={() => setQuickViewProduct(undefined)} />
    </>
  );
}
