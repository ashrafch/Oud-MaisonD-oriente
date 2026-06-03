import { NextResponse } from 'next/server';
import { createSupabaseCookieServerClient } from '@/lib/supabase/ssr';

export async function POST() {
  const supabase = await createSupabaseCookieServerClient();
  await supabase?.auth.signOut();
  return NextResponse.json({ ok: true });
}
