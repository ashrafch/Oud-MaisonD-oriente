'use client';

import { useMemo, useState } from 'react';
import { Copy, Megaphone } from 'lucide-react';
import { products as seedProducts } from '@/data/catalog';
import { getStoredProducts, useCartStore } from '@/lib/cart/store';

export function MarketingCaptionGenerator() {
  const notify = useCartStore((state) => state.notify);
  const products = getStoredProducts(seedProducts);
  const [productId, setProductId] = useState(products[0]?.id ?? '');
  const [channel, setChannel] = useState('Instagram');
  const product = products.find((item) => item.id === productId) ?? products[0];
  const caption = useMemo(() => {
    if (!product) return '';
    const tags = ['#oude', '#profumiarabi', '#maisonorientale', `#${product.category}`, '#bologna'].join(' ');
    if (channel === 'WhatsApp') return `Nuovo consiglio OUDÉ: ${product.name}. ${product.shortDescription} Prezzo ${product.price}€. Vuoi provarlo o ricevere una consulenza?`;
    if (channel === 'TikTok') return `POV: scopri ${product.name}, ${product.intensity.toLowerCase()} e persistente. Note: ${product.notes.top.join(', ')} / ${product.notes.heart.join(', ')} / ${product.notes.base.join(', ')}. ${tags}`;
    return `${product.name} è una firma olfattiva ${product.intensity.toLowerCase()} per chi ama il mondo orientale. ${product.shortDescription}\n\nNote: ${product.notes.top.join(', ')} · ${product.notes.heart.join(', ')} · ${product.notes.base.join(', ')}\n\n${tags}`;
  }, [channel, product]);

  const copy = async () => {
    await navigator.clipboard.writeText(caption);
    notify({ title: 'Caption copiata', description: channel, tone: 'success' });
  };

  return (
    <section>
      <h1 className="font-serif text-4xl sm:text-5xl">Social & Marketing</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded border border-ink/10 bg-white p-5">
          <p className="flex items-center gap-2 font-serif text-3xl"><Megaphone size={20} className="text-oud" /> Generatore caption</p>
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
          </div>
        </div>
        <div className="rounded border border-ink/10 bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="font-serif text-3xl">Copy pronto</p>
            <button className="inline-flex items-center gap-2 rounded bg-oud px-4 py-3 text-sm font-semibold text-white" onClick={copy}><Copy size={17} /> Copia</button>
          </div>
          <pre className="mt-5 whitespace-pre-wrap rounded bg-cream p-4 text-sm leading-6 text-ink/70">{caption}</pre>
        </div>
      </div>
    </section>
  );
}
