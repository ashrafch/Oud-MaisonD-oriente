'use client';

import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ProductCard } from '@/components/product/product-card';
import { products } from '@/data/catalog';

const questions = [
  { key: 'mood', label: 'Che atmosfera cerchi?', options: ['Elegante', 'Pulita', 'Calda', 'Rituale'] },
  { key: 'intensity', label: 'Quanto deve farsi notare?', options: ['Morbido', 'Medio', 'Intenso'] },
  { key: 'occasion', label: 'Per quale occasione?', options: ['Ogni giorno', 'Sera', 'Regalo'] }
];

export function FragranceFinderQuiz() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const recommendation = useMemo(() => {
    if (answers.mood === 'Pulita') return products.find((product) => product.category === 'musk');
    if (answers.mood === 'Rituale') return products.find((product) => product.category === 'bakhoor');
    if (answers.occasion === 'Regalo') return products.find((product) => product.tags.includes('gift'));
    if (answers.intensity === 'Intenso') return products.find((product) => product.category === 'oud');
    return products[0];
  }, [answers]);

  return (
    <section className="bg-white py-12 sm:py-14">
      <div className="container grid items-start gap-6 lg:grid-cols-[0.78fr_0.62fr] lg:justify-between">
        <div className="rounded border border-saffron/18 bg-cream/70 p-5 shadow-sm sm:p-6">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-oud"><Sparkles size={18} /> Finder olfattivo</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Trova la tua fragranza in pochi tocchi</h2>
          <div className="mt-6 grid gap-4">
            {questions.map((question) => (
              <div key={question.key}>
                <p className="text-sm font-semibold">{question.label}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {question.options.map((option) => (
                    <button key={option} className={`min-h-10 rounded border px-4 text-sm font-semibold transition ${answers[question.key] === option ? 'border-oud bg-oud text-white' : 'border-ink/12 bg-cream hover:bg-mist'}`} onClick={() => setAnswers((current) => ({ ...current, [question.key]: option }))}>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto w-full max-w-sm lg:max-w-[360px]">
          {recommendation ? <ProductCard product={recommendation} /> : null}
        </div>
      </div>
    </section>
  );
}
