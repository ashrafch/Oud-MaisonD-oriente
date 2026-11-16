import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabase/server';

export async function guardPublicRequest(request: Request, scope: string, limit: number) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Origine non autorizzata' }, { status: 403 });
  }
  const length = Number(request.headers.get('content-length'));
  if (length > 32768) return NextResponse.json({ error: 'Richiesta troppo grande' }, { status: 413 });
  const client = createSupabaseServiceClient();
  if (!client) return NextResponse.json({ error: 'Servizio temporaneamente non disponibile' }, { status: 503 });
  // Vercel overwrites this header at its trusted proxy; never trust a client-supplied forwarded IP locally.
  const ip = process.env.VERCEL ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() : 'local';
  const key = createHash('sha256').update(`${scope}:${ip || 'unknown'}`).digest('hex');
  const rpc = client.rpc.bind(client) as unknown as (
    name: string, args: { p_key: string; p_limit: number; p_seconds: number }
  ) => PromiseLike<{ data: boolean | null; error: { message: string } | null }>;
  const { data, error } = await rpc('consume_api_rate_limit', { p_key: key, p_limit: limit, p_seconds: 600 });
  if (error) return NextResponse.json({ error: 'Servizio temporaneamente non disponibile' }, { status: 503 });
  if (!data) return NextResponse.json({ error: 'Troppe richieste. Riprova tra dieci minuti.' }, { status: 429, headers: { 'Retry-After': '600' } });
  return null;
}
