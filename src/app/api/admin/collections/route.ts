import { z } from 'zod';
import { readJsonBody } from '@/lib/security/json-body';
import { collectionSchema } from '@/lib/validations/admin';
import { NextResponse } from 'next/server';
import { requireAdminApiSession } from '@/lib/admin/auth';
import { deleteAdminCollection, getAdminCollections, upsertAdminCollection } from '@/lib/supabase/admin-taxonomy';

export async function GET() {
  const admin = await requireAdminApiSession();
  if (!admin) return unauthorized();
  return NextResponse.json({ collections: await getAdminCollections() });
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return unauthorized();
    const parsed = collectionSchema.safeParse(await readJsonBody(request).catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: 'Dati non validi' }, { status: 400 });
    const collection = parsed.data;
    if (!collection.name || !collection.slug) return NextResponse.json({ error: 'Nome e slug obbligatori' }, { status: 400 });
    await upsertAdminCollection(collection);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Errore collezioni' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return unauthorized();
    const parsed = z.object({ collectionId: z.string().uuid() }).safeParse(await readJsonBody(request));
    if (!parsed.success) return NextResponse.json({ error: 'Dati non validi' }, { status: 400 });
    const { collectionId } = parsed.data;
    await deleteAdminCollection(collectionId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Errore collezioni' }, { status: 500 });
  }
}

function unauthorized() {
  return NextResponse.json({ error: 'Accesso admin richiesto' }, { status: 401 });
}
