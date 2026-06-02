import { Star } from 'lucide-react';
import type { Product } from '@/types/catalog';

const demoQuotes = [
  'Scia elegante e persistente, perfetto per la sera.',
  'Packaging curato e profumo molto fedele alla descrizione.',
  'Consiglio WhatsApp preciso, acquisto semplice.'
];

export function ReviewSummary({ product }: { product: Product }) {
  const rating = product.rating ?? 4.8;
  const reviewCount = product.reviewCount ?? 18;

  return (
    <section className="rounded border border-ink/10 bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-serif text-3xl">Recensioni</p>
          <p className="mt-1 text-sm text-ink/60">{reviewCount} recensioni verificate</p>
        </div>
        <div className="flex items-center gap-2 text-saffron">
          {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={18} fill="currentColor" />)}
          <span className="ml-1 text-sm font-semibold text-ink">{rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {demoQuotes.map((quote) => <blockquote key={quote} className="rounded bg-cream p-4 text-sm leading-6 text-ink/68">“{quote}”</blockquote>)}
      </div>
    </section>
  );
}
