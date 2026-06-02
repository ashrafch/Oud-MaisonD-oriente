# AGENTS.md

## Visione

OUDÉ Maison D'Oriente deve sembrare una boutique reale: elegante, orientale, calda, premium ma accessibile. Evitare estetiche generiche e sovraccariche.

## Regole sviluppo

- Preferire componenti server, usare client component solo per interazioni reali.
- Mantenere naming chiaro e domini separati: storefront, admin, ecommerce, servizi, validazioni.
- Non esporre mai chiavi segrete lato client.
- Validare input critici con Zod e proteggere operazioni admin server-side.
- Tenere il gestionale semplice per una persona non tecnica: card, badge, filtri comprensibili, empty state chiari.
- Gli asset brand sono in `public/brand` e sono già puliti dai numeri slider.

## Priorità prossime

1. Collegare Supabase con auth admin/staff/customer.
2. Implementare CRUD prodotti reale.
3. Collegare carrello a Zustand/localStorage e Stripe con prodotti dinamici.
4. Scrivere policy RLS complete per ordini, clienti, wishlist e admin.
5. Aggiungere test di smoke per pagine principali e webhook.
