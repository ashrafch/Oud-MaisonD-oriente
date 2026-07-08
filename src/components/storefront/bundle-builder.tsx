'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Gift, Plus, Check } from 'lucide-react';
import type { Product } from '@/types/catalog';
import { formatPrice, useCartStore } from '@/lib/cart/store';

const groups = [
  { label: 'Oud & Legnosi', match: (p: Product) => p.categories.includes('oud') },
  { label: 'Gourmand & Dolci', match: (p: Product) => p.categories.includes('gourmand') },
  {
    label: 'Fresco & Floreale',
    match: (p: Product) =>
      !p.categories.includes('oud') &&
      !p.categories.includes('gourmand') &&
      !p.categories.includes('casa') &&
      !p.categories.includes('set-regalo')
  }
];

export function BundleBuilder({ products }: { products: Product[] }) {
  const addItem = useCartStore((state) => state.addItem);
  const notify = useCartStore((state) => state.notify);
  const [selected, setSelected] = useState<Record<string, string>>({});

  const options = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          products: products.filter((p) => p.stock > 0 && group.match(p)).slice(0, 4)
        }))
        .filter((group) => group.products.length > 0),
    [products]
  );

  const selectedProducts = Object.values(selected)
    .map((id) => products.find((product) => product.id === id))
    .filter((p): p is Product => Boolean(p));
  const total = selectedProducts.reduce((sum, product) => sum + product.price, 0);
  const discountedTotal = total * 0.92;

  const addBundle = () => {
    if (selectedProducts.length < 2) {
      notify({ title: 'Scegli almeno due profumi per il bundle', tone: 'warning' });
      return;
    }
    selectedProducts.forEach((product) => addItem(product.id, product));
    notify({ title: 'Bundle aggiunto al carrello', description: 'Sconto rituale -8% applicato alla selezione.', tone: 'success' });
    setSelected({});
  };

  return (
    <section className="container py-12 sm:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-oud">
            <Gift size={18} /> Bundle builder
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Crea il tuo rituale e risparmia</h2>
          <p className="mt-2 text-sm text-ink/55">Combina fragranze di famiglie diverse: sul bundle applichiamo -8%.</p>
        </div>
        <div className="rounded border border-saffron/20 bg-cream/80 p-4 shadow-sm">
          <p className="text-sm text-ink/55">Totale bundle{selectedProducts.length ? ` (${selectedProducts.length})` : ''}</p>
          <p className="text-2xl font-semibold">{formatPrice(discountedTotal || 0)}</p>
          {total ? <p className="text-sm text-ink/40 line-through">{formatPrice(total)}</p> : null}
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {options.map((group) => (
          <div key={group.label} className="rounded border border-saffron/20 bg-[linear-gradient(145deg,#fffaf2_0%,#ffffff_58%,#f4efe6_100%)] p-5 shadow-sm">
            <p className="font-serif text-2xl sm:text-3xl">{group.label}</p>
            <div className="mt-4 grid gap-3">
              {group.products.map((product) => {
                const isSelected = selected[group.label] === product.id;
                return (
                  <button
                    key={product.id}
                    className={`flex items-center gap-3 rounded border p-2.5 text-left transition ${
                      isSelected
                        ? 'border-oud bg-oud/10 shadow-sm'
                        : 'border-saffron/16 bg-white/72 hover:border-saffron/35 hover:bg-mist'
                    }`}
                    onClick={() =>
                      setSelected((current) =>
                        current[group.label] === product.id
                          ? Object.fromEntries(Object.entries(current).filter(([k]) => k !== group.label))
                          : { ...current, [group.label]: product.id }
                      )
                    }
                  >
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-mist">
                      <Image src={product.image} alt={product.name} fill sizes="56px" className="object-cover" unoptimized={product.image.startsWith('data:')} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{product.name}</span>
                      <span className="mt-0.5 block text-sm text-ink/55">{formatPrice(product.price)} · {product.brand}</span>
                    </span>
                    {isSelected ? <Check size={18} className="shrink-0 text-oud" /> : null}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded bg-oud px-5 text-sm font-semibold text-white transition hover:bg-bark sm:w-auto"
        onClick={addBundle}
      >
        <Plus size={18} /> Aggiungi bundle al carrello
      </button>
    </section>
  );
}
