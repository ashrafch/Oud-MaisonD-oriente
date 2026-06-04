'use client';

import Link from 'next/link';
import { Heart, Search, ShoppingBag, UserRound } from 'lucide-react';
import { useCartStore } from '@/lib/cart/store';

export function HeaderActions() {
  const itemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const wishlistCount = useCartStore((state) => state.wishlist.length);
  const openCartDrawer = useCartStore((state) => state.openCartDrawer);

  return (
    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
      <Link aria-label="Cerca" className="focus-ring rounded-full p-2 text-ink/76 transition hover:bg-mist hover:text-oud" href="/search">
        <Search size={19} />
      </Link>
      <Link aria-label="Wishlist" className="focus-ring relative rounded-full p-2 text-ink/76 transition hover:bg-mist hover:text-oud" href="/wishlist">
        <Heart size={19} />
        {wishlistCount ? <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-saffron px-1 text-center text-[11px] font-semibold text-ink">{wishlistCount}</span> : null}
      </Link>
      <button aria-label="Carrello" className="focus-ring relative rounded-full p-2 text-ink/76 transition hover:bg-mist hover:text-oud" onClick={openCartDrawer}>
        <ShoppingBag size={19} />
        {itemCount ? <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-oud px-1 text-center text-[11px] font-semibold text-white">{itemCount}</span> : null}
      </button>
      <Link aria-label="Admin" className="focus-ring rounded-full p-2 text-ink/76 transition hover:bg-mist hover:text-oud" href="/admin">
        <UserRound size={19} />
      </Link>
    </div>
  );
}
