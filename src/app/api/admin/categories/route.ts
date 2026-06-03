import { NextResponse } from 'next/server';
import { requireAdminApiSession } from '@/lib/admin/auth';
import { getAdminCategories, hideAdminCategory, upsertAdminCategory, type AdminCategory } from '@/lib/supabase/admin-taxonomy';

export async function GET() {
  const admin = await requireAdminApiSession();
  if (!admin) return unauthorized();
  return NextResponse.json({ categories: await getAdminCategories() });
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return unauthorized();
    const category = await request.json() as AdminCategory;
    if (!category.name || !category.slug) return NextResponse.json({ error: 'Nome e slug obbligatori' }, { status: 400 });
    await upsertAdminCategory(category);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Errore categorie' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return unauthorized();
    const { categoryId } = await request.json() as { categoryId?: string };
    if (!categoryId) return NextResponse.json({ error: 'Categoria mancante' }, { status: 400 });
    await hideAdminCategory(categoryId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Errore categorie' }, { status: 500 });
  }
}

function unauthorized() {
  return NextResponse.json({ error: 'Accesso admin richiesto' }, { status: 401 });
}
