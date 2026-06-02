import Image from 'next/image';
import Link from 'next/link';
import { categories } from '@/data/catalog';
import { HeaderActions } from './header-actions';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/92 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-3 md:h-20 md:gap-6">
        <Link href="/" className="flex min-w-0 items-center gap-2 focus-ring sm:gap-3">
          <Image src="/brand/oude-logo.jpg" alt="OUDÉ" width={78} height={78} className="h-10 w-10 shrink-0 rounded-full object-cover md:h-12 md:w-12" priority />
          <span className="truncate font-serif text-lg tracking-normal sm:text-xl">Maison D&apos;Oriente</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-ink/78 xl:flex">
          <Link href="/products">Catalogo</Link>
          {categories.slice(0, 5).map((category) => (
            <Link key={category.slug} href={`/categories/${category.slug}`}>{category.name}</Link>
          ))}
          <Link href="/about">Boutique</Link>
        </nav>
        <HeaderActions />
      </div>
      <nav aria-label="Navigazione mobile" className="border-t border-ink/8 xl:hidden">
        <div className="container flex gap-4 overflow-x-auto py-3 text-sm font-semibold text-ink/72 [scrollbar-width:none]">
          <Link className="shrink-0" href="/products">Catalogo</Link>
          {categories.slice(0, 6).map((category) => (
            <Link className="shrink-0" key={category.slug} href={`/categories/${category.slug}`}>{category.name}</Link>
          ))}
          <Link className="shrink-0" href="/about">Boutique</Link>
        </div>
      </nav>
    </header>
  );
}
