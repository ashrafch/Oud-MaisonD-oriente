'use client';

import { useCallback, useEffect, useState } from 'react';
import { Mail, Phone, UserRound } from 'lucide-react';
import { formatPrice, useCartStore } from '@/lib/cart/store';
import type { AdminOrder } from '@/lib/supabase/orders';

export function CustomerTimeline() {
  const localOrders = useCartStore((state) => state.orders);
  const notify = useCartStore((state) => state.notify);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCustomers = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/orders', { cache: 'no-store' });
      if (!response.ok) throw new Error('Clienti Supabase non disponibili');
      const payload = await response.json() as { orders: AdminOrder[] };
      setOrders(payload.orders);
    } catch {
      setOrders(localOrders);
      notify({ title: 'Uso clienti locali', description: 'Supabase non ha risposto.', tone: 'warning' });
    } finally {
      setIsLoading(false);
    }
  }, [localOrders, notify]);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  const customers = orders.reduce<Record<string, typeof orders>>((acc, order) => {
    acc[order.customer.email] = [...(acc[order.customer.email] ?? []), order];
    return acc;
  }, {});

  return (
    <section>
      <h1 className="font-serif text-4xl sm:text-5xl">Clienti</h1>
      <p className="mt-3 max-w-2xl text-ink/60">Vista CRM leggera persistente: storico ordini, contatti e valore cliente salvati su Supabase.</p>
      <div className="mt-8 grid gap-4">
        {isLoading ? <div className="rounded border border-ink/10 bg-white p-5 text-sm text-ink/60">Caricamento clienti...</div> : null}
        {Object.entries(customers).length ? Object.entries(customers).map(([email, customerOrders]) => {
          const customer = customerOrders[0].customer;
          const total = customerOrders.reduce((sum, order) => sum + order.total, 0);
          return (
            <article key={email} className="rounded border border-ink/10 bg-white p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="flex items-center gap-2 font-serif text-3xl"><UserRound className="text-oud" size={22} /> {customer.fullName}</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-ink/60"><Mail size={15} /> {email}</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-ink/60"><Phone size={15} /> {customer.phone}</p>
                </div>
                <div className="rounded bg-mist p-4 text-sm">
                  <p className="text-ink/55">Valore cliente</p>
                  <p className="text-2xl font-semibold">{formatPrice(total)}</p>
                  <p className="mt-1 text-ink/55">{customerOrders.length} ordini</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2">
                {customerOrders.map((order) => <div key={order.id} className="flex flex-col gap-1 rounded border border-ink/10 p-3 text-sm sm:flex-row sm:justify-between"><span>{order.id}</span><span>{order.status} - {formatPrice(order.total)}</span></div>)}
              </div>
            </article>
          );
        }) : (
          <div className="rounded border border-dashed border-ink/20 bg-white p-10 text-center">
            <p className="font-serif text-3xl">Nessun cliente ancora</p>
            <p className="mt-2 text-sm text-ink/60">I clienti compariranno dopo il primo checkout.</p>
          </div>
        )}
      </div>
    </section>
  );
}
