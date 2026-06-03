'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { products as seedProducts } from '@/data/catalog';
import { getStoredProducts, setStoredProducts, useCartStore } from '@/lib/cart/store';
import type { Product } from '@/types/catalog';

export function InventoryClient() {
  const notify = useCartStore((state) => state.notify);
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const visibleProducts = useMemo(() => products.filter((product) => [product.name, product.category, product.brand].join(' ').toLowerCase().includes(query.toLowerCase())), [products, query]);

  const loadProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/inventory', { cache: 'no-store' });
      if (!response.ok) throw new Error('Inventario Supabase non disponibile');
      const payload = await response.json() as { products: Product[] };
      setProducts(payload.products);
      setStoredProducts(payload.products);
    } catch {
      setProducts(getStoredProducts(seedProducts));
      notify({ title: 'Uso inventario locale', description: 'Supabase non ha risposto.', tone: 'warning' });
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const updateStock = async (productId: string, stock: number) => {
    const nextStock = Math.max(0, stock);
    const nextProducts = products.map((product) => product.id === productId ? { ...product, stock: nextStock } : product);
    setProducts(nextProducts);
    setStoredProducts(nextProducts);
    try {
      const response = await fetch('/api/admin/inventory', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ productId, stock: nextStock })
      });
      if (!response.ok) throw new Error('Aggiornamento stock fallito');
      notify({ title: 'Stock aggiornato su Supabase', tone: 'success' });
    } catch {
      notify({ title: 'Stock aggiornato solo localmente', description: 'Supabase non ha confermato la modifica.', tone: 'warning' });
    }
  };

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl sm:text-5xl">Inventario</h1>
          <p className="mt-3 max-w-2xl text-ink/60">Stessi prodotti del catalogo: qui aggiorni stock e disponibilita operativa.</p>
        </div>
        <label className="flex min-h-11 items-center gap-2 rounded border border-ink/12 bg-white px-3 text-sm">
          <Search size={16} className="text-ink/40" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cerca prodotto" className="min-w-0 bg-transparent outline-none" />
        </label>
      </div>
      <div className="mt-8 grid gap-4">
        {isLoading ? <div className="rounded border border-ink/10 bg-white p-5 text-sm text-ink/60">Caricamento inventario da Supabase...</div> : null}
        {visibleProducts.map((product) => (
          <article key={product.id} className="grid gap-4 rounded border border-ink/10 bg-white p-4 md:grid-cols-[1fr_160px_180px] md:items-center">
            <div>
              <p className="font-semibold">{product.name}</p>
              <p className="mt-1 text-sm text-ink/55">{product.category} - visibile anche in Prodotti</p>
            </div>
            <span className={`w-fit rounded px-3 py-1 text-sm font-semibold ${product.stock <= 0 ? 'bg-oud/10 text-oud' : product.stock <= 8 ? 'bg-saffron/15 text-bark' : 'bg-sage/12 text-sage'}`}>
              {product.stock <= 0 ? 'Esaurito' : product.stock <= 8 ? 'Sotto scorta' : 'Disponibile'}
            </span>
            <div className="flex items-center gap-2">
              <button className="rounded border border-ink/10 px-3 py-2" onClick={() => void updateStock(product.id, product.stock - 1)}>-</button>
              <input value={product.stock} onChange={(event) => void updateStock(product.id, Number(event.target.value))} className="min-h-10 w-20 rounded border border-ink/12 text-center text-sm" type="number" />
              <button className="rounded border border-ink/10 px-3 py-2" onClick={() => void updateStock(product.id, product.stock + 1)}>+</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
