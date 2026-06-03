'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { products as seedProducts } from '@/data/catalog';
import { calculateCart, formatPrice, getStoredProducts, mergeProducts, useCartStore } from '@/lib/cart/store';
import { useActiveCoupons } from '@/lib/cart/use-active-coupons';

export function CartDrawer() {
  const isOpen = useCartStore((state) => state.isCartDrawerOpen);
  const close = useCartStore((state) => state.closeCartDrawer);
  const items = useCartStore((state) => state.items);
  const couponCode = useCartStore((state) => state.couponCode);
  const catalogProducts = useCartStore((state) => state.catalogProducts);
  const setCouponCode = useCartStore((state) => state.setCouponCode);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const coupons = useActiveCoupons();
  const products = mergeProducts(catalogProducts, getStoredProducts(seedProducts));
  const totals = calculateCart(items, products, couponCode, coupons);

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isOpen}>
      <button aria-label="Chiudi carrello" className={`absolute inset-0 bg-ink/35 transition ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={close} />
      <aside className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-soft transition duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-ink/10 p-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-oud" size={21} />
            <p className="font-serif text-3xl">Carrello</p>
          </div>
          <button aria-label="Chiudi" className="rounded p-2 hover:bg-mist" onClick={close}><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {items.length ? (
            <div className="grid gap-4">
              {items.map((item) => {
                const product = products.find((entry) => entry.id === item.productId);
                if (!product) return null;
                return (
                  <article key={item.productId} className="grid grid-cols-[72px_1fr] gap-3 rounded border border-ink/10 bg-white p-3">
                    <div className="relative h-20 overflow-hidden rounded bg-mist">
                      <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized={product.image.startsWith('data:')} />
                    </div>
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="mt-1 text-sm text-ink/55">{formatPrice(product.price)}</p>
                      <div className="mt-3 flex w-fit items-center overflow-hidden rounded border border-ink/10">
                        <button className="p-2 hover:bg-mist" aria-label="Diminuisci" onClick={() => setQuantity(product.id, item.quantity - 1)}><Minus size={14} /></button>
                        <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                        <button className="p-2 hover:bg-mist" aria-label="Aumenta" onClick={() => setQuantity(product.id, item.quantity + 1)}><Plus size={14} /></button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded border border-dashed border-ink/20 bg-white p-8 text-center">
              <p className="font-serif text-3xl">Carrello vuoto</p>
              <p className="mt-2 text-sm text-ink/60">Aggiungi una fragranza per iniziare.</p>
            </div>
          )}
        </div>
        <div className="border-t border-ink/10 bg-white p-5">
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between"><span>Subtotale</span><span>{formatPrice(totals.subtotal)}</span></div>
            <div className="flex justify-between"><span>Sconto</span><span>-{formatPrice(totals.discount)}</span></div>
            <div className="flex justify-between text-lg font-semibold"><span>Totale</span><span>{formatPrice(totals.total)}</span></div>
          </div>
          {items.length ? (
            <div className="mt-4">
              <div className="flex gap-2">
                <input value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="OUDE10" className="min-w-0 flex-1 rounded border border-ink/12 px-3 text-sm" />
                <button className="rounded bg-mist px-3 text-sm font-semibold" onClick={() => setCouponCode(couponCode)}>Applica</button>
              </div>
              <p className="mt-2 text-xs text-ink/45">Coupon attivi: {coupons.map((coupon) => coupon.code).join(', ') || 'nessuno'}</p>
            </div>
          ) : null}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link className="rounded border border-ink/12 px-4 py-3 text-center text-sm font-semibold" href="/cart" onClick={close}>Carrello</Link>
            <Link className="rounded bg-oud px-4 py-3 text-center text-sm font-semibold text-white" href="/checkout" onClick={close}>Checkout</Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
