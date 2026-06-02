import { CheckCircle2, CircleDashed } from 'lucide-react';

const checklist = [
  ['Supabase URL e anon key', 'NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY'],
  ['Supabase service role solo server', 'SUPABASE_SERVICE_ROLE_KEY'],
  ['Stripe secret e webhook', 'STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET'],
  ['Dominio produzione', 'NEXT_PUBLIC_SITE_URL'],
  ['Email transazionali', 'RESEND_API_KEY'],
  ['WhatsApp assistenza', 'NEXT_PUBLIC_WHATSAPP_NUMBER']
];

export function ProductionSettings() {
  return (
    <section>
      <h1 className="font-serif text-4xl sm:text-5xl">Impostazioni</h1>
      <p className="mt-3 max-w-2xl text-ink/60">Checklist operativa per passare da demo locale a produzione Vercel + Supabase + Stripe.</p>
      <div className="mt-8 grid gap-4">
        {checklist.map(([label, env]) => {
          const configured = env.split(', ').every((key) => Boolean(process.env[key]));
          return (
            <article key={label} className="flex flex-col gap-3 rounded border border-ink/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">{label}</p>
                <p className="mt-1 text-sm text-ink/50">{env}</p>
              </div>
              <span className={`inline-flex items-center gap-2 rounded px-3 py-1 text-sm font-semibold ${configured ? 'bg-sage/12 text-sage' : 'bg-saffron/14 text-bark'}`}>
                {configured ? <CheckCircle2 size={16} /> : <CircleDashed size={16} />} {configured ? 'Configurato' : 'Da configurare'}
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
