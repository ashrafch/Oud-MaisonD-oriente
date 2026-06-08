# Project checklist e quadro produzione

Ultimo aggiornamento: 08/06/2026

Questo e il documento unico per capire lo stato del progetto OUDÉ Maison D'Oriente Ecommerce: cosa e completato, cosa e predisposto, cosa manca prima della produzione e cosa conviene sviluppare dopo.

Documenti collegati:

- `docs/FUNCTIONAL_GUIDE.md`: guida operativa per usare storefront, admin, checkout, Supabase e email.
- `docs/SUPABASE_ADMIN_AUTH.md`: procedura specifica per login admin/super admin.
- `README.md`: setup rapido, stack e link documentazione.

## Stato sintetico

- [x] Storefront responsive e professionale.
- [x] Catalogo e schede prodotto collegate a Supabase con fallback locale.
- [x] Carrello persistente funzionante con prodotti Supabase, drawer, pagina carrello e checkout.
- [x] Wishlist, prodotti visti di recente, quick view, finder olfattivo e bundle builder.
- [x] Checkout manuale assistito con salvataggio ordine su Supabase.
- [x] Coupon reali letti da Supabase in carrello/drawer/checkout.
- [x] Admin protetto con Supabase Auth e ruoli `super_admin`/`admin`.
- [x] Area configurazione tecnica separata e visibile solo al `super_admin`.
- [x] Admin operativo per dashboard, prodotti, categorie, collezioni, ordini, clienti, inventario, coupon, contenuti e social.
- [x] Upload immagini prodotto su Supabase Storage quando le env sono configurate.
- [x] Email ordine/notifica proprietario predisposte con Resend.
- [x] Pagine legali/informative complete in versione pre-produzione.
- [x] Build Next.js verificata localmente.
- [x] Vercel configurato con deployment Production Ready.
- [ ] Stripe non ancora configurato.
- [x] PayPal predisposto lato codice, API e checkout ma non ancora configurato con account.
- [x] Resend attivo in test con `onboarding@resend.dev`.
- [ ] Resend non ancora attivo con dominio reale.
- [ ] Dati fiscali reali attivita non ancora inseriti.

## Storefront pubblico

- [x] Home responsive.
- [x] Hero con CTA verso catalogo e idee regalo.
- [x] Categorie principali.
- [x] Prodotti in evidenza da Supabase.
- [x] Catalogo `/products`.
- [x] Ricerca catalogo.
- [x] Filtri categoria.
- [x] Ordinamento prodotti.
- [x] Product card responsive.
- [x] Quick view prodotto.
- [x] Scheda prodotto `/products/[slug]`.
- [x] Note olfattive testa/cuore/fondo.
- [x] Badge disponibilita, intensita, bestseller, nuovo, gift.
- [x] Pairing prodotti consigliati.
- [x] Recensioni demo.
- [x] Wishlist.
- [x] Prodotti visti di recente.
- [x] Finder olfattivo interattivo.
- [x] Bundle builder.
- [x] WhatsApp floating button.
- [x] Cookie banner limitato ai cookie tecnici.
- [x] Footer con link utili, contatti e dati fiscali da env.
- [x] Pagine informative: chi siamo, contatti, FAQ, spedizioni, resi, privacy, termini.
- [ ] Foto prodotto reali complete.
- [ ] Foto categoria reali.
- [ ] Foto negozio/storytelling reale.
- [ ] Ingredienti, allergeni, avvertenze e note normative per ogni prodotto.
- [ ] Recensioni reali collegate al database.
- [ ] Account cliente e storico ordini.
- [ ] Recupero carrello.

## Carrello e checkout

- [x] Store carrello persistente con Zustand/localStorage.
- [x] Aggiunta da catalogo.
- [x] Aggiunta da quick view.
- [x] Aggiunta da scheda prodotto.
- [x] Aggiunta da bundle builder.
- [x] Aggiunta da upsell pagina carrello.
- [x] Drawer carrello laterale.
- [x] Pagina carrello completa.
- [x] Modifica quantita.
- [x] Rimozione prodotto.
- [x] Coupon form nel drawer e nella pagina carrello.
- [x] Coupon validati contro Supabase.
- [x] Calcolo subtotale, sconto, spedizione e totale.
- [x] Checkout manuale assistito.
- [x] Salvataggio ordine, cliente e righe ordine su Supabase.
- [x] Success page con numero richiesta ordine.
- [x] Email cliente/proprietario predisposte con Resend.
- [x] Attivare Resend con `RESEND_API_KEY`.
- [ ] Verificare dominio mittente in Resend.
- [x] Fare test reale email cliente e interna.
- [ ] Checkout Stripe reale.
- [ ] Webhook Stripe per confermare pagamento.
- [x] Checkout PayPal predisposto e nascosto finche `NEXT_PUBLIC_PAYPAL_ENABLED=false`.
- [x] API PayPal Orders v2 predisposte per create/capture.
- [x] Webhook PayPal predisposto con verifica firma.
- [ ] Account PayPal Business non ancora configurato.
- [ ] Credenziali PayPal sandbox/live non ancora inserite.
- [ ] Test PayPal in Preview non ancora eseguito.
- [ ] Aggiornamento inventario solo dopo pagamento confermato.
- [ ] Gestione rimborsi e annullamenti da webhook/admin.
- [ ] Trigger post-pagamenti: dopo configurazione e test riuscito di Stripe/PayPal in Preview, aggiornare tutti i testi storefront/email/checkout che oggi indicano pagamento manuale o pagamento online non attivo.

## Admin portal

- [x] Login admin con Supabase Auth.
- [x] Ruolo `super_admin` per creatore progetto.
- [x] Ruolo `admin` per proprietario negozio.
- [x] Logout evidente dal portale admin.
- [x] Link "Torna alla home" visibile nel portale admin.
- [x] Navigazione admin differenziata per ruolo.
- [x] Pagina configurazione tecnica riservata al `super_admin`.
- [x] Protezione middleware per `/admin`.
- [x] Protezione API admin server-side.
- [x] Dashboard con dati reali Supabase.
- [x] Refresh dashboard manuale, automatico e al ritorno sulla tab.
- [x] Gestione prodotti.
- [x] Creazione prodotto.
- [x] Modifica prodotto.
- [x] Creazione/modifica prodotto in modale dedicata.
- [x] Duplicazione prodotto.
- [x] Soft delete prodotto.
- [x] Upload immagine con preview e Supabase Storage.
- [x] Campi SEO prodotto.
- [x] Campi note olfattive, prezzo, stock, tag, stato.
- [x] Inventario allineato agli stessi prodotti della gestione prodotti.
- [x] Modifica stock.
- [x] Tracciamento movimenti inventario.
- [x] Gestione categorie.
- [x] Creazione/modifica categoria in modale dedicata.
- [x] Toggle categoria visibile/nascosta con azione chiara.
- [x] Gestione collezioni.
- [x] Creazione/modifica collezione in modale dedicata.
- [x] Gestione ordini e cambio stato.
- [x] Console ordini avanzata con code operative, metriche, ricerca, dettaglio cliente, tracking, note e stati separati pagamento/preparazione/spedizione.
- [x] CRM clienti leggero.
- [x] Gestione coupon.
- [x] Creazione coupon in modale dedicata.
- [x] Azioni admin con icona e testo/tooltip leggibile.
- [x] Gestione contenuti/pagine.
- [x] Social/marketing: generatore caption e salvataggio post.
- [x] Settings con checklist env.
- [ ] Bulk actions prodotti.
- [ ] Import/export CSV prodotti.
- [ ] Gestione recensioni reali.
- [ ] Newsletter reale.
- [ ] Storico modifiche prodotto.
- [ ] Log audit admin.

## Supabase

- [x] Progetto Supabase creato.
- [x] Env locali Supabase configurate.
- [x] Migration `001_initial_schema.sql` eseguita.
- [x] Seed `seed.sql` eseguito.
- [x] Storage bucket `product-images` creato.
- [x] Migration `002_admin_auth.sql` eseguita.
- [x] Utenti Supabase Auth creati.
- [x] `ADMIN_AUTH_ENABLED=true` in locale.
- [x] Catalogo pubblico da Supabase.
- [x] Categorie pubbliche da Supabase.
- [x] Product slug/SEO da Supabase.
- [x] Admin prodotti da Supabase.
- [x] Ordini/clienti da Supabase.
- [x] Coupon da Supabase.
- [x] Categorie/collezioni/contenuti/marketing da Supabase.
- [x] Inventario e movimenti da Supabase.
- [x] Replicare env principali su Vercel per Production e Preview.
- [ ] Rafforzare RLS per dati personali cliente prima di account pubblici.
- [ ] Ridurre fallback localStorage dopo monitoraggio produzione.
- [ ] Backup/restore strategy.

## Stripe

- [x] File server Stripe predisposti.
- [x] API checkout predisposta.
- [x] Webhook route `/api/webhooks/stripe` predisposta.
- [ ] Creare account/progetto Stripe.
- [ ] Aggiungere `STRIPE_SECRET_KEY`.
- [ ] Aggiungere `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- [ ] Configurare webhook endpoint su dominio Vercel.
- [ ] Aggiungere `STRIPE_WEBHOOK_SECRET`.
- [ ] Creare ordine pending prima del redirect Stripe.
- [ ] Confermare ordine solo da webhook.
- [ ] Aggiornare stock solo dopo pagamento.
- [ ] Testare pagamento completato, cancellato, fallito, rimborso.

## PayPal

- [x] File server PayPal predisposti.
- [x] API `/api/paypal/orders` per creare ordine PayPal predisposta.
- [x] API `/api/paypal/orders/[paypalOrderId]/capture` per catturare pagamento predisposta.
- [x] Webhook route `/api/webhooks/paypal` predisposta.
- [x] Metodo PayPal nel checkout nascosto dietro `NEXT_PUBLIC_PAYPAL_ENABLED`.
- [x] Aggancio con Supabase per ordine `pending` e aggiornamento a `paid`.
- [ ] Creare account PayPal Business.
- [ ] Creare app REST PayPal sandbox.
- [ ] Aggiungere `PAYPAL_CLIENT_ID`.
- [ ] Aggiungere `PAYPAL_CLIENT_SECRET`.
- [ ] Aggiungere `NEXT_PUBLIC_PAYPAL_CLIENT_ID`.
- [ ] Configurare webhook endpoint su dominio Vercel.
- [ ] Aggiungere `PAYPAL_WEBHOOK_ID`.
- [ ] Testare pagamento sandbox completato, annullato e negato.
- [ ] Passare a credenziali live solo dopo validazione Preview.

## Coda sviluppo post-configurazione pagamenti

Questa sezione va avviata subito dopo aver configurato e testato Stripe e PayPal in Preview.

### Pagamenti robusti

- [ ] Stripe live/test completo collegato al carrello reale.
- [ ] PayPal sandbox/live completo collegato al carrello reale.
- [ ] Ordine `pending` creato prima del pagamento per Stripe e PayPal.
- [ ] Ordine `paid` solo dopo conferma webhook/capture.
- [ ] Gestione pagamenti falliti, annullati e scaduti.
- [ ] Gestione rimborsi totali/parziali da admin o webhook.
- [ ] Idempotenza per evitare doppi ordini, doppi pagamenti o doppio scarico stock.
- [ ] Email transazionali per pagamento ricevuto, pagamento fallito, ordine in preparazione, spedizione e rimborso.
- [ ] Aggiornamento contenuti checkout/email/success page quando il pagamento online sara attivo.

### Inventario robusto

- [ ] Scarico stock solo dopo pagamento confermato.
- [ ] Blocco checkout se stock insufficiente.
- [ ] Movimenti magazzino automatici per vendita, reso, rimborso, annullamento e correzione manuale.
- [ ] Alert sotto scorta automatici in dashboard/admin.
- [ ] Stato prodotto automatico `sold_out` quando lo stock arriva a zero.
- [ ] Ripristino stock su annullamento o rimborso se applicabile.
- [ ] Storico inventario completo e leggibile in admin.

## Resend email

- [x] Codice email ordine predisposto.
- [x] Notifica cliente predisposta.
- [x] Notifica proprietario/admin predisposta.
- [x] Supporto destinatari interni multipli separati da virgola.
- [x] Invio email non blocca il salvataggio ordine.
- [x] Env documentate in `.env.example` e `FUNCTIONAL_GUIDE`.
- [x] Creare API key Resend.
- [x] Aggiungere `RESEND_API_KEY` in locale e Vercel.
- [ ] Verificare dominio mittente.
- [ ] Sostituire `ORDER_EMAIL_FROM` con email dominio reale.
- [x] Test reale ordine + email.
- [ ] Email cambio stato ordine.
- [ ] Template email piu brandizzato.

## Vercel e deploy

- [x] Repository GitHub configurata.
- [x] Codice pushato su `main`.
- [x] Build locale Next.js verificata.
- [x] Importare repository in Vercel.
- [x] Impostare env principali per Production e Preview.
- [x] Impostare `NEXT_PUBLIC_SITE_URL` con alias Vercel production.
- [x] Deployment Production `Ready`.
- [x] Smoke test storefront production: home, catalogo, carrello, checkout, pagine legali.
- [x] Smoke test API pubblica coupon.
- [x] Confermare protezione API admin non autenticata con `401`.
- [ ] Collegare dominio custom.
- [ ] Verificare DNS.
- [x] Deploy production.
- [x] Testare storefront online.
- [x] Testare login admin online.
- [ ] Testare upload immagini online.
- [ ] Testare ordine manuale online.
- [ ] Attivare Vercel Analytics/Speed Insights se desiderato.

## Legal, contenuti e commerce

- [x] Privacy policy pre-produzione.
- [x] Termini e condizioni pre-produzione.
- [x] Spedizioni pre-produzione.
- [x] Resi/rimborsi pre-produzione.
- [x] FAQ pre-produzione.
- [x] Contatti pre-produzione.
- [x] Chi siamo pre-produzione.
- [x] Cookie banner coerente con soli cookie tecnici.
- [x] Checkout manuale chiarito prima di Stripe/PayPal.
- [ ] Inserire ragione sociale reale.
- [ ] Inserire P.IVA/codice fiscale attivita.
- [ ] Inserire indirizzo legale/esercizio.
- [ ] Inserire PEC/SDI se applicabile.
- [ ] Inserire email finale ordini/assistenza.
- [ ] Validazione finale da commercialista/legale.
- [ ] Ingredienti, avvertenze e allergeni prodotto.
- [ ] Tempi/costi spedizione reali definitivi.
- [ ] Regole promo/coupon definitive.

## SEO, performance e tracking

- [x] Metadata base.
- [x] OpenGraph base.
- [x] JSON-LD Product.
- [x] Sitemap statica.
- [x] Robots.
- [x] Manifest PWA.
- [ ] Sitemap dinamica da Supabase.
- [ ] Metadata dinamici avanzati prodotto/categoria.
- [ ] OG image dinamiche.
- [ ] Vercel Analytics.
- [ ] Speed Insights.
- [ ] Eventi ecommerce.
- [ ] Meta Pixel.
- [ ] TikTok Pixel.
- [ ] Google Analytics se necessario.
- [ ] Cookie consent avanzato prima di tracking non tecnico.

## Qualita tecnica

- [x] Next.js App Router.
- [x] TypeScript.
- [x] Tailwind CSS.
- [x] Zustand persist.
- [x] Supabase client/server.
- [x] API route admin protette.
- [x] Validazioni principali server-side.
- [x] `npm run typecheck` verificato.
- [x] `npm run build` verificato.
- [x] Fix cache/chunk Next documentato operativamente durante sviluppo.
- [ ] Test automatici smoke principali.
- [ ] Test checkout manuale.
- [ ] Test webhook Stripe quando attivo.
- [ ] Test webhook PayPal quando attivo.
- [ ] Test admin CRUD.
- [ ] Error monitoring produzione.
- [ ] Rate limiting/API hardening per endpoint sensibili.

## Roadmap consigliata

### Prima della produzione

1. Configurare Resend e test email ordine.
2. Inserire dati fiscali e contatti reali.
3. Testare upload immagini e ordine manuale online.
4. Collegare dominio custom e aggiornare `NEXT_PUBLIC_SITE_URL`.
5. Fare smoke test completo online sul dominio finale.

### Produzione pagamento

1. Configurare Stripe e PayPal in Preview.
2. Avviare subito la coda sviluppo "Pagamenti robusti".
3. Avviare subito la coda sviluppo "Inventario robusto".
4. Collegare checkout reale.
5. Gestire ordine pending per entrambi i provider.
6. Confermare pagamento via webhook/capture.
7. Aggiornare inventario via webhook.
8. Testare pagamenti, cancellazioni e rimborsi.
9. Trigger contenuti post-pagamenti: rimuovere il messaggio "pagamento online non attivo" da checkout, success page, email cliente, FAQ e testi operativi solo dopo test Stripe/PayPal completato.

### Crescita V2

1. Account cliente e storico ordini.
2. Recensioni reali.
3. Newsletter e automazioni email.
4. Analytics/pixel con consenso.
5. Import/export CSV.
6. Bundle con pricing reale.
7. Gift card.
8. Social calendar piu avanzato.
