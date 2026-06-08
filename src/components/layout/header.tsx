'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories } from '@/data/catalog';
import { cn } from '@/lib/utils/cn';
import { HeaderActions } from './header-actions';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 12);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b transition-all duration-300',
          isScrolled
            ? 'border-cream/18 bg-cream/64 shadow-[0_18px_45px_rgba(23,20,18,0.10)] backdrop-blur-xl'
            : 'border-cream/18 bg-cream/82 backdrop-blur-md'
        )}
      >
        <div
          className={cn(
            'overflow-hidden border-b border-saffron/18 bg-[rgba(201,155,69,0.16)] text-ink transition-all duration-300',
            isScrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'
          )}
        >
          <div className="container flex min-h-9 items-center justify-center text-center text-[12px] font-semibold uppercase tracking-widest text-ink/66">
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
            <NavLink href="/" active={pathname === '/'}>Maison</NavLink>
            <NavLink href="/products" active={pathname === '/products' || pathname.startsWith('/products/')}>Catalogo</NavLink>
            {categories.slice(0, 5).map((category) => (
              <NavLink key={category.slug} href={`/categories/${category.slug}`} active={pathname === `/categories/${category.slug}`}>
                {category.name}
              </NavLink>
            ))}
            <NavLink href="/about" active={pathname === '/about'}>Boutique</NavLink>
          </nav>

          <HeaderActions />
        </div>

        <nav aria-label="Navigazione mobile" className={cn('border-t border-ink/8 transition-all duration-300 xl:hidden', isScrolled ? 'bg-cream/76' : 'bg-cream/50')}>
          <div className="container flex gap-4 overflow-x-auto py-3 text-[13px] font-semibold text-ink/70 [scrollbar-width:none]">
            <MobileNavLink href="/" active={pathname === '/'}>Maison</MobileNavLink>
            <MobileNavLink href="/products" active={pathname === '/products' || pathname.startsWith('/products/')}>Catalogo</MobileNavLink>
            {categories.slice(0, 6).map((category) => (
              <MobileNavLink key={category.slug} href={`/categories/${category.slug}`} active={pathname === `/categories/${category.slug}`}>
                {category.name}
              </MobileNavLink>
            ))}
            <MobileNavLink href="/about" active={pathname === '/about'}>Boutique</MobileNavLink>
          </div>
        </nav>
      </header>
      <div aria-hidden="true" className="h-[145px] md:h-[157px] xl:h-[112px]" />
    </>
  );
}

function NavLink({ href, children, active = false }: { href: string; children: ReactNode; active?: boolean }) {
  return (
    <Link
      className={cn(
        'nav-underline relative rounded-full px-2.5 py-1 transition hover:text-oud',
        active
          ? 'bg-[linear-gradient(135deg,rgba(255,250,242,0.92),rgba(234,220,200,0.58))] text-ink shadow-[0_12px_30px_rgba(35,27,23,0.12)] ring-1 ring-white/65 before:absolute before:inset-x-2 before:bottom-0 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(201,155,69,0.95),transparent)] before:content-[""]'
          : ''
      )}
      href={href}
      aria-current={active ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, active = false }: { href: string; children: ReactNode; active?: boolean }) {
  return (
    <Link
      className={cn(
        'nav-underline relative shrink-0 rounded-full px-2.5 py-1 transition hover:text-oud',
        active
          ? 'bg-[linear-gradient(135deg,rgba(255,250,242,0.92),rgba(234,220,200,0.58))] text-ink shadow-[0_12px_30px_rgba(35,27,23,0.12)] ring-1 ring-white/65 before:absolute before:inset-x-2 before:bottom-0 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(201,155,69,0.95),transparent)] before:content-[""]'
          : ''
      )}
      href={href}
      aria-current={active ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}
