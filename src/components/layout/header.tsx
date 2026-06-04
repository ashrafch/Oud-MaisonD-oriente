import Image from 'next/image';
import Link from 'next/link';
import { categories } from '@/data/catalog';
import { HeaderActions } from './header-actions';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-3 md:h-[76px] md:gap-6">
        <Link href="/" className="focus-ring flex min-w-0 items-center gap-3">
          <Image
            src="/brand/oude-logo.jpg"
            alt="OUDE"
            width={80}
            height={80}
            className="h-10 w-10 shrink-0 rounded object-cover md:h-11 md:w-11"
            priority
          />
          <span className="grid min-w-0 leading-none">
            <span className="truncate font-serif text-xl font-semibold md:text-2xl">OUDE</span>
            <span className="mt-1 hidden text-[11px] font-semibold uppercase tracking-widest text-ink/45 sm:block">
              Maison D&apos;Oriente
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-[13px] font-semibold uppercase tracking-wide text-ink/68 xl:flex">
          <Link className="transition hover:text-oud" href="/products">Catalogo</Link>
          {categories.slice(0, 5).map((category) => (
            <Link className="transition hover:text-oud" key={category.slug} href={`/categories/${category.slug}`}>
              {category.name}
            </Link>
          ))}
          <Link className="transition hover:text-oud" href="/about">Boutique</Link>
        </nav>

        <HeaderActions />
      </div>

      <nav aria-label="Navigazione mobile" className="border-t border-ink/8 xl:hidden">
        <div className="container flex gap-4 overflow-x-auto py-3 text-[13px] font-semibold text-ink/70 [scrollbar-width:none]">
          <Link className="shrink-0 transition hover:text-oud" href="/products">Catalogo</Link>
          {categories.slice(0, 6).map((category) => (
            <Link className="shrink-0 transition hover:text-oud" key={category.slug} href={`/categories/${category.slug}`}>
              {category.name}
            </Link>
          ))}
          <Link className="shrink-0 transition hover:text-oud" href="/about">Boutique</Link>
        </div>
      </nav>
    </header>
  );
}
