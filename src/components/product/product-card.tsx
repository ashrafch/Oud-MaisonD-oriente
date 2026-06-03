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
    <article className="group overflow-hidden rounded border border-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] bg-mist">
          <Image src={product.image} alt={product.name} fill sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" unoptimized={product.image.startsWith('data:')} />
          <span className="absolute left-3 top-3 rounded bg-cream px-2 py-1 text-xs font-semibold text-oud">{product.intensity}</span>
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs uppercase tracking-widest text-ink/50">{product.brand}</p>
        <Link href={`/products/${product.slug}`} className="mt-1 block font-serif text-2xl">{product.name}</Link>
        <p className="mt-2 min-h-12 text-sm leading-6 text-ink/65">{product.shortDescription}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="font-semibold">
            {formatPrice(product.price)}
            {product.compareAtPrice ? <span className="ml-2 text-sm text-ink/40 line-through">{formatPrice(product.compareAtPrice)}</span> : null}
          </div>
          <div className="flex gap-2">
            {onQuickView ? <button aria-label="Anteprima rapida" className="rounded border border-ink/10 px-3 py-2 text-xs font-semibold hover:bg-mist" onClick={() => onQuickView(product)}>Preview</button> : null}
            <button aria-label="Wishlist" className="rounded border border-ink/10 p-2 hover:bg-mist" onClick={() => toggleWishlist(product.id)}><Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} /></button>
            <button aria-label="Aggiungi al carrello" className="rounded bg-oud p-2 text-white hover:bg-bark" onClick={() => addItem(product.id, product)}><ShoppingBag size={17} /></button>
          </div>
        </div>
      </div>
    </article>
  );
}
