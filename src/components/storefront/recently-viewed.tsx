'use client';

import { ProductCard } from '@/components/product/product-card';
import { products as seedProducts } from '@/data/catalog';
import { getStoredProducts, useCartStore } from '@/lib/cart/store';

export function RecentlyViewedProducts() {
  const recentlyViewed = useCartStore((state) => state.recentlyViewed);
  const products = getStoredProducts(seedProducts).filter((product) => recentlyViewed.includes(product.id)).slice(0, 4);
  if (!products.length) return null;

  return (
    <section className="container py-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-oud">Continua da qui</p>
      <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Visti di recente</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}
