# Project checklist e quadro produzione

Ultimo aggiornamento: 17/11/2026

## Boutique experience — pubblicata in Production

- Verifica conclusa il 17/11/2026: PR #3 unita, commit `8bafb14`, Vercel Production READY (`dpl_5oruhaj6KxBCyHJYwocMQ611wWAn`). Home canonica HTTP 200; dati della vetrina verificati: Legnoso / Ameer Al Oud VIP, Gourmand / Musk Pina Colada, Floreale / Ya Habibti, tutti distinti.
- Smoke Production superato: storefront, health database, header di sicurezza e otto API admin negate senza sessione. Nessun pagamento, ordine o dato di inventario modificato dai controlli.

- 16/11/2026: titolare approva la grafica della Preview e autorizza Production. Corretta la selezione: ogni famiglia esclude i prodotti gia mostrati dalle altre, mantenendo corrispondenza delle note e disponibilita. Se non esiste un altro prodotto compatibile, la famiglia viene omessa anziche duplicare il profumo.
- Preview della grafica semplificata `fad951c` e della correzione `52effd4`: build READY e home HTTP 200; tre prodotti distinti verificati prima del merge. Verifica visuale automatica desktop/mobile non completata per problema cattura Chrome; approvazione visuale fornita direttamente dal titolare.

- Revisione su feedback del titolare: taccuino sostituito da una vetrina essenziale integrata nella hero. Tre pulsanti famiglia, flacone su nicchia avorio, brand/nome/prezzo e link; rimossi contatore, note e descrizioni. Typecheck superato; Preview verificata e grafica approvata.
- Branch `feat/boutique-experience`: nuova home editoriale borgogna/avorio/oro, tipografia piu espressiva e vetrina olfattiva interattiva su tre accordi, selezionati dalle note reali del catalogo disponibile.
- Schede prodotto con immagini contenute, disponibilita esplicita, azioni da almeno 44px, preferiti con stato accessibile e carrello disabilitato per esauriti. Menu Catalogo con apertura click/tastiera ed Escape.
- Animazioni native di ingresso/cambio fragranza; contenuti visibili senza JavaScript; rispetto prefers-reduced-motion. Nessuna libreria aggiunta, asset public/brand invariati.
- Rimossi dalla home testo da prototipo e testimonianza demo presentata come cliente verificato. Quiz, bundle, carrello e navigazione prodotti conservati.
- Typecheck e build locale superati; verifica HTTP locale home 200 con nuovi contenuti. La precedente attesa di validazione grafica e conclusa con l'approvazione del titolare sopra riportata.

## Completamento hardening admin e operazioni — 16/11/2026

- Pubblicato tramite PR #2, commit main `39b3451`: Production READY (`dpl_8bE6mnt3xSGzQ1qkZ8LaM2tonuAS`). Primo workflow monitoring completato con successo: https://github.com/ashrafch/Oud-MaisonD-oriente/actions/runs/43830937039. Smoke manuale Production superato, `/api/health` HTTP 200/ok, nessun error/fatal nella breve finestra log verificata.
- Successiva osservazione browser: sessione super_admin attiva sul deployment Production precedente `2y9kwfc7a` (commit `0f7980e`), quindi allowlist/login della prima revisione confermati. Navigazione automatizzata non verificabile; upload sull'ultima revisione resta da provare.

- Validazioni categorie, collezioni, contenuti e social tramite Zod; UUID e payload DELETE validati. Body JSON limitati realmente a 128 KiB anche senza Content-Length.
- Upload raster verifica signature JPEG/PNG/WebP e dimensioni; rifiuta MIME falsificati. Controllo cross-site sulle API admin/logout; profilo admin verificato senza ignorare errori Supabase.
- Funzione `set_admin_product_stock` applicata su Supabase e testata con rollback: stock, stato published/sold_out e movimento cambiano atomicamente; invocazione negata ad authenticated/anon.
- Monitoraggio GitHub Actions ogni 30 minuti e su push main, con controllo storefront, health DB e otto API admin. Endpoint `/api/health` senza dettagli sensibili; runbook in `docs/OPERATIONS.md`.
- Test unitari: body chunked eccessivo, validazioni admin, MIME immagine falsificato. Typecheck/build/audit eseguiti nel rilascio.
- Sessione super_admin osservata nel browser sul vecchio deployment `6a34emnmi`; NON equivale a login/upload verificati sul dominio Production attuale. Input browser interrotto da errore geometria; nessun prodotto o ordine modificato.
- Blocchi esterni confermati: Supabase Free non offre leaked password protection (richiede Pro). CLI backup non autenticata, nessuna destinazione privata di backup configurata; procedura documentata ma esportazione completa e restore NON eseguiti. Non considerare backup completato o Pro attivato.

## Rilascio sicurezza pubblicato 16/11/2026

- PR #1 unita su main, commit `23625de`. Vercel Production READY, deployment `dpl_FLQMFDszFge9fzHfXmR8nutC2Fg7`, sito `https://oud-maison-d-oriente.vercel.app`.
- Verifica Production superata: home/catalogo/checkout/login HTTP 200 con nuovi header; otto API admin HTTP 401 senza sessione; payload login/checkout non validi HTTP 400; origine checkout esterna HTTP 403. Nessun ordine o pagamento creato.
- Nessun log runtime error/fatal rilevato nella finestra di controllo del deployment; questo controllo breve non sostituisce monitoraggio continuativo.
- Migrazioni remote applicate e testate. Tutte le tabelle public hanno RLS, colonna ruolo non aggiornabile da authenticated, funzioni stock/rate limit non invocabili da anon.
- Limitazioni e attivita residue elencate sotto restano aperte; il rilascio rafforza la sicurezza ma non completa tutta la roadmap. Test Stripe saltato su richiesta esplicita. Nessuna modifica al dominio.

Le sezioni successive conservano lo storico: per lo stato di pubblicazione prevale questa sezione.

## Verifica remota 16/11/2026 — rilascio in preparazione

- Accessi Supabase e Vercel verificati per i progetti corretti. Sul database reale tutte le tabelle pubbliche avevano gia RLS attiva; la vulnerabilita confermata era il permesso UPDATE sulla colonna `profiles.role`.
- Applicate e verificate migrazioni security_baseline, atomic_stock (SECURITY INVOKER), restrict_profile_trigger_execution e api_rate_limits. Utenti/anon non possono modificare ruoli o invocare funzioni privilegiate. Test stock e rate limit eseguiti con dati temporanei in transazioni annullate.
- Protezione distribuita login/checkout/PayPal tramite contatori DB; controllo origine e dimensione dichiarata richieste; limiti input checkout. Preview rifiuta checkout Stripe con chiavi live.
- Rimborsi admin richiedono pagamento Stripe pagato verificabile e chiave di idempotenza. Eventi Stripe ripetuti/falliti/scaduti non riportano un ordine gia pagato a stati precedenti.
- Build locale e typecheck passati, audit dipendenze zero vulnerabilita. Prima Preview: catalogo raggiungibile; verifica API attraverso protezione Vercel ha incontrato errore autenticazione del connettore e richiede controllo finale.
- Test Stripe end-to-end saltato su esplicita richiesta del titolare. Nessun pagamento/rimborso reale eseguito. PayPal sandbox non configurato.
- Avviso Supabase residuo: leaked password protection disabilitata. Tabelle con RLS senza policy sono intenzionalmente accessibili solo dal server service-role. Dominio e mittente email definitivo ancora sospesi.
- Non dichiarare il prodotto interamente finito: restano test login admin autenticato, upload immagine, backup/restore, monitoraggio, validazioni residue admin e prove pagamenti.

## Revisione sicurezza 15/11/2026 — in corso, non pubblicata

- 16/11/2026: build Vercel Preview del commit `70299b8` riuscita (non equivale a test funzionale pagamenti). PR #1 ancora draft. Aggiunta validazione Zod inventario (interi non negativi, UUID e limite note) e coupon (tipo, codice, valore, percentuale massima 100%). Supabase/Vercel risultano installati ma gli strumenti dei provider non sono ancora disponibili in questa sessione; migrazioni remote e configurazione restano da verificare.

- Branch `fix/security-hardening`: auth obbligatoria fuori sviluppo; ruoli admin solo da allowlist server; header di sicurezza; verifica associazione PayPal; rimborsi parziali Stripe esclusi dal ripristino totale; limiti upload; controllo prodotti mancanti/nascosti/eliminati e quantita aggregate; coupon demo rimossi.
- Next.js aggiornato a 15.5.29, Zod a 4.6.7 e dipendenze transitive aggiornate. Audit npm: zero vulnerabilita; typecheck passato; build locale passata. API prodotti validata con Zod.
- Test PostgreSQL locale: migrazioni 001–004 applicate; doppio scarico e doppio ripristino stock verificati; ruolo cliente privo di permessi modifica ruolo/esecuzione funzione stock. Test riproducibile in `supabase/tests/stock.sql`.
- Migrazioni 003 (RLS e permessi profili) e 004 (stock transazionale) preparate: NON ancora applicate su Supabase. Applicarle e verificarle prima del deploy del codice che usa `apply_order_stock`.
- Verificare `ADMIN_SUPER_EMAILS` e `ADMIN_EMAILS` in Preview/Production prima del rilascio: il ruolo nel profilo non concede piu accesso da solo.
- Restano: verifica schema reale e Storage, test concorrenti stock, Preview pagamenti/rimborsi, rate limiting distribuito, validazione completa API admin, backup/restore e monitoraggio. Dominio in pausa per richiesta del titolare.
- Non considerare questa revisione una certificazione di sicurezza o un deploy completato.

Questo e il documento unico per capire lo stato del progetto OUDÉ Maison D'Oriente Ecommerce: cosa e completato, cosa e predisposto, cosa manca prima della produzione e cosa conviene sviluppare dopo.

Documenti collegati:

- `docs/FUNCTIONAL_GUIDE.md`: guida operativa per usare storefront, admin, checkout, Supabase e email.
- `docs/SUPABASE_ADMIN_AUTH.md`: procedura specifica per login admin/super admin.
- `README.md`: setup rapido, stack e link documentazione.

## Ultimi aggiornamenti (luglio 2026) — Catalogo reale e UX

- [x] Import catalogo reale: 69 prodotti dal listino SumUp del negozio (nomi, brand, prezzi, gender, intensità, note olfattive verificate).
- [x] 81 foto prodotto reali caricate su Supabase Storage e collegate ai prodotti (`scripts/import-products.mjs`, `scripts/products-data.mjs`).
- [x] Fix immagini storefront: il catalogo pubblico ora legge le join immagini/categorie via client service-role server-side (le RLS bloccavano il client anon).
- [x] Tassonomia categorie ridisegnata e popolata: Uomo, Donna, Unisex, Oud & Legnosi, Gourmand & Dolci, Set Regalo, Casa & Profumatori (vecchie attar/musk/bakhoor nascoste). `scripts/restructure-categories.mjs`.
- [x] Top bar armoniosa con mega-menu "Catalogo" (opaco e leggibile), nomi lunghi non vanno più a capo.
- [x] Finder olfattivo professionale e personalizzato: 4 domande, profilo cliente, % di affinità calcolata sui prodotti reali.
- [x] Bundle "Crea il tuo rituale" scalabile: tab per famiglia, selezione su tutto il catalogo, sconto a scaglioni (2→-8%, 3→-12%, 4+→-15%), riepilogo sticky.
- [x] Coerenza foto ovunque: catalogo, scheda, quick view, carrello, drawer, checkout, wishlist, scelta consigliata, rituale consigliato, visti di recente.
- [x] Rimosso merge legacy `localStorage['oude-products']`: niente più prodotti demo/test fantasma nel browser; lo storefront mostra solo il catalogo reale.
- [x] Prodotti demo/seed (oud-sultan, musk-al-tahara, amber-night, test) soft-deleted dal DB.
- [ ] ~34 voci del listino SumUp ancora senza foto (bukhoor, oli essenziali, cofanetti incenso, set Valentine): da aggiungere quando arrivano le foto.
- [ ] Descrizioni estese/storytelling per prodotto (ora c'è la descrizione breve + note olfattive).

## Stato sintetico

- [x] Storefront responsive e professionale.
- [x] Catalogo e schede prodotto collegate a Supabase con fallback locale.
- [x] Carrello persistente funzionante con prodotti Supabase, drawer, pagina carrello e checkout.
- [x] Wishlist, prodotti visti di recente, quick view, finder olfattivo e bundle builder.
- [x] Checkout online con Stripe e alternativa richiesta assistita.
- [x] Coupon reali letti da Supabase in carrello/drawer/checkout.
- [x] Admin protetto con Supabase Auth e ruoli `super_admin`/`admin`.
- [x] Area configurazione tecnica separata e visibile solo al `super_admin`.
- [x] Admin operativo per dashboard, prodotti, categorie, collezioni, ordini, clienti, inventario, coupon, contenuti e social.
- [x] Upload immagini prodotto su Supabase Storage quando le env sono configurate.
- [x] Email ordine/notifica proprietario predisposte con Resend.
- [x] Pagine legali/informative aggiornate per checkout Stripe attivo.
- [x] Build Next.js verificata localmente.
- [x] Vercel configurato con deployment Production Ready.
- [x] Stripe configurato e validato in Preview con chiavi test.
- [x] Stripe Production live configurato su Vercel.
- [ ] Test pagamento reale Stripe live non ancora eseguito.
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
- [x] Foto prodotto reali per i 69 prodotti importati (mancano ~34 voci listino senza foto: bukhoor, oli, cofanetti, set Valentine).
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
- [x] Checkout Stripe con carta come metodo principale.
- [x] Checkout assistito come alternativa manuale.
- [x] Salvataggio ordine, cliente e righe ordine su Supabase.
- [x] Success page differenziata per pagamento online e richiesta assistita.
- [x] Email cliente/proprietario predisposte con Resend.
- [x] Attivare Resend con `RESEND_API_KEY`.
- [ ] Verificare dominio mittente in Resend.
- [x] Fare test reale email cliente e interna.
- [x] Checkout Stripe reale da carrello predisposto in Preview.
- [x] Webhook Stripe per confermare pagamento attivo.
- [x] Checkout PayPal predisposto e nascosto finche `NEXT_PUBLIC_PAYPAL_ENABLED=false`.
- [x] API PayPal Orders v2 predisposte per create/capture.
- [x] Webhook PayPal predisposto con verifica firma.
- [ ] Account PayPal Business non ancora configurato.
- [ ] Credenziali PayPal sandbox/live non ancora inserite.
- [ ] Test PayPal in Preview non ancora eseguito.
- [x] Aggiornamento inventario solo dopo pagamento confermato predisposto per Stripe.
- [x] Rimborso da admin: Stripe refund + stock restore + email (pannello ordini → Dettaglio → Rimborsa).
- [x] Rimborso da webhook Stripe `charge.refunded`: aggiorna ordine + stock + email (idempotente).
- [x] Trigger post-pagamenti eseguito: checkout, success page, FAQ, legali, admin ed email aggiornati per Stripe attivo.

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
- [x] Creare account/progetto Stripe.
- [x] Aggiungere `STRIPE_SECRET_KEY` in locale.
- [x] Aggiungere `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in locale.
- [x] Configurare webhook endpoint su dominio Vercel.
- [x] Aggiungere `STRIPE_WEBHOOK_SECRET` in locale.
- [x] Creare ordine pending prima del redirect Stripe.
- [x] Confermare ordine solo da webhook.
- [x] Aggiornare stock solo dopo pagamento confermato.
- [x] Replicare env Stripe test su Vercel Preview per branch `feat/stripe-real-checkout`.
- [x] Testare checkout Stripe in Preview.
- [x] Testare pagamento completato in Preview.
- [x] Salvare ID sessione Stripe sull'ordine.
- [x] Replicare env Stripe live su Vercel Production.
- [x] Configurare webhook Stripe live verso `/api/webhooks/stripe` Production.
- [x] Handler `checkout.session.completed` attivo (pagamento confermato).
- [x] Handler `checkout.session.expired` attivo (ordine annullato).
- [x] Handler `payment_intent.payment_failed` attivo (pagamento fallito).
- [x] Handler `charge.refunded` attivo (rimborso da pannello Stripe o admin).
- [x] Evento `charge.refunded` aggiunto alla lista eventi del webhook su dashboard Stripe.
- [x] Testare pagamento reale Stripe live (€0,60 — ordine 95e6e824, email cliente + proprietario ricevute, stock scalato).
- [ ] Testare cancellazione, fallimento e rimborso in produzione.

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

- [x] Stripe test completo collegato al carrello reale in Preview.
- [x] Stripe live collegato al carrello reale in Production.
- [x] Stripe live validato con pagamento reale (€0,60 — flusso completo: checkout → webhook → ordine paid → email → stock).
- [ ] PayPal sandbox/live completo collegato al carrello reale.
- [x] Ordine `pending` creato prima del pagamento Stripe.
- [x] Ordine Stripe `paid` solo dopo conferma webhook.
- [ ] Ordine PayPal `pending`/`paid` da validare in sandbox.
- [x] Gestione checkout scaduto (`checkout.session.expired` → ordine `cancelled`).
- [x] Gestione pagamento fallito (`payment_intent.payment_failed` → `payment_status: failed`).
- [x] Gestione rimborso totale da admin (Stripe refund + stock restore + email cliente/proprietario).
- [x] Gestione rimborso da webhook Stripe `charge.refunded` (idempotente, aggiorna ordine + stock + email).
- [ ] Gestione rimborsi parziali (solo rimborso totale implementato).
- [ ] Email cliente per pagamento fallito o scaduto (notifica proattiva non ancora implementata).
- [x] Idempotenza scarico stock Stripe contro doppio webhook (guard su `vendita` movement).
- [x] Idempotenza rimborso stock contro doppio webhook (guard su `rimborso` movement).
- [ ] Idempotenza completa per doppi ordini e doppi pagamenti.
- [x] Email transazionale per pagamento Stripe ricevuto.
- [x] Email stato `in preparazione` triggherata da PATCH admin (`status → preparing`).
- [x] Email stato `spedito` con tracking code triggherata da PATCH admin (`status → shipped`).
- [x] Email rimborso cliente + proprietario con idempotenza (`refundEmailSentAt` in internal_notes).
- [ ] Email per pagamento fallito/scaduto (notifica proattiva al cliente).
- [x] Aggiornamento contenuti checkout/email/success page per pagamento online attivo.

### Inventario robusto

- [x] Scarico stock Stripe solo dopo pagamento confermato.
- [x] Blocco checkout se stock insufficiente (409 server-side con lista prodotti).
- [x] Movimento magazzino `vendita` creato dopo pagamento Stripe confermato.
- [x] Movimento magazzino `rimborso` creato dopo rimborso Stripe (da admin o webhook).
- [ ] Movimenti magazzino per PayPal, annullamento manuale e correzione admin.
- [ ] Alert sotto scorta automatici in dashboard/admin.
- [x] Stato prodotto automatico `sold_out` quando lo stock arriva a zero.
- [x] Ripristino stock su rimborso con guard idempotente e riattivazione `active`.
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
- [x] Email cambio stato: in preparazione (`status → preparing`) e spedito (`status → shipped`) triggerate dal PATCH admin.
- [x] Email rimborso: cliente + proprietario con idempotenza (flag `refundEmailSentAt` in notes).
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
9. Trigger contenuti post-pagamenti Stripe eseguito: checkout, success page, email cliente/proprietario, FAQ, legali e testi operativi sono aggiornati per pagamento online attivo.

### Crescita V2

1. Account cliente e storico ordini.
2. Recensioni reali.
3. Newsletter e automazioni email.
4. Analytics/pixel con consenso.
5. Import/export CSV.
6. Bundle con pricing reale.
7. Gift card.
8. Social calendar piu avanzato.
