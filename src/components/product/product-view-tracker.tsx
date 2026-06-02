'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/lib/cart/store';

export function ProductViewTracker({ productId }: { productId: string }) {
  const addRecentlyViewed = useCartStore((state) => state.addRecentlyViewed);

  useEffect(() => {
    addRecentlyViewed(productId);
  }, [addRecentlyViewed, productId]);

  return null;
}
