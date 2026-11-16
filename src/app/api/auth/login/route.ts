import { readJsonBody } from '@/lib/security/json-body';
import { guardPublicRequest } from '@/lib/security/request-guard';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ensureAdminProfile } from '@/lib/admin/auth';
import { createSupabaseCookieServerClient } from '@/lib/supabase/ssr';

export async function POST(request: Request) {
  const blocked = await guardPublicRequest(request, 'login', 15);
  if (blocked) return blocked;
  const supabase = await createSupabaseCookieServerClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase Auth non configurato' }, { status: 500 });
  }

  const parsed = z.object({ email: z.string().email().max(254), password: z.string().min(1).max(1024) })
    .safeParse(await readJsonBody(request).catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Email e password obbligatorie' }, { status: 400 });
  }

  const { email, password } = parsed.data;

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
