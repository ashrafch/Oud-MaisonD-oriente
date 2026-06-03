import { NextResponse } from 'next/server';
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
    const { productId, stock, note } = await request.json() as { productId?: string; stock?: number; note?: string };
    if (!productId || typeof stock !== 'number') {
      return NextResponse.json({ error: 'Dati inventario non validi' }, { status: 400 });
    }
    await updateAdminProductStock(productId, stock, note);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Errore inventario' }, { status: 500 });
  }
}

function unauthorized() {
  return NextResponse.json({ error: 'Accesso admin richiesto' }, { status: 401 });
}
