'use client';

import { useState } from 'react';
import { products as seedProducts } from '@/data/catalog';
import { getStoredProducts, setStoredProducts, useCartStore } from '@/lib/cart/store';

export function InventoryClient() {
  const notify = useCartStore((state) => state.notify);
  const [products, setProducts] = useState(() => getStoredProducts(seedProducts));

  const updateStock = (productId: string, stock: number) => {
    const nextProducts = products.map((product) => product.id === productId ? { ...product, stock: Math.max(0, stock) } : product);
    setProducts(nextProducts);
    setStoredProducts(nextProducts);
    notify({ title: 'Stock aggiornato', tone: 'success' });
  };

  return (
    <section>
      <h1 className="font-serif text-4xl sm:text-5xl">Inventario</h1>
      <p className="mt-3 max-w-2xl text-ink/60">Aggiorna rapidamente stock, individua prodotti esauriti e prepara riordini.</p>
      <div className="mt-8 grid gap-4">
        {products.map((product) => (
          <article key={product.id} className="grid gap-4 rounded border border-ink/10 bg-white p-4 md:grid-cols-[1fr_160px_160px] md:items-center">
            <div>
              <p className="font-semibold">{product.name}</p>
              <p className="mt-1 text-sm text-ink/55">{product.category} · soglia consigliata 8 pezzi</p>
            </div>
            <span className={`w-fit rounded px-3 py-1 text-sm font-semibold ${product.stock <= 0 ? 'bg-oud/10 text-oud' : product.stock <= 8 ? 'bg-saffron/15 text-bark' : 'bg-sage/12 text-sage'}`}>
              {product.stock <= 0 ? 'Esaurito' : product.stock <= 8 ? 'Sotto scorta' : 'Disponibile'}
            </span>
            <div className="flex items-center gap-2">
              <button className="rounded border border-ink/10 px-3 py-2" onClick={() => updateStock(product.id, product.stock - 1)}>-</button>
              <input value={product.stock} onChange={(event) => updateStock(product.id, Number(event.target.value))} className="min-h-10 w-20 rounded border border-ink/12 text-center text-sm" type="number" />
              <button className="rounded border border-ink/10 px-3 py-2" onClick={() => updateStock(product.id, product.stock + 1)}>+</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
