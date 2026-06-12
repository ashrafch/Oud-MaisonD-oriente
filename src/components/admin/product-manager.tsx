'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Copy, EyeOff, ImagePlus, Pencil, Plus, Save } from 'lucide-react';
import { ActionButton } from '@/components/admin/action-button';
import { AdminModal } from '@/components/admin/admin-modal';
import { categories, products as seedProducts } from '@/data/catalog';
import { formatPrice, getStoredProducts, setStoredProducts, useCartStore } from '@/lib/cart/store';
import type { Product } from '@/types/catalog';

type ProductDraft = Omit<Product, 'notes' | 'tags'> & {
  tags: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  seoTitle: string;
  seoDescription: string;
};

const emptyDraft: ProductDraft = {
  id: '',
  slug: '',
  name: '',
  brand: 'OUDE',
  price: 0,
  compareAtPrice: undefined,
  category: 'oud',
  categories: ['oud'],
  image: '/brand/oude-logo.jpg',
  stock: 10,
  intensity: 'Medio',
  duration: '6-8 ore',
  gender: 'unisex',
  tags: 'nuovo',
  seoTitle: '',
  seoDescription: '',
  shortDescription: '',
  topNotes: '',
  heartNotes: '',
  baseNotes: ''
};

function slugify(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function draftFromProduct(product: Product): ProductDraft {
  return {
    ...product,
    tags: product.tags.join(', '),
    topNotes: product.notes.top.join(', '),
    heartNotes: product.notes.heart.join(', '),
    baseNotes: product.notes.base.join(', '),
    seoTitle: product.seoTitle ?? product.name,
    seoDescription: product.seoDescription ?? product.shortDescription
  };
}

function productFromDraft(draft: ProductDraft): Product {
  const id = draft.id || slugify(draft.name) || crypto.randomUUID();
  return {
    id,
    slug: draft.slug || slugify(draft.name),
    name: draft.name,
    brand: draft.brand,
    price: Number(draft.price),
    compareAtPrice: draft.compareAtPrice ? Number(draft.compareAtPrice) : undefined,
    category: draft.category,
    categories: [draft.category],
    image: draft.image,
    stock: Number(draft.stock),
    intensity: draft.intensity,
    duration: draft.duration,
    gender: draft.gender,
    tags: draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    seoTitle: draft.seoTitle || draft.name,
    seoDescription: draft.seoDescription || draft.shortDescription,
    shortDescription: draft.shortDescription,
    notes: {
      top: draft.topNotes.split(',').map((note) => note.trim()).filter(Boolean),
      heart: draft.heartNotes.split(',').map((note) => note.trim()).filter(Boolean),
      base: draft.baseNotes.split(',').map((note) => note.trim()).filter(Boolean)
    }
  };
}

export function ProductManager() {
  const notify = useCartStore((state) => state.notify);
  const [products, setProducts] = useState(() => getStoredProducts(seedProducts));
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const editing = Boolean(draft.id);
  const visibleProducts = useMemo(() => products.filter((product) => [product.name, product.brand, product.category].join(' ').toLowerCase().includes(query.toLowerCase())), [products, query]);

  const loadProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/products', { cache: 'no-store' });
      if (!response.ok) throw new Error('Catalogo Supabase non disponibile');
      const payload = await response.json() as { products: Product[] };
      setProducts(payload.products);
      setStoredProducts(payload.products);
    } catch {
      setProducts(getStoredProducts(seedProducts));
      notify({ title: 'Uso catalogo locale', description: 'Controlla le variabili Supabase se non vedi i prodotti del database.', tone: 'warning' });
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const persistProducts = (nextProducts: Product[]) => {
    setProducts(nextProducts);
    setStoredProducts(nextProducts);
  };

  const openCreate = () => {
    setDraft(emptyDraft);
    setIsModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setDraft(draftFromProduct(product));
    setIsModalOpen(true);
  };

  const clearError = (field: string) => setFormErrors((e) => { const n = { ...e }; delete n[field]; return n; });

  const closeModal = () => {
    setDraft(emptyDraft);
    setFormErrors({});
    setIsModalOpen(false);
  };

  const saveProduct = async () => {
    const errors: Record<string, string> = {};
    if (!draft.name.trim()) errors.name = 'Il nome è obbligatorio';
    if (!draft.shortDescription.trim()) errors.shortDescription = 'La descrizione breve è obbligatoria';
    if (!draft.price || Number(draft.price) <= 0) errors.price = 'Il prezzo deve essere maggiore di 0';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setIsSaving(true);
    const product = productFromDraft({ ...draft, slug: draft.slug || slugify(draft.name) });
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (!response.ok) throw new Error('Salvataggio Supabase fallito');
      await loadProducts();
      closeModal();
      notify({ title: editing ? 'Prodotto aggiornato su Supabase' : 'Prodotto creato su Supabase', description: product.name, tone: 'success' });
    } catch {
      const nextProducts = products.some((item) => item.id === product.id)
        ? products.map((item) => item.id === product.id ? product : item)
        : [product, ...products];
      persistProducts(nextProducts);
      closeModal();
      notify({ title: 'Prodotto salvato in locale', description: 'Supabase non ha confermato il salvataggio.', tone: 'warning' });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!window.confirm('Nascondere questo prodotto dal catalogo?')) return;
    try {
      const response = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      if (!response.ok) throw new Error('Eliminazione Supabase fallita');
      await loadProducts();
      notify({ title: 'Prodotto nascosto su Supabase', tone: 'info' });
    } catch {
      persistProducts(products.filter((product) => product.id !== productId));
      notify({ title: 'Prodotto rimosso in locale', description: 'Supabase non ha confermato la modifica.', tone: 'warning' });
    }
  };

  const duplicateProduct = async (product: Product) => {
    const copy = { ...product, id: `${product.id}-copy-${Date.now()}`, slug: `${product.slug}-copia`, name: `${product.name} copia` };
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(copy)
      });
      if (!response.ok) throw new Error('Duplicazione Supabase fallita');
      await loadProducts();
      notify({ title: 'Prodotto duplicato su Supabase', description: copy.name, tone: 'success' });
    } catch {
      persistProducts([copy, ...products]);
      notify({ title: 'Prodotto duplicato in locale', description: copy.name, tone: 'warning' });
    }
  };

  const handleImage = async (file?: File) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Upload Supabase fallito');
      const payload = await response.json() as { url: string };
      setDraft((current) => ({ ...current, image: payload.url }));
      notify({ title: 'Immagine caricata su Supabase', tone: 'success' });
    } catch (err) {
      notify({
        title: 'Upload immagine fallito',
        description: err instanceof Error ? err.message : 'Controlla che Supabase Storage sia configurato su Vercel.',
        tone: 'warning'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-oud">Catalogo admin</p>
          <h1 className="font-serif text-4xl sm:text-5xl">Prodotti</h1>
          <p className="mt-3 text-ink/60">Crea e modifica i prodotti da una finestra dedicata, senza perdere il contesto del catalogo.</p>
        </div>
        <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded bg-oud px-4 text-sm font-semibold text-white" onClick={openCreate}>
          <Plus size={17} /> Nuovo prodotto
        </button>
      </div>

      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cerca prodotto" className="mt-6 min-h-11 w-full rounded border border-ink/12 bg-white px-3 text-sm sm:max-w-sm" />

      <div className="mt-6 grid gap-4">
        {isLoading ? <div className="rounded border border-ink/10 bg-white p-5 text-sm text-ink/60">Caricamento catalogo da Supabase...</div> : null}
        {visibleProducts.map((product) => (
          <article key={product.id} className="grid gap-4 rounded border border-ink/10 bg-white p-4 md:grid-cols-[96px_1fr_auto] md:items-center">
            <div className="relative h-28 overflow-hidden rounded bg-mist md:h-24">
              <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized={product.image.startsWith('data:')} />
            </div>
            <div>
              <p className="font-serif text-2xl">{product.name}</p>
              <p className="mt-1 text-sm text-ink/55">{product.category} - {formatPrice(product.price)} - {product.stock} pezzi</p>
              <p className="mt-2 text-sm text-ink/65">{product.shortDescription}</p>
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end">
              <ActionButton label="Modifica" icon={<Pencil size={16} />} onClick={() => openEdit(product)} />
              <ActionButton label="Duplica" icon={<Copy size={16} />} onClick={() => void duplicateProduct(product)} />
              <ActionButton label="Nascondi" icon={<EyeOff size={16} />} tone="danger" onClick={() => void deleteProduct(product.id)} />
            </div>
          </article>
        ))}
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        size="xl"
        title={editing ? 'Modifica prodotto' : 'Nuovo prodotto'}
        description="Compila dati prodotto, immagine, stock, note olfattive e SEO. Il salvataggio aggiorna Supabase quando disponibile."
      >
        {Object.keys(formErrors).length > 0 ? (
          <div className="flex items-start gap-3 rounded border border-oud/25 bg-oud/8 px-4 py-3 text-sm text-oud">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Campi obbligatori mancanti:</p>
              <ul className="mt-1 list-disc pl-4">
                {Object.values(formErrors).map((msg) => <li key={msg}>{msg}</li>)}
              </ul>
            </div>
          </div>
        ) : null}
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="grid gap-4">
            <Field label="Nome" required error={formErrors.name} value={draft.name} onChange={(value) => { setDraft((current) => ({ ...current, name: value, slug: current.slug || slugify(value) })); if (value.trim()) clearError('name'); }} />
            <Field label="Slug" value={draft.slug} onChange={(value) => setDraft((current) => ({ ...current, slug: slugify(value) }))} />
            <Field label="Brand" value={draft.brand} onChange={(value) => setDraft((current) => ({ ...current, brand: value }))} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Prezzo" required type="number" error={formErrors.price} value={String(draft.price)} onChange={(value) => { setDraft((current) => ({ ...current, price: Number(value) })); if (Number(value) > 0) clearError('price'); }} />
              <Field label="Stock" type="number" value={String(draft.stock)} onChange={(value) => setDraft((current) => ({ ...current, stock: Number(value) }))} />
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-semibold">Categoria</span>
              <select value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))} className="min-h-11 rounded border border-ink/12 px-3 text-sm">
                {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
              </select>
            </label>
            <Field label="Intensita" value={draft.intensity} onChange={(value) => setDraft((current) => ({ ...current, intensity: value }))} />
            <Field label="Durata" value={draft.duration} onChange={(value) => setDraft((current) => ({ ...current, duration: value }))} />
            <Field label="Descrizione breve" required error={formErrors.shortDescription} value={draft.shortDescription} onChange={(value) => { setDraft((current) => ({ ...current, shortDescription: value })); if (value.trim()) clearError('shortDescription'); }} />
            <Field label="Note testa" value={draft.topNotes} onChange={(value) => setDraft((current) => ({ ...current, topNotes: value }))} />
            <Field label="Note cuore" value={draft.heartNotes} onChange={(value) => setDraft((current) => ({ ...current, heartNotes: value }))} />
            <Field label="Note fondo" value={draft.baseNotes} onChange={(value) => setDraft((current) => ({ ...current, baseNotes: value }))} />
            <Field label="Tag marketing" value={draft.tags} onChange={(value) => setDraft((current) => ({ ...current, tags: value }))} />
            <div className="rounded border border-ink/10 bg-white p-4">
              <p className="font-serif text-2xl">SEO prodotto</p>
              <div className="mt-4 grid gap-4">
                <Field label="SEO title" value={draft.seoTitle} onChange={(value) => setDraft((current) => ({ ...current, seoTitle: value }))} />
                <Field label="SEO description" value={draft.seoDescription} onChange={(value) => setDraft((current) => ({ ...current, seoDescription: value }))} />
              </div>
            </div>
          </div>
          <aside className="grid h-fit gap-4 rounded border border-ink/10 bg-white p-4">
            <div className="relative h-56 overflow-hidden rounded border border-ink/10 bg-mist">
              <Image src={draft.image} alt="Anteprima prodotto" fill className="object-cover" unoptimized={draft.image.startsWith('data:')} />
            </div>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-ink/20 p-3 text-sm font-semibold hover:bg-mist">
              <ImagePlus size={18} /> Carica foto prodotto
              <input type="file" accept="image/*" className="sr-only" onChange={(event) => void handleImage(event.target.files?.[0])} />
            </label>
            {isUploading ? <p className="text-xs text-ink/55">Upload in corso...</p> : null}
          </aside>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-ink/10 pt-5 sm:flex-row sm:justify-end">
          <button className="min-h-11 rounded border border-ink/12 px-4 text-sm font-semibold" onClick={closeModal}>Annulla</button>
          <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded bg-oud px-4 text-sm font-semibold text-white disabled:opacity-55" disabled={isSaving} onClick={() => void saveProduct()}><Save size={17} /> {isSaving ? 'Salvataggio...' : 'Salva prodotto'}</button>
        </div>
      </AdminModal>
    </section>
  );
}

function Field({ label, value, onChange, type = 'text', error, required }: { label: string; value: string; onChange: (value: string) => void; type?: string; error?: string; required?: boolean }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold">
        {label}
        {required ? <span className="ml-0.5 text-oud" aria-hidden>*</span> : null}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`min-h-11 rounded border px-3 text-sm transition-colors ${error ? 'border-oud bg-oud/5 focus:outline-none focus:ring-1 focus:ring-oud/40' : 'border-ink/12'}`}
      />
      {error ? <p className="text-xs font-medium text-oud">{error}</p> : null}
    </label>
  );
}
