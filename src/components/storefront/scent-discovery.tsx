'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Product } from '@/types/catalog';

export type ScentChapter = {
  label: string;
  product: Pick<Product, 'slug' | 'name' | 'brand' | 'image' | 'price'>;
};

export function ScentDiscovery({ chapters }: { chapters: ScentChapter[] }) {
  const [selected, setSelected] = useState(0);
  const chapter = chapters[selected] ?? chapters[0];
  if (!chapter) return null;
  const { product } = chapter;

  return (
    <section className="scent-discovery" aria-label="Esplora le fragranze">
      <p className="mb-3 text-center text-xs tracking-wide text-cream/75">Da quali note vuoi iniziare?</p>
      <div role="group" aria-label="Famiglie olfattive" className="mb-6 flex flex-wrap justify-center gap-2">
        {chapters.map((entry, index) => (
          <button key={entry.label} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)} className={`scent-selector focus-ring min-h-11 rounded-full border px-5 text-sm transition-colors ${selected === index ? 'border-saffron bg-saffron text-ink' : 'border-cream/30 text-cream hover:border-cream/70 hover:bg-cream/10'}`}>
            {entry.label}
          </button>
        ))}
      </div>
      <Link href={`/products/${product.slug}`} aria-label={`Scopri ${product.name}`} className="scent-stage focus-ring group block">
        <div key={product.slug} className="scent-image-enter absolute inset-0">
          <Image src={product.image} alt={product.name} fill priority={selected === 0} quality={90} sizes="(min-width: 428px) 400px, calc(100vw - 28px)" className="object-cover" />
        </div>
      </Link>
      <div className="pt-5 text-center">
        <div aria-live="polite" aria-atomic="true">
          <p className="text-[10px] uppercase tracking-[0.2em] text-cream/70">{product.brand}</p>
          <h2 className="mt-1 font-serif text-3xl leading-tight text-cream">{product.name}</h2>
          <p className="mt-2 text-sm text-cream/85">{new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(product.price)}</p>
        </div>
        <Link href={`/products/${product.slug}`} className="focus-ring mt-2 inline-flex min-h-11 items-center gap-3 text-sm font-medium text-saffron transition-colors hover:text-cream">
          Scopri il profumo <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
