'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, PackageCheck, TrendingUp } from 'lucide-react';
import { formatPrice } from '@/lib/cart/store';
import type { Product } from '@/types/catalog';
import type { AdminOrder } from '@/lib/supabase/orders';

export function DashboardClient() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      const [ordersResponse, productsResponse] = await Promise.all([
        fetch('/api/admin/orders', { cache: 'no-store' }),
        fetch('/api/admin/products', { cache: 'no-store' })
      ]);
      if (ordersResponse.ok) {
        const payload = await ordersResponse.json() as { orders: AdminOrder[] };
        setOrders(payload.orders);
      }
      if (productsResponse.ok) {
        const payload = await productsResponse.json() as { products: Product[] };
        setProducts(payload.products);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const lowStock = products.filter((product) => product.stock <= 8);
  const bestsellers = products.filter((product) => product.tags.includes('bestseller') || product.tags.includes('gift')).slice(0, 4);
  const stats = useMemo(() => [
    ['Vendite totali', formatPrice(revenue)],
    ['Ordini recenti', String(orders.length)],
    ['Prodotti sotto scorta', String(lowStock.length)],
    ['Prodotti catalogo', String(products.length)]
  ], [revenue, orders.length, lowStock.length, products.length]);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-oud">Pannello proprietario</p>
          <h1 className="font-serif text-4xl sm:text-5xl">Dashboard</h1>
          {isLoading ? <p className="mt-2 text-sm text-ink/55">Caricamento dati Supabase...</p> : null}
        </div>
        <Link className="rounded bg-oud px-4 py-3 text-center text-sm font-semibold text-white" href="/admin/products">Gestisci prodotti</Link>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => <div key={label} className="rounded border border-ink/10 bg-white p-5"><p className="text-sm text-ink/55">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>)}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded border border-ink/10 bg-white p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-serif text-2xl sm:text-3xl"><AlertCircle className="text-oud" size={22} /> Alert intelligenti</h2>
          <div className="mt-4 grid gap-3 text-sm">
            {lowStock.slice(0, 4).map((product) => <p key={product.id} className="rounded bg-saffron/12 p-3">{product.name} sta finendo: restano {product.stock} pezzi.</p>)}
            {!lowStock.length ? <p className="rounded bg-sage/12 p-3">Nessun prodotto sotto scorta.</p> : null}
          </div>
        </section>
        <section className="rounded border border-ink/10 bg-white p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-serif text-2xl sm:text-3xl"><TrendingUp className="text-oud" size={22} /> Prodotti da spingere</h2>
          <div className="mt-4 grid gap-3">
            {bestsellers.map((product) => <div key={product.id} className="flex flex-col gap-1 border-b border-ink/8 pb-2 text-sm sm:flex-row sm:justify-between"><span>{product.name}</span><span>{product.stock} in stock</span></div>)}
          </div>
        </section>
        <section className="rounded border border-ink/10 bg-white p-5 sm:p-6 lg:col-span-2">
          <h2 className="flex items-center gap-2 font-serif text-2xl sm:text-3xl"><PackageCheck className="text-oud" size={22} /> Ordini recenti</h2>
          <div className="mt-4 grid gap-3">
            {orders.length ? orders.slice(0, 5).map((order) => (
              <Link key={order.id} href="/admin/orders" className="flex flex-col gap-1 rounded border border-ink/10 p-3 text-sm hover:bg-mist sm:flex-row sm:items-center sm:justify-between">
                <span className="font-semibold">{order.id} - {order.customer.fullName}</span>
                <span>{order.status} - {formatPrice(order.total)}</span>
              </Link>
            )) : <p className="rounded border border-dashed border-ink/20 p-5 text-sm text-ink/60">Gli ordini creati dal checkout appariranno qui.</p>}
          </div>
        </section>
      </div>
    </>
  );
}
