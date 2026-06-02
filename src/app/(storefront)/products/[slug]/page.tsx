import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/product/product-card';
import { ProductActions } from '@/components/product/product-actions';
import { products } from '@/data/catalog';
import { productJsonLd } from '@/lib/seo/json-ld';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

type ProductPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) return {};
  return { title: product.name, description: product.shortDescription, openGraph: { images: [product.image] } };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);
  return (
    <section className="container py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }} />
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1fr] lg:gap-10">
        <div className="relative aspect-square overflow-hidden rounded border border-ink/10 bg-white">
          <Image src={product.image} alt={product.name} fill priority className="object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-oud">{product.brand}</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl lg:text-6xl">{product.name}</h1>
          <p className="mt-4 text-base leading-7 text-ink/68 sm:text-lg sm:leading-8">{product.shortDescription}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-2xl font-semibold sm:text-3xl">€{product.price.toFixed(2)}</span>
            {product.compareAtPrice ? <span className="text-lg text-ink/40 line-through">€{product.compareAtPrice.toFixed(2)}</span> : null}
            <span className="rounded bg-sage/12 px-3 py-1 text-sm font-semibold text-sage">{product.stock > 0 ? 'Disponibile' : 'Esaurito'}</span>
          </div>
          <ProductActions product={product} />
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Info label="Intensità" value={product.intensity} />
            <Info label="Durata" value={product.duration} />
            <Info label="Target" value={product.gender} />
          </div>
          <div className="mt-8 rounded border border-ink/10 bg-white p-5">
            <h2 className="font-serif text-3xl">Note olfattive</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <Note label="Testa" value={product.notes.top.join(', ')} />
              <Note label="Cuore" value={product.notes.heart.join(', ')} />
              <Note label="Fondo" value={product.notes.base.join(', ')} />
            </dl>
          </div>
        </div>
      </div>
      <section className="mt-16">
        <h2 className="font-serif text-3xl sm:text-4xl">Abbina e completa il rituale</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(related.length ? related : products.slice(1, 4)).map((item) => <ProductCard key={item.id} product={item} />)}
        </div>
      </section>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded bg-mist p-4"><p className="text-xs uppercase tracking-widest text-ink/45">{label}</p><p className="mt-1 font-semibold capitalize">{value}</p></div>;
}

function Note({ label, value }: { label: string; value: string }) {
  return <div className="flex flex-col gap-1 border-b border-ink/8 pb-2 sm:flex-row sm:justify-between sm:gap-4"><dt className="font-semibold">{label}</dt><dd className="text-ink/65 sm:text-right">{value}</dd></div>;
}
