import { NextResponse } from 'next/server';
import { requireAdminApiSession } from '@/lib/admin/auth';
import { getContentPages, upsertContentPage, type ContentPage } from '@/lib/supabase/content';

export async function GET() {
  const admin = await requireAdminApiSession();
  if (!admin) return unauthorized();
  return NextResponse.json({ pages: await getContentPages() });
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return unauthorized();
    const page = await request.json() as ContentPage;
    if (!page.slug || !page.title) return NextResponse.json({ error: 'Pagina non valida' }, { status: 400 });
    await upsertContentPage(page);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Errore contenuti' }, { status: 500 });
  }
}

function unauthorized() {
  return NextResponse.json({ error: 'Accesso admin richiesto' }, { status: 401 });
}
