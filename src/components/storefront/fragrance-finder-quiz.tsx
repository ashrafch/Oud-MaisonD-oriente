'use client';

import { useMemo, useState } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { ProductCard } from '@/components/product/product-card';
import type { Product } from '@/types/catalog';

type Answers = { gender?: string; family?: string; intensity?: string };

const questions = [
  {
    key: 'gender',
    label: 'Per chi è?',
    options: [
      { label: 'Per lui', value: 'uomo' },
      { label: 'Per lei', value: 'donna' },
      { label: 'Indifferente', value: 'unisex' }
    ]
  },
  {
    key: 'family',
    label: 'Che carattere ami?',
    options: [
      { label: 'Oud & Legnosi', value: 'oud' },
      { label: 'Gourmand & Dolce', value: 'gourmand' },
      { label: 'Fresco & Floreale', value: 'fresco' }
    ]
  },
  {
    key: 'intensity',
    label: 'Quanta presenza vuoi?',
    options: [
      { label: 'Discreta', value: 'Morbido' },
      { label: 'Decisa', value: 'Intenso' },
      { label: 'Da protagonista', value: 'Molto intenso' }
    ]
  }
] as const;

const INTENSITY_RANK: Record<string, number> = { Morbido: 1, Intenso: 2, 'Molto intenso': 3 };

export function FragranceFinderQuiz({ products }: { products: Product[] }) {
  const [answers, setAnswers] = useState<Answers>({});

  // Solo profumi indossabili: escludiamo profumatori d'ambiente e set regalo
  const wearable = useMemo(
    () => products.filter((p) => !p.categories.includes('casa') && !p.categories.includes('set-regalo')),
    [products]
  );

  const results = useMemo(() => {
    const answered = Boolean(answers.gender || answers.family || answers.intensity);
    const scored = wearable
      .map((p) => {
        let score = 0;
        // Gender
        if (answers.gender === 'uomo') score += p.categories.includes('uomo') ? 3 : p.gender === 'unisex' ? 1 : 0;
        else if (answers.gender === 'donna') score += p.categories.includes('donna') ? 3 : p.gender === 'unisex' ? 1 : 0;
        else if (answers.gender === 'unisex') score += p.categories.includes('unisex') ? 2 : 1;
        // Famiglia olfattiva
        if (answers.family === 'oud') score += p.categories.includes('oud') ? 3 : 0;
        else if (answers.family === 'gourmand') score += p.categories.includes('gourmand') ? 3 : 0;
        else if (answers.family === 'fresco')
          score += !p.categories.includes('oud') && !p.categories.includes('gourmand') ? 3 : 0;
        // Intensità (match esatto o adiacente)
        if (answers.intensity) {
          const want = INTENSITY_RANK[answers.intensity] ?? 2;
          const have = INTENSITY_RANK[p.intensity] ?? 2;
          const diff = Math.abs(want - have);
          score += diff === 0 ? 2 : diff === 1 ? 0.75 : 0;
        }
        // Bonus qualità di catalogo
        if (p.tags.includes('bestseller')) score += 0.4;
        if (p.stock > 0) score += 0.2;
        return { product: p, score };
      })
      .sort((a, b) => b.score - a.score);

    if (!answered) {
      return wearable
        .filter((p) => p.tags.includes('bestseller') || p.tags.includes('nuovo'))
        .slice(0, 3);
    }
    return scored.slice(0, 3).map((s) => s.product);
  }, [answers, wearable]);

  const answered = Boolean(answers.gender || answers.family || answers.intensity);

  return (
    <section className="bg-white py-12 sm:py-14">
      <div className="container">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-oud">
              <Sparkles size={18} /> Finder olfattivo
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Trova la tua fragranza in pochi tocchi</h2>
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

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <div className="rounded border border-saffron/18 bg-cream/70 p-5 shadow-sm sm:p-6">
            <div className="grid gap-5">
              {questions.map((question) => (
                <div key={question.key}>
                  <p className="text-sm font-semibold">{question.label}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {question.options.map((option) => (
                      <button
                        key={option.value}
                        className={`min-h-10 rounded border px-4 text-sm font-semibold transition ${
                          answers[question.key as keyof Answers] === option.value
                            ? 'border-oud bg-oud text-white'
                            : 'border-ink/12 bg-cream hover:bg-mist'
                        }`}
                        onClick={() =>
                          setAnswers((current) => ({ ...current, [question.key]: option.value }))
                        }
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-ink/55">
              {answered
                ? 'Ecco le fragranze del nostro catalogo più vicine ai tuoi gusti.'
                : 'Rispondi alle domande: filtriamo il catalogo reale in base a genere, famiglia olfattiva e intensità.'}
            </p>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink/45">
              {answered ? 'La tua selezione' : 'I più amati'}
            </p>
            {results.length ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded border border-dashed border-ink/20 bg-cream/60 p-8 text-center text-sm text-ink/60">
                Nessuna corrispondenza esatta: prova a cambiare una risposta.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
