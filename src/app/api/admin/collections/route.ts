import { NextResponse } from 'next/server';
import { requireAdminApiSession } from '@/lib/admin/auth';
import { deleteAdminCollection, getAdminCollections, upsertAdminCollection, type AdminCollection } from '@/lib/supabase/admin-taxonomy';

export async function GET() {
  const admin = await requireAdminApiSession();
  if (!admin) return unauthorized();
  return NextResponse.json({ collections: await getAdminCollections() });
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return unauthorized();
    const collection = await request.json() as AdminCollection;
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
    const { collectionId } = await request.json() as { collectionId?: string };
    if (!collectionId) return NextResponse.json({ error: 'Collezione mancante' }, { status: 400 });
    await deleteAdminCollection(collectionId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Errore collezioni' }, { status: 500 });
  }
}

function unauthorized() {
  return NextResponse.json({ error: 'Accesso admin richiesto' }, { status: 401 });
}
