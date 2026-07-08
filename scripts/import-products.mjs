// Bulk import prodotti OUDÉ Maison D'Oriente
// - Carica le foto reali (src/prodotti) su Supabase Storage (bucket product-images)
// - Upsert dei prodotti su Supabase (conflict su slug -> ri-eseguibile senza duplicati)
// - Collega categorie (product_categories) e immagini (product_images)
//
// Uso:  node scripts/import-products.mjs           (import completo)
//       node scripts/import-products.mjs --dry     (solo validazione, nessuna scrittura)
//
// Richiede in .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_STORAGE_BUCKET

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import { products } from './products-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PRODOTTI_DIR = join(ROOT, 'src', 'prodotti');
const DRY_RUN = process.argv.includes('--dry');
const DEFAULT_STOCK = 10;

// ---- env ----
function loadEnv() {
  const envPath = join(ROOT, '.env.local');
  const raw = readFileSync(envPath, 'utf8');
  const out = {};
  for (const line of raw.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  return out;
}
const env = loadEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = env.SUPABASE_STORAGE_BUCKET || 'product-images';
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Mancano NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const contentTypeFor = (file) => {
  const ext = extname(file).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  return 'image/jpeg';
};

async function uploadImage(slug, filename, index) {
  const localPath = join(PRODOTTI_DIR, filename);
  if (!existsSync(localPath)) {
    console.warn(`   ⚠️  immagine mancante: ${filename}`);
    return null;
  }
  const bytes = readFileSync(localPath);
  const ext = extname(filename).toLowerCase() || '.jpg';
  const storagePath = `products/${slug}-${index}${ext}`;
  if (DRY_RUN) return `DRY:${storagePath}`;
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, bytes, {
    contentType: contentTypeFor(filename),
    upsert: true
  });
  if (error) {
    console.warn(`   ⚠️  upload fallito (${filename}): ${error.message}`);
    return null;
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

function toDbProduct(p) {
  const tags = p.tags ?? [];
  return {
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    status: 'published',
    price: p.price,
    compare_at_price: p.compareAtPrice ?? null,
    stock: p.stock ?? DEFAULT_STOCK,
    short_description: p.shortDescription ?? null,
    long_description: p.longDescription ?? null,
    fragrance_family: p.category ?? null,
    top_notes: p.notes?.top ?? [],
    heart_notes: p.notes?.heart ?? [],
    base_notes: p.notes?.base ?? [],
    intensity: p.intensity ?? null,
    longevity: p.duration ?? null,
    gender: p.gender ?? 'unisex',
    tags,
    seo_title: p.name,
    seo_description: p.shortDescription ?? null,
    is_featured: tags.includes('featured') || tags.includes('bestseller'),
    is_bestseller: tags.includes('bestseller'),
    is_new: tags.includes('nuovo'),
    is_gift_idea: tags.includes('gift'),
    updated_at: new Date().toISOString()
  };
}

async function main() {
  console.log(`\n🌙 Import OUDÉ — ${products.length} prodotti ${DRY_RUN ? '(DRY RUN)' : ''}`);
  console.log(`   Bucket: ${BUCKET}  |  Supabase: ${SUPABASE_URL}\n`);

  // categorie: slug -> id
  const { data: cats, error: catErr } = await supabase.from('categories').select('id, slug');
  if (catErr) { console.error('❌ Errore lettura categorie:', catErr.message); process.exit(1); }
  const catMap = new Map(cats.map((c) => [c.slug, c.id]));
  console.log(`   Categorie trovate: ${[...catMap.keys()].join(', ')}\n`);

  // validazione slug categorie usati
  const usedCats = new Set(products.flatMap((p) => p.categories ?? [p.category]));
  for (const c of usedCats) if (!catMap.has(c)) console.warn(`⚠️  categoria non esistente nel DB: ${c}`);

  let ok = 0, fail = 0, imgCount = 0;
  for (const p of products) {
    process.stdout.write(`• ${p.brand} — ${p.name} … `);
    try {
      // 1) immagini
      const urls = [];
      for (let i = 0; i < (p.images?.length ?? 0); i++) {
        const url = await uploadImage(p.slug, p.images[i], i);
        if (url) urls.push(url);
      }

      if (DRY_RUN) { console.log(`ok (${urls.length} img) [dry]`); ok++; imgCount += urls.length; continue; }

      // 2) upsert prodotto
      const { data: prod, error: upErr } = await supabase
        .from('products')
        .upsert(toDbProduct(p), { onConflict: 'slug' })
        .select('id')
        .single();
      if (upErr) throw upErr;
      const productId = prod.id;

      // 3) categorie (many-to-many)
      const catIds = (p.categories ?? [p.category])
        .map((slug) => catMap.get(slug))
        .filter(Boolean);
      await supabase.from('product_categories').delete().eq('product_id', productId);
      if (catIds.length) {
        const { error: pcErr } = await supabase
          .from('product_categories')
          .insert(catIds.map((category_id) => ({ product_id: productId, category_id })));
        if (pcErr) throw pcErr;
      }

      // 4) immagini
      await supabase.from('product_images').delete().eq('product_id', productId);
      if (urls.length) {
        const { error: imgErr } = await supabase
          .from('product_images')
          .insert(urls.map((url, sort_order) => ({ product_id: productId, url, alt: p.name, sort_order })));
        if (imgErr) throw imgErr;
      }

      imgCount += urls.length;
      ok++;
      console.log(`ok (${urls.length} img, cat: ${(p.categories ?? [p.category]).join('/')})`);
    } catch (e) {
      fail++;
      console.log(`❌ ${e.message}`);
    }
  }

  console.log(`\n✅ Completato: ${ok} prodotti, ${imgCount} immagini${fail ? `, ${fail} errori` : ''}.\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
