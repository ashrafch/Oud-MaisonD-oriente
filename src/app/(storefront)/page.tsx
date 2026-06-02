import Image from 'next/image';
import { BundleBuilder } from '@/components/storefront/bundle-builder';
import { FragranceFinderQuiz } from '@/components/storefront/fragrance-finder-quiz';
import { RecentlyViewedProducts } from '@/components/storefront/recently-viewed';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/product-card';
import { categories, featuredProducts, products } from '@/data/catalog';
import { ShieldCheck, Sparkles, Truck, MessageCircle } from 'lucide-react';

const benefits = [
  { icon: Truck, label: 'Spedizione rapida' },
  { icon: ShieldCheck, label: 'Pagamento sicuro' },
  { icon: MessageCircle, label: 'Assistenza WhatsApp' },
  { icon: Sparkles, label: 'Profumi selezionati' }
];

export default function HomePage() {
  const daily = products[0];
  return (
    <>
      <section className="bg-oud text-cream">
        <div className="container grid min-h-[calc(100svh-112px)] items-center gap-8 py-10 sm:py-12 lg:min-h-[calc(100svh-80px)] lg:grid-cols-[1fr_0.85fr] lg:gap-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-saffron sm:text-sm sm:tracking-[0.22em]">Boutique di profumi arabi</p>
            <h1 className="mt-5 max-w-3xl font-serif text-[clamp(2.7rem,13vw,4.8rem)] leading-[1.02] md:text-7xl">OUDÉ Maison D&apos;Oriente</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-cream/78 sm:text-lg sm:leading-8">Oud, musk, attar e rituali orientali selezionati per chi cerca una scia elegante, calda e memorabile.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/products" className="w-full bg-saffron text-ink hover:bg-cream sm:w-auto">Esplora catalogo</Button>
              <Button href="/categories/set-regalo" variant="secondary" className="w-full border-cream/25 bg-cream/10 text-cream hover:bg-cream/18 sm:w-auto">Idee regalo</Button>
            </div>
          </div>
          <div className="relative min-h-[320px] overflow-hidden rounded border border-cream/15 bg-cream sm:min-h-[420px]">
            <Image src="/brand/botanical-identity.jpg" alt="Identità OUDÉ Maison D'Oriente" fill priority className="object-cover" />
          </div>
        </div>
      </section>

      <section className="container py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 rounded border border-ink/10 bg-white p-4">
              <Icon className="text-oud" size={22} />
              <span className="text-sm font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-oud">In evidenza</p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Fragranze da scoprire</h2>
          </div>
          <Button href="/products" variant="secondary">Vedi tutto</Button>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="bg-mist py-16">
        <div className="container grid gap-8 lg:grid-cols-[0.8fr_1fr]">
          <div className="relative min-h-[260px] overflow-hidden rounded border border-ink/10 sm:min-h-80">
            <Image src="/brand/location-card.png" alt="OUDÉ Bologna" fill className="object-cover" />
          </div>
          <div className="self-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-oud">Scelta consigliata</p>
            <h2 className="mt-2 font-serif text-4xl sm:text-5xl">{daily.name}</h2>
            <p className="mt-4 max-w-xl leading-7 text-ink/68">{daily.shortDescription} Note di testa {daily.notes.top.join(', ')}, cuore {daily.notes.heart.join(', ')} e fondo {daily.notes.base.join(', ')}.</p>
            <Button href={`/products/${daily.slug}`} className="mt-7">Scopri il profumo</Button>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-oud">Categorie</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <a key={category.slug} href={`/categories/${category.slug}`} className="rounded border border-ink/10 bg-white p-6 transition hover:border-oud/40 hover:shadow-soft">
              <h3 className="font-serif text-2xl sm:text-3xl">{category.name}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/62">{category.description}</p>
            </a>
          ))}
        </div>
      </section>

      <FragranceFinderQuiz />
      <BundleBuilder />
      <RecentlyViewedProducts />

      <section className="bg-white py-16">
        <div className="container grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-oud">Storytelling</p>
            <h2 className="mt-2 font-serif text-4xl sm:text-5xl">Un rituale prima ancora di un prodotto</h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-ink/68 sm:text-lg sm:leading-8">Il mondo dei profumi arabi vive di materie prime intense, gesti lenti e composizioni persistenti. Questa base ecommerce è pronta per raccontare ogni fragranza con note, durata, occasioni d&apos;uso, gift box e contenuti social.</p>
          </div>
          <div className="rounded border border-ink/10 bg-cream p-6">
            <p className="font-serif text-3xl">Recensioni</p>
            <p className="mt-4 leading-7 text-ink/68">“Fragranze persistenti, packaging curato e consiglio WhatsApp preciso. Sembra una boutique vera anche online.”</p>
            <p className="mt-4 text-sm font-semibold">Cliente verificato</p>
          </div>
        </div>
      </section>
    </>
  );
}
