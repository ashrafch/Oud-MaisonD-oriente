import { NextResponse } from 'next/server';
import { ensureAdminProfile } from '@/lib/admin/auth';
import { createSupabaseCookieServerClient } from '@/lib/supabase/ssr';

export async function POST(request: Request) {
  const supabase = await createSupabaseCookieServerClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase Auth non configurato' }, { status: 500 });
  }

  const { email, password } = await request.json() as { email?: string; password?: string };
  if (!email || !password) {
    return NextResponse.json({ error: 'Email e password obbligatorie' }, { status: 400 });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user?.email) {
    return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 });
  }

  const admin = await ensureAdminProfile(data.user.id, data.user.email, data.user.user_metadata?.full_name);
  if (!admin) {
    await supabase.auth.signOut();
    return NextResponse.json({ error: 'Utente non autorizzato al pannello admin' }, { status: 403 });
  }

  return NextResponse.json({ admin });
}
