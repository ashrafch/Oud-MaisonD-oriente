import { NextResponse } from 'next/server';
import { createSupabaseCookieServerClient } from '@/lib/supabase/ssr';

export async function POST(request: Request) {
  if (request.headers.get('sec-fetch-site') === 'cross-site') {
    return NextResponse.json({ error: 'Origine non autorizzata' }, { status: 403 });
  }
  const supabase = await createSupabaseCookieServerClient();
  await supabase?.auth.signOut();
  return NextResponse.json({ ok: true });
}
