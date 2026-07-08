'use client';

import { useEffect } from 'react';
import type { Product } from '@/types/catalog';
import { useCartStore } from '@/lib/cart/store';

export function ProductViewTracker({ product }: { product: Product }) {
  const addRecentlyViewed = useCartStore((state) => state.addRecentlyViewed);
  const syncProducts = useCartStore((state) => state.syncProducts);

  useEffect(() => {
    syncProducts([product]);
    addRecentlyViewed(product.id);
  }, [product, addRecentlyViewed, syncProducts]);

  return null;
}
