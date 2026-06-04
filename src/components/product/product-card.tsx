'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types/catalog';
import { formatPrice, useCartStore } from '@/lib/cart/store';

export function ProductCard({ product, onQuickView }: { product: Product; onQuickView?: (product: Product) => void }) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const wishlist = useCartStore((state) => state.wishlist);
  const isWishlisted = wishlist.includes(product.id);

  return (
    <article className="premium-card group flex h-full flex-col overflow-hidden rounded border border-ink/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-saffron/45 hover:shadow-soft">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="soft-shine relative aspect-[4/5] bg-mist">
          <Image src={product.image} alt={product.name} fill sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" unoptimized={product.image.startsWith('data:')} />
          <span className="absolute left-3 top-3 rounded bg-cream/95 px-2.5 py-1 text-xs font-semibold text-oud shadow-sm transition duration-300 group-hover:bg-saffron group-hover:text-ink">{product.intensity}</span>
          <span className="absolute bottom-3 left-3 right-3 translate-y-3 rounded bg-ink/82 px-3 py-2 text-center text-xs font-semibold uppercase tracking-widest text-cream opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            Scopri la fragranza
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-xs uppercase tracking-widest text-ink/50">{product.brand}</p>
        <Link href={`/products/${product.slug}`} className="mt-1 block font-serif text-[1.55rem] leading-tight transition hover:text-oud sm:text-2xl">{product.name}</Link>
        <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-ink/65">{product.shortDescription}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <div className="font-semibold">
            {formatPrice(product.price)}
            {product.compareAtPrice ? <span className="ml-2 text-sm text-ink/40 line-through">{formatPrice(product.compareAtPrice)}</span> : null}
          </div>
          <div className="flex gap-2">
            {onQuickView ? <button aria-label="Anteprima rapida" className="min-h-10 rounded border border-ink/10 px-3 text-xs font-semibold transition hover:-translate-y-0.5 hover:bg-mist" onClick={() => onQuickView(product)}>Preview</button> : null}
            <button aria-label="Wishlist" className="min-h-10 rounded border border-ink/10 p-2 transition hover:-translate-y-0.5 hover:bg-mist" onClick={() => toggleWishlist(product.id)}><Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} /></button>
            <button aria-label="Aggiungi al carrello" className="min-h-10 rounded bg-oud p-2 text-white transition hover:-translate-y-0.5 hover:bg-bark" onClick={() => addItem(product.id, product)}><ShoppingBag size={17} /></button>
          </div>
        </div>
      </div>
    </article>
  );
}
