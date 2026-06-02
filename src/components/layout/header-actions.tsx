'use client';

import Link from 'next/link';
import { Heart, Search, ShoppingBag, UserRound } from 'lucide-react';
import { useCartStore } from '@/lib/cart/store';

export function HeaderActions() {
  const itemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const wishlistCount = useCartStore((state) => state.wishlist.length);

  return (
    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
      <Link aria-label="Cerca" className="focus-ring rounded-full p-2 hover:bg-mist" href="/search"><Search size={20} /></Link>
      <Link aria-label="Wishlist" className="focus-ring relative rounded-full p-2 hover:bg-mist" href="/wishlist">
        <Heart size={20} />
        {wishlistCount ? <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-saffron px-1 text-center text-[11px] font-semibold text-ink">{wishlistCount}</span> : null}
      </Link>
      <Link aria-label="Carrello" className="focus-ring relative rounded-full p-2 hover:bg-mist" href="/cart">
        <ShoppingBag size={20} />
        {itemCount ? <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-oud px-1 text-center text-[11px] font-semibold text-white">{itemCount}</span> : null}
      </Link>
      <Link aria-label="Admin" className="focus-ring rounded-full p-2 hover:bg-mist" href="/admin"><UserRound size={20} /></Link>
    </div>
  );
}
