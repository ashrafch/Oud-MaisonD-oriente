import { NextResponse } from 'next/server';
import { requireAdminApiSession } from '@/lib/admin/auth';
import { getSupabaseProducts } from '@/lib/supabase/catalog';
import { softDeleteAdminProduct, upsertAdminProduct } from '@/lib/supabase/admin-products';
import { adminProductSchema } from '@/lib/validations/product';

export async function GET() {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return unauthorized();
    const products = await getSupabaseProducts({ includeHidden: true });
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return unauthorized();
    const product = adminProductSchema.safeParse(await request.json().catch(() => null));
    if (!product.success) return NextResponse.json({ error: 'Dati prodotto non validi' }, { status: 400 });
    const productId = await upsertAdminProduct(product.data);
    return NextResponse.json({ productId });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return unauthorized();
    const { productId } = await request.json() as { productId?: string };
    if (!productId) {
      return NextResponse.json({ error: 'productId mancante' }, { status: 400 });
    }
    await softDeleteAdminProduct(productId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Errore Supabase';
}

function unauthorized() {
  return NextResponse.json({ error: 'Accesso admin richiesto' }, { status: 401 });
}
