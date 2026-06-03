'use client';

import { useCallback, useEffect, useState } from 'react';
import { EyeOff, Pencil, Plus, Save } from 'lucide-react';
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

  const save = async () => {
    if (!draft.name || !draft.slug) {
      notify({ title: 'Nome e slug obbligatori', tone: 'warning' });
      return;
    }
    const response = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(draft)
    });
    if (!response.ok) {
      notify({ title: 'Categoria non salvata', tone: 'warning' });
      return;
    }
    setDraft(emptyCategory);
    await loadCategories();
    notify({ title: editing ? 'Categoria aggiornata' : 'Categoria creata', tone: 'success' });
  };

  const hide = async (categoryId?: string) => {
    if (!categoryId) return;
    const response = await fetch('/api/admin/categories', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ categoryId })
    });
    if (response.ok) {
      await loadCategories();
      notify({ title: 'Categoria nascosta', tone: 'info' });
    }
  };

  return (
    <section className="grid gap-8 xl:grid-cols-[380px_1fr]">
      <div className="h-fit rounded border border-ink/10 bg-white p-5">
        <p className="flex items-center gap-2 font-serif text-3xl"><Plus size={20} className="text-oud" /> {editing ? 'Modifica categoria' : 'Nuova categoria'}</p>
        <div className="mt-5 grid gap-4">
          <Field label="Nome" value={draft.name} onChange={(value) => setDraft((current) => ({ ...current, name: value, slug: current.slug || slugify(value) }))} />
          <Field label="Slug" value={draft.slug} onChange={(value) => setDraft((current) => ({ ...current, slug: slugify(value) }))} />
          <Field label="Descrizione" value={draft.description} onChange={(value) => setDraft((current) => ({ ...current, description: value }))} />
          <Field label="Ordine" type="number" value={String(draft.sortOrder)} onChange={(value) => setDraft((current) => ({ ...current, sortOrder: Number(value) }))} />
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={draft.isVisible} onChange={(event) => setDraft((current) => ({ ...current, isVisible: event.target.checked }))} /> Visibile nello storefront</label>
          <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded bg-oud px-4 text-sm font-semibold text-white" onClick={() => void save()}><Save size={17} /> Salva</button>
        </div>
      </div>
      <div>
        <h1 className="font-serif text-4xl sm:text-5xl">Categorie</h1>
        <p className="mt-3 text-ink/60">Categorie usate da catalogo, filtri e pagine categoria.</p>
        <div className="mt-6 grid gap-4">
          {isLoading ? <div className="rounded border border-ink/10 bg-white p-5 text-sm text-ink/60">Caricamento categorie...</div> : null}
          {categories.map((category) => (
            <article key={category.slug} className="flex flex-col gap-4 rounded border border-ink/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-serif text-2xl">{category.name}</p>
                <p className="text-sm text-ink/55">{category.slug} - ordine {category.sortOrder} - {category.isVisible ? 'visibile' : 'nascosta'}</p>
                <p className="mt-2 text-sm text-ink/65">{category.description}</p>
              </div>
              <div className="flex gap-2">
                <button className="rounded border border-ink/10 p-2 hover:bg-mist" onClick={() => setDraft(category)} aria-label="Modifica"><Pencil size={17} /></button>
                <button className="rounded border border-ink/10 p-2 text-oud hover:bg-mist" onClick={() => void hide(category.id)} aria-label="Nascondi"><EyeOff size={17} /></button>
              </div>
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
