'use client';

import { useCallback, useEffect, useState } from 'react';
import { formatPrice, type Order, useCartStore } from '@/lib/cart/store';
import type { AdminOrder } from '@/lib/supabase/orders';

const statuses: Order['status'][] = ['new', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled'];

export function OrdersClient() {
  const localOrders = useCartStore((state) => state.orders);
  const updateLocalOrderStatus = useCartStore((state) => state.updateOrderStatus);
  const notify = useCartStore((state) => state.notify);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/orders', { cache: 'no-store' });
      if (!response.ok) throw new Error('Ordini Supabase non disponibili');
      const payload = await response.json() as { orders: AdminOrder[] };
      setOrders(payload.orders);
    } catch {
      setOrders(localOrders);
      notify({ title: 'Uso ordini locali', description: 'Supabase non ha risposto.', tone: 'warning' });
    } finally {
      setIsLoading(false);
    }
  }, [localOrders, notify]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const updateStatus = async (orderId: string, status: Order['status']) => {
    setOrders((current) => current.map((order) => order.id === orderId ? { ...order, status } : order));
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ orderId, status })
      });
      if (!response.ok) throw new Error('Aggiornamento Supabase fallito');
      notify({ title: 'Stato ordine aggiornato', tone: 'success' });
    } catch {
      updateLocalOrderStatus(orderId, status);
      notify({ title: 'Stato aggiornato solo localmente', tone: 'warning' });
    }
  };

  return (
    <section>
      <h1 className="font-serif text-4xl sm:text-5xl">Ordini</h1>
      <p className="mt-3 max-w-2xl text-ink/60">Gli ordini creati dal checkout vengono salvati su Supabase per preparazione, spedizione e assistenza cliente.</p>
      <div className="mt-8 grid gap-4">
        {isLoading ? <div className="rounded border border-ink/10 bg-white p-5 text-sm text-ink/60">Caricamento ordini...</div> : null}
        {orders.length ? orders.map((order) => (
          <article key={order.id} className="rounded border border-ink/10 bg-white p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-serif text-2xl">{order.id}</p>
                <p className="mt-1 text-sm text-ink/55">{new Date(order.createdAt).toLocaleString('it-IT')} - {order.customer.fullName}</p>
                <p className="mt-2 text-sm text-ink/70">{order.customer.address}, {order.customer.zip} {order.customer.city}</p>
                <p className="mt-1 text-sm text-ink/70">{order.customer.email} - {order.customer.phone}</p>
              </div>
              <div className="grid gap-2 sm:min-w-56">
                <select value={order.status} onChange={(event) => void updateStatus(order.id, event.target.value as Order['status'])} className="min-h-11 rounded border border-ink/12 px-3 text-sm">
                  {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <p className="text-right text-lg font-semibold">{formatPrice(order.total)}</p>
              </div>
            </div>
            <div className="mt-4 rounded bg-mist p-3 text-sm">
              {order.items.map((item) => <span key={item.productId} className="mr-4 inline-block">{item.productId} x {item.quantity}</span>)}
            </div>
          </article>
        )) : (
          <div className="rounded border border-dashed border-ink/20 bg-white p-10 text-center">
            <p className="font-serif text-3xl">Nessun ordine ancora</p>
            <p className="mt-2 text-sm text-ink/60">Completa un checkout dallo storefront per vedere il flusso proprietario.</p>
          </div>
        )}
      </div>
    </section>
  );
}
