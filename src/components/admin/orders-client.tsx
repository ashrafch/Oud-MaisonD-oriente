'use client';

import { formatPrice, type Order, useCartStore } from '@/lib/cart/store';

const statuses: Order['status'][] = ['new', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled'];

export function OrdersClient() {
  const orders = useCartStore((state) => state.orders);
  const updateOrderStatus = useCartStore((state) => state.updateOrderStatus);

  return (
    <section>
      <h1 className="font-serif text-4xl sm:text-5xl">Ordini</h1>
      <p className="mt-3 max-w-2xl text-ink/60">Gli ordini creati dal checkout locale vengono salvati qui per preparazione, spedizione e assistenza cliente.</p>
      <div className="mt-8 grid gap-4">
        {orders.length ? orders.map((order) => (
          <article key={order.id} className="rounded border border-ink/10 bg-white p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-serif text-2xl">{order.id}</p>
                <p className="mt-1 text-sm text-ink/55">{new Date(order.createdAt).toLocaleString('it-IT')} · {order.customer.fullName}</p>
                <p className="mt-2 text-sm text-ink/70">{order.customer.address}, {order.customer.zip} {order.customer.city}</p>
                <p className="mt-1 text-sm text-ink/70">{order.customer.email} · {order.customer.phone}</p>
              </div>
              <div className="grid gap-2 sm:min-w-56">
                <select value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value as Order['status'])} className="min-h-11 rounded border border-ink/12 px-3 text-sm">
                  {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <p className="text-right text-lg font-semibold">{formatPrice(order.total)}</p>
              </div>
            </div>
            <div className="mt-4 rounded bg-mist p-3 text-sm">
              {order.items.map((item) => <span key={item.productId} className="mr-4 inline-block">{item.productId} × {item.quantity}</span>)}
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
