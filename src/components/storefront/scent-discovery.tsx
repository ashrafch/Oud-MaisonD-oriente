'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import type { Product } from '@/types/catalog';

export type ScentChapter = {
  label: string;
  subtitle: string;
  product: Pick<Product, 'slug' | 'name' | 'brand' | 'image' | 'price' | 'notes'>;
};

export function ScentDiscovery({ chapters }: { chapters: ScentChapter[] }) {
  const [selected, setSelected] = useState(0);
  const chapter = chapters[selected] ?? chapters[0];
  if (!chapter) return null;
  const { product } = chapter;

  return (
    <div className="scent-discovery">
      <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/55 sm:px-7">
        <span>Il taccuino olfattivo</span>
        <span aria-hidden="true">0{selected + 1} / 0{chapters.length}</span>
      </div>
      <div className="scent-stage">
        <div className="scent-orbit" aria-hidden="true" />
        <div key={product.slug} className="scent-image-enter relative mx-auto h-[285px] w-[72%] sm:h-[335px]">
          <Image src={product.image} alt={product.name} fill priority={selected === 0} sizes="(min-width: 1024px) 360px, 75vw" className="object-contain mix-blend-multiply" />
        </div>
        <span className="scent-stage-label" aria-hidden="true">Una presenza che resta</span>
      </div>
      <div className="relative px-5 pb-6 sm:px-7">
        <div aria-live="polite" aria-atomic="true" className="min-h-[96px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-oud">{product.brand}</p>
          <div className="mt-2 flex items-baseline justify-between gap-4">
            <h2 className="font-serif text-3xl leading-tight text-ink">{product.name}</h2>
            <span className="shrink-0 text-sm text-ink/65">{new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(product.price)}</span>
          </div>
          <p className="mt-2 text-sm text-ink/60">{chapter.subtitle}</p>
        </div>
        <div className="my-5 grid grid-cols-3 gap-3 border-y border-ink/10 py-4">
          {([['Apertura', product.notes.top], ['Cuore', product.notes.heart], ['Fondo', product.notes.base]] as const).map(([label, notes]) => (
            <div key={label}>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-oud/70">{label}</p>
              <p className="mt-1 text-xs leading-5 text-ink/70">{notes.slice(0, 2).join(', ') || 'Da scoprire'}</p>
            </div>
          ))}
        </div>
        <Link href={`/products/${product.slug}`} className="focus-ring flex min-h-11 items-center justify-between text-sm font-semibold text-oud">
          Entra nella fragranza <ArrowUpRight size={20} aria-hidden="true" />
        </Link>
      </div>
      <div role="group" aria-label="Esplora le famiglie olfattive" className="grid grid-cols-3 border-t border-ink/10 bg-white/40">
        {chapters.map((entry, index) => (
          <button key={entry.label} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)} className={`scent-selector focus-ring flex min-h-16 items-center justify-center gap-1 px-2 text-xs font-medium transition-colors ${selected === index ? 'bg-oud text-cream' : 'text-ink/65 hover:bg-oud/5'}`}>
            {entry.label}<ChevronRight size={12} aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
