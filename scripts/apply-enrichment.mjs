// Applica l'arricchimento (descrizioni + piramidi olfattive verificate su Fragrantica)
// ai prodotti già importati. Aggiorna via service-role: short_description,
// seo_description, top/heart/base notes, gender, intensity — match per slug.
//
// Uso:  node scripts/apply-enrichment.mjs <sourceDir>
//   <sourceDir> = cartella con i file enrich-*.json (default: scripts/enrichment-src).
// Consolida i frammenti in scripts/enrichment.json (storicizzato) e poi aggiorna il DB.

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC_DIR = process.argv[2] || join(__dirname, 'enrichment-src');
const CONSOLIDATED = join(__dirname, 'enrichment.json');
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

// 1) consolida i frammenti enrich-*.json (se presenti) in enrichment.json
let entries = [];
if (existsSync(SRC_DIR)) {
  const files = readdirSync(SRC_DIR).filter((f) => /^enrich-.*\.json$/.test(f)).sort();
  for (const f of files) entries.push(...JSON.parse(readFileSync(join(SRC_DIR, f), 'utf8')));
  if (entries.length) writeFileSync(CONSOLIDATED, JSON.stringify(entries, null, 2));
}
if (!entries.length && existsSync(CONSOLIDATED)) {
  entries = JSON.parse(readFileSync(CONSOLIDATED, 'utf8'));
}
if (!entries.length) { console.error('❌ Nessun dato di arricchimento trovato.'); process.exit(1); }

console.log(`\n🌙 Arricchimento OUDÉ — ${entries.length} prodotti ${DRY_RUN ? '(DRY RUN)' : ''}\n`);

let ok = 0, fail = 0, notFound = 0;
for (const e of entries) {
  const patch = {
    short_description: e.shortDescription,
    seo_description: e.shortDescription,
    top_notes: e.notesTop ?? [],
    heart_notes: e.notesHeart ?? [],
    base_notes: e.notesBase ?? [],
    gender: e.gender,
    intensity: e.intensity,
    updated_at: new Date().toISOString()
  };
  if (DRY_RUN) { console.log(`• ${e.slug} → ${e.gender}/${e.intensity} (${(e.notesTop||[]).length}+${(e.notesHeart||[]).length}+${(e.notesBase||[]).length} note)`); ok++; continue; }
  const { data, error } = await supabase.from('products').update(patch).eq('slug', e.slug).is('deleted_at', null).select('id');
  if (error) { console.log(`• ${e.slug} ❌ ${error.message}`); fail++; continue; }
  if (!data || !data.length) { console.log(`• ${e.slug} ⚠️  slug non trovato`); notFound++; continue; }
  console.log(`• ${e.slug} ✓`);
  ok++;
}
console.log(`\n✅ Aggiornati: ${ok}${fail ? `, errori: ${fail}` : ''}${notFound ? `, non trovati: ${notFound}` : ''}\n`);
