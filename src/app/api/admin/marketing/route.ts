import { z } from 'zod';
import { readJsonBody } from '@/lib/security/json-body';
import { marketingSchema } from '@/lib/validations/admin';
import { NextResponse } from 'next/server';
import { requireAdminApiSession } from '@/lib/admin/auth';
import { deleteMarketingPost, getMarketingPosts, upsertMarketingPost } from '@/lib/supabase/marketing';

export async function GET() {
  const admin = await requireAdminApiSession();
  if (!admin) return unauthorized();
  return NextResponse.json({ posts: await getMarketingPosts() });
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return unauthorized();
    const parsed = marketingSchema.safeParse(await readJsonBody(request).catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: 'Dati non validi' }, { status: 400 });
    const post = parsed.data;
    if (!post.channel || !post.caption) return NextResponse.json({ error: 'Canale e caption obbligatori' }, { status: 400 });
    await upsertMarketingPost(post);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Errore marketing' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return unauthorized();
    const parsed = z.object({ postId: z.string().uuid() }).safeParse(await readJsonBody(request));
    if (!parsed.success) return NextResponse.json({ error: 'Dati non validi' }, { status: 400 });
    const { postId } = parsed.data;
    await deleteMarketingPost(postId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Errore marketing' }, { status: 500 });
  }
}

function unauthorized() {
  return NextResponse.json({ error: 'Accesso admin richiesto' }, { status: 401 });
}
