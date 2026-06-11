import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdminApiSession } from '@/lib/admin/auth';
import { createSupabaseServiceClient } from '@/lib/supabase/server';

type ShippingConfig = { baseCost: number; freeThreshold: number };
const DEFAULTS: ShippingConfig = { baseCost: 6.9, freeThreshold: 79 };

export async function GET() {
  try {
    const supabase = createSupabaseServiceClient() as any;
    if (!supabase) return NextResponse.json(DEFAULTS);
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'shipping').single();
    const config = data?.value as ShippingConfig | null;
    return NextResponse.json(config ?? DEFAULTS);
  } catch {
    return NextResponse.json(DEFAULTS);
  }
}

const shippingSchema = z.object({
  baseCost: z.number().nonnegative().max(999),
  freeThreshold: z.number().nonnegative().max(9999)
});

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return NextResponse.json({ error: 'Accesso admin richiesto' }, { status: 401 });

    const body = shippingSchema.safeParse(await request.json().catch(() => null));
    if (!body.success) return NextResponse.json({ error: 'Dati non validi' }, { status: 400 });

    const supabase = createSupabaseServiceClient() as any;
    if (!supabase) return NextResponse.json({ error: 'Supabase non disponibile' }, { status: 503 });

    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: 'shipping', value: body.data, updated_at: new Date().toISOString() });

    if (error) {
      return NextResponse.json(
        { error: 'Tabella site_settings non trovata. Esegui la migration SQL nel progetto Supabase.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, config: body.data });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Errore server' }, { status: 500 });
  }
}
