import { createSupabaseServiceClient } from '@/lib/supabase/server';

export type AdminCategory = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  isVisible: boolean;
  sortOrder: number;
};

export type AdminCollection = {
  id?: string;
  name: string;
  slug: string;
  description: string;
};

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const supabase = createSupabaseServiceClient() as any;
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, is_visible, sort_order')
    .order('sort_order', { ascending: true });
  if (error) return [];
  return (data ?? []).map((category: any) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? '',
    isVisible: category.is_visible,
    sortOrder: category.sort_order ?? 0
  }));
}

export async function upsertAdminCategory(category: AdminCategory) {
  const supabase = createSupabaseServiceClient() as any;
  if (!supabase) throw new Error('Supabase service client non configurato');
  const payload = {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    is_visible: category.isVisible,
    sort_order: category.sortOrder,
    updated_at: new Date().toISOString()
  };
  const { error } = await supabase.from('categories').upsert(payload, { onConflict: 'slug' });
  if (error) throw error;
}

export async function hideAdminCategory(categoryId: string) {
  const supabase = createSupabaseServiceClient() as any;
  if (!supabase) throw new Error('Supabase service client non configurato');
  const { error } = await supabase.from('categories').update({ is_visible: false, updated_at: new Date().toISOString() }).eq('id', categoryId);
  if (error) throw error;
}

export async function getAdminCollections(): Promise<AdminCollection[]> {
  const supabase = createSupabaseServiceClient() as any;
  if (!supabase) return [];
  const { data, error } = await supabase.from('collections').select('id, name, slug, description').order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []).map((collection: any) => ({
    id: collection.id,
    name: collection.name,
    slug: collection.slug,
    description: collection.description ?? ''
  }));
}

export async function upsertAdminCollection(collection: AdminCollection) {
  const supabase = createSupabaseServiceClient() as any;
  if (!supabase) throw new Error('Supabase service client non configurato');
  const { error } = await supabase.from('collections').upsert({
    id: collection.id,
    name: collection.name,
    slug: collection.slug,
    description: collection.description,
    updated_at: new Date().toISOString()
  }, { onConflict: 'slug' });
  if (error) throw error;
}

export async function deleteAdminCollection(collectionId: string) {
  const supabase = createSupabaseServiceClient() as any;
  if (!supabase) throw new Error('Supabase service client non configurato');
  const { error } = await supabase.from('collections').delete().eq('id', collectionId);
  if (error) throw error;
}
