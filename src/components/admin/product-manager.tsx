'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Copy, ImagePlus, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { categories, products as seedProducts } from '@/data/catalog';
import { formatPrice, getStoredProducts, setStoredProducts, useCartStore } from '@/lib/cart/store';
import type { Product } from '@/types/catalog';

type ProductDraft = Omit<Product, 'notes' | 'tags'> & {
  tags: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
};

const emptyDraft: ProductDraft = {
  id: '',
  slug: '',
  name: '',
  brand: 'OUDÉ',
  price: 0,
  compareAtPrice: undefined,
  category: 'oud',
  image: '/brand/oude-logo.jpg',
  stock: 10,
  intensity: 'Medio',
  duration: '6-8 ore',
  gender: 'unisex',
  tags: 'nuovo',
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
    baseNotes: product.notes.base.join(', ')
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
    image: draft.image,
    stock: Number(draft.stock),
    intensity: draft.intensity,
    duration: draft.duration,
    gender: draft.gender,
    tags: draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
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
  const editing = Boolean(draft.id);
  const visibleProducts = useMemo(() => products.filter((product) => [product.name, product.brand, product.category].join(' ').toLowerCase().includes(query.toLowerCase())), [products, query]);

  const persistProducts = (nextProducts: Product[]) => {
    setProducts(nextProducts);
    setStoredProducts(nextProducts);
  };

  const saveProduct = () => {
    if (!draft.name || !draft.shortDescription || !draft.price) {
      notify({ title: 'Compila nome, descrizione e prezzo', tone: 'warning' });
      return;
    }
    const product = productFromDraft({ ...draft, slug: draft.slug || slugify(draft.name) });
    const nextProducts = products.some((item) => item.id === product.id)
      ? products.map((item) => item.id === product.id ? product : item)
      : [product, ...products];
    persistProducts(nextProducts);
    setDraft(emptyDraft);
    notify({ title: editing ? 'Prodotto aggiornato' : 'Prodotto creato', description: product.name, tone: 'success' });
  };

  const deleteProduct = (productId: string) => {
    if (!window.confirm('Nascondere/eliminare questo prodotto dal catalogo locale?')) return;
    persistProducts(products.filter((product) => product.id !== productId));
    notify({ title: 'Prodotto rimosso', tone: 'info' });
  };

  const duplicateProduct = (product: Product) => {
    const copy = { ...product, id: `${product.id}-copy-${Date.now()}`, slug: `${product.slug}-copia`, name: `${product.name} copia` };
    persistProducts([copy, ...products]);
    notify({ title: 'Prodotto duplicato', description: copy.name, tone: 'success' });
  };

  const handleImage = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraft((current) => ({ ...current, image: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
      <section className="h-fit rounded border border-ink/10 bg-white p-5">
        <div className="flex items-center gap-2">
          <Plus className="text-oud" size={20} />
          <h2 className="font-serif text-3xl">{editing ? 'Modifica prodotto' : 'Nuovo prodotto'}</h2>
        </div>
        <div className="mt-5 grid gap-4">
          <Field label="Nome" value={draft.name} onChange={(value) => setDraft((current) => ({ ...current, name: value, slug: current.slug || slugify(value) }))} />
          <Field label="Slug" value={draft.slug} onChange={(value) => setDraft((current) => ({ ...current, slug: slugify(value) }))} />
          <Field label="Brand" value={draft.brand} onChange={(value) => setDraft((current) => ({ ...current, brand: value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prezzo" type="number" value={String(draft.price)} onChange={(value) => setDraft((current) => ({ ...current, price: Number(value) }))} />
            <Field label="Stock" type="number" value={String(draft.stock)} onChange={(value) => setDraft((current) => ({ ...current, stock: Number(value) }))} />
          </div>
          <label className="grid gap-2">
            <span className="text-sm font-semibold">Categoria</span>
            <select value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))} className="min-h-11 rounded border border-ink/12 px-3 text-sm">
              {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
            </select>
          </label>
          <div className="relative h-48 overflow-hidden rounded border border-ink/10 bg-mist">
            <Image src={draft.image} alt="Anteprima prodotto" fill className="object-cover" unoptimized={draft.image.startsWith('data:')} />
          </div>
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-ink/20 p-3 text-sm font-semibold hover:bg-mist">
            <ImagePlus size={18} /> Carica foto prodotto
            <input type="file" accept="image/*" className="sr-only" onChange={(event) => handleImage(event.target.files?.[0])} />
          </label>
          <Field label="Intensità" value={draft.intensity} onChange={(value) => setDraft((current) => ({ ...current, intensity: value }))} />
          <Field label="Durata" value={draft.duration} onChange={(value) => setDraft((current) => ({ ...current, duration: value }))} />
          <Field label="Descrizione breve" value={draft.shortDescription} onChange={(value) => setDraft((current) => ({ ...current, shortDescription: value }))} />
          <Field label="Note testa" value={draft.topNotes} onChange={(value) => setDraft((current) => ({ ...current, topNotes: value }))} />
          <Field label="Note cuore" value={draft.heartNotes} onChange={(value) => setDraft((current) => ({ ...current, heartNotes: value }))} />
          <Field label="Note fondo" value={draft.baseNotes} onChange={(value) => setDraft((current) => ({ ...current, baseNotes: value }))} />
          <Field label="Tag marketing" value={draft.tags} onChange={(value) => setDraft((current) => ({ ...current, tags: value }))} />
          <div className="flex gap-3">
            <button className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded bg-oud px-4 text-sm font-semibold text-white" onClick={saveProduct}><Save size={17} /> Salva</button>
            <button className="min-h-11 rounded border border-ink/12 px-4 text-sm font-semibold" onClick={() => setDraft(emptyDraft)}>Reset</button>
          </div>
        </div>
      </section>
      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-oud">Catalogo admin</p>
            <h1 className="font-serif text-4xl sm:text-5xl">Prodotti</h1>
          </div>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cerca prodotto" className="min-h-11 rounded border border-ink/12 bg-white px-3 text-sm" />
        </div>
        <div className="mt-6 grid gap-4">
          {visibleProducts.map((product) => (
            <article key={product.id} className="grid gap-4 rounded border border-ink/10 bg-white p-4 md:grid-cols-[96px_1fr_auto] md:items-center">
              <div className="relative h-28 overflow-hidden rounded bg-mist md:h-24">
                <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized={product.image.startsWith('data:')} />
              </div>
              <div>
                <p className="font-serif text-2xl">{product.name}</p>
                <p className="mt-1 text-sm text-ink/55">{product.category} · {formatPrice(product.price)} · {product.stock} pezzi</p>
                <p className="mt-2 text-sm text-ink/65">{product.shortDescription}</p>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <button className="rounded border border-ink/10 p-2 hover:bg-mist" aria-label="Modifica" onClick={() => setDraft(draftFromProduct(product))}><Pencil size={17} /></button>
                <button className="rounded border border-ink/10 p-2 hover:bg-mist" aria-label="Duplica" onClick={() => duplicateProduct(product)}><Copy size={17} /></button>
                <button className="rounded border border-ink/10 p-2 text-oud hover:bg-mist" aria-label="Elimina" onClick={() => deleteProduct(product.id)}><Trash2 size={17} /></button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="min-h-11 rounded border border-ink/12 px-3 text-sm" />
    </label>
  );
}
