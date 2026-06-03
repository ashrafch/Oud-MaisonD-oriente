'use client';

import { useCallback, useEffect, useState } from 'react';
import { Percent, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/lib/cart/store';
import type { Coupon } from '@/lib/supabase/coupons';

const initialCoupons: Coupon[] = [
  { code: 'OUDE10', type: 'percent', value: 10, active: true },
  { code: 'WELCOME15', type: 'percent', value: 15, active: true }
];

export function CouponManager() {
  const notify = useCartStore((state) => state.notify);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [draft, setDraft] = useState<Coupon>({ code: '', type: 'percent', value: 10, active: true });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadCoupons = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/coupons', { cache: 'no-store' });
      if (!response.ok) throw new Error('Coupon Supabase non disponibili');
      const payload = await response.json() as { coupons: Coupon[] };
      setCoupons(payload.coupons);
      window.localStorage.setItem('oude-coupons', JSON.stringify(payload.coupons));
    } catch {
      const raw = window.localStorage.getItem('oude-coupons');
      setCoupons(raw ? JSON.parse(raw) as Coupon[] : initialCoupons);
      notify({ title: 'Uso coupon locali', description: 'Supabase non ha risposto.', tone: 'warning' });
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void loadCoupons();
  }, [loadCoupons]);

  const persistLocal = (next: Coupon[]) => {
    setCoupons(next);
    window.localStorage.setItem('oude-coupons', JSON.stringify(next));
  };

  const save = async () => {
    if (!draft.code || draft.value <= 0) {
      notify({ title: 'Coupon non valido', description: 'Inserisci codice e valore.', tone: 'warning' });
      return;
    }
    setIsSaving(true);
    const normalized = { ...draft, code: draft.code.trim().toUpperCase() };
    try {
      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(normalized)
      });
      if (!response.ok) throw new Error('Salvataggio coupon fallito');
      await loadCoupons();
      setDraft({ code: '', type: 'percent', value: 10, active: true });
      notify({ title: 'Coupon salvato su Supabase', description: normalized.code, tone: 'success' });
    } catch {
      persistLocal([normalized, ...coupons.filter((coupon) => coupon.code !== normalized.code)]);
      notify({ title: 'Coupon salvato in locale', description: normalized.code, tone: 'warning' });
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (code: string) => {
    try {
      const response = await fetch('/api/admin/coupons', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code })
      });
      if (!response.ok) throw new Error('Eliminazione coupon fallita');
      await loadCoupons();
      notify({ title: 'Coupon eliminato', description: code, tone: 'info' });
    } catch {
      persistLocal(coupons.filter((item) => item.code !== code));
      notify({ title: 'Coupon rimosso in locale', description: code, tone: 'warning' });
    }
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
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={draft.active} onChange={(event) => setDraft((current) => ({ ...current, active: event.target.checked }))} />
              Attivo
            </label>
            <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded bg-oud px-4 text-sm font-semibold text-white disabled:opacity-55" disabled={isSaving} onClick={() => void save()}><Plus size={17} /> {isSaving ? 'Salvataggio...' : 'Salva coupon'}</button>
          </div>
        </div>
        <div className="grid gap-4">
          {isLoading ? <div className="rounded border border-ink/10 bg-white p-5 text-sm text-ink/60">Caricamento coupon...</div> : null}
          {coupons.map((coupon) => (
            <article key={coupon.code} className="flex flex-col gap-3 rounded border border-ink/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-serif text-2xl">{coupon.code}</p>
                <p className="text-sm text-ink/55">{coupon.type === 'percent' ? `${coupon.value}%` : `${coupon.value} EUR`} - {coupon.active ? 'attivo' : 'spento'}</p>
              </div>
              <button className="rounded border border-ink/10 p-2 text-oud hover:bg-mist" onClick={() => void remove(coupon.code)}><Trash2 size={17} /></button>
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
