'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, ShieldCheck } from 'lucide-react';
import { products as seedProducts } from '@/data/catalog';
import { calculateCart, formatPrice, getStoredProducts, type CustomerDraft, useCartStore } from '@/lib/cart/store';
import { useActiveCoupons } from '@/lib/cart/use-active-coupons';

const emptyCustomer: CustomerDraft = { fullName: '', email: '', phone: '', address: '', city: '', zip: '', notes: '' };

export function CheckoutClient() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const couponCode = useCartStore((state) => state.couponCode);
  const createOrder = useCartStore((state) => state.createOrder);
  const clearCart = useCartStore((state) => state.clearCart);
  const notify = useCartStore((state) => state.notify);
  const [customer, setCustomer] = useState(emptyCustomer);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const coupons = useActiveCoupons();
  const products = getStoredProducts(seedProducts);
  const totals = calculateCart(items, products, couponCode, coupons);
  const isValid = customer.fullName && customer.email.includes('@') && customer.phone && customer.address && customer.city && customer.zip && items.length;

  const updateField = (field: keyof CustomerDraft, value: string) => setCustomer((current) => ({ ...current, [field]: value }));

  const submitOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) {
      notify({ title: 'Completa i dati richiesti', description: "Servono contatti e indirizzo per preparare l'ordine.", tone: 'warning' });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ mode: 'manual_order', items, customer, couponCode, ...totals })
      });
      const payload = await response.json() as { order?: { id: string }; error?: string };
      if (!response.ok || !payload.order) throw new Error(payload.error ?? 'Ordine non creato');
      clearCart();
      notify({ title: 'Richiesta ordine inviata', description: payload.order.id, tone: 'success' });
      router.push(`/checkout/success?order=${payload.order.id}`);
    } catch {
      const order = createOrder({ items, customer, ...totals });
      notify({ title: 'Ordine salvato in locale', description: 'Supabase non ha confermato la creazione.', tone: 'warning' });
      router.push(`/checkout/success?order=${order.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!items.length) {
    return (
      <section className="container py-12">
        <div className="rounded border border-dashed border-ink/20 bg-white p-10 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl">Nessun prodotto da ordinare</h1>
          <p className="mt-3 text-ink/60">Il checkout si attiva dopo aver aggiunto almeno un prodotto.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <form onSubmit={submitOrder} className="rounded border border-ink/10 bg-white p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-oud">Richiesta ordine</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Dati cliente e spedizione</h1>
          <div className="mt-5 rounded border border-saffron/25 bg-saffron/10 p-4 text-sm leading-6 text-ink/70">
            In questa fase non paghi online. Invierai una richiesta ordine: il negozio controllera disponibilita, indirizzo e modalita di pagamento, poi ti contattera per confermare.
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Field label="Nome e cognome" value={customer.fullName} onChange={(value) => updateField('fullName', value)} />
            <Field label="Email" type="email" value={customer.email} onChange={(value) => updateField('email', value)} />
            <Field label="Telefono" value={customer.phone} onChange={(value) => updateField('phone', value)} />
            <Field label="CAP" value={customer.zip} onChange={(value) => updateField('zip', value)} />
            <Field label="Indirizzo" className="sm:col-span-2" value={customer.address} onChange={(value) => updateField('address', value)} />
            <Field label="Citta" value={customer.city} onChange={(value) => updateField('city', value)} />
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-semibold">Note ordine</span>
              <textarea value={customer.notes} onChange={(event) => updateField('notes', event.target.value)} className="min-h-28 rounded border border-ink/12 px-3 py-2 text-sm" />
            </label>
          </div>
          <button className="mt-8 min-h-12 w-full rounded bg-oud px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50" disabled={!isValid || isSubmitting}>
            {isSubmitting ? 'Invio richiesta...' : 'Invia richiesta ordine'}
          </button>
        </form>
        <aside className="h-fit rounded border border-ink/10 bg-white p-6">
          <div className="flex items-center gap-2 text-sage"><ShieldCheck size={20} /><span className="text-sm font-semibold">Ordine manuale assistito</span></div>
          <p className="mt-4 font-serif text-3xl">Riepilogo</p>
          <div className="mt-5 grid gap-3 text-sm">
            {items.map((item) => {
              const product = products.find((entry) => entry.id === item.productId);
              if (!product) return null;
              return <div key={item.productId} className="flex justify-between gap-3"><span>{product.name} x {item.quantity}</span><span>{formatPrice(product.price * item.quantity)}</span></div>;
            })}
            <div className="flex justify-between border-t border-ink/10 pt-3"><span>Sconto</span><span>-{formatPrice(totals.discount)}</span></div>
            <div className="flex justify-between"><span>Spedizione</span><span>{totals.shipping ? formatPrice(totals.shipping) : 'Gratis'}</span></div>
            <div className="flex justify-between text-lg font-semibold"><span>Totale indicativo</span><span>{formatPrice(totals.total)}</span></div>
          </div>
          <div className="mt-5 rounded bg-mist p-3 text-xs leading-5 text-ink/60">
            <p className="flex items-center gap-2 font-semibold text-ink"><MessageCircle size={15} /> Dopo l&apos;invio</p>
            <p className="mt-1">Riceverai conferma dal negozio prima della preparazione. Il pagamento online sara attivato nel prossimo step con Stripe.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, type = 'text', className = '' }: { label: string; value: string; onChange: (value: string) => void; type?: string; className?: string }) {
  return (
    <label className={`grid gap-2 ${className}`}>
      <span className="text-sm font-semibold">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="min-h-11 rounded border border-ink/12 px-3 text-sm" />
    </label>
  );
}
