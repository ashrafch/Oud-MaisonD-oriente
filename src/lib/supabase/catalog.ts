import { categories as seedCategories, products as seedProducts } from '@/data/catalog';
import type { Category, Product } from '@/types/catalog';
import { createSupabasePublicServerClient, createSupabaseServiceClient } from './server';

type SupabaseAnyClient = any;

type SupabaseProductRow = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  status: string;
  price: number | string;
  compare_at_price: number | string | null;
  stock: number;
  short_description: string | null;
  top_notes: string[] | null;
  heart_notes: string[] | null;
  base_notes: string[] | null;
  intensity: string | null;
  longevity: string | null;
  gender: 'uomo' | 'donna' | 'unisex' | null;
  tags: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  product_images?: { url: string; alt: string | null; sort_order: number }[];
  product_categories?: { categories: { slug: string; name: string } | null }[];
};

function inferCategory(row: Pick<SupabaseProductRow, 'slug' | 'tags'>) {
  const text = `${row.slug} ${(row.tags ?? []).join(' ')}`.toLowerCase();
  if (text.includes('musk')) return 'musk';
  if (text.includes('bakhoor')) return 'bakhoor';
  if (text.includes('attar')) return 'attar';
  if (text.includes('gift')) return 'set-regalo';
  if (text.includes('oud')) return 'oud';
  return 'unisex';
}

function mapProduct(row: SupabaseProductRow): Product {
  const allCategories = (row.product_categories ?? [])
    .map((entry) => entry.categories?.slug)
    .filter((slug): slug is string => Boolean(slug));
  const category = allCategories[0] ?? inferCategory(row);
  const categories = allCategories.length > 0 ? allCategories : [category];
  const image = row.product_images?.sort((a, b) => a.sort_order - b.sort_order)[0]?.url ?? '/brand/oude-logo.jpg';

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand ?? 'OUDÉ',
    price: Number(row.price),
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    category,
    categories,
    image,
    stock: row.stock,
    intensity: row.intensity ?? 'Medio',
    duration: row.longevity ?? '6-8 ore',
    gender: row.gender ?? 'unisex',
    tags: row.tags ?? [],
    seoTitle: row.seo_title ?? row.name,
    seoDescription: row.seo_description ?? row.short_description ?? undefined,
    shortDescription: row.short_description ?? '',
    notes: {
      top: row.top_notes ?? [],
      heart: row.heart_notes ?? [],
      base: row.base_notes ?? []
    }
  };
}

export async function getSupabaseCategories(): Promise<Category[]> {
  const supabase = createSupabasePublicServerClient() as SupabaseAnyClient;
  if (!supabase) return seedCategories;
  const { data, error } = await supabase
    .from('categories')
    .select('name, slug, description')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true });
  if (error || !data?.length) return seedCategories;
  return data.map((category: { name: string; slug: string; description: string | null }) => ({
    name: category.name,
    slug: category.slug,
    description: category.description ?? ''
  }));
}

export async function getSupabaseProducts(options: { includeHidden?: boolean } = {}): Promise<Product[]> {
  // Le pagine catalogo/categoria sono Server Component: usiamo il client service-role
  // (mai esposto al browser) così le join product_images / product_categories sono
  // sempre leggibili. Con il solo client anon le RLS le restituiscono vuote e le
  // immagini/categorie non compaiono nel sito. Fallback su client pubblico.
  const supabase = (createSupabaseServiceClient() ?? createSupabasePublicServerClient()) as SupabaseAnyClient;
  if (!supabase) return seedProducts;
  let query = supabase
    .from('products')
    .select('*, product_images(url, alt, sort_order), product_categories(categories(slug, name))')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });
  if (!options.includeHidden) query = query.eq('status', 'published');
  const { data, error } = await query;
  if (error || !data?.length) return seedProducts;
  return (data as SupabaseProductRow[]).map(mapProduct);
}

export async function getSupabaseProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getSupabaseProducts();
  return products.find((product) => product.slug === slug);
}

export async function getSupabaseProductSlugs() {
  const supabase = createSupabasePublicServerClient() as SupabaseAnyClient;
  if (!supabase) return seedProducts.map((product) => product.slug);
  const { data, error } = await supabase
    .from('products')
    .select('slug')
    .eq('status', 'published')
    .is('deleted_at', null);
  if (error || !data?.length) return seedProducts.map((product) => product.slug);
  return data.map((row: { slug: string }) => row.slug);
}
