import type { Product } from '@/types/catalog';

export function StockUrgencyBadge({ product }: { product: Product }) {
  if (product.stock <= 0) return <span className="rounded bg-oud/10 px-2 py-1 text-xs font-semibold text-oud">Esaurito</span>;
  if (product.stock <= 5) return <span className="rounded bg-saffron/18 px-2 py-1 text-xs font-semibold text-bark">Ultimi {product.stock} pezzi</span>;
  if (product.tags.includes('nuovo')) return <span className="rounded bg-sage/12 px-2 py-1 text-xs font-semibold text-sage">Nuovo arrivo</span>;
  if (product.tags.includes('bestseller')) return <span className="rounded bg-oud px-2 py-1 text-xs font-semibold text-white">Bestseller</span>;
  return <span className="rounded bg-cream px-2 py-1 text-xs font-semibold text-oud">{product.intensity}</span>;
}
