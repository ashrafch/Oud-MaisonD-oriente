'use client';

import { Heart, ShoppingBag, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types/catalog';
import { useCartStore } from '@/lib/cart/store';

export function ProductActions({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const wishlist = useCartStore((state) => state.wishlist);
  const isWishlisted = wishlist.includes(product.id);

  const buyNow = () => {
    addItem(product.id);
    router.push('/checkout');
  };

  return (
    <div className="mt-7 flex flex-wrap gap-3">
      <button className="inline-flex min-h-11 w-full items-center justify-center rounded bg-oud px-5 text-sm font-semibold text-white transition hover:bg-bark sm:w-auto" onClick={() => addItem(product.id)}>
        <ShoppingBag className="mr-2" size={18} /> Aggiungi al carrello
      </button>
      <button className="inline-flex min-h-11 w-full items-center justify-center rounded border border-ink/15 bg-cream px-5 text-sm font-semibold text-ink transition hover:bg-mist sm:w-auto" onClick={buyNow}>
        <Zap className="mr-2" size={18} /> Acquista ora
      </button>
      <button className="inline-flex min-h-11 w-full items-center justify-center rounded px-5 text-sm font-semibold text-ink transition hover:bg-mist sm:w-auto" onClick={() => toggleWishlist(product.id)}>
        <Heart className="mr-2" size={18} fill={isWishlisted ? 'currentColor' : 'none'} /> Wishlist
      </button>
    </div>
  );
}
