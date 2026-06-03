import { NextResponse } from 'next/server';
import { requireAdminApiSession } from '@/lib/admin/auth';
import { deleteMarketingPost, getMarketingPosts, upsertMarketingPost, type MarketingPost } from '@/lib/supabase/marketing';

export async function GET() {
  const admin = await requireAdminApiSession();
  if (!admin) return unauthorized();
  return NextResponse.json({ posts: await getMarketingPosts() });
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return unauthorized();
    const post = await request.json() as MarketingPost;
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
    const { postId } = await request.json() as { postId?: string };
    if (!postId) return NextResponse.json({ error: 'Post mancante' }, { status: 400 });
    await deleteMarketingPost(postId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Errore marketing' }, { status: 500 });
  }
}

function unauthorized() {
  return NextResponse.json({ error: 'Accesso admin richiesto' }, { status: 401 });
}
