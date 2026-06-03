import { createSupabaseServiceClient } from '@/lib/supabase/server';

export type MarketingPost = {
  id?: string;
  productId?: string;
  channel: string;
  caption: string;
  hashtags: string[];
  status: 'draft' | 'scheduled' | 'published';
  scheduledAt?: string;
  productName?: string;
};

export async function getMarketingPosts(): Promise<MarketingPost[]> {
  const supabase = createSupabaseServiceClient() as any;
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('marketing_posts')
    .select('id, product_id, channel, caption, hashtags, status, scheduled_at, products(name)')
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []).map((post: any) => ({
    id: post.id,
    productId: post.product_id ?? undefined,
    channel: post.channel,
    caption: post.caption,
    hashtags: post.hashtags ?? [],
    status: post.status,
    scheduledAt: post.scheduled_at ?? undefined,
    productName: post.products?.name
  }));
}

export async function upsertMarketingPost(post: MarketingPost) {
  const supabase = createSupabaseServiceClient() as any;
  if (!supabase) throw new Error('Supabase service client non configurato');
  const { error } = await supabase.from('marketing_posts').upsert({
    id: post.id,
    product_id: post.productId || null,
    channel: post.channel,
    caption: post.caption,
    hashtags: post.hashtags,
    status: post.status,
    scheduled_at: post.scheduledAt || null,
    updated_at: new Date().toISOString()
  });
  if (error) throw error;
}

export async function deleteMarketingPost(postId: string) {
  const supabase = createSupabaseServiceClient() as any;
  if (!supabase) throw new Error('Supabase service client non configurato');
  const { error } = await supabase.from('marketing_posts').delete().eq('id', postId);
  if (error) throw error;
}
