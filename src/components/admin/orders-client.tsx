'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Clock3, CreditCard, Eye, PackageCheck, RefreshCw, Search, Send, Truck, XCircle } from 'lucide-react';
import { formatPrice, type Order, useCartStore } from '@/lib/cart/store';
import type { AdminOrder } from '@/lib/supabase/orders';
import { AdminModal } from './admin-modal';

type PaymentStatus = 'manual_pending' | 'pending' | 'paid' | 'failed' | 'refunded';
type FulfillmentStatus = 'new' | 'ready_to_prepare' | 'preparing' | 'packed' | 'completed' | 'blocked';
type ShippingStatus = 'not_ready' | 'pickup_ready' | 'waiting_courier' | 'shipped' | 'delivered' | 'returned';
type QueueKey = 'all' | 'toConfirm' | 'toPrepare' | 'toShip' | 'completed' | 'issues';

const orderStatuses: { value: Order['status']; label: string }[] = [
  { value: 'new', label: 'Nuovo' },
  { value: 'paid', label: 'Pagato' },
  { value: 'preparing', label: 'In preparazione' },
  { value: 'shipped', label: 'Spedito' },
  { value: 'delivered', label: 'Consegnato' },
  { value: 'cancelled', label: 'Annullato' },
  { value: 'refunded', label: 'Rimborsato' }
];

const paymentStatuses: { value: PaymentStatus; label: string }[] = [
  { value: 'manual_pending', label: 'Pagamento manuale da confermare' },
  { value: 'pending', label: 'Pagamento online in attesa' },
  { value: 'paid', label: 'Pagato' },
  { value: 'failed', label: 'Pagamento fallito' },
  { value: 'refunded', label: 'Rimborsato' }
];

const fulfillmentStatuses: { value: FulfillmentStatus; label: string }[] = [
  { value: 'new', label: 'Da controllare' },
  { value: 'ready_to_prepare', label: 'Pronto da preparare' },
  { value: 'preparing', label: 'In preparazione' },
  { value: 'packed', label: 'Pacco pronto' },
  { value: 'completed', label: 'Evaso' },
  { value: 'blocked', label: 'Bloccato' }
];

const shippingStatuses: { value: ShippingStatus; label: string }[] = [
  { value: 'not_ready', label: 'Non pronto' },
  { value: 'pickup_ready', label: 'Ritiro in negozio pronto' },
  { value: 'waiting_courier', label: 'In attesa corriere' },
  { value: 'shipped', label: 'Spedito' },
  { value: 'delivered', label: 'Consegnato' },
  { value: 'returned', label: 'Reso' }
];

const queues: { key: QueueKey; label: string; description: string }[] = [
  { key: 'all', label: 'Tutti', description: 'Vista completa' },
  { key: 'toConfirm', label: 'Da confermare', description: 'Pagamento o disponibilita' },
  { key: 'toPrepare', label: 'Da preparare', description: 'Ordini pronti al banco' },
  { key: 'toShip', label: 'Da spedire', description: 'Pacco pronto o corriere' },
  { key: 'completed', label: 'Completati', description: 'Consegnati o evasi' },
  { key: 'issues', label: 'Critici', description: 'Falliti, bloccati, resi' }
];

const pageSize = 8;

export function OrdersClient() {
  const localOrders = useCartStore((state) => state.orders);
  const updateLocalOrderStatus = useCartStore((state) => state.updateOrderStatus);
  const notify = useCartStore((state) => state.notify);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [detailOrderId, setDetailOrderId] = useState<string>();
  const [activeQueue, setActiveQueue] = useState<QueueKey>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/orders', { cache: 'no-store' });
      if (!response.ok) throw new Error('Ordini Supabase non disponibili');
      const payload = await response.json() as { orders: AdminOrder[] };
      setOrders(payload.orders);
      setLastUpdated(new Date());
    } catch {
      setOrders(localOrders as AdminOrder[]);
      notify({ title: 'Uso ordini locali', description: 'Supabase non ha risposto.', tone: 'warning' });
    } finally {
      setIsLoading(false);
    }
  }, [localOrders, notify]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeQueue, searchTerm]);

  const stats = useMemo(() => {
    const toConfirm = orders.filter(isToConfirm);
    const toPrepare = orders.filter(isToPrepare);
    const toShip = orders.filter(isToShip);
    const completed = orders.filter(isCompleted);
    const issues = orders.filter(hasIssue);
    return {
      revenue: orders.reduce((sum, order) => sum + order.total, 0),
      toConfirm: toConfirm.length,
      toPrepare: toPrepare.length,
      toShip: toShip.length,
      completed: completed.length,
      issues: issues.length
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return orders.filter((order) => {
      const queueMatch = activeQueue === 'all'
        || (activeQueue === 'toConfirm' && isToConfirm(order))
        || (activeQueue === 'toPrepare' && isToPrepare(order))
        || (activeQueue === 'toShip' && isToShip(order))
        || (activeQueue === 'completed' && isCompleted(order))
        || (activeQueue === 'issues' && hasIssue(order));
      if (!queueMatch) return false;
      if (!normalizedSearch) return true;
      return [
        order.id,
        order.customer.fullName,
        order.customer.email,
        order.customer.phone,
        order.customer.city,
        order.trackingCode,
        ...order.items.map((item) => item.productName ?? item.productId)
      ].some((value) => (value ?? '').toLowerCase().includes(normalizedSearch));
    });
  }, [activeQueue, orders, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedOrders = filteredOrders.slice((safePage - 1) * pageSize, safePage * pageSize);
  const detailOrder = orders.find((order) => order.id === detailOrderId);

  const patchOrder = async (orderId: string, patch: Partial<AdminOrder>) => {
    setIsSaving(true);
    setOrders((current) => current.map((order) => order.id === orderId ? { ...order, ...patch } : order));
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ orderId, ...patch })
      });
      if (!response.ok) throw new Error('Aggiornamento Supabase fallito');
      notify({ title: 'Ordine aggiornato', tone: 'success' });
      setLastUpdated(new Date());
    } catch {
      if (patch.status) updateLocalOrderStatus(orderId, patch.status);
      notify({ title: 'Aggiornamento solo locale', description: 'Controlla connessione o sessione admin.', tone: 'warning' });
      void loadOrders();
    } finally {
      setIsSaving(false);
    }
  };

  const advanceOrder = (order: AdminOrder) => {
    const paymentStatus = normalizePaymentStatus(order.paymentStatus);
    const fulfillmentStatus = normalizeFulfillmentStatus(order.fulfillmentStatus);
    const shippingStatus = normalizeShippingStatus(order.shippingStatus);
    if (paymentStatus !== 'paid') {
      void patchOrder(order.id, { paymentStatus: 'paid', status: 'paid', fulfillmentStatus: 'ready_to_prepare', shippingStatus: 'not_ready' } as Partial<AdminOrder>);
      return;
    }
    if (fulfillmentStatus === 'ready_to_prepare' || fulfillmentStatus === 'new') {
      void patchOrder(order.id, { status: 'preparing', fulfillmentStatus: 'preparing' } as Partial<AdminOrder>);
      return;
    }
    if (fulfillmentStatus === 'preparing') {
      void patchOrder(order.id, { fulfillmentStatus: 'packed', shippingStatus: 'waiting_courier' } as Partial<AdminOrder>);
      return;
    }
    if (shippingStatus === 'waiting_courier' || fulfillmentStatus === 'packed') {
      void patchOrder(order.id, { status: 'shipped', shippingStatus: 'shipped' } as Partial<AdminOrder>);
      return;
    }
    void patchOrder(order.id, { status: 'delivered', fulfillmentStatus: 'completed', shippingStatus: 'delivered' } as Partial<AdminOrder>);
  };

  return (
    <section>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-oud">Gestione operativa</p>
          <h1 className="font-serif text-4xl sm:text-5xl">Ordini</h1>
          <p className="mt-3 max-w-3xl text-sm text-ink/60">
            Controlla pagamento, preparazione e spedizione in fasi separate. La pagina e gia impostata per Stripe: quando il webhook sara attivo aggiornera automaticamente lo stato pagamento.
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-ink/45">
            {isLoading ? 'Aggiornamento ordini...' : lastUpdated ? `Aggiornata alle ${lastUpdated.toLocaleTimeString('it-IT')}` : 'Dati Supabase'}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative block sm:min-w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" size={17} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="min-h-11 w-full rounded border border-ink/12 bg-white pl-10 pr-3 text-sm outline-none focus:border-oud/40"
              placeholder="Cerca cliente, ordine, prodotto..."
            />
          </label>
          <button
            type="button"
            onClick={() => void loadOrders()}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded border border-ink/10 bg-white px-4 text-sm font-semibold transition hover:bg-mist"
          >
            <RefreshCw size={17} className={isLoading ? 'animate-spin' : ''} />
            Aggiorna
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Incasso ordini" value={formatPrice(stats.revenue)} icon={<CreditCard size={20} />} />
        <Metric label="Da confermare" value={String(stats.toConfirm)} icon={<Clock3 size={20} />} tone={stats.toConfirm ? 'warning' : 'neutral'} />
        <Metric label="Da preparare" value={String(stats.toPrepare)} icon={<PackageCheck size={20} />} />
        <Metric label="Da spedire" value={String(stats.toShip)} icon={<Truck size={20} />} />
        <Metric label="Critici" value={String(stats.issues)} icon={<XCircle size={20} />} tone={stats.issues ? 'danger' : 'neutral'} />
      </div>

      <div className="mt-6 grid gap-2 md:grid-cols-3 xl:grid-cols-6">
        {queues.map((queue) => (
          <button
            key={queue.key}
            type="button"
            onClick={() => setActiveQueue(queue.key)}
            className={`rounded border p-3 text-left transition ${activeQueue === queue.key ? 'border-oud/45 bg-oud/8 text-oud' : 'border-ink/10 bg-white hover:bg-mist'}`}
          >
            <span className="block text-sm font-semibold">{queue.label}</span>
            <span className="mt-1 block text-xs text-ink/55">{queue.description}</span>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <div className="mb-3 flex flex-col gap-2 text-sm text-ink/55 sm:flex-row sm:items-center sm:justify-between">
          <span>
            {filteredOrders.length ? `Mostro ${(safePage - 1) * pageSize + 1}-${Math.min(safePage * pageSize, filteredOrders.length)} di ${filteredOrders.length} ordini` : 'Nessun ordine da mostrare'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="inline-flex min-h-9 items-center gap-1 rounded border border-ink/10 bg-white px-3 text-xs font-semibold transition hover:bg-mist disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ChevronLeft size={15} />
              Indietro
            </button>
            <span className="rounded bg-mist px-3 py-2 text-xs font-semibold text-ink">Pagina {safePage}/{totalPages}</span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              className="inline-flex min-h-9 items-center gap-1 rounded border border-ink/10 bg-white px-3 text-xs font-semibold transition hover:bg-mist disabled:cursor-not-allowed disabled:opacity-45"
            >
              Avanti
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {isLoading ? <div className="rounded border border-ink/10 bg-white p-5 text-sm text-ink/60">Caricamento ordini...</div> : null}
          {paginatedOrders.length ? paginatedOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              disabled={isSaving}
              onOpenDetail={() => setDetailOrderId(order.id)}
              onAdvance={() => advanceOrder(order)}
              onCancel={() => void patchOrder(order.id, { status: 'cancelled', fulfillmentStatus: 'blocked' } as Partial<AdminOrder>)}
            />
          )) : (
            <div className="rounded border border-dashed border-ink/20 bg-white p-10 text-center">
              <p className="font-serif text-3xl">Nessun ordine in questa coda</p>
              <p className="mt-2 text-sm text-ink/60">Cambia filtro o completa un checkout dallo storefront.</p>
            </div>
          )}
        </div>
      </div>

      <AdminModal
        title={detailOrder ? `Ordine ${shortOrderId(detailOrder.id)}` : 'Dettaglio ordine'}
        description="Gestisci dati cliente, stati operativi, tracking e note interne."
        isOpen={Boolean(detailOrder)}
        onClose={() => setDetailOrderId(undefined)}
        size="xl"
      >
        <OrderDetail
          order={detailOrder}
          disabled={isSaving || !detailOrder}
          onPatch={(patch) => detailOrder ? void patchOrder(detailOrder.id, patch) : undefined}
        />
      </AdminModal>
    </section>
  );
}

function Metric({ label, value, icon, tone = 'neutral' }: { label: string; value: string; icon: React.ReactNode; tone?: 'neutral' | 'warning' | 'danger' }) {
  const tones = {
    neutral: 'border-ink/10 bg-white text-ink',
    warning: 'border-saffron/35 bg-saffron/12 text-ink',
    danger: 'border-oud/25 bg-oud/10 text-oud'
  };
  return (
    <div className={`rounded border p-4 ${tones[tone]}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-ink/55">{label}</p>
        <span className="text-oud">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function OrderCard({
  order,
  disabled,
  onOpenDetail,
  onAdvance,
  onCancel
}: {
  order: AdminOrder;
  disabled: boolean;
  onOpenDetail: () => void;
  onAdvance: () => void;
  onCancel: () => void;
}) {
  const nextAction = getNextAction(order);
  return (
    <article className="rounded border border-ink/10 bg-white p-4 transition hover:border-oud/25 hover:shadow-soft">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-serif text-2xl">{shortOrderId(order.id)}</p>
            <span className="max-w-full truncate rounded bg-mist px-2 py-1 text-[11px] font-semibold text-ink/55" title={order.id}>{order.id}</span>
            <StatusBadge label={getLabel(orderStatuses, order.status)} tone={getOrderTone(order)} />
            <StatusBadge label={getLabel(paymentStatuses, normalizePaymentStatus(order.paymentStatus))} tone={getPaymentTone(order)} />
          </div>
          <p className="mt-2 truncate text-sm text-ink/55">{new Date(order.createdAt).toLocaleString('it-IT')} - {order.customer.fullName}</p>
          <p className="mt-2 truncate text-sm text-ink/70">{order.customer.city || 'Citta non indicata'} - {order.customer.email}</p>
          <div className="mt-4 grid gap-3 rounded bg-mist/70 p-3 text-sm md:grid-cols-3">
            <FlowStep label="Pagamento" value={getLabel(paymentStatuses, normalizePaymentStatus(order.paymentStatus))} active={normalizePaymentStatus(order.paymentStatus) === 'paid'} />
            <FlowStep label="Preparazione" value={getLabel(fulfillmentStatuses, normalizeFulfillmentStatus(order.fulfillmentStatus))} active={['preparing', 'packed', 'completed'].includes(normalizeFulfillmentStatus(order.fulfillmentStatus))} />
            <FlowStep label="Spedizione" value={getLabel(shippingStatuses, normalizeShippingStatus(order.shippingStatus))} active={['shipped', 'delivered'].includes(normalizeShippingStatus(order.shippingStatus))} />
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 xl:items-end">
          <div className="text-left xl:text-right">
            <p className="text-xl font-semibold">{formatPrice(order.total)}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-ink/45">{order.items.length} righe ordine</p>
          </div>
          <div className="grid w-full gap-2 sm:grid-cols-3 xl:grid-cols-1">
            <button
              type="button"
              onClick={onOpenDetail}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded border border-ink/10 bg-white px-3 text-sm font-semibold transition hover:bg-mist"
            >
              <Eye size={16} />
              Dettaglio
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={onAdvance}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded bg-oud px-3 text-sm font-semibold text-white transition hover:bg-oud/90 disabled:cursor-not-allowed disabled:opacity-55"
            >
              <Send size={16} />
              {nextAction}
            </button>
            {!['cancelled', 'delivered', 'refunded'].includes(order.status) ? (
              <button
                type="button"
                disabled={disabled}
                onClick={onCancel}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded border border-oud/20 bg-white px-3 text-sm font-semibold text-oud transition hover:bg-oud/8 disabled:cursor-not-allowed disabled:opacity-55"
              >
                <XCircle size={16} />
                Blocca
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function OrderDetail({ order, disabled, onPatch }: { order?: AdminOrder; disabled: boolean; onPatch: (patch: Partial<AdminOrder>) => void }) {
  const [trackingCode, setTrackingCode] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  useEffect(() => {
    setTrackingCode(order?.trackingCode ?? '');
    setInternalNotes(order?.internalNotes ?? order?.customer.notes ?? '');
  }, [order]);

  if (!order) {
    return <div className="rounded border border-dashed border-ink/20 bg-white p-8 text-center text-sm text-ink/60">Seleziona un ordine.</div>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="grid gap-5">
        <section className="rounded border border-ink/10 bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-oud">Numero ordine</p>
              <p className="mt-1 break-all font-mono text-sm text-ink/65">{order.id}</p>
            </div>
            <p className="text-2xl font-semibold">{formatPrice(order.total)}</p>
          </div>
        </section>

        <section className="rounded border border-ink/10 bg-white p-4">
          <h3 className="font-serif text-2xl">Cliente</h3>
          <div className="mt-3 grid gap-1 text-sm text-ink/70">
            <p className="font-semibold text-ink">{order.customer.fullName}</p>
            <p>{order.customer.email}</p>
            <p>{order.customer.phone}</p>
            <p>{order.customer.address}, {order.customer.zip} {order.customer.city}</p>
          </div>
        </section>

        <section className="rounded border border-ink/10 bg-white p-4">
          <h3 className="font-serif text-2xl">Prodotti</h3>
          <div className="mt-3 grid gap-2">
            {order.items.map((item) => (
              <div key={`${item.productId}-${item.quantity}`} className="flex items-start justify-between gap-3 border-b border-ink/8 pb-2 text-sm">
                <span>
                  <span className="block font-semibold">{item.productName ?? item.productId}</span>
                  <span className="text-ink/55">Quantita {item.quantity}</span>
                </span>
                <span className="font-semibold">{formatPrice((item.unitPrice ?? 0) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded bg-mist p-3 text-sm">
            <p>Subtotale: {formatPrice(order.subtotal)}</p>
            <p>Sconto: -{formatPrice(order.discount)}</p>
            <p>Spedizione: {order.shipping ? formatPrice(order.shipping) : 'Gratis'}</p>
          </div>
        </section>
      </div>

      <div className="grid gap-5">
        <section className="rounded border border-ink/10 bg-white p-4">
          <h3 className="font-serif text-2xl">Stati</h3>
          <div className="mt-4 grid gap-3">
            <SelectRow label="Stato ordine" value={order.status} options={orderStatuses} disabled={disabled} onChange={(status) => onPatch({ status: status as Order['status'] })} />
            <SelectRow label="Pagamento" value={normalizePaymentStatus(order.paymentStatus)} options={paymentStatuses} disabled={disabled} onChange={(paymentStatus) => onPatch({ paymentStatus })} />
            <SelectRow label="Preparazione" value={normalizeFulfillmentStatus(order.fulfillmentStatus)} options={fulfillmentStatuses} disabled={disabled} onChange={(fulfillmentStatus) => onPatch({ fulfillmentStatus })} />
            <SelectRow label="Spedizione" value={normalizeShippingStatus(order.shippingStatus)} options={shippingStatuses} disabled={disabled} onChange={(shippingStatus) => onPatch({ shippingStatus })} />
          </div>
        </section>

        <section className="rounded border border-ink/10 bg-white p-4">
          <h3 className="font-serif text-2xl">Tracking e note</h3>
          <label className="mt-3 block text-sm font-semibold">
            Codice tracking
            <input
              value={trackingCode}
              onChange={(event) => setTrackingCode(event.target.value)}
              className="mt-2 min-h-11 w-full rounded border border-ink/12 px-3 text-sm outline-none focus:border-oud/40"
              placeholder="Es. BRT123..."
            />
          </label>
          <label className="mt-3 block text-sm font-semibold">
            Note interne / cliente
            <textarea
              value={internalNotes}
              onChange={(event) => setInternalNotes(event.target.value)}
              rows={5}
              className="mt-2 w-full rounded border border-ink/12 p-3 text-sm outline-none focus:border-oud/40"
              placeholder="Disponibilita, pagamento, richieste particolari..."
            />
          </label>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onPatch({ trackingCode, internalNotes })}
            className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded bg-ink px-4 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-55"
          >
            <CheckCircle2 size={16} />
            Salva tracking e note
          </button>
        </section>
      </div>
    </div>
  );
}

function SelectRow({
  label,
  value,
  options,
  disabled,
  onChange
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 rounded border border-ink/12 bg-white px-3 text-sm font-normal outline-none focus:border-oud/40 disabled:opacity-60"
      >
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function FlowStep({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-ink/45">{label}</p>
      <p className={`mt-1 font-semibold ${active ? 'text-sage' : 'text-ink'}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ label, tone }: { label: string; tone: 'neutral' | 'success' | 'warning' | 'danger' }) {
  const tones = {
    neutral: 'bg-mist text-ink',
    success: 'bg-sage/12 text-sage',
    warning: 'bg-saffron/18 text-ink',
    danger: 'bg-oud/10 text-oud'
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{label}</span>;
}

function normalizePaymentStatus(status?: string): PaymentStatus {
  if (status === 'paid' || status === 'pending' || status === 'failed' || status === 'refunded' || status === 'manual_pending') return status;
  return 'manual_pending';
}

function normalizeFulfillmentStatus(status?: string): FulfillmentStatus {
  if (status === 'ready_to_prepare' || status === 'preparing' || status === 'packed' || status === 'completed' || status === 'blocked' || status === 'new') return status;
  return 'new';
}

function normalizeShippingStatus(status?: string): ShippingStatus {
  if (status === 'pickup_ready' || status === 'waiting_courier' || status === 'shipped' || status === 'delivered' || status === 'returned' || status === 'not_ready') return status;
  return 'not_ready';
}

function getLabel(options: { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function shortOrderId(orderId: string) {
  return orderId.length > 13 ? `#${orderId.slice(0, 8)}` : orderId;
}

function isToConfirm(order: AdminOrder) {
  return ['manual_pending', 'pending'].includes(normalizePaymentStatus(order.paymentStatus)) && !['cancelled', 'refunded'].includes(order.status);
}

function isToPrepare(order: AdminOrder) {
  const paymentStatus = normalizePaymentStatus(order.paymentStatus);
  const fulfillmentStatus = normalizeFulfillmentStatus(order.fulfillmentStatus);
  return paymentStatus === 'paid' && ['new', 'ready_to_prepare', 'preparing'].includes(fulfillmentStatus) && !['cancelled', 'refunded'].includes(order.status);
}

function isToShip(order: AdminOrder) {
  const fulfillmentStatus = normalizeFulfillmentStatus(order.fulfillmentStatus);
  const shippingStatus = normalizeShippingStatus(order.shippingStatus);
  return ['packed', 'completed'].includes(fulfillmentStatus) || ['pickup_ready', 'waiting_courier', 'shipped'].includes(shippingStatus);
}

function isCompleted(order: AdminOrder) {
  return order.status === 'delivered' || normalizeShippingStatus(order.shippingStatus) === 'delivered' || normalizeFulfillmentStatus(order.fulfillmentStatus) === 'completed';
}

function hasIssue(order: AdminOrder) {
  return order.status === 'cancelled'
    || order.status === 'refunded'
    || normalizePaymentStatus(order.paymentStatus) === 'failed'
    || normalizePaymentStatus(order.paymentStatus) === 'refunded'
    || normalizeFulfillmentStatus(order.fulfillmentStatus) === 'blocked'
    || normalizeShippingStatus(order.shippingStatus) === 'returned';
}

function getOrderTone(order: AdminOrder): 'neutral' | 'success' | 'warning' | 'danger' {
  if (hasIssue(order)) return 'danger';
  if (isCompleted(order)) return 'success';
  if (isToConfirm(order)) return 'warning';
  return 'neutral';
}

function getPaymentTone(order: AdminOrder): 'neutral' | 'success' | 'warning' | 'danger' {
  const status = normalizePaymentStatus(order.paymentStatus);
  if (status === 'paid') return 'success';
  if (status === 'failed' || status === 'refunded') return 'danger';
  return 'warning';
}

function getNextAction(order: AdminOrder) {
  const paymentStatus = normalizePaymentStatus(order.paymentStatus);
  const fulfillmentStatus = normalizeFulfillmentStatus(order.fulfillmentStatus);
  const shippingStatus = normalizeShippingStatus(order.shippingStatus);
  if (paymentStatus !== 'paid') return 'Segna pagato';
  if (fulfillmentStatus === 'new' || fulfillmentStatus === 'ready_to_prepare') return 'Avvia preparazione';
  if (fulfillmentStatus === 'preparing') return 'Segna pacco pronto';
  if (shippingStatus === 'waiting_courier' || fulfillmentStatus === 'packed') return 'Segna spedito';
  return 'Segna consegnato';
}
