import { Button } from '@/components/ui/button';

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order, payment } = await searchParams as { order?: string; payment?: string };
  const isPaid = payment === 'paypal' || payment === 'stripe';
  return (
    <section className="container py-16">
      <div className="max-w-2xl rounded border border-ink/10 bg-white p-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-sage">{isPaid ? 'Il tuo ordine' : 'Richiesta ricevuta'}</p>
        <h1 className="mt-3 font-serif text-5xl">{isPaid ? 'Grazie per il tuo ordine' : 'Ti contatteremo presto'}</h1>
        <p className="mt-4 text-ink/65">
          {isPaid
            ? 'Prepariamo il tuo ordine dopo la conferma del pagamento. Per assistenza, contatta la boutique con il numero ordine qui sotto.'
            : 'Abbiamo ricevuto la tua richiesta. Verifichiamo i prodotti e ti contattiamo per concordare pagamento e spedizione.'}
        </p>
        {order ? <p className="mt-5 rounded bg-mist p-3 text-sm font-semibold">Numero ordine: {order}</p> : null}
        <Button href="/products" className="mt-6">Torna ai profumi</Button>
      </div>
    </section>
  );
}
