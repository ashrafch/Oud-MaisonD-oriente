'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { categories } from '@/data/catalog';
import { cn } from '@/lib/utils/cn';
import { HeaderActions } from './header-actions';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 12);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-all duration-300',
        isScrolled
          ? 'border-ink/12 bg-cream/96 shadow-[0_18px_45px_rgba(23,20,18,0.10)] backdrop-blur-xl'
          : 'border-cream/18 bg-cream/78 backdrop-blur-md'
      )}
    >
      <div
        className={cn(
          'overflow-hidden border-b border-ink/8 bg-oud text-cream transition-all duration-300',
          isScrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'
        )}
      >
        <div className="container flex min-h-9 items-center justify-center text-center text-[12px] font-semibold uppercase tracking-widest text-cream/86">
          Boutique profumi arabi a Bologna - ritiro in negozio e spedizione rapida
        </div>
      </div>

      <div className={cn('container flex items-center justify-between gap-3 transition-all duration-300 md:gap-6', isScrolled ? 'h-14 md:h-16' : 'h-16 md:h-[76px]')}>
        <Link href="/" className="focus-ring group flex min-w-0 items-center gap-3">
          <Image
            src="/brand/oude-logo.jpg"
            alt="OUDE"
            width={80}
            height={80}
            className={cn('shrink-0 rounded object-cover transition-all duration-300 group-hover:scale-105', isScrolled ? 'h-9 w-9 md:h-10 md:w-10' : 'h-10 w-10 md:h-11 md:w-11')}
            priority
          />
          <span className="grid min-w-0 leading-none">
            <span className="truncate font-serif text-xl font-semibold transition-colors group-hover:text-oud md:text-2xl">OUDE</span>
            <span className="mt-1 hidden text-[11px] font-semibold uppercase tracking-widest text-ink/45 sm:block">
              Maison D&apos;Oriente
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-[13px] font-semibold uppercase tracking-wide text-ink/68 xl:flex">
          <NavLink href="/products">Catalogo</NavLink>
          {categories.slice(0, 5).map((category) => (
            <NavLink key={category.slug} href={`/categories/${category.slug}`}>
              {category.name}
            </NavLink>
          ))}
          <NavLink href="/about">Boutique</NavLink>
        </nav>

        <HeaderActions />
      </div>

      <nav aria-label="Navigazione mobile" className={cn('border-t border-ink/8 transition-all duration-300 xl:hidden', isScrolled ? 'bg-cream/88' : 'bg-cream/50')}>
        <div className="container flex gap-4 overflow-x-auto py-3 text-[13px] font-semibold text-ink/70 [scrollbar-width:none]">
          <Link className="nav-underline shrink-0 transition hover:text-oud" href="/products">Catalogo</Link>
          {categories.slice(0, 6).map((category) => (
            <Link className="nav-underline shrink-0 transition hover:text-oud" key={category.slug} href={`/categories/${category.slug}`}>
              {category.name}
            </Link>
          ))}
          <Link className="nav-underline shrink-0 transition hover:text-oud" href="/about">Boutique</Link>
        </div>
      </nav>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="nav-underline transition hover:text-oud" href={href}>
      {children}
    </Link>
  );
}
