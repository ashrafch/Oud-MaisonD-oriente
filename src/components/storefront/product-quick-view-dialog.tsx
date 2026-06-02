'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { ProductActions } from '@/components/product/product-actions';
import { ReviewSummary } from '@/components/storefront/review-summary';
import { StockUrgencyBadge } from '@/components/storefront/stock-urgency-badge';
import type { Product } from '@/types/catalog';
import { formatPrice } from '@/lib/cart/store';

export function ProductQuickViewDialog({ product, onClose }: { product?: Product; onClose: () => void }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/45 p-4">
      <div className="max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded border border-ink/10 bg-cream shadow-soft">
        <div className="flex items-center justify-between border-b border-ink/10 p-4">
          <p className="font-serif text-2xl">Anteprima prodotto</p>
          <button aria-label="Chiudi anteprima" className="rounded p-2 hover:bg-mist" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="grid gap-6 p-5 md:grid-cols-[0.9fr_1fr]">
          <div className="relative min-h-80 overflow-hidden rounded bg-white">
            <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized={product.image.startsWith('data:')} />
          </div>
          <div>
            <StockUrgencyBadge product={product} />
            <h2 className="mt-3 font-serif text-4xl">{product.name}</h2>
            <p className="mt-2 text-sm uppercase tracking-widest text-ink/45">{product.brand}</p>
            <p className="mt-4 text-2xl font-semibold">{formatPrice(product.price)}</p>
            <p className="mt-4 leading-7 text-ink/68">{product.shortDescription}</p>
            <div className="mt-5 grid gap-2 text-sm">
              <p><strong>Testa:</strong> {product.notes.top.join(', ')}</p>
              <p><strong>Cuore:</strong> {product.notes.heart.join(', ')}</p>
              <p><strong>Fondo:</strong> {product.notes.base.join(', ')}</p>
            </div>
            <ProductActions product={product} />
          </div>
        </div>
        <div className="p-5 pt-0">
          <ReviewSummary product={product} />
        </div>
      </div>
    </div>
  );
}
