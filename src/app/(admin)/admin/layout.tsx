import Link from 'next/link';
import { BarChart3, Boxes, ClipboardList, Megaphone, Package, Settings, Tag } from 'lucide-react';

const nav = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3 },
  { href: '/admin/products', label: 'Prodotti', icon: Package },
  { href: '/admin/orders', label: 'Ordini', icon: ClipboardList },
  { href: '/admin/inventory', label: 'Inventario', icon: Boxes },
  { href: '/admin/categories', label: 'Categorie', icon: Tag },
  { href: '/admin/social', label: 'Social', icon: Megaphone },
  { href: '/admin/settings', label: 'Impostazioni', icon: Settings }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f3ed]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-ink/10 bg-white p-5 lg:block">
        <p className="font-serif text-3xl">OUDÉ Admin</p>
        <nav className="mt-8 grid gap-2">
          {nav.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="flex items-center gap-3 rounded px-3 py-3 text-sm font-semibold hover:bg-mist"><Icon size={18} />{label}</Link>)}
        </nav>
      </aside>
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-white lg:hidden">
        <div className="container py-4">
          <p className="font-serif text-2xl">OUDÉ Admin</p>
          <nav className="mt-3 flex gap-3 overflow-x-auto pb-1 text-sm font-semibold text-ink/72 [scrollbar-width:none]">
            {nav.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="flex shrink-0 items-center gap-2 rounded bg-mist px-3 py-2"><Icon size={16} />{label}</Link>)}
          </nav>
        </div>
      </header>
      <main className="lg:pl-64">
        <div className="container py-8">{children}</div>
      </main>
    </div>
  );
}
