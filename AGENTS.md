# AGENTS.md

Questo file è l'unica fonte di verità per chiunque (umano o AI) lavori su questo progetto.
Leggilo prima di qualsiasi intervento. Seguilo senza eccezioni.

---

## Progetto

OUDÉ Maison D'Oriente — ecommerce boutique profumeria araba.
Deve sembrare una boutique reale: elegante, orientale, calda, premium ma accessibile.
Evitare estetiche generiche e sovraccariche.

**Stack:** Next.js 15 App Router · TypeScript strict · Tailwind CSS · Supabase · Stripe · Resend · Vercel  
**Documentazione operativa completa:** `docs/PROJECT_CHECKLIST.md` (aggiornare sempre dopo ogni modifica significativa)

---

## Regole sviluppo

- Preferire Server Components. Usare `'use client'` solo dove c'è interazione reale.
- Validare input critici con Zod. Proteggere ogni API admin con `requireAdminApiSession()`.
- Non esporre mai env secrets lato client (`NEXT_PUBLIC_*` sono pubbliche per definizione).
- Il pannello admin deve restare semplice per una persona non tecnica: card, badge, empty state chiari.
- Gli asset brand sono in `public/brand/` e non vanno toccati senza esplicita richiesta.
- Naming separato e coerente per domini: `storefront`, `admin`, `cart`, `email`, `stripe`, `supabase`.
- Non aggiungere dipendenze npm senza necessità reale. Preferire utility native o già presenti.
- TypeScript strict: nessun `any` esplicito, tipizzare sempre. Eseguire `npx tsc --noEmit` prima di ogni commit.
- Nessun commento ovvio. Solo commenti per WHY non ovvi o workaround.

---

## Workflow Git

### Branch strategy

| Branch | Scopo |
| -------- | ------- |
| `main` | Produzione. Ogni push trigghera deploy Vercel Production automatico. |
| `feat/<nome>` | Nuova feature. Aprire da `main`, unire con PR o merge diretto dopo validazione Preview. |
| `fix/<nome>` | Bugfix urgente. Può andare direttamente su `main` se il fix è piccolo e testato. |

### Ciclo completo per feature nuova

```bash
# 1. Partire da main aggiornato
git checkout main && git pull origin main

# 2. Creare branch feature
git checkout -b feat/nome-feature

# 3. Sviluppare, committare spesso
git add <file specifici>
git commit -m "feat: descrizione concisa"

# 4. Pushare per avere Preview Vercel
git push origin feat/nome-feature

# 5. Aprire PR su GitHub → Vercel genera automaticamente una Preview URL
# Testare la Preview URL prima di procedere

# 6. Dopo validazione: merge su main
git checkout main
git merge feat/nome-feature
git push origin main  # → deploy Production automatico

# 7. Cancellare branch locale
git branch -d feat/nome-feature
```

### Fix piccoli e urgenti (hotfix)

```bash
git add <file>
git commit -m "fix: descrizione"
git push origin main
```

### Regole commit

- Formato: `tipo: descrizione breve` (max 72 caratteri sul titolo)
- Tipi: `feat` · `fix` · `refactor` · `docs` · `style` · `chore`
- Corpo opzionale per spiegare WHY, non WHAT
- Non usare `--no-verify` e non bypassare hook

---

## Workflow Vercel

### Ambienti

| Ambiente | Trigger | URL |
| ---------- | --------- | ----- |
| **Production** | Push su `main` | `https://oud-maison-d-oriente.vercel.app` |
| **Preview** | Push su qualsiasi branch diverso da `main` | URL univoca generata da Vercel per branch/commit |

### Regola fondamentale

> Ogni feature significativa va testata in Preview prima di andare in Production.
> Solo dopo validazione esplicita si fa merge su `main`.

### Env vars

- Gestite da **Vercel Dashboard → Settings → Environment Variables**
- Le variabili `SUPABASE_*`, `STRIPE_*`, `RESEND_*` devono essere presenti in tutti gli ambienti necessari
- Dopo aver aggiunto/modificato una env var: **Redeploy** manuale dal pannello Vercel oppure nuovo push
- Non committare mai valori reali nel codice. Usare `.env.local` in locale (già in `.gitignore`)

### Variabili critiche attualmente configurate

| Variabile | Dove |
| ----------- | ------ |
| `SUPABASE_URL` | Production + Preview |
| `SUPABASE_ANON_KEY` | Production + Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | Production + Preview |
| `SUPABASE_STORAGE_BUCKET` | Production + Preview (valore: `product-images`) |
| `STRIPE_SECRET_KEY` | Production (live) · Preview (test) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Production (live) · Preview (test) |
| `STRIPE_WEBHOOK_SECRET` | Production · Preview (valori separati) |
| `RESEND_API_KEY` | Production + Preview |
| `ORDER_NOTIFICATION_EMAIL` | Production (`Oude.oriente@gmail.com`) |
| `ADMIN_AUTH_ENABLED` | Production + Preview (true) |
| `NEXTAUTH_SECRET` / `NEXT_PUBLIC_SITE_URL` | Production |

---

## Workflow Supabase

- Migrazioni SQL in `supabase/migrations/` — eseguire manualmente nel SQL Editor di Supabase
- Non modificare tabelle esistenti senza migration file versionata
- Usare sempre `createSupabaseServiceClient()` lato server per operazioni admin
- Usare `createSupabaseClient()` lato client solo per operazioni utente autenticate
- RLS attive su tutte le tabelle — verificare sempre che le policy non blocchino operazioni legittime

---

## Autorizzazioni operative per l'agente AI

L'agente può e deve eseguire autonomamente, senza chiedere conferma:

- `git add` · `git commit` · `git push origin main` dopo ogni modifica completata e verificata
- `npx tsc --noEmit` per verifica typecheck
- Lettura di qualsiasi file del progetto
- Scrittura/modifica di file sorgente, documentazione, configurazione

L'agente deve chiedere conferma prima di:

- `git push --force` o operazioni distruttive su branch remoti
- Modifiche a `.env.local` o file con credenziali
- Operazioni dirette su database di produzione Supabase (DROP, DELETE massivi)
- Deploy manuali da CLI Vercel in ambienti production

---

## Struttura progetto

```text
src/
  app/
    (storefront)/       — pagine pubbliche Next.js
    (admin)/admin/      — pannello admin protetto
    api/
      admin/            — API admin protette (requireAdminApiSession)
      webhooks/         — Stripe e PayPal webhooks
      settings/         — API configurazioni (spedizione, etc.)
  components/
    admin/              — componenti pannello admin
    storefront/         — componenti storefront
    product/            — componenti scheda/card prodotto
    ui/                 — componenti UI generici
  lib/
    cart/               — store Zustand + calcoli carrello + shipping config
    supabase/           — client, catalog, orders, admin-products, fulfillment
    stripe/             — server Stripe
    email/              — Resend email templates
    admin/              — auth admin
public/
  brand/                — logo, immagini brand (non toccare)
docs/
  PROJECT_CHECKLIST.md  — stato avanzamento progetto (aggiornare sempre)
supabase/
  migrations/           — SQL migrations versionate
```

---

## Aree sensibili — attenzione extra

| Area | Perché |
| ------ | -------- |
| `src/lib/stripe/` · `src/app/api/webhooks/stripe/` | Gestione pagamenti reali. Testare solo in Preview con chiavi test. |
| `src/lib/supabase/orders.ts` | Crea ordini e muove stock. Ogni modifica impatta dati reali. |
| `src/lib/supabase/fulfillment.ts` | Scarica e ripristina stock. Idempotenza critica. |
| `src/lib/email/order-email.ts` | Invia email a clienti reali in Production. |
| `src/lib/admin/auth.ts` | Protezione accesso admin. Non indebolire mai. |

---

## Prima di ogni sessione di lavoro

1. `git pull origin main` — assicurarsi di avere l'ultimo codice
2. Leggere `docs/PROJECT_CHECKLIST.md` per capire lo stato attuale
3. Leggere questo file se ci sono dubbi su workflow o struttura

## Dopo ogni sessione di lavoro

1. `npx tsc --noEmit` — zero errori TypeScript
2. `git add <file> && git commit -m "tipo: descrizione"` — commit atomici e descrittivi
3. `git push origin main` — deploy automatico Vercel Production
4. Aggiornare `docs/PROJECT_CHECKLIST.md` se è cambiato qualcosa di significativo

---

## Priorità sviluppo correnti

1. Testare upload immagini prodotto in Production (dopo fix env SUPABASE_STORAGE_BUCKET)
2. Verificare dominio mittente Resend e sostituire `onboarding@resend.dev`
3. Inserire dati fiscali reali (`NEXT_PUBLIC_BUSINESS_FISCAL_DATA`)
4. Testare cancellazione, fallimento e rimborso Stripe in Production
5. Configurare account PayPal Business e credenziali sandbox
6. Collegare dominio custom e aggiornare `NEXT_PUBLIC_SITE_URL`
7. Rafforzare RLS Supabase prima di aprire account pubblici clienti
