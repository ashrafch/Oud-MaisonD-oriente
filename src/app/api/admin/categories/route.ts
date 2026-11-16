import { z } from 'zod';
import { readJsonBody } from '@/lib/security/json-body';
import { categorySchema } from '@/lib/validations/admin';
import { NextResponse } from 'next/server';
import { requireAdminApiSession } from '@/lib/admin/auth';
import { getAdminCategories, hideAdminCategory, upsertAdminCategory } from '@/lib/supabase/admin-taxonomy';

export async function GET() {
  const admin = await requireAdminApiSession();
  if (!admin) return unauthorized();
  return NextResponse.json({ categories: await getAdminCategories() });
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return unauthorized();
    const parsed = categorySchema.safeParse(await readJsonBody(request).catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: 'Dati non validi' }, { status: 400 });
    const category = parsed.data;
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
    const parsed = z.object({ categoryId: z.string().uuid() }).safeParse(await readJsonBody(request));
    if (!parsed.success) return NextResponse.json({ error: 'Dati non validi' }, { status: 400 });
    const { categoryId } = parsed.data;
    await hideAdminCategory(categoryId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Errore categorie' }, { status: 500 });
  }
}

function unauthorized() {
  return NextResponse.json({ error: 'Accesso admin richiesto' }, { status: 401 });
}
