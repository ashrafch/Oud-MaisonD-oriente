'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, BadgePercent, FileText, Megaphone, PackageCheck, RefreshCw, Tag, TrendingUp } from 'lucide-react';
import { formatPrice } from '@/lib/cart/store';
import type { Coupon } from '@/lib/supabase/coupons';
import type { AdminCategory } from '@/lib/supabase/admin-taxonomy';
import type { MarketingPost } from '@/lib/supabase/marketing';
import type { Product } from '@/types/catalog';
import type { AdminOrder } from '@/lib/supabase/orders';

export function DashboardClient() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [posts, setPosts] = useState<MarketingPost[]>([]);
  const [contentCount, setContentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const [ordersResponse, productsResponse, categoriesResponse, couponsResponse, marketingResponse, contentResponse] = await Promise.all([
        fetch('/api/admin/orders', { cache: 'no-store' }),
        fetch('/api/admin/products', { cache: 'no-store' }),
        fetch('/api/admin/categories', { cache: 'no-store' }),
        fetch('/api/admin/coupons', { cache: 'no-store' }),
        fetch('/api/admin/marketing', { cache: 'no-store' }),
        fetch('/api/admin/content', { cache: 'no-store' })
      ]);

      if (ordersResponse.ok) setOrders(((await ordersResponse.json()) as { orders: AdminOrder[] }).orders);
      if (productsResponse.ok) setProducts(((await productsResponse.json()) as { products: Product[] }).products);
      if (categoriesResponse.ok) setCategories(((await categoriesResponse.json()) as { categories: AdminCategory[] }).categories);
      if (couponsResponse.ok) setCoupons(((await couponsResponse.json()) as { coupons: Coupon[] }).coupons);
      if (marketingResponse.ok) setPosts(((await marketingResponse.json()) as { posts: MarketingPost[] }).posts);
      if (contentResponse.ok) setContentCount(((await contentResponse.json()) as { pages: unknown[] }).pages.length);
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
    const interval = window.setInterval(() => void loadDashboard(), 20000);
    const refreshOnFocus = () => {
      if (document.visibilityState === 'visible') void loadDashboard();
    };
    document.addEventListener('visibilitychange', refreshOnFocus);
    window.addEventListener('focus', refreshOnFocus);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', refreshOnFocus);
      window.removeEventListener('focus', refreshOnFocus);
    };
  }, [loadDashboard]);

  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const lowStock = products.filter((product) => product.stock <= 8);
  const bestsellers = products.filter((product) => product.tags.includes('bestseller') || product.tags.includes('gift')).slice(0, 4);
  const activeCoupons = coupons.filter((coupon) => coupon.active);
  const scheduledPosts = posts.filter((post) => post.status === 'scheduled');
  const draftPosts = posts.filter((post) => post.status === 'draft');
  const hiddenCategories = categories.filter((category) => !category.isVisible);

  const stats = useMemo(() => [
    ['Vendite totali', formatPrice(revenue), '/admin/orders'],
    ['Ordini', String(orders.length), '/admin/orders'],
    ['Prodotti sotto scorta', String(lowStock.length), '/admin/inventory'],
    ['Prodotti catalogo', String(products.length), '/admin/products'],
    ['Coupon attivi', String(activeCoupons.length), '/admin/discounts'],
    ['Categorie visibili', String(categories.length - hiddenCategories.length), '/admin/categories'],
    ['Post pianificati', String(scheduledPosts.length), '/admin/social'],
    ['Pagine contenuto', String(contentCount), '/admin/content']
  ], [activeCoupons.length, categories.length, contentCount, hiddenCategories.length, lowStock.length, orders.length, products.length, revenue, scheduledPosts.length]);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-oud">Pannello proprietario</p>
          <h1 className="font-serif text-4xl sm:text-5xl">Dashboard</h1>
          <p className="mt-2 text-sm text-ink/55">
            {isLoading ? 'Aggiornamento dati Supabase...' : lastUpdated ? `Aggiornata alle ${lastUpdated.toLocaleTimeString('it-IT')}` : 'Dati reali Supabase'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center justify-center gap-2 rounded border border-ink/10 bg-white px-4 py-3 text-sm font-semibold hover:bg-mist" onClick={() => void loadDashboard()}>
            <RefreshCw size={17} className={isLoading ? 'animate-spin' : ''} />
            Aggiorna
          </button>
          <Link className="rounded bg-oud px-4 py-3 text-center text-sm font-semibold text-white" href="/admin/products">Gestisci prodotti</Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, href]) => (
          <Link key={label} href={href} className="rounded border border-ink/10 bg-white p-5 transition hover:border-oud/35 hover:shadow-soft">
            <p className="text-sm text-ink/55">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded border border-ink/10 bg-white p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-serif text-2xl sm:text-3xl"><AlertCircle className="text-oud" size={22} /> Alert operativi</h2>
          <div className="mt-4 grid gap-3 text-sm">
            {lowStock.slice(0, 4).map((product) => <p key={product.id} className="rounded bg-saffron/12 p-3">{product.name} sta finendo: restano {product.stock} pezzi.</p>)}
            {hiddenCategories.length ? <p className="rounded bg-oud/10 p-3">{hiddenCategories.length} categorie sono nascoste nello storefront.</p> : null}
            {draftPosts.length ? <p className="rounded bg-mist p-3">{draftPosts.length} contenuti social sono ancora in bozza.</p> : null}
            {!lowStock.length && !hiddenCategories.length && !draftPosts.length ? <p className="rounded bg-sage/12 p-3">Nessun alert operativo.</p> : null}
          </div>
        </section>

        <section className="rounded border border-ink/10 bg-white p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-serif text-2xl sm:text-3xl"><TrendingUp className="text-oud" size={22} /> Prodotti da spingere</h2>
          <div className="mt-4 grid gap-3">
            {bestsellers.map((product) => <div key={product.id} className="flex flex-col gap-1 border-b border-ink/8 pb-2 text-sm sm:flex-row sm:justify-between"><span>{product.name}</span><span>{product.stock} in stock</span></div>)}
            {!bestsellers.length ? <p className="text-sm text-ink/55">Aggiungi tag bestseller o gift ai prodotti da promuovere.</p> : null}
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

        <section className="grid gap-4 sm:grid-cols-2 lg:col-span-2 xl:grid-cols-4">
          <QuickLink icon={BadgePercent} href="/admin/discounts" label="Coupon" value={`${activeCoupons.length} attivi`} />
          <QuickLink icon={Tag} href="/admin/categories" label="Categorie" value={`${categories.length} totali`} />
          <QuickLink icon={Megaphone} href="/admin/social" label="Social" value={`${posts.length} contenuti`} />
          <QuickLink icon={FileText} href="/admin/content" label="Contenuti" value={`${contentCount} pagine`} />
        </section>
      </div>
    </>
  );
}

function QuickLink({ icon: Icon, href, label, value }: { icon: React.ElementType; href: string; label: string; value: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded border border-ink/10 bg-white p-4 transition hover:border-oud/35 hover:shadow-soft">
      <Icon className="text-oud" size={22} />
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="mt-1 block text-xs text-ink/55">{value}</span>
      </span>
    </Link>
  );
}
