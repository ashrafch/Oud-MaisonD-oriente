'use client';

import { useMemo, useState } from 'react';
import { Sparkles, RotateCcw, Wand2 } from 'lucide-react';
import { ProductCard } from '@/components/product/product-card';
import type { Product } from '@/types/catalog';

type Answers = { gender?: string; family?: string; intensity?: string; occasion?: string };

const questions = [
  {
    key: 'gender',
    label: 'Per chi la cerchi?',
    options: [
      { label: 'Per lui', value: 'uomo' },
      { label: 'Per lei', value: 'donna' },
      { label: 'Indifferente', value: 'unisex' }
    ]
  },
  {
    key: 'family',
    label: 'Che carattere ti rappresenta?',
    options: [
      { label: 'Oud & Legnosi', value: 'oud' },
      { label: 'Gourmand & Dolce', value: 'gourmand' },
      { label: 'Fresco & Floreale', value: 'fresco' }
    ]
  },
  {
    key: 'intensity',
    label: 'Quanta presenza vuoi avere?',
    options: [
      { label: 'Discreta', value: 'Morbido' },
      { label: 'Decisa', value: 'Intenso' },
      { label: 'Da protagonista', value: 'Molto intenso' }
    ]
  },
  {
    key: 'occasion',
    label: 'Quando la indosserai?',
    options: [
      { label: 'Di giorno', value: 'giorno' },
      { label: 'Di sera', value: 'sera' },
      { label: 'Ogni occasione', value: 'ogni' }
    ]
  }
] as const;

const INTENSITY_RANK: Record<string, number> = { Delicato: 1, Morbido: 1, Intenso: 2, 'Molto intenso': 3 };
const FAMILY_LABEL: Record<string, string> = { oud: 'Oud & Legnosi', gourmand: 'Gourmand & Dolci', fresco: 'Fresco & Floreale' };
const INTENSITY_LABEL: Record<string, string> = { Morbido: 'discreta', Intenso: 'decisa', 'Molto intenso': 'da protagonista' };
const OCCASION_LABEL: Record<string, string> = { giorno: 'da giorno', sera: 'da sera', ogni: 'per ogni occasione' };

function occasionScore(product: Product, occ: string) {
  const intense = ['Intenso', 'Molto intenso'].includes(product.intensity);
  const soft = ['Delicato', 'Morbido'].includes(product.intensity);
  const warm = product.categories.includes('oud') || product.categories.includes('gourmand');
  if (occ === 'sera') return (intense ? 1 : 0) + (warm ? 0.5 : 0);
  if (occ === 'giorno') return (soft || product.intensity === 'Intenso' ? 0.9 : 0) + (!product.categories.includes('oud') ? 0.6 : 0);
  if (occ === 'ogni') return 0.9;
  return 0;
}

export function FragranceFinderQuiz({ products }: { products: Product[] }) {
  const [answers, setAnswers] = useState<Answers>({});
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const answered = answeredCount > 0;

  const wearable = useMemo(
    () => products.filter((p) => !p.categories.includes('casa') && !p.categories.includes('set-regalo')),
    [products]
  );

  const results = useMemo(() => {
    if (!answered) {
      return wearable
        .filter((p) => p.tags.includes('bestseller') || p.tags.includes('nuovo'))
        .slice(0, 3)
        .map((product) => ({ product, affinity: null as number | null }));
    }
    return wearable
      .map((p) => {
        let score = 0;
        let max = 0;
        if (answers.gender) {
          max += 3;
          if (answers.gender === 'unisex') score += p.categories.includes('unisex') ? 3 : 1.5;
          else score += p.categories.includes(answers.gender) ? 3 : p.gender === 'unisex' ? 1.5 : 0;
        }
        if (answers.family) {
          max += 3;
          if (answers.family === 'oud') score += p.categories.includes('oud') ? 3 : 0;
          else if (answers.family === 'gourmand') score += p.categories.includes('gourmand') ? 3 : 0;
          else score += !p.categories.includes('oud') && !p.categories.includes('gourmand') ? 3 : 0;
        }
        if (answers.intensity) {
          max += 2;
          const diff = Math.abs((INTENSITY_RANK[answers.intensity] ?? 2) - (INTENSITY_RANK[p.intensity] ?? 2));
          score += diff === 0 ? 2 : diff === 1 ? 1 : 0;
        }
        if (answers.occasion) {
          max += 1.5;
          score += occasionScore(p, answers.occasion);
        }
        const affinity = max > 0 ? Math.round((score / max) * 100) : 0;
        const tieBonus = (p.tags.includes('bestseller') ? 0.3 : 0) + (p.stock > 0 ? 0.1 : 0);
        return { product: p, affinity, rank: score + tieBonus };
      })
      .sort((a, b) => b.rank - a.rank)
      .slice(0, 3)
      .map(({ product, affinity }) => ({ product, affinity }));
  }, [answers, answered, wearable]);

  const profileSubtitle = useMemo(() => {
    if (!answered) return '';
    const parts: string[] = [];
    if (answers.family) parts.push(FAMILY_LABEL[answers.family].toLowerCase());
    if (answers.intensity) parts.push(`presenza ${INTENSITY_LABEL[answers.intensity]}`);
    if (answers.occasion) parts.push(OCCASION_LABEL[answers.occasion]);
    const who = answers.gender === 'uomo' ? 'per lui' : answers.gender === 'donna' ? 'per lei' : answers.gender === 'unisex' ? 'versatile' : '';
    return `Cerchi una fragranza ${parts.join(', ')}${who ? `, ${who}` : ''}. Ecco le nostre proposte più affini a te.`;
  }, [answers, answered]);

  return (
    <section className="bg-white py-12 sm:py-14">
      <div className="container">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-oud">
              <Sparkles size={18} /> Finder olfattivo
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">La tua firma olfattiva, su misura</h2>
          </div>
          {answered ? (
            <button
              onClick={() => setAnswers({})}
              className="inline-flex items-center gap-2 self-start rounded border border-ink/12 px-4 py-2 text-sm font-semibold text-ink/70 transition hover:bg-mist sm:self-auto"
            >
              <RotateCcw size={15} /> Ricomincia
            </button>
          ) : null}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-10">
          <div className="rounded-2xl border border-saffron/18 bg-cream/70 p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink/45">Il tuo profilo</p>
              <span className="text-xs font-semibold text-oud">{answeredCount}/4</span>
            </div>
            <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-ink/8">
              <div className="h-full rounded-full bg-oud transition-all duration-500" style={{ width: `${(answeredCount / 4) * 100}%` }} />
            </div>
            <div className="grid gap-5">
              {questions.map((question) => (
                <div key={question.key}>
                  <p className="text-sm font-semibold">{question.label}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {question.options.map((option) => (
                      <button
                        key={option.value}
                        className={`min-h-10 rounded-full border px-4 text-sm font-semibold transition ${
                          answers[question.key as keyof Answers] === option.value
                            ? 'border-oud bg-oud text-white shadow-sm'
                            : 'border-ink/12 bg-white hover:border-oud/35 hover:bg-mist'
                        }`}
                        onClick={() => setAnswers((current) => ({ ...current, [question.key]: option.value }))}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {answered ? (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-oud/15 bg-oud/[0.04] p-4 sm:p-5">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-oud/10 text-oud"><Wand2 size={18} /></span>
                <div>
                  <p className="font-serif text-xl text-ink sm:text-2xl">La selezione pensata per te</p>
                  <p className="mt-1 text-sm leading-6 text-ink/65">{profileSubtitle}</p>
                </div>
              </div>
            ) : (
              <p className="mb-5 text-sm leading-6 text-ink/60">
                Rispondi alle domande: analizziamo genere, famiglia olfattiva, intensità e occasione per calcolare l&apos;affinità con ogni fragranza del catalogo. Intanto, ecco i più amati.
              </p>
            )}

            {results.length ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.map(({ product, affinity }, index) => (
                  <div key={product.id} className="relative">
                    {affinity !== null ? (
                      <span
                        className={`absolute -top-2 left-1/2 z-10 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
                          index === 0 ? 'bg-oud text-white' : 'bg-cream text-oud ring-1 ring-oud/25'
                        }`}
                      >
                        {affinity}% affinità
                      </span>
                    ) : null}
                    <div className={affinity !== null ? 'pt-2' : ''}>
                      <ProductCard product={product} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-ink/20 bg-cream/60 p-8 text-center text-sm text-ink/60">
                Nessuna corrispondenza esatta: prova a cambiare una risposta.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
