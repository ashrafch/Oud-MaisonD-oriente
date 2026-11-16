import { readJsonBody } from '@/lib/security/json-body';
import { contentSchema } from '@/lib/validations/admin';
import { NextResponse } from 'next/server';
import { requireAdminApiSession } from '@/lib/admin/auth';
import { getContentPages, upsertContentPage } from '@/lib/supabase/content';

export async function GET() {
  const admin = await requireAdminApiSession();
  if (!admin) return unauthorized();
  return NextResponse.json({ pages: await getContentPages() });
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return unauthorized();
    const parsed = contentSchema.safeParse(await readJsonBody(request).catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: 'Dati non validi' }, { status: 400 });
    const page = parsed.data;
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
