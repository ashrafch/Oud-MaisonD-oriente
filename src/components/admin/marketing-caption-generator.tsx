'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Copy, Megaphone, Save, Trash2 } from 'lucide-react';
import { products as seedProducts } from '@/data/catalog';
import { getStoredProducts, useCartStore } from '@/lib/cart/store';
import type { MarketingPost } from '@/lib/supabase/marketing';
import type { Product } from '@/types/catalog';

export function MarketingCaptionGenerator() {
  const notify = useCartStore((state) => state.notify);
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts(seedProducts));
  const [posts, setPosts] = useState<MarketingPost[]>([]);
  const [productId, setProductId] = useState(products[0]?.id ?? '');
  const [channel, setChannel] = useState('Instagram');
  const [status, setStatus] = useState<MarketingPost['status']>('draft');
  const [scheduledAt, setScheduledAt] = useState('');
  const product = products.find((item) => item.id === productId) ?? products[0];

  const loadData = useCallback(async () => {
    const [productsResponse, postsResponse] = await Promise.all([
      fetch('/api/admin/products', { cache: 'no-store' }),
      fetch('/api/admin/marketing', { cache: 'no-store' })
    ]);
    if (productsResponse.ok) {
      const payload = await productsResponse.json() as { products: Product[] };
      setProducts(payload.products);
      setProductId((current) => current || payload.products[0]?.id || '');
    }
    if (postsResponse.ok) {
      const payload = await postsResponse.json() as { posts: MarketingPost[] };
      setPosts(payload.posts);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const caption = useMemo(() => {
    if (!product) return '';
    const tags = ['#oude', '#profumiarabi', '#maisonorientale', `#${product.category}`, '#bologna'];
    if (channel === 'WhatsApp') return `Nuovo consiglio OUDÉ: ${product.name}. ${product.shortDescription} Prezzo ${product.price} EUR. Vuoi provarlo o ricevere una consulenza?`;
    if (channel === 'TikTok') return `POV: scopri ${product.name}, ${product.intensity.toLowerCase()} e persistente. Note: ${product.notes.top.join(', ')} / ${product.notes.heart.join(', ')} / ${product.notes.base.join(', ')}. ${tags.join(' ')}`;
    return `${product.name} e una firma olfattiva ${product.intensity.toLowerCase()} per chi ama il mondo orientale. ${product.shortDescription}\n\nNote: ${product.notes.top.join(', ')} - ${product.notes.heart.join(', ')} - ${product.notes.base.join(', ')}\n\n${tags.join(' ')}`;
  }, [channel, product]);

  const hashtags = useMemo(() => caption.match(/#[\w-]+/g) ?? [], [caption]);

  const copy = async () => {
    await navigator.clipboard.writeText(caption);
    notify({ title: 'Caption copiata', description: channel, tone: 'success' });
  };

  const savePost = async () => {
    const response = await fetch('/api/admin/marketing', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ productId, channel, caption, hashtags, status, scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined })
    });
    if (response.ok) {
      await loadData();
      notify({ title: 'Contenuto salvato', description: channel, tone: 'success' });
    }
  };

  const remove = async (postId?: string) => {
    if (!postId) return;
    const response = await fetch('/api/admin/marketing', { method: 'DELETE', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ postId }) });
    if (response.ok) {
      await loadData();
      notify({ title: 'Contenuto eliminato', tone: 'info' });
    }
  };

  return (
    <section>
      <h1 className="font-serif text-4xl sm:text-5xl">Social & Marketing</h1>
      <p className="mt-3 max-w-2xl text-ink/60">Crea caption prodotto e salva bozze o post pianificati su Supabase.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded border border-ink/10 bg-white p-5">
          <p className="flex items-center gap-2 font-serif text-3xl"><Megaphone size={20} className="text-oud" /> Generatore</p>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm font-semibold">Prodotto
              <select className="min-h-11 rounded border border-ink/12 px-3" value={productId} onChange={(event) => setProductId(event.target.value)}>
                {products.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold">Canale
              <select className="min-h-11 rounded border border-ink/12 px-3" value={channel} onChange={(event) => setChannel(event.target.value)}>
                <option>Instagram</option>
                <option>TikTok</option>
                <option>WhatsApp</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold">Stato
              <select className="min-h-11 rounded border border-ink/12 px-3" value={status} onChange={(event) => setStatus(event.target.value as MarketingPost['status'])}>
                <option value="draft">Bozza</option>
                <option value="scheduled">Pianificato</option>
                <option value="published">Pubblicato</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold">Data pianificazione
              <input type="datetime-local" className="min-h-11 rounded border border-ink/12 px-3" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} />
            </label>
          </div>
        </div>
        <div className="rounded border border-ink/10 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-serif text-3xl">Copy pronto</p>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 rounded border border-ink/10 px-4 py-3 text-sm font-semibold hover:bg-mist" onClick={() => void copy()}><Copy size={17} /> Copia</button>
              <button className="inline-flex items-center gap-2 rounded bg-oud px-4 py-3 text-sm font-semibold text-white" onClick={() => void savePost()}><Save size={17} /> Salva</button>
            </div>
          </div>
          <pre className="mt-5 whitespace-pre-wrap rounded bg-cream p-4 text-sm leading-6 text-ink/70">{caption}</pre>
        </div>
      </div>
      <div className="mt-8 grid gap-4">
        {posts.map((post) => (
          <article key={post.id} className="rounded border border-ink/10 bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-serif text-2xl">{post.channel} - {post.status}</p>
                <p className="mt-1 text-sm text-ink/55">{post.productName ?? 'Senza prodotto'} {post.scheduledAt ? `- ${new Date(post.scheduledAt).toLocaleString('it-IT')}` : ''}</p>
              </div>
              <button className="rounded border border-ink/10 p-2 text-oud hover:bg-mist" onClick={() => void remove(post.id)} aria-label="Elimina"><Trash2 size={17} /></button>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-ink/68">{post.caption}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
