import { createSupabaseServiceClient } from '@/lib/supabase/server';

export type ContentPage = {
  slug: string;
  title: string;
  body: string;
};

const defaultPages: ContentPage[] = [
  { slug: 'about', title: 'Chi siamo', body: '' },
  { slug: 'contact', title: 'Contatti', body: '' },
  { slug: 'shipping', title: 'Spedizioni', body: '' },
  { slug: 'returns', title: 'Resi e rimborsi', body: '' },
  { slug: 'privacy', title: 'Privacy policy', body: '' },
  { slug: 'terms', title: 'Termini e condizioni', body: '' },
  { slug: 'faq', title: 'FAQ', body: '' }
];

export async function getContentPages(): Promise<ContentPage[]> {
  const supabase = createSupabaseServiceClient() as any;
  if (!supabase) return defaultPages;
  const { data, error } = await supabase.from('settings').select('key, value').like('key', 'content:%').order('key');
  if (error) return defaultPages;
  const saved = new Map<string, ContentPage>((data ?? []).map((row: any) => [String(row.key).replace('content:', ''), row.value as ContentPage]));
  return defaultPages.map((page) => saved.get(page.slug) ?? page);
}

export async function upsertContentPage(page: ContentPage) {
  const supabase = createSupabaseServiceClient() as any;
  if (!supabase) throw new Error('Supabase service client non configurato');
  const { error } = await supabase.from('settings').upsert({
    key: `content:${page.slug}`,
    value: page,
    updated_at: new Date().toISOString()
  }, { onConflict: 'key' });
  if (error) throw error;
}
