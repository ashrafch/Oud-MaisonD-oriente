# OUDÉ Maison D'Oriente Ecommerce

Base ecommerce professionale per profumi arabi, oud, musk, attar, bakhoor, gift box e accessori boutique.

## Stack

- Next.js App Router, TypeScript, React, Tailwind CSS
- Supabase PostgreSQL/Auth/Storage predisposto
- Stripe Checkout attivo con webhook; PayPal Checkout predisposto
- Zod, Zustand, TanStack Table-ready, React Hook Form-ready
- SEO con metadata, sitemap, robots e JSON-LD Product/Organization

## Avvio locale

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Struttura

- `src/app/(storefront)`: pagine pubbliche ecommerce
- `src/app/(admin)/admin`: gestionale negoziante
- `src/app/api`: checkout, webhook Stripe e webhook PayPal
- `src/components`: UI, layout, product card e storefront
- `src/lib`: Supabase, Stripe, PayPal, validazioni, SEO, carrello
- `src/data`: seed demo TypeScript per UI
- `supabase/migrations`: schema PostgreSQL iniziale
- `docs`: specifica originale e roadmap

## Documentazione

- `docs/PROJECT_CHECKLIST.md`: documento unico con stato progetto, checklist produzione, roadmap, cose fatte, predisposte e mancanti.
- `docs/FUNCTIONAL_GUIDE.md`: guida completa a tutte le funzionalita e come usarle.
- `docs/SUPABASE_ADMIN_AUTH.md`: guida specifica per accesso admin/super admin.

## Deploy

1. Crea repo GitHub e collega il progetto a Vercel.
2. Crea progetto Supabase, applica `supabase/migrations/001_initial_schema.sql` e poi `supabase/seed.sql`.
3. Configura le variabili in `.env.example` su Vercel.
4. Configura Stripe Checkout e il webhook `/api/webhooks/stripe` con chiavi test in Preview e chiavi live in Production.
5. Configura PayPal Checkout e il webhook `/api/webhooks/paypal`.
6. Aggiorna testi legali, policy spedizione/resi e numero WhatsApp.

## Roadmap e stato

La roadmap e lo stato produzione sono mantenuti in `docs/PROJECT_CHECKLIST.md`.
