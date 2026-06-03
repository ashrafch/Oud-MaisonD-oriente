import { Button } from '@/components/ui/button';

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  return (
    <section className="container py-16">
      <div className="max-w-2xl rounded border border-ink/10 bg-white p-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-sage">Richiesta ricevuta</p>
        <h1 className="mt-3 font-serif text-5xl">Richiesta ordine inviata</h1>
        <p className="mt-4 text-ink/65">Grazie, il negozio vede la richiesta nel pannello admin. Verificheremo disponibilita e dati di spedizione, poi ti contatteremo per conferma e pagamento.</p>
        {order ? <p className="mt-5 rounded bg-mist p-3 text-sm font-semibold">Numero richiesta: {order}</p> : null}
        <Button href="/products" className="mt-6">Continua lo shopping</Button>
      </div>
    </section>
  );
}
