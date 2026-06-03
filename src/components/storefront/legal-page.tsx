import Link from 'next/link';

export type LegalSection = {
  title: string;
  body: string[];
};

export type LegalPageContent = {
  title: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
};

export function LegalPage({ content }: { content: LegalPageContent }) {
  return (
    <section className="container py-12 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded border border-ink/10 bg-white p-5">
          <p className="text-sm font-semibold uppercase tracking-widest text-oud">Informazioni</p>
          <nav className="mt-4 grid gap-2 text-sm font-semibold text-ink/65">
            <Link href="/terms">Termini</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/shipping">Spedizioni</Link>
            <Link href="/returns">Resi</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contatti</Link>
          </nav>
        </aside>
        <article className="rounded border border-ink/10 bg-white p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-oud">Ultimo aggiornamento: {content.updatedAt}</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">{content.title}</h1>
          <p className="mt-5 max-w-3xl leading-7 text-ink/68">{content.intro}</p>
          <div className="mt-8 grid gap-7">
            {content.sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-serif text-2xl sm:text-3xl">{section.title}</h2>
                <div className="mt-3 grid gap-3 text-sm leading-7 text-ink/68 sm:text-base">
                  {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
