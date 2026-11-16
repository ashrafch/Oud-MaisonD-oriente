import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdminApiSession } from '@/lib/admin/auth';
import { getSupabaseProducts } from '@/lib/supabase/catalog';
import { updateAdminProductStock } from '@/lib/supabase/admin-products';

export async function GET() {
  const admin = await requireAdminApiSession();
  if (!admin) return unauthorized();
  const products = await getSupabaseProducts({ includeHidden: true });
  return NextResponse.json({ products });
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return unauthorized();
    const parsed = z.object({
      productId: z.string().uuid(),
      stock: z.number().int().min(0).max(1000000),
      note: z.string().max(1200).optional()
    }).safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dati inventario non validi' }, { status: 400 });
    }
    await updateAdminProductStock(parsed.data.productId, parsed.data.stock, parsed.data.note);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Errore inventario' }, { status: 500 });
  }
}

function unauthorized() {
  return NextResponse.json({ error: 'Accesso admin richiesto' }, { status: 401 });
}
