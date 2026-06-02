'use client';

import { useState } from 'react';
import { Percent, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/lib/cart/store';

type Coupon = { code: string; type: 'percent' | 'fixed'; value: number; minOrder: number; active: boolean };

const initialCoupons: Coupon[] = [
  { code: 'OUDE10', type: 'percent', value: 10, minOrder: 0, active: true },
  { code: 'WELCOME15', type: 'percent', value: 15, minOrder: 59, active: true }
];

export function CouponManager() {
  const notify = useCartStore((state) => state.notify);
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    if (typeof window === 'undefined') return initialCoupons;
    const raw = window.localStorage.getItem('oude-coupons');
    return raw ? JSON.parse(raw) as Coupon[] : initialCoupons;
  });
  const [draft, setDraft] = useState<Coupon>({ code: '', type: 'percent', value: 10, minOrder: 0, active: true });

  const persist = (next: Coupon[]) => {
    setCoupons(next);
    window.localStorage.setItem('oude-coupons', JSON.stringify(next));
  };

  const save = () => {
    if (!draft.code || draft.value <= 0) {
      notify({ title: 'Coupon non valido', description: 'Inserisci codice e valore.', tone: 'warning' });
      return;
    }
    const normalized = { ...draft, code: draft.code.trim().toUpperCase() };
    persist([normalized, ...coupons.filter((coupon) => coupon.code !== normalized.code)]);
    setDraft({ code: '', type: 'percent', value: 10, minOrder: 0, active: true });
    notify({ title: 'Coupon salvato', description: normalized.code, tone: 'success' });
  };

  return (
    <section>
      <h1 className="font-serif text-4xl sm:text-5xl">Sconti e coupon</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded border border-ink/10 bg-white p-5">
          <p className="flex items-center gap-2 font-serif text-3xl"><Percent size={20} className="text-oud" /> Nuovo coupon</p>
          <div className="mt-5 grid gap-4">
            <Field label="Codice" value={draft.code} onChange={(value) => setDraft((current) => ({ ...current, code: value }))} />
            <label className="grid gap-2 text-sm font-semibold">Tipo
              <select value={draft.type} onChange={(event) => setDraft((current) => ({ ...current, type: event.target.value as Coupon['type'] }))} className="min-h-11 rounded border border-ink/12 px-3">
                <option value="percent">Percentuale</option>
                <option value="fixed">Importo fisso</option>
              </select>
            </label>
            <Field label="Valore" type="number" value={String(draft.value)} onChange={(value) => setDraft((current) => ({ ...current, value: Number(value) }))} />
            <Field label="Minimo ordine" type="number" value={String(draft.minOrder)} onChange={(value) => setDraft((current) => ({ ...current, minOrder: Number(value) }))} />
            <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded bg-oud px-4 text-sm font-semibold text-white" onClick={save}><Plus size={17} /> Salva coupon</button>
          </div>
        </div>
        <div className="grid gap-4">
          {coupons.map((coupon) => (
            <article key={coupon.code} className="flex flex-col gap-3 rounded border border-ink/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-serif text-2xl">{coupon.code}</p>
                <p className="text-sm text-ink/55">{coupon.type === 'percent' ? `${coupon.value}%` : `€${coupon.value}`} · minimo €{coupon.minOrder} · {coupon.active ? 'attivo' : 'spento'}</p>
              </div>
              <button className="rounded border border-ink/10 p-2 text-oud hover:bg-mist" onClick={() => persist(coupons.filter((item) => item.code !== coupon.code))}><Trash2 size={17} /></button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="grid gap-2 text-sm font-semibold">{label}<input className="min-h-11 rounded border border-ink/12 px-3" type={type} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}
