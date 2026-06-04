'use client';

import { useCallback, useEffect, useState } from 'react';
import { Eye, EyeOff, Pencil, Plus, Save } from 'lucide-react';
import { ActionButton } from '@/components/admin/action-button';
import { AdminModal } from '@/components/admin/admin-modal';
import { useCartStore } from '@/lib/cart/store';
import type { AdminCategory } from '@/lib/supabase/admin-taxonomy';

const emptyCategory: AdminCategory = { name: '', slug: '', description: '', isVisible: true, sortOrder: 0 };

function slugify(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function CategoryManager() {
  const notify = useCartStore((state) => state.notify);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [draft, setDraft] = useState<AdminCategory>(emptyCategory);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const editing = Boolean(draft.id);

  const loadCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/categories', { cache: 'no-store' });
      if (!response.ok) throw new Error('Categorie non disponibili');
      const payload = await response.json() as { categories: AdminCategory[] };
      setCategories(payload.categories);
    } catch {
      notify({ title: 'Categorie non caricate', description: 'Controlla Supabase o il login admin.', tone: 'warning' });
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const openCreate = () => {
    setDraft(emptyCategory);
    setIsModalOpen(true);
  };

  const openEdit = (category: AdminCategory) => {
    setDraft(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setDraft(emptyCategory);
    setIsModalOpen(false);
  };

  const persistCategory = async (category: AdminCategory) => {
    if (!category.name || !category.slug) {
      notify({ title: 'Nome e slug obbligatori', tone: 'warning' });
      return false;
    }
    const response = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(category)
    });
    if (!response.ok) {
      notify({ title: 'Categoria non salvata', tone: 'warning' });
      return false;
    }
    await loadCategories();
    return true;
  };

  const save = async () => {
    const saved = await persistCategory(draft);
    if (!saved) return;
    notify({ title: draft.id ? 'Categoria aggiornata' : 'Categoria creata', tone: 'success' });
    closeModal();
  };

  const toggleVisibility = async (category: AdminCategory) => {
    const saved = await persistCategory({ ...category, isVisible: !category.isVisible });
    if (!saved) return;
    notify({ title: category.isVisible ? 'Categoria nascosta' : 'Categoria resa visibile', tone: 'info' });
  };

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl sm:text-5xl">Categorie</h1>
          <p className="mt-3 text-ink/60">Categorie usate da catalogo, filtri e pagine categoria.</p>
        </div>
        <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded bg-oud px-4 text-sm font-semibold text-white" onClick={openCreate}>
          <Plus size={17} /> Nuova categoria
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        {isLoading ? <div className="rounded border border-ink/10 bg-white p-5 text-sm text-ink/60">Caricamento categorie...</div> : null}
        {categories.map((category) => (
          <article key={category.slug} className="flex flex-col gap-4 rounded border border-ink/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-serif text-2xl">{category.name}</p>
                <span className={`rounded px-2 py-1 text-xs font-semibold ${category.isVisible ? 'bg-sage/12 text-sage' : 'bg-oud/10 text-oud'}`}>
                  {category.isVisible ? 'Visibile nello storefront' : 'Nascosta nello storefront'}
                </span>
              </div>
              <p className="text-sm text-ink/55">{category.slug} - ordine {category.sortOrder}</p>
              <p className="mt-2 text-sm text-ink/65">{category.description}</p>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <ActionButton label="Modifica" icon={<Pencil size={16} />} onClick={() => openEdit(category)} />
              <ActionButton
                label={category.isVisible ? 'Nascondi' : 'Mostra'}
                icon={category.isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                tone={category.isVisible ? 'danger' : 'success'}
                onClick={() => void toggleVisibility(category)}
              />
            </div>
          </article>
        ))}
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editing ? 'Modifica categoria' : 'Nuova categoria'}
        description="Compila i dati della categoria. La visibilita controlla se appare nello storefront e nei filtri pubblici."
      >
        <div className="grid gap-4">
          <Field label="Nome" value={draft.name} onChange={(value) => setDraft((current) => ({ ...current, name: value, slug: current.slug || slugify(value) }))} />
          <Field label="Slug" value={draft.slug} onChange={(value) => setDraft((current) => ({ ...current, slug: slugify(value) }))} />
          <Field label="Descrizione" value={draft.description} onChange={(value) => setDraft((current) => ({ ...current, description: value }))} />
          <Field label="Ordine" type="number" value={String(draft.sortOrder)} onChange={(value) => setDraft((current) => ({ ...current, sortOrder: Number(value) }))} />
          <label className="flex items-center gap-2 rounded border border-ink/10 bg-white p-3 text-sm font-semibold">
            <input type="checkbox" checked={draft.isVisible} onChange={(event) => setDraft((current) => ({ ...current, isVisible: event.target.checked }))} />
            Visibile nello storefront
          </label>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button className="min-h-11 rounded border border-ink/12 px-4 text-sm font-semibold" onClick={closeModal}>Annulla</button>
            <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded bg-oud px-4 text-sm font-semibold text-white" onClick={() => void save()}><Save size={17} /> Salva categoria</button>
          </div>
        </div>
      </AdminModal>
    </section>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="grid gap-2 text-sm font-semibold">{label}<input className="min-h-11 rounded border border-ink/12 px-3" type={type} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}
