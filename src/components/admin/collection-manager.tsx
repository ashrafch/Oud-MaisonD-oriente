'use client';

import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { ActionButton } from '@/components/admin/action-button';
import { AdminModal } from '@/components/admin/admin-modal';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const editing = Boolean(draft.id);

  const loadCollections = useCallback(async () => {
    const response = await fetch('/api/admin/collections', { cache: 'no-store' });
    if (!response.ok) return;
    const payload = await response.json() as { collections: AdminCollection[] };
    setCollections(payload.collections);
  }, []);

  useEffect(() => {
    void loadCollections();
  }, [loadCollections]);

  const openCreate = () => {
    setDraft(emptyCollection);
    setIsModalOpen(true);
  };

  const openEdit = (collection: AdminCollection) => {
    setDraft(collection);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setDraft(emptyCollection);
    setIsModalOpen(false);
  };

  const save = async () => {
    if (!draft.name || !draft.slug) {
      notify({ title: 'Nome e slug obbligatori', tone: 'warning' });
      return;
    }
    const response = await fetch('/api/admin/collections', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(draft) });
    if (response.ok) {
      closeModal();
      await loadCollections();
      notify({ title: editing ? 'Collezione aggiornata' : 'Collezione creata', tone: 'success' });
    }
  };

  const remove = async (collectionId?: string) => {
    if (!collectionId) return;
    if (!window.confirm('Eliminare questa collezione?')) return;
    const response = await fetch('/api/admin/collections', { method: 'DELETE', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ collectionId }) });
    if (response.ok) {
      await loadCollections();
      notify({ title: 'Collezione eliminata', tone: 'info' });
    }
  };

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl sm:text-5xl">Collezioni</h1>
          <p className="mt-3 text-ink/60">Raggruppamenti editoriali e campagne, utili per landing e merchandising.</p>
        </div>
        <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded bg-oud px-4 text-sm font-semibold text-white" onClick={openCreate}>
          <Plus size={17} /> Nuova collezione
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        {collections.map((collection) => (
          <article key={collection.slug} className="flex flex-col gap-4 rounded border border-ink/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-serif text-2xl">{collection.name}</p>
              <p className="text-sm text-ink/55">{collection.slug}</p>
              <p className="mt-2 text-sm text-ink/65">{collection.description}</p>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <ActionButton label="Modifica" icon={<Pencil size={16} />} onClick={() => openEdit(collection)} />
              <ActionButton label="Elimina" icon={<Trash2 size={16} />} tone="danger" onClick={() => void remove(collection.id)} />
            </div>
          </article>
        ))}
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editing ? 'Modifica collezione' : 'Nuova collezione'}
        description="Le collezioni servono a organizzare campagne, landing e merchandising del catalogo."
      >
        <div className="grid gap-4">
          <Field label="Nome" value={draft.name} onChange={(value) => setDraft((current) => ({ ...current, name: value, slug: current.slug || slugify(value) }))} />
          <Field label="Slug" value={draft.slug} onChange={(value) => setDraft((current) => ({ ...current, slug: slugify(value) }))} />
          <Field label="Descrizione" value={draft.description} onChange={(value) => setDraft((current) => ({ ...current, description: value }))} />
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button className="min-h-11 rounded border border-ink/12 px-4 text-sm font-semibold" onClick={closeModal}>Annulla</button>
            <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded bg-oud px-4 text-sm font-semibold text-white" onClick={() => void save()}><Save size={17} /> Salva collezione</button>
          </div>
        </div>
      </AdminModal>
    </section>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="grid gap-2 text-sm font-semibold">{label}<input className="min-h-11 rounded border border-ink/12 px-3" value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}
