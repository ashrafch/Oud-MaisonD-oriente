import { Button } from '@/components/ui/button';

export default function CheckoutCancelPage() {
  return <section className="container py-16"><h1 className="font-serif text-5xl">Pagamento annullato</h1><p className="mt-4 text-ink/65">Il carrello è ancora disponibile.</p><Button href="/cart" className="mt-6">Torna al carrello</Button></section>;
}
