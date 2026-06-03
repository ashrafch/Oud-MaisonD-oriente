import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AdminLoginForm } from '@/components/admin/login-form';
import { getCurrentAdminSession, isAdminAuthEnabled } from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  const session = await getCurrentAdminSession();
  if (session && isAdminAuthEnabled()) redirect('/admin');

  return (
    <main className="min-h-screen bg-cream">
      <section className="container flex min-h-screen items-center justify-center py-12">
        <div className="w-full max-w-md rounded border border-ink/10 bg-white p-6 shadow-soft">
          <Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-ink/60 hover:text-oud">
            <ArrowLeft size={16} />
            Torna alla home
          </Link>
          <p className="text-sm font-semibold uppercase tracking-widest text-oud">Area riservata</p>
          <h1 className="mt-2 font-serif text-4xl">Accesso admin</h1>
          <p className="mt-3 text-sm leading-6 text-ink/62">Usa l&apos;utente creato in Supabase Auth e autorizzato nelle variabili admin.</p>
          <div className="mt-6">
            <AdminLoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
