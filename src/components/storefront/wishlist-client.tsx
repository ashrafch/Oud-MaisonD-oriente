'use client';

import { useEffect } from 'react';
import { ProductCard } from '@/components/product/product-card';
import { products as seedProducts } from '@/data/catalog';
import { getStoredProducts, mergeProducts, useCartStore } from '@/lib/cart/store';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/catalog';

export function WishlistClient({ initialProducts = [] }: { initialProducts?: Product[] }) {
  const wishlist = useCartStore((state) => state.wishlist);
  const catalogProducts = useCartStore((state) => state.catalogProducts);
  const syncProducts = useCartStore((state) => state.syncProducts);

  useEffect(() => {
    if (initialProducts.length) syncProducts(initialProducts);
  }, [initialProducts, syncProducts]);

  const catalog = mergeProducts(catalogProducts, initialProducts, getStoredProducts(seedProducts));
  const products = wishlist
    .map((id) => catalog.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));

  return (
    <section className="container py-12">
      <h1 className="font-serif text-4xl sm:text-5xl">Wishlist</h1>
      {products.length ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="mt-8 rounded border border-dashed border-ink/20 bg-white p-10 text-center">
          <p className="font-serif text-3xl">Nessun prodotto salvato</p>
          <p className="mt-2 text-sm text-ink/60">Usa il cuore sulle card prodotto per creare una selezione.</p>
          <Button href="/products" className="mt-6">Scopri prodotti</Button>
        </div>
      )}
    </section>
  );
}
