'use client';

import { useCallback, useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { useCartStore } from '@/lib/cart/store';
import type { ContentPage } from '@/lib/supabase/content';

export function ContentManager() {
  const notify = useCartStore((state) => state.notify);
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [selectedSlug, setSelectedSlug] = useState('about');
  const selected = pages.find((page) => page.slug === selectedSlug) ?? pages[0];

  const loadPages = useCallback(async () => {
    const response = await fetch('/api/admin/content', { cache: 'no-store' });
    if (!response.ok) return;
    const payload = await response.json() as { pages: ContentPage[] };
    setPages(payload.pages);
    setSelectedSlug((current) => current || payload.pages[0]?.slug || 'about');
  }, []);

  useEffect(() => {
    void loadPages();
  }, [loadPages]);

  const updateSelected = (patch: Partial<ContentPage>) => {
    setPages((current) => current.map((page) => page.slug === selectedSlug ? { ...page, ...patch } : page));
  };

  const save = async () => {
    if (!selected) return;
    const response = await fetch('/api/admin/content', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(selected) });
    if (response.ok) notify({ title: 'Contenuto salvato', description: selected.title, tone: 'success' });
  };

  return (
    <section className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="h-fit rounded border border-ink/10 bg-white p-4">
        <p className="font-serif text-3xl">Pagine</p>
        <div className="mt-4 grid gap-2">
          {pages.map((page) => (
            <button key={page.slug} className={`rounded px-3 py-2 text-left text-sm font-semibold ${selectedSlug === page.slug ? 'bg-oud text-white' : 'hover:bg-mist'}`} onClick={() => setSelectedSlug(page.slug)}>{page.title}</button>
          ))}
        </div>
      </aside>
      <div className="rounded border border-ink/10 bg-white p-5">
        <h1 className="font-serif text-4xl sm:text-5xl">Contenuti</h1>
        <p className="mt-3 text-ink/60">Bozze operative per testi legali, pagine informative e FAQ.</p>
        {selected ? (
          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-semibold">Titolo
              <input className="min-h-11 rounded border border-ink/12 px-3" value={selected.title} onChange={(event) => updateSelected({ title: event.target.value })} />
            </label>
            <label className="grid gap-2 text-sm font-semibold">Testo
              <textarea className="min-h-80 rounded border border-ink/12 px-3 py-2" value={selected.body} onChange={(event) => updateSelected({ body: event.target.value })} />
            </label>
            <button className="inline-flex min-h-11 w-fit items-center gap-2 rounded bg-oud px-4 text-sm font-semibold text-white" onClick={() => void save()}><Save size={17} /> Salva contenuto</button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
