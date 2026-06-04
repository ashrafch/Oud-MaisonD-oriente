# AGENTS.md

## Visione

OUDE Maison D'Oriente deve sembrare una boutique reale: elegante, orientale, calda, premium ma accessibile. Evitare estetiche generiche e sovraccariche.

## Regole sviluppo

- Preferire componenti server, usare client component solo per interazioni reali.
- Mantenere naming chiaro e domini separati: storefront, admin, ecommerce, servizi, validazioni.
- Non esporre mai chiavi segrete lato client.
- Validare input critici con Zod e proteggere operazioni admin server-side.
- Tenere il gestionale semplice per una persona non tecnica: card, badge, filtri comprensibili, empty state chiari.
- Gli asset brand sono in `public/brand` e sono gia puliti dai numeri slider.
- Workflow Vercel: ogni nuovo sviluppo va testato prima in Preview. Si pubblica/promuove in Production solo dopo validazione esplicita del funzionamento.

## Priorita prossime

1. Configurare Resend e testare email ordine cliente/proprietario.
2. Inserire dati fiscali e contatti reali.
3. Testare upload immagini e ordine manuale su Vercel Production.
4. Configurare Stripe in Preview, validare checkout/webhook e poi promuovere in Production.
5. Scrivere policy RLS piu complete per dati cliente e ordini prima degli account pubblici.
6. Aggiungere test smoke per pagine principali, checkout e webhook.
