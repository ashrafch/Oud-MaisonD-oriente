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
    <article className="premium-card group flex h-full flex-col overflow-hidden rounded-lg border border-ink/10 bg-white transition duration-300 hover:-translate-y-1 hover:border-saffron/45 hover:shadow-soft focus-within:border-saffron/60">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="soft-shine relative aspect-[4/5] bg-mist">
          <Image src={product.image} alt={product.name} fill sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw" className="object-contain transition duration-500 group-hover:scale-105" unoptimized={product.image.startsWith('data:')} />
          <span className="absolute left-3 top-3 rounded bg-cream/95 px-2.5 py-1 text-xs font-semibold text-oud shadow-sm transition duration-300 group-hover:bg-saffron group-hover:text-ink">{product.intensity}</span>
          <span className="absolute bottom-3 left-3 right-3 translate-y-3 rounded bg-ink/82 px-3 py-2 text-center text-xs font-semibold uppercase tracking-widest text-cream opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            Scopri la fragranza
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-xs uppercase tracking-widest text-ink/50">{product.brand}</p>
        <Link href={`/products/${product.slug}`} className="mt-1 block font-serif text-[1.55rem] leading-tight transition hover:text-oud sm:text-2xl">{product.name}</Link>
        <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-ink/65">{product.shortDescription}</p>
        <p className="mt-3 text-[10px] font-medium uppercase tracking-widest text-ink/50">{product.stock > 0 ? 'Disponibile online' : 'Momentaneamente esaurito'}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-ink/8 pt-4">
          <div className="font-semibold">
            {formatPrice(product.price)}
            {product.compareAtPrice ? <span className="ml-2 text-sm text-ink/40 line-through">{formatPrice(product.compareAtPrice)}</span> : null}
          </div>
          <div className="flex gap-2">
            {onQuickView ? <button aria-label={`Anteprima di ${product.name}`} className="focus-ring min-h-11 rounded border border-ink/10 px-3 text-xs font-semibold transition hover:bg-mist" onClick={() => onQuickView(product)}>Anteprima</button> : null}
            <button aria-label={`${isWishlisted ? 'Rimuovi' : 'Salva'} ${product.name} ${isWishlisted ? 'dai' : 'nei'} preferiti`} aria-pressed={isWishlisted} className={`focus-ring grid min-h-11 min-w-11 place-items-center rounded border border-ink/10 transition hover:bg-mist ${isWishlisted ? 'text-oud' : ''}`} onClick={() => toggleWishlist(product.id)}><Heart size={17} aria-hidden="true" fill={isWishlisted ? 'currentColor' : 'none'} /></button>
            <button aria-label={`Aggiungi ${product.name} al carrello`} disabled={product.stock <= 0} className="focus-ring grid min-h-11 min-w-11 place-items-center rounded bg-oud text-white transition hover:bg-bark disabled:cursor-not-allowed disabled:bg-ink/20" onClick={() => addItem(product.id, product)}><ShoppingBag size={17} aria-hidden="true" /></button>
          </div>
        </div>
      </div>
    </article>
  );
}
