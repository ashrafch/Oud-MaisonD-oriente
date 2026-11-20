import Link from 'next/link';

const serviceLinks = [
  { label: 'Domande frequenti', href: '/faq' },
  { label: 'Spedizioni', href: '/shipping' },
  { label: 'Resi', href: '/returns' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Termini', href: '/terms' }
];

const shopLinks = [
  { label: 'Catalogo', href: '/products' },
  { label: 'Carrello', href: '/cart' },
  { label: 'Preferiti', href: '/wishlist' },
  { label: 'Contatti', href: '/contact' }
];

export function Footer() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'ordini@oude.example';

  return (
    <footer className="border-t border-ink/10 bg-ink text-cream">
      <div className="container grid gap-10 py-10 sm:py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-serif text-3xl">OUDE</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-cream/70">
            Profumi arabi e consigli per scegliere. Online e nella nostra boutique a Bologna.
          </p>
          <p className="mt-5 text-sm text-cream/70">Via Farini 26/D, 40124 Bologna</p>
          <p className="mt-2 text-sm text-cream/70">Email: <a href={`mailto:${email}`} className="underline underline-offset-4">{email}</a></p>
          <p className="mt-2 text-xs leading-5 text-cream/45">{process.env.NEXT_PUBLIC_BUSINESS_FISCAL_DATA || 'Dati fiscali da completare prima della pubblicazione.'}</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-saffron">Servizio</p>
          <div className="mt-4 grid gap-3 text-sm text-cream/72">
            {serviceLinks.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-saffron">Negozio</p>
          <div className="mt-4 grid gap-3 text-sm text-cream/72">
            {shopLinks.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
