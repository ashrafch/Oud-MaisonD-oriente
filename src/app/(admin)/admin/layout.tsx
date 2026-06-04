import Link from 'next/link';
import { BadgePercent, BarChart3, Boxes, ClipboardList, FileText, Layers3, Megaphone, Package, Settings, ShieldCheck, Tag, UsersRound } from 'lucide-react';
import { LogoutButton } from '@/components/admin/logout-button';
import { isAdminAuthEnabled, requireAdminSession, type AdminRole } from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';

const operationalNav = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3 },
  { href: '/admin/products', label: 'Prodotti', icon: Package },
  { href: '/admin/orders', label: 'Ordini', icon: ClipboardList },
  { href: '/admin/customers', label: 'Clienti', icon: UsersRound },
  { href: '/admin/inventory', label: 'Inventario', icon: Boxes },
  { href: '/admin/categories', label: 'Categorie', icon: Tag },
  { href: '/admin/collections', label: 'Collezioni', icon: Layers3 },
  { href: '/admin/discounts', label: 'Coupon', icon: BadgePercent },
  { href: '/admin/content', label: 'Contenuti', icon: FileText },
  { href: '/admin/social', label: 'Social', icon: Megaphone }
];

const superNav = [
  { href: '/admin/settings', label: 'Configurazione', icon: Settings }
];

const roleLabels: Record<AdminRole, string> = {
  super_admin: 'Super admin sviluppatore',
  admin: 'Admin operativo'
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdminSession();
  const isSuperAdmin = admin.role === 'super_admin';
  const mobileNav = isSuperAdmin ? [...operationalNav, ...superNav] : operationalNav;

  return (
    <div className="min-h-screen bg-[#f7f3ed]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-ink/10 bg-white p-5 lg:block">
        <p className="font-serif text-3xl">OUDÉ Admin</p>
        <div className="mt-4 rounded border border-ink/10 bg-mist p-3 text-xs">
          <p className="font-semibold">{admin.fullName ?? admin.email}</p>
          <p className="mt-1 uppercase tracking-widest text-ink/50">{roleLabels[admin.role]}</p>
          {isSuperAdmin ? <p className="mt-2 flex items-center gap-1 text-oud"><ShieldCheck size={14} /> Area configurazione abilitata</p> : <p className="mt-2 text-ink/55">Gestione negozio quotidiana.</p>}
          {!isAdminAuthEnabled() ? <p className="mt-2 text-oud">Auth admin disattivata in locale.</p> : null}
        </div>
        <nav className="mt-8 grid gap-2">
          {operationalNav.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="flex items-center gap-3 rounded px-3 py-3 text-sm font-semibold hover:bg-mist"><Icon size={18} />{label}</Link>)}
        </nav>
        {isSuperAdmin ? (
          <div className="mt-7 border-t border-ink/10 pt-5">
            <p className="px-3 text-xs font-semibold uppercase tracking-widest text-ink/45">Super admin</p>
            <nav className="mt-2 grid gap-2">
              {superNav.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="flex items-center gap-3 rounded px-3 py-3 text-sm font-semibold text-oud hover:bg-oud/8"><Icon size={18} />{label}</Link>)}
            </nav>
          </div>
        ) : null}
        <div className="mt-6"><LogoutButton /></div>
      </aside>
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-white lg:hidden">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-serif text-2xl">OUDÉ Admin</p>
              <p className="text-xs uppercase tracking-widest text-ink/50">{roleLabels[admin.role]}</p>
            </div>
            <LogoutButton />
          </div>
          <nav className="mt-3 flex gap-3 overflow-x-auto pb-1 text-sm font-semibold text-ink/72 [scrollbar-width:none]">
            {mobileNav.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="flex shrink-0 items-center gap-2 rounded bg-mist px-3 py-2"><Icon size={16} />{label}</Link>)}
          </nav>
        </div>
      </header>
      <main className="lg:pl-64">
        <div className="container py-8">{children}</div>
      </main>
    </div>
  );
}
