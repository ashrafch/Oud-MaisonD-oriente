'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products as seedProducts } from '@/data/catalog';
import { calculateCart, formatPrice, getStoredProducts, useCartStore } from '@/lib/cart/store';

export function CartClient() {
  const items = useCartStore((state) => state.items);
  const couponCode = useCartStore((state) => state.couponCode);
  const setCouponCode = useCartStore((state) => state.setCouponCode);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const addItem = useCartStore((state) => state.addItem);
  const products = getStoredProducts(seedProducts);
  const totals = calculateCart(items, products, couponCode);
  const cartProducts = items.map((item) => ({ item, product: products.find((product) => product.id === item.productId) })).filter((entry) => entry.product);
  const upsells = products.filter((product) => !items.some((item) => item.productId === product.id)).slice(0, 3);

  if (!items.length) {
    return (
      <section className="container py-12">
        <div className="rounded border border-dashed border-ink/20 bg-white p-10 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl">Il carrello è vuoto</h1>
          <p className="mt-4 text-ink/62">Aggiungi un oud, un musk o una gift box per iniziare il tuo ordine.</p>
          <Button href="/products" className="mt-6">Vai al catalogo</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-12">
      <h1 className="font-serif text-4xl sm:text-5xl">Carrello</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          {cartProducts.map(({ item, product }) => product ? (
            <div key={product.id} className="grid gap-4 rounded border border-ink/10 bg-white p-4 sm:grid-cols-[96px_1fr_auto] sm:items-center">
              <div className="relative h-28 overflow-hidden rounded bg-mist sm:h-24">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
              </div>
              <div>
                <Link href={`/products/${product.slug}`} className="font-serif text-2xl">{product.name}</Link>
                <p className="mt-1 text-sm text-ink/55">{product.brand} · {product.intensity}</p>
                <p className="mt-2 font-semibold">{formatPrice(product.price)}</p>
              </div>
              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                <div className="flex items-center overflow-hidden rounded border border-ink/10">
                  <button aria-label="Diminuisci quantità" className="p-2 hover:bg-mist" onClick={() => setQuantity(product.id, item.quantity - 1)}><Minus size={16} /></button>
                  <span className="min-w-10 text-center text-sm font-semibold">{item.quantity}</span>
                  <button aria-label="Aumenta quantità" className="p-2 hover:bg-mist" onClick={() => setQuantity(product.id, item.quantity + 1)}><Plus size={16} /></button>
                </div>
                <button className="flex items-center gap-2 text-sm text-oud hover:underline" onClick={() => removeItem(product.id)}><Trash2 size={16} /> Rimuovi</button>
              </div>
            </div>
          ) : null)}
          <section className="rounded border border-ink/10 bg-white p-5">
            <p className="font-serif text-2xl">Completa il rituale</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {upsells.map((product) => (
                <button key={product.id} className="rounded border border-ink/10 p-3 text-left hover:bg-mist" onClick={() => addItem(product.id)}>
                  <span className="block text-sm font-semibold">{product.name}</span>
                  <span className="mt-1 block text-sm text-ink/55">{formatPrice(product.price)}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
        <aside className="h-fit rounded border border-ink/10 bg-white p-6">
          <p className="font-serif text-3xl">Riepilogo</p>
          <div className="mt-5 grid gap-3 text-sm">
            <div className="flex justify-between"><span>Subtotale</span><span>{formatPrice(totals.subtotal)}</span></div>
            <div className="flex justify-between"><span>Sconto</span><span>-{formatPrice(totals.discount)}</span></div>
            <div className="flex justify-between"><span>Spedizione</span><span>{totals.shipping ? formatPrice(totals.shipping) : 'Gratis'}</span></div>
            <div className="flex justify-between border-t border-ink/10 pt-3 text-lg font-semibold"><span>Totale</span><span>{formatPrice(totals.total)}</span></div>
          </div>
          <div className="mt-5 flex gap-2">
            <input value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="OUDE10" className="min-w-0 flex-1 rounded border border-ink/12 px-3 text-sm" />
            <button className="rounded bg-mist px-3 text-sm font-semibold" onClick={() => setCouponCode(couponCode)}>Applica</button>
          </div>
          <Button href="/checkout" className="mt-6 w-full">Vai al checkout</Button>
        </aside>
      </div>
    </section>
  );
}
