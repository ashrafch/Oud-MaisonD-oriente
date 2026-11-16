import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, MessageCircle, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { BundleBuilder } from '@/components/storefront/bundle-builder';
import { FragranceFinderQuiz } from '@/components/storefront/fragrance-finder-quiz';
import { RecentlyViewedProducts } from '@/components/storefront/recently-viewed';
import { BoutiqueMotion } from '@/components/storefront/boutique-motion';
import { ScentDiscovery, type ScentChapter } from '@/components/storefront/scent-discovery';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/product-card';
import { getSupabaseCategories, getSupabaseProducts } from '@/lib/supabase/catalog';

const benefits = [
  { icon: Truck, label: 'A casa o in boutique', detail: 'Spedizione e ritiro a Bologna' },
  { icon: ShieldCheck, label: 'Acquisti con serenità', detail: 'Pagamento protetto con Stripe' },
  { icon: MessageCircle, label: 'Un consiglio personale', detail: 'Ti accompagniamo nella scelta' }
];

export default async function HomePage() {
  const [categories, products] = await Promise.all([getSupabaseCategories(), getSupabaseProducts()]);
  const featured = [...products].sort((a, b) => Number(b.tags.includes('bestseller')) - Number(a.tags.includes('bestseller'))).slice(0, 4);
  const available = products.filter(product => product.stock > 0);
  const chapters: ScentChapter[] = [
    { label: 'Legnoso', subtitle: 'Il carattere profondo dei legni e delle spezie.', match: /oud|sandalo|cedro|legno/i },
    { label: 'Gourmand', subtitle: 'Accordi golosi, morbidi e avvolgenti.', match: /vaniglia|tonka|caramello|cioccolato/i },
    { label: 'Floreale', subtitle: 'Petali e sfumature da scoprire sulla pelle.', match: /rosa|gelsomino|fiori|floreale/i }
  ].flatMap(({ label, subtitle, match }) => {
    const product = available.find(entry => match.test([...entry.notes.top, ...entry.notes.heart, ...entry.notes.base].join(' ')));
    if (!product) return [];
    const { slug, name, brand, image, price, notes } = product;
    return [{ label, subtitle, product: { slug, name, brand, image, price, notes } }];
  });
  const brands = [...new Set(products.map(product => product.brand))].slice(0, 6);

  return (
    <BoutiqueMotion>
      <section className="boutique-hero relative overflow-hidden text-cream" aria-labelledby="boutique-heading">
        <div className="hero-contours" aria-hidden="true" />
        <div className="container relative grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:py-20">
          <div className="hero-copy">
            <div className="mb-8 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-saffron sm:text-xs">
              <span className="h-px w-9 bg-saffron/60" aria-hidden="true" /> Profumeria araba · Bologna
            </div>
            <h1 id="boutique-heading" className="max-w-xl font-serif text-[3.6rem] leading-[0.95] tracking-[-0.025em] sm:text-7xl lg:text-[5.5rem]">Ci sono scie<br />che <em className="font-normal text-saffron">parlano</em><br />di te.</h1>
            <p className="mt-7 max-w-md text-base leading-7 text-cream/75">Oud preziosi, dolcezze inattese, incontri sulla pelle. Entra nel mondo OUDÉ e trova la fragranza che senti tua.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/products" className="gap-7 bg-saffron px-6 text-ink hover:bg-cream">Esplora la collezione <ArrowUpRight size={18} aria-hidden="true" /></Button>
              <Link href="#scopri-la-tua-scia" className="focus-ring inline-flex min-h-11 items-center justify-center gap-3 px-4 text-sm font-medium text-cream/85 transition hover:text-saffron">Trova la tua scia <ArrowDown size={16} aria-hidden="true" /></Link>
            </div>
            <div className="mt-12 flex items-center gap-3 border-t border-cream/15 pt-6 text-xs text-cream/60">
              <Sparkles size={16} className="text-saffron" aria-hidden="true" /> Una selezione da esplorare, un profumo da riconoscere.
            </div>
          </div>
          {chapters.length ? <ScentDiscovery chapters={chapters} /> : <div className="relative aspect-square overflow-hidden rounded-t-[45%] bg-cream"><Image src="/brand/botanical-identity.jpg" alt="Il mondo botanico di OUDÉ" fill priority className="object-cover" /></div>}
        </div>
        <div className="relative border-t border-cream/10">
          <div className="container flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5 text-[10px] uppercase tracking-[0.22em] text-cream/45 sm:justify-between">
            <span className="text-saffron/80">I marchi della nostra selezione</span>
            {brands.map(brand => <span key={brand}>{brand}</span>)}
          </div>
        </div>
      </section>

      <section className="container grid gap-5 py-8 sm:grid-cols-3 sm:py-10" aria-label="La tua esperienza in boutique">
        {benefits.map(({ icon: Icon, label, detail }) => <div key={label} className="flex items-center gap-4 py-2" data-reveal><Icon size={24} strokeWidth={1.3} className="shrink-0 text-oud" aria-hidden="true" /><div><p className="text-sm font-medium">{label}</p><p className="mt-1 text-xs text-ink/55">{detail}</p></div></div>)}
      </section>

      <section id="selezione" className="container scroll-mt-28 py-10 sm:py-14">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end" data-reveal>
          <div><p className="boutique-eyebrow">La selezione OUDÉ</p><h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">Piccoli incontri.<br className="sm:hidden" /> Grandi affinità.</h2></div>
          <Link href="/products" className="boutique-text-link">Tutte le fragranze <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{featured.map(product => <div key={product.id} data-reveal><ProductCard product={product} /></div>)}</div>
      </section>

      <section className="container py-12 sm:py-16" aria-labelledby="universi-heading">
        <div className="mb-8 flex items-end justify-between gap-5" data-reveal><div><p className="boutique-eyebrow">Segui la tua curiosità</p><h2 id="universi-heading" className="mt-3 font-serif text-4xl sm:text-5xl">A ogni anima, il suo universo.</h2></div><span className="hidden font-serif text-5xl italic text-oud/20 sm:block" aria-hidden="true">O.</span></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => <Link key={category.slug} href={`/categories/${category.slug}`} className={`universe-card focus-ring group ${index === 0 ? 'universe-card-featured' : ''}`} data-reveal><div className="flex items-start justify-between"><span className="text-[10px] tracking-widest opacity-45">0{index + 1}</span><ArrowUpRight size={20} strokeWidth={1.25} className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" /></div><div className="mt-8"><h3 className="font-serif text-3xl">{category.name}</h3><p className="mt-2 max-w-xs text-sm leading-6 opacity-65">{category.description}</p></div><span className="mt-6 block text-[10px] font-semibold uppercase tracking-[0.18em]">Esplora l&apos;universo</span></Link>)}
        </div>
      </section>

      <section className="my-6 overflow-hidden bg-mist" aria-labelledby="rituale-heading">
        <div className="container grid gap-8 py-14 sm:py-20 lg:grid-cols-[.9fr_1fr] lg:gap-20">
          <div className="relative min-h-80 overflow-hidden rounded-t-[160px] border border-ink/10 sm:min-h-[440px]" data-reveal><Image src="/brand/botanical-identity.jpg" alt="Botanica e dettagli dell'identità OUDÉ Maison D'Oriente" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" /></div>
          <div className="self-center" data-reveal><p className="boutique-eyebrow">La cultura del profumo</p><h2 id="rituale-heading" className="mt-4 max-w-lg font-serif text-4xl leading-[1.05] sm:text-6xl">Prima di una fragranza,<br /><em className="font-normal text-oud">un rituale.</em></h2><p className="mt-6 max-w-lg text-base leading-8 text-ink/65">Una goccia, il calore della pelle, il tempo di lasciarla cambiare. La profumeria araba invita a rallentare: ad ascoltare le note, a sovrapporle, a trovare il proprio equilibrio.</p><p className="mt-4 max-w-lg leading-7 text-ink/65">Da OUDÉ puoi esplorare questo mondo al tuo ritmo, online o nella nostra boutique a Bologna.</p><Link href="/about" className="boutique-text-link mt-8">La nostra Maison <ArrowRight size={17} aria-hidden="true" /></Link></div>
        </div>
      </section>

      <div id="scopri-la-tua-scia" className="scroll-mt-24" data-reveal><FragranceFinderQuiz products={products} /></div>
      <div data-reveal><BundleBuilder products={products} /></div>
      <RecentlyViewedProducts />

      <section className="container py-12 sm:py-20" data-reveal>
        <div className="boutique-concierge flex flex-col gap-8 px-6 py-10 sm:px-12 lg:flex-row lg:items-center lg:justify-between"><div><p className="boutique-eyebrow">Il piacere di scegliere insieme</p><h2 className="mt-3 font-serif text-4xl sm:text-5xl">Un profumo si sceglie.<br />Una scia si riconosce.</h2><p className="mt-4 max-w-xl text-sm leading-7 text-ink/60">Hai una nota del cuore o cerchi un regalo? Raccontaci cosa ti piace: ti aiutiamo a orientarti nella selezione.</p></div><Button href="/contact" variant="secondary" className="shrink-0 gap-6 border-oud/20 bg-transparent">Parliamone <MessageCircle size={18} aria-hidden="true" /></Button></div>
      </section>
    </BoutiqueMotion>
  );
}
