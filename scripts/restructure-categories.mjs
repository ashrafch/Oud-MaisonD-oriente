// Ristruttura le categorie del catalogo in modo che ogni categoria contenga prodotti.
// Nuova tassonomia: Uomo / Donna / Unisex (per gender, sempre popolate) +
// Oud & Legnosi / Gourmand & Dolci (famiglie olfattive) + Set Regalo + Casa & Profumatori.
// Le vecchie categorie senza prodotti (attar, musk, bakhoor) vengono nascoste.
//
// Uso: node scripts/restructure-categories.mjs [--dry]
// Legge il gender verificato da scripts/enrichment.json e riscrive product_categories.

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DRY_RUN = process.argv.includes('--dry');

function loadEnv() {
  const raw = readFileSync(join(ROOT, '.env.local'), 'utf8');
  const out = {};
  for (const line of raw.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  return out;
}
const env = loadEnv();
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const enrichment = JSON.parse(readFileSync(join(__dirname, 'enrichment.json'), 'utf8'));
const genderBySlug = new Map(enrichment.map((e) => [e.slug, e.gender]));

// Categorie target (visibili) + descrizioni
const TARGET_CATS = [
  { slug: 'uomo', name: 'Uomo', description: 'Fragranze maschili decise, legnose e strutturate.', sort_order: 1 },
  { slug: 'donna', name: 'Donna', description: 'Fragranze femminili eleganti, floreali e sensuali.', sort_order: 2 },
  { slug: 'unisex', name: 'Unisex', description: 'Fragranze versatili e contemporanee per lui e per lei.', sort_order: 3 },
  { slug: 'oud', name: 'Oud & Legnosi', description: 'Oud, legni preziosi e scie orientali intense.', sort_order: 4 },
  { slug: 'gourmand', name: 'Gourmand & Dolci', description: 'Vaniglia, caramello, datteri e note golose avvolgenti.', sort_order: 5 },
  { slug: 'set-regalo', name: 'Set Regalo', description: 'Cofanetti e idee regalo curate.', sort_order: 6 },
  { slug: 'casa', name: 'Casa & Profumatori', description: 'Profumatori per ambienti e bakhoor per la casa.', sort_order: 7 }
];
const HIDE_CATS = ['attar', 'musk', 'bakhoor'];

// Classificazione per famiglia (oltre alla categoria di gender)
const OUD = new Set([
  'lattafa-asad', 'lattafa-asad-elixir', 'lattafa-badee-al-oud-honor-glory',
  'lattafa-badee-al-oud-sublime', 'lattafa-badee-al-oud-noble-blush', 'lattafa-musamam-black',
  'lattafa-musamam-white', 'lattafa-fakhar-black', 'lattafa-fakhar-platino', 'lattafa-classic-stone',
  'lattafa-teriaq-black', 'lattafa-sherif', 'lattafa-taureau-de-combat', 'french-avenue-cosmic-tonka',
  'french-avenue-marmara', 'french-avenue-nomade', 'riiffs-patchouli-de-oro', 'riiffs-golden-elixir',
  'maison-asrar-faris-al-arab', 'maison-asrar-muharib', 'maison-asrar-rey', 'attri-ameer-al-oud-vip',
  'hersh-lahab', 'afnan-ornament-homme', 'asdaaf-ameerat-al-arab'
]);
const GOURMAND = new Set([
  'lattafa-khamrah', 'lattafa-khamrah-qahwa', 'lattafa-khamrah-dukhan', 'lattafa-asad-bourbon',
  'lattafa-nebras-elixir', 'lattafa-eclaire', 'lattafa-yara', 'lattafa-yara-moi', 'lattafa-yara-candy',
  'lattafa-victoria', 'lattafa-sakeena', 'lattafa-atheeri', 'lattafa-teriaq-white', 'lattafa-pure-crystal',
  'lattafa-queen-of-arabia', 'lattafa-nasamaat', 'maison-asrar-vanilla-voyage', 'maison-asrar-oh-honey',
  'maison-asrar-tornado', 'maison-asrar-hilm', 'french-avenue-liquid-brun', 'french-avenue-eclair-affair',
  'french-avenue-aromatix-xandal', 'riiffs-fleurie-emerald', 'riiffs-golden-elixir', 'musk-pina-colada'
]);

function categoriesFor(slug) {
  if (slug.endsWith('-air-spray')) return ['casa'];
  if (slug.endsWith('-set')) return ['set-regalo'];
  const cats = [];
  const g = genderBySlug.get(slug) || 'unisex';
  cats.push(g); // uomo | donna | unisex
  if (OUD.has(slug)) cats.push('oud');
  if (GOURMAND.has(slug)) cats.push('gourmand');
  return cats;
}

async function main() {
  console.log(`\n🌙 Ristrutturazione categorie ${DRY_RUN ? '(DRY RUN)' : ''}\n`);

  // 1) upsert categorie target + nascondi le vuote
  if (!DRY_RUN) {
    for (const c of TARGET_CATS) {
      await supabase.from('categories').upsert({ ...c, is_visible: true }, { onConflict: 'slug' });
    }
    await supabase.from('categories').update({ is_visible: false }).in('slug', HIDE_CATS);
  }
  console.log('Categorie visibili:', TARGET_CATS.map((c) => c.slug).join(', '));
  console.log('Categorie nascoste:', HIDE_CATS.join(', '), '\n');

  // 2) mappa slug->id categorie
  const { data: cats } = await supabase.from('categories').select('id, slug');
  const catId = new Map(cats.map((c) => [c.slug, c.id]));

  // 3) prodotti pubblicati
  const { data: prods } = await supabase.from('products').select('id, slug, name').is('deleted_at', null).eq('status', 'published');
  const counts = {};
  for (const p of prods) {
    const slugs = categoriesFor(p.slug);
    slugs.forEach((s) => (counts[s] = (counts[s] || 0) + 1));
    if (DRY_RUN) { console.log(`• ${p.slug} → ${slugs.join(', ')}`); continue; }
    const ids = slugs.map((s) => catId.get(s)).filter(Boolean);
    await supabase.from('product_categories').delete().eq('product_id', p.id);
    if (ids.length) await supabase.from('product_categories').insert(ids.map((category_id) => ({ product_id: p.id, category_id })));
  }

  console.log('\nDistribuzione per categoria:');
  for (const c of TARGET_CATS) console.log(`  ${c.slug}: ${counts[c.slug] || 0}`);
  console.log(`\n✅ ${DRY_RUN ? 'Simulazione' : 'Ristrutturazione'} completata su ${prods.length} prodotti.\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
