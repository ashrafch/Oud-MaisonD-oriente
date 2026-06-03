import type { Product } from '@/types/catalog';
import { createSupabaseServiceClient } from './server';

type SupabaseServiceClient = any;

function toDbProduct(product: Product) {
  const dbProduct = {
    id: product.id && product.id.length === 36 ? product.id : undefined,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    status: 'published',
    price: product.price,
    compare_at_price: product.compareAtPrice ?? null,
    stock: product.stock,
    short_description: product.shortDescription,
    top_notes: product.notes.top,
    heart_notes: product.notes.heart,
    base_notes: product.notes.base,
    intensity: product.intensity,
    longevity: product.duration,
    gender: product.gender,
    tags: product.tags,
    seo_title: product.seoTitle ?? product.name,
    seo_description: product.seoDescription ?? product.shortDescription,
    is_featured: product.tags.includes('featured'),
    is_bestseller: product.tags.includes('bestseller'),
    is_new: product.tags.includes('nuovo'),
    is_gift_idea: product.tags.includes('gift'),
    updated_at: new Date().toISOString()
  };
  return Object.fromEntries(Object.entries(dbProduct).filter(([, value]) => value !== undefined));
}

export async function upsertAdminProduct(product: Product) {
  const supabase = createSupabaseServiceClient() as SupabaseServiceClient;
  if (!supabase) throw new Error('Supabase service client non configurato');

  const { data, error } = await supabase
    .from('products')
    .upsert(toDbProduct(product), { onConflict: 'slug' })
    .select('id')
    .single();
  if (error) throw error;

  const productId = data.id as string;
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', product.category)
    .single();

  if (category?.id) {
    await supabase.from('product_categories').delete().eq('product_id', productId);
    await supabase.from('product_categories').insert({ product_id: productId, category_id: category.id });
  }

  if (product.image) {
    await supabase.from('product_images').delete().eq('product_id', productId);
    await supabase.from('product_images').insert({
      product_id: productId,
      url: product.image,
      alt: product.name,
      sort_order: 0
    });
  }

  return productId;
}

export async function softDeleteAdminProduct(productId: string) {
  const supabase = createSupabaseServiceClient() as SupabaseServiceClient;
  if (!supabase) throw new Error('Supabase service client non configurato');
  const { error } = await supabase
    .from('products')
    .update({ deleted_at: new Date().toISOString(), status: 'hidden' })
    .eq('id', productId);
  if (error) throw error;
}

export async function uploadProductImage(file: File) {
  const supabase = createSupabaseServiceClient() as SupabaseServiceClient;
  if (!supabase) throw new Error('Supabase service client non configurato');
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? 'product-images';
  const extension = file.name.split('.').pop() || 'jpg';
  const path = `products/${crypto.randomUUID()}.${extension}`;
  const bytes = await file.arrayBuffer();
  const { error } = await supabase.storage.from(bucket).upload(path, bytes, {
    contentType: file.type || 'image/jpeg',
    upsert: false
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
