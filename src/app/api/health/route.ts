import { NextResponse } from 'next/server';
import { createSupabasePublicServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = createSupabasePublicServerClient();
    if (!client) throw new Error('Database unavailable');
    const { error } = await client.from('products').select('id').limit(1).abortSignal(AbortSignal.timeout(5000));
    if (error) throw error;
    return NextResponse.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    console.error('Health check: catalog database unavailable');
    return NextResponse.json({ status: 'unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
