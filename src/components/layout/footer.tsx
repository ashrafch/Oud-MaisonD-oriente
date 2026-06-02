import Link from 'next/link';

const links = ['FAQ', 'Spedizioni', 'Resi', 'Privacy', 'Termini'];

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-cream">
      <div className="container grid gap-10 py-10 sm:py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-serif text-3xl">OUDÉ</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-cream/70">Maison D&apos;Oriente seleziona profumi arabi, oud, musk e rituali olfattivi con un approccio boutique: caldo, elegante e concreto.</p>
          <p className="mt-5 text-sm text-cream/70">Via Farini 26/D, 40124 Bologna</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-saffron">Servizio</p>
          <div className="mt-4 grid gap-3 text-sm text-cream/72">
            {links.map((item) => <Link key={item} href={`/${item.toLowerCase()}`}>{item}</Link>)}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-saffron">Newsletter</p>
          <form className="mt-4 flex flex-col overflow-hidden rounded border border-cream/20 bg-cream/8 sm:flex-row md:flex-col xl:flex-row">
            <input aria-label="Email" placeholder="email@example.com" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-cream/40" />
            <button className="min-h-11 bg-saffron px-4 text-sm font-semibold text-ink">Iscriviti</button>
          </form>
        </div>
      </div>
    </footer>
  );
}
