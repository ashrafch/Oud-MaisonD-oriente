'use client';

import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { useCartStore } from '@/lib/cart/store';
import type { AdminCollection } from '@/lib/supabase/admin-taxonomy';

const emptyCollection: AdminCollection = { name: '', slug: '', description: '' };

function slugify(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function CollectionManager() {
  const notify = useCartStore((state) => state.notify);
  const [collections, setCollections] = useState<AdminCollection[]>([]);
  const [draft, setDraft] = useState<AdminCollection>(emptyCollection);

  const loadCollections = useCallback(async () => {
    const response = await fetch('/api/admin/collections', { cache: 'no-store' });
    if (!response.ok) return;
    const payload = await response.json() as { collections: AdminCollection[] };
    setCollections(payload.collections);
  }, []);

  useEffect(() => {
    void loadCollections();
  }, [loadCollections]);

  const save = async () => {
    if (!draft.name || !draft.slug) {
      notify({ title: 'Nome e slug obbligatori', tone: 'warning' });
      return;
    }
    const response = await fetch('/api/admin/collections', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(draft) });
    if (response.ok) {
      setDraft(emptyCollection);
      await loadCollections();
      notify({ title: 'Collezione salvata', tone: 'success' });
    }
  };

  const remove = async (collectionId?: string) => {
    if (!collectionId) return;
    const response = await fetch('/api/admin/collections', { method: 'DELETE', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ collectionId }) });
    if (response.ok) {
      await loadCollections();
      notify({ title: 'Collezione eliminata', tone: 'info' });
    }
  };

  return (
    <section className="grid gap-8 xl:grid-cols-[380px_1fr]">
      <div className="h-fit rounded border border-ink/10 bg-white p-5">
        <p className="flex items-center gap-2 font-serif text-3xl"><Plus size={20} className="text-oud" /> Collezione</p>
        <div className="mt-5 grid gap-4">
          <Field label="Nome" value={draft.name} onChange={(value) => setDraft((current) => ({ ...current, name: value, slug: current.slug || slugify(value) }))} />
          <Field label="Slug" value={draft.slug} onChange={(value) => setDraft((current) => ({ ...current, slug: slugify(value) }))} />
          <Field label="Descrizione" value={draft.description} onChange={(value) => setDraft((current) => ({ ...current, description: value }))} />
          <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded bg-oud px-4 text-sm font-semibold text-white" onClick={() => void save()}><Save size={17} /> Salva</button>
        </div>
      </div>
      <div>
        <h1 className="font-serif text-4xl sm:text-5xl">Collezioni</h1>
        <p className="mt-3 text-ink/60">Raggruppamenti editoriali e campagne, utili per landing e merchandising.</p>
        <div className="mt-6 grid gap-4">
          {collections.map((collection) => (
            <article key={collection.slug} className="flex flex-col gap-4 rounded border border-ink/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-serif text-2xl">{collection.name}</p>
                <p className="text-sm text-ink/55">{collection.slug}</p>
                <p className="mt-2 text-sm text-ink/65">{collection.description}</p>
              </div>
              <div className="flex gap-2">
                <button className="rounded border border-ink/10 p-2 hover:bg-mist" onClick={() => setDraft(collection)} aria-label="Modifica"><Pencil size={17} /></button>
                <button className="rounded border border-ink/10 p-2 text-oud hover:bg-mist" onClick={() => void remove(collection.id)} aria-label="Elimina"><Trash2 size={17} /></button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="grid gap-2 text-sm font-semibold">{label}<input className="min-h-11 rounded border border-ink/12 px-3" value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}
