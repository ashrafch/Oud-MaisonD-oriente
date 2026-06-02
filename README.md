# OUDÉ Maison D'Oriente Ecommerce

Base ecommerce professionale per profumi arabi, oud, musk, attar, bakhoor, gift box e accessori boutique.

## Stack

- Next.js App Router, TypeScript, React, Tailwind CSS
- Supabase PostgreSQL/Auth/Storage predisposto
- Stripe Checkout e webhook predisposti
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
- `src/app/api`: checkout Stripe e webhook
- `src/components`: UI, layout, product card e storefront
- `src/lib`: Supabase, Stripe, validazioni, SEO, carrello
- `src/data`: seed demo TypeScript per UI
- `supabase/migrations`: schema PostgreSQL iniziale
- `docs`: specifica originale e roadmap

## Deploy

1. Crea repo GitHub e collega il progetto a Vercel.
2. Crea progetto Supabase, applica `supabase/migrations/001_initial_schema.sql` e poi `supabase/seed.sql`.
3. Configura le variabili in `.env.example` su Vercel.
4. Configura Stripe Checkout e il webhook `/api/webhooks/stripe`.
5. Aggiorna testi legali, policy spedizione/resi e numero WhatsApp.

## Roadmap

- MVP: catalogo, schede prodotto, carrello persistente, checkout Stripe, dashboard admin leggibile.
- V1: CRUD completo con Supabase, upload immagini, ordini reali, inventario e email Resend.
- V2: recensioni, coupon avanzati, calendario social, analytics, pixel, PWA e automazioni marketing.
