'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, Package, RotateCcw, Truck, Zap } from 'lucide-react';
import { useCartStore } from '@/lib/cart/store';
import { invalidateShippingCache } from '@/lib/cart/use-shipping-config';

type ShippingConfig = { baseCost: number; freeThreshold: number };
const DEFAULTS: ShippingConfig = { baseCost: 6.9, freeThreshold: 79 };

function describeRule(cfg: ShippingConfig): string {
  if (cfg.baseCost === 0) return 'Spedizione gratuita per tutti gli ordini.';
  if (cfg.freeThreshold === 0) return `Spedizione €${cfg.baseCost.toFixed(2)} per tutti gli ordini (nessuna soglia gratuita).`;
  return `Spedizione €${cfg.baseCost.toFixed(2)} per ordini sotto €${cfg.freeThreshold.toFixed(2)}. Gratuita sopra soglia.`;
}

export function ShippingSettings() {
  const notify = useCartStore((state) => state.notify);
  const [config, setConfig] = useState<ShippingConfig>(DEFAULTS);
  const [draft, setDraft] = useState<ShippingConfig>(DEFAULTS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [migrationNeeded, setMigrationNeeded] = useState(false);

  useEffect(() => {
    fetch('/api/settings/shipping')
      .then((r) => (r.ok ? (r.json() as Promise<ShippingConfig>) : null))
      .then((data) => {
        if (data && typeof data.baseCost === 'number') {
          setConfig(data);
          setDraft(data);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const isDirty = draft.baseCost !== config.baseCost || draft.freeThreshold !== config.freeThreshold;

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setMigrationNeeded(false);
    try {
      const response = await fetch('/api/settings/shipping', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(draft)
      });
      const payload = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok) {
        if (payload.error?.includes('site_settings')) setMigrationNeeded(true);
        else setSaveError(payload.error ?? 'Salvataggio fallito');
        return;
      }
      setConfig(draft);
      invalidateShippingCache();
      notify({ title: 'Tariffe spedizione aggiornate', description: describeRule(draft), tone: 'success' });
    } catch {
      setSaveError('Errore di rete. Riprova.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="rounded border border-ink/10 bg-white p-6 text-sm text-ink/60">Caricamento configurazione spedizione...</div>;
  }

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-oud">Impostazioni negozio</p>
        <h1 className="font-serif text-4xl sm:text-5xl">Spedizione</h1>
        <p className="mt-3 text-ink/60">Configura il costo di spedizione standard e la soglia per la spedizione gratuita. Le modifiche si applicano agli ordini successivi al salvataggio.</p>
      </div>

      {migrationNeeded ? (
        <div className="rounded border border-amber-300 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-800">Migration Supabase richiesta</p>
              <p className="mt-1 text-sm text-amber-700">La tabella <code className="rounded bg-amber-100 px-1">site_settings</code> non esiste ancora. Esegui questo SQL nel pannello Supabase (SQL Editor) e poi riprova:</p>
              <pre className="mt-3 overflow-x-auto rounded bg-amber-100 p-3 text-xs text-amber-900">{`CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lettura pubblica" ON site_settings
  FOR SELECT USING (true);

INSERT INTO site_settings (key, value) VALUES
  ('shipping', '{"baseCost": 6.90, "freeThreshold": 79}'::jsonb)
ON CONFLICT (key) DO NOTHING;`}</pre>
            </div>
          </div>
        </div>
      ) : null}

      {saveError ? (
        <div className="flex items-center gap-2 rounded border border-oud/25 bg-oud/8 px-4 py-3 text-sm text-oud">
          <AlertCircle size={16} className="shrink-0" />
          {saveError}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-4">
          <div className="rounded border border-ink/10 bg-white p-6">
            <div className="flex items-center gap-2 font-serif text-2xl">
              <Truck size={22} className="text-oud" />
              Tariffe spedizione
            </div>
            <p className="mt-2 text-sm text-ink/60">Imposta 0 nel campo Costo per spedizione sempre gratuita. Imposta 0 nel campo Soglia per disattivare la spedizione gratuita per importo.</p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold">Costo spedizione standard (€)</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink/50">€</span>
                  <input
                    type="number"
                    min={0}
                    max={999}
                    step={0.01}
                    value={draft.baseCost}
                    onChange={(e) => setDraft((d) => ({ ...d, baseCost: Math.max(0, Number(e.target.value)) }))}
                    className="min-h-11 w-full rounded border border-ink/12 pl-7 pr-3 text-sm"
                  />
                </div>
                <p className="text-xs text-ink/50">0 = spedizione sempre gratuita</p>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Soglia spedizione gratuita (€)</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink/50">€</span>
                  <input
                    type="number"
                    min={0}
                    max={9999}
                    step={1}
                    value={draft.freeThreshold}
                    onChange={(e) => setDraft((d) => ({ ...d, freeThreshold: Math.max(0, Number(e.target.value)) }))}
                    className="min-h-11 w-full rounded border border-ink/12 pl-7 pr-3 text-sm"
                  />
                </div>
                <p className="text-xs text-ink/50">0 = nessuna soglia gratuita per importo</p>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 border-t border-ink/10 pt-5">
              <button
                className="inline-flex items-center gap-2 rounded bg-oud/8 px-4 py-2 text-sm font-semibold text-oud hover:bg-oud/15"
                onClick={() => setDraft({ baseCost: 0, freeThreshold: 0 })}
              >
                <Zap size={15} />
                Gratis per tutti
              </button>
              <button
                className="inline-flex items-center gap-2 rounded border border-ink/12 px-4 py-2 text-sm font-semibold hover:bg-mist"
                onClick={() => setDraft(DEFAULTS)}
              >
                <RotateCcw size={15} />
                Ripristina default (€6,90 / €79)
              </button>
              <button
                className="inline-flex items-center gap-2 rounded border border-ink/12 px-4 py-2 text-sm font-semibold hover:bg-mist"
                onClick={() => setDraft(config)}
                disabled={!isDirty}
              >
                Annulla modifiche
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded bg-oud px-6 text-sm font-semibold text-white disabled:opacity-55"
              disabled={isSaving || !isDirty}
              onClick={() => void handleSave()}
            >
              {isSaving ? 'Salvataggio...' : 'Salva tariffe'}
            </button>
            {!isDirty && !isSaving ? (
              <div className="inline-flex items-center gap-2 rounded bg-mist px-4 py-2 text-sm text-ink/55">
                <CheckCircle2 size={15} /> Nessuna modifica in sospeso
              </div>
            ) : null}
          </div>
        </div>

        <aside className="grid h-fit gap-4">
          <div className="rounded border border-ink/10 bg-white p-5">
            <div className="flex items-center gap-2 font-serif text-xl">
              <Package size={18} className="text-oud" />
              Anteprima regola
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink/75">{describeRule(draft)}</p>

            <div className="mt-5 grid gap-2 border-t border-ink/10 pt-4 text-xs text-ink/55">
              {draft.baseCost === 0 ? (
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 size={13} />
                  Tutti gli ordini: spedizione gratuita
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    Ordini sotto €{draft.freeThreshold || '—'}: costo €{draft.baseCost.toFixed(2)}
                  </div>
                  {draft.freeThreshold > 0 ? (
                    <div className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle2 size={13} />
                      Ordini sopra €{draft.freeThreshold.toFixed(2)}: gratuita
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>

          <div className="rounded border border-ink/10 bg-white p-5">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <Info size={15} className="text-oud" />
              Configurazione attiva
            </div>
            <div className="mt-3 grid gap-2 text-xs text-ink/65">
              <div className="flex justify-between">
                <span>Costo corrente</span>
                <span className="font-semibold">€{config.baseCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Soglia gratuita</span>
                <span className="font-semibold">{config.freeThreshold > 0 ? `€${config.freeThreshold.toFixed(2)}` : 'Disattivata'}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
