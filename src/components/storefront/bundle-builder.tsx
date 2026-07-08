'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Gift, Plus, Check, X } from 'lucide-react';
import type { Product } from '@/types/catalog';
import { formatPrice, useCartStore } from '@/lib/cart/store';

const tabs = [
  { key: 'all', label: 'Tutti', match: () => true },
  { key: 'uomo', label: 'Uomo', match: (p: Product) => p.categories.includes('uomo') },
  { key: 'donna', label: 'Donna', match: (p: Product) => p.categories.includes('donna') },
  { key: 'oud', label: 'Oud & Legnosi', match: (p: Product) => p.categories.includes('oud') },
  { key: 'gourmand', label: 'Gourmand', match: (p: Product) => p.categories.includes('gourmand') }
];

function discountRate(n: number) {
  if (n >= 4) return 0.15;
  if (n === 3) return 0.12;
  if (n === 2) return 0.08;
  return 0;
}

export function BundleBuilder({ products }: { products: Product[] }) {
  const addItem = useCartStore((state) => state.addItem);
  const notify = useCartStore((state) => state.notify);
  const [tab, setTab] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const wearable = useMemo(
    () => products.filter((p) => p.stock > 0 && !p.categories.includes('casa') && !p.categories.includes('set-regalo')),
    [products]
  );
  const visible = useMemo(() => {
    const activeTab = tabs.find((t) => t.key === tab) ?? tabs[0];
    return wearable.filter(activeTab.match);
  }, [wearable, tab]);

  const selectedProducts = selectedIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
  const total = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const rate = discountRate(selectedProducts.length);
  const discountedTotal = total * (1 - rate);
  const nextTierAt = selectedProducts.length < 2 ? 2 : selectedProducts.length < 3 ? 3 : selectedProducts.length < 4 ? 4 : null;
  const nextTierRate = nextTierAt ? discountRate(nextTierAt) : null;

  const toggle = (id: string) =>
    setSelectedIds((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));

  const addBundle = () => {
    if (selectedProducts.length < 2) {
      notify({ title: 'Scegli almeno due profumi per creare il bundle', tone: 'warning' });
      return;
    }
    selectedProducts.forEach((p) => addItem(p.id, p));
    notify({ title: 'Bundle aggiunto al carrello', description: `${selectedProducts.length} profumi · sconto -${Math.round(rate * 100)}% applicato.`, tone: 'success' });
    setSelectedIds([]);
  };

  return (
    <section className="container py-12 sm:py-14">
      <div className="max-w-2xl">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-oud">
          <Gift size={18} /> Crea il tuo rituale
        </p>
        <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Componi il tuo set e risparmia</h2>
        <p className="mt-2 text-sm leading-6 text-ink/60">
          Scegli i tuoi profumi preferiti dal catalogo: più ne aggiungi, più risparmi. <span className="font-semibold text-ink/75">2 profumi -8% · 3 profumi -12% · 4+ profumi -15%</span>.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
        <div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`min-h-9 rounded-full border px-4 text-sm font-semibold transition ${
                  tab === t.key ? 'border-oud bg-oud text-white shadow-sm' : 'border-ink/12 bg-white text-ink/70 hover:border-oud/35 hover:bg-mist'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-5 grid max-h-[460px] gap-3 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((product) => {
              const isSelected = selectedIds.includes(product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => toggle(product.id)}
                  className={`flex items-center gap-3 rounded-xl border p-2.5 text-left transition ${
                    isSelected ? 'border-oud bg-oud/8 shadow-sm' : 'border-ink/10 bg-white hover:border-saffron/40 hover:bg-mist'
                  }`}
                >
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-mist">
                    <Image src={product.image} alt={product.name} fill sizes="56px" className="object-cover" unoptimized={product.image.startsWith('data:')} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{product.name}</span>
                    <span className="mt-0.5 block truncate text-xs text-ink/50">{product.brand}</span>
                    <span className="mt-0.5 block text-sm font-semibold text-oud">{formatPrice(product.price)}</span>
                  </span>
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition ${isSelected ? 'border-oud bg-oud text-white' : 'border-ink/20 text-transparent'}`}>
                    <Check size={14} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Riepilogo */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-saffron/25 bg-[linear-gradient(150deg,#fffaf2_0%,#ffffff_60%,#f4efe6_100%)] p-5 shadow-sm">
            <p className="font-serif text-2xl">Il tuo rituale</p>
            {selectedProducts.length ? (
              <ul className="mt-4 grid max-h-48 gap-2 overflow-y-auto pr-1">
                {selectedProducts.map((p) => (
                  <li key={p.id} className="flex items-center gap-2 text-sm">
                    <span className="min-w-0 flex-1 truncate">{p.name}</span>
                    <span className="shrink-0 font-semibold">{formatPrice(p.price)}</span>
                    <button aria-label="Rimuovi" onClick={() => toggle(p.id)} className="shrink-0 rounded-full p-1 text-ink/40 transition hover:bg-oud/10 hover:text-oud">
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-ink/55">Nessun profumo selezionato. Tocca i prodotti per aggiungerli al tuo rituale.</p>
            )}

            <div className="mt-4 border-t border-ink/10 pt-4">
              {rate > 0 ? (
                <div className="flex items-center justify-between text-sm text-sage">
                  <span>Sconto -{Math.round(rate * 100)}%</span>
                  <span>-{formatPrice(total - discountedTotal)}</span>
                </div>
              ) : null}
              <div className="mt-1 flex items-end justify-between">
                <span className="text-sm text-ink/55">Totale</span>
                <span className="font-serif text-2xl">{formatPrice(discountedTotal || 0)}</span>
              </div>
              {total && rate > 0 ? <p className="text-right text-sm text-ink/40 line-through">{formatPrice(total)}</p> : null}
              {nextTierAt && nextTierRate ? (
                <p className="mt-2 rounded-lg bg-oud/8 px-3 py-2 text-xs font-medium text-oud">
                  Aggiungi ancora {nextTierAt - selectedProducts.length} per sbloccare -{Math.round(nextTierRate * 100)}%
                </p>
              ) : null}
            </div>

            <button
              onClick={addBundle}
              disabled={selectedProducts.length < 2}
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-oud px-5 text-sm font-semibold text-white transition hover:bg-bark disabled:cursor-not-allowed disabled:bg-ink/20"
            >
              <Plus size={18} /> Aggiungi al carrello
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
