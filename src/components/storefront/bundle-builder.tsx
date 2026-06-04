'use client';

import { useMemo, useState } from 'react';
import { Gift, Plus } from 'lucide-react';
import { products } from '@/data/catalog';
import { formatPrice, useCartStore } from '@/lib/cart/store';

const groups = [
  { label: 'Fragranza', categories: ['oud', 'musk', 'attar', 'unisex'] },
  { label: 'Rituale casa', categories: ['bakhoor'] },
  { label: 'Idea regalo', categories: ['set-regalo'] }
];

export function BundleBuilder() {
  const addItem = useCartStore((state) => state.addItem);
  const notify = useCartStore((state) => state.notify);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const selectedProducts = Object.values(selected).map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const total = selectedProducts.reduce((sum, product) => sum + (product?.price ?? 0), 0);
  const discountedTotal = total * 0.92;

  const options = useMemo(() => groups.map((group) => ({
    ...group,
    products: products.filter((product) => group.categories.includes(product.category)).slice(0, 3)
  })), []);

  const addBundle = () => {
    if (!selectedProducts.length) {
      notify({ title: 'Scegli almeno un prodotto', tone: 'warning' });
      return;
    }
    selectedProducts.forEach((product) => product && addItem(product.id, product));
    notify({ title: 'Bundle aggiunto', description: 'Sconto rituale applicato al riepilogo promozionale.', tone: 'success' });
  };

  return (
    <section className="container py-12 sm:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-oud"><Gift size={18} /> Bundle builder</p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Crea il rituale perfetto</h2>
        </div>
        <div className="rounded border border-saffron/20 bg-cream/80 p-4 shadow-sm">
          <p className="text-sm text-ink/55">Totale bundle</p>
          <p className="text-2xl font-semibold">{formatPrice(discountedTotal || 0)}</p>
          {total ? <p className="text-sm text-ink/40 line-through">{formatPrice(total)}</p> : null}
        </div>
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {options.map((group) => (
          <div key={group.label} className="premium-card rounded border border-saffron/20 bg-[linear-gradient(145deg,#fffaf2_0%,#ffffff_58%,#f4efe6_100%)] p-5 shadow-sm">
            <p className="font-serif text-2xl sm:text-3xl">{group.label}</p>
            <div className="mt-4 grid gap-3">
              {group.products.map((product) => (
                <button key={product.id} className={`rounded border p-3 text-left transition ${selected[group.label] === product.id ? 'border-oud bg-oud/10 shadow-sm' : 'border-saffron/16 bg-white/72 hover:border-saffron/35 hover:bg-mist'}`} onClick={() => setSelected((current) => ({ ...current, [group.label]: product.id }))}>
                  <span className="block font-semibold">{product.name}</span>
                  <span className="mt-1 block text-sm text-ink/55">{formatPrice(product.price)} - {product.intensity}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded bg-oud px-5 text-sm font-semibold text-white transition hover:bg-bark sm:w-auto" onClick={addBundle}>
        <Plus size={18} /> Aggiungi bundle al carrello
      </button>
    </section>
  );
}
