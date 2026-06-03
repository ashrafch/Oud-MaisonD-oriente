import { NextResponse } from 'next/server';
import { getSupabaseProducts } from '@/lib/supabase/catalog';
import { softDeleteAdminProduct, upsertAdminProduct } from '@/lib/supabase/admin-products';
import type { Product } from '@/types/catalog';

export async function GET() {
  try {
    const products = await getSupabaseProducts({ includeHidden: true });
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const product = await request.json() as Product;
    const productId = await upsertAdminProduct(product);
    return NextResponse.json({ productId });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
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
