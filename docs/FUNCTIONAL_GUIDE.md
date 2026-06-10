# Guida funzionale ecommerce OUDE

Questa guida spiega come usare le funzionalita sviluppate nell'ecommerce OUDE Maison D'Oriente.

## Avvio locale

```bash
npm install
npm run dev
```

Apri `http://127.0.0.1:3000`.

Nota: il catalogo, admin, ordini, clienti, coupon, inventario, categorie, contenuti e marketing usano Supabase. `localStorage` resta per carrello anonimo, wishlist, prodotti visti di recente e fallback locale se Supabase non risponde.

## Storefront pubblico

### Home

Percorso: `/`

Funzionalita:
- Hero responsive con CTA verso catalogo e idee regalo.
- Prodotti in evidenza.
- Categorie principali.
- Profumo consigliato.
- Finder olfattivo interattivo.
- Bundle builder.
- Prodotti visti di recente.
- Storytelling boutique.
- Footer con link legali, contatti e dati fiscali da env.
- Cookie banner.
- Pulsante WhatsApp floating.

Uso:
- `Esplora catalogo` porta alla pagina prodotti.
- Il finder olfattivo consiglia un prodotto in base alle risposte.
- Il bundle builder permette di scegliere prodotti complementari e aggiungerli al carrello.

### Catalogo prodotti

Percorso: `/products`

Funzionalita:
- Griglia prodotti responsive.
- Ricerca per nome, brand, descrizione e note olfattive.
- Filtro per categoria.
- Ordinamento per consigliati, prezzo, nuovi arrivi e stock basso.
- Quick view prodotto.
- Aggiunta al carrello dalla card.
- Wishlist dalla card.
- Badge intensita, bestseller, nuovo arrivo o stock basso.

Uso:
- Scrivi nella barra di ricerca.
- Attiva le categorie nei filtri.
- Usa `Preview` per aprire l'anteprima prodotto.
- Usa il carrello per aggiungere un prodotto.
- Usa il cuore per salvare in wishlist.

### Scheda prodotto

Percorso: `/products/[slug]`

Funzionalita:
- Immagine prodotto.
- Nome, brand, prezzo e disponibilita.
- Badge urgenza stock.
- Aggiungi al carrello.
- Acquista ora.
- Wishlist.
- Note olfattive testa/cuore/fondo.
- Intensita, durata e target.
- Recensioni demo.
- Pairing consigliati.
- Tracking prodotti visti di recente.
- JSON-LD Product predisposto.

Uso:
- `Aggiungi al carrello` aggiunge il prodotto e apre il drawer.
- `Acquista ora` aggiunge il prodotto e porta al checkout.
- I prodotti aperti vengono salvati nei visti di recente.

### Carrello

Percorso: `/cart`

Funzionalita:
- Lista prodotti nel carrello.
- Modifica quantita.
- Rimozione prodotto.
- Upsell prodotti suggeriti.
- Coupon demo.
- Subtotale, sconto, spedizione e totale.
- CTA checkout.

Coupon demo:
- `OUDE10`: sconto 10%.
- `WELCOME15`: sconto 15%.

Nota: i coupon demo sono lato client. In produzione devono essere validati server-side.

### Cart drawer

Disponibile dall'header e dopo aggiunta prodotto.

Funzionalita:
- Drawer laterale.
- Modifica quantita.
- Totale rapido.
- Link a carrello e checkout.

### Wishlist

Percorso: `/wishlist`

Funzionalita:
- Prodotti salvati.
- Aggiunta al carrello da card.
- Empty state.

### Checkout manuale assistito

Percorso: `/checkout`

Funzionalita:
- Form cliente.
- Dati spedizione.
- Note ordine.
- Riepilogo prodotti.
- Calcolo totale.
- Creazione richiesta ordine su Supabase.
- Email cliente/proprietario se Resend e configurato.
- Success page con numero ordine.

Campi richiesti:
- Nome e cognome.
- Email.
- Telefono.
- Indirizzo.
- Citta.
- CAP.

Nota: in questa fase il cliente non paga online. Il negozio verifica disponibilita e contatta il cliente per conferma e pagamento. Stripe e PayPal restano i prossimi step di pagamento online.

### Email ordine e notifica interna

Quando il cliente invia la richiesta ordine, il sistema prova a inviare:
- una conferma al cliente;
- una notifica interna al proprietario/admin.

Il salvataggio ordine non dipende dalle email: se Resend non e configurato o l'invio fallisce, l'ordine resta comunque salvato in Supabase.

Variabili da configurare in `.env.local` e poi su Vercel:

```env
RESEND_API_KEY=
ORDER_EMAIL_FROM="OUDE Maison D Oriente <ordini@tuodominio.it>"
ORDER_NOTIFICATION_EMAIL="mail-proprietario@dominio.it,mail-creatore@dominio.it"
NEXT_PUBLIC_CONTACT_EMAIL=ordini@tuodominio.it
NEXT_PUBLIC_BUSINESS_FISCAL_DATA="Ragione sociale, P.IVA, indirizzo, PEC/SDI se disponibili"
```

Come completare:
1. Crea un account su Resend.
2. Crea una API key e inseriscila in `RESEND_API_KEY`.
3. Quando hai il dominio, verifica il dominio su Resend.
4. Sostituisci `ORDER_EMAIL_FROM` con una casella del dominio verificato.
5. Metti in `ORDER_NOTIFICATION_EMAIL` una o piu mail interne separate da virgola.
6. Riavvia il server locale dopo ogni modifica a `.env.local`.

Nota: finche il dominio email non e verificato, `ORDER_EMAIL_FROM` resta un valore da completare. Per la produzione non usare domini placeholder.

### Ricerca

Percorso: `/search`

Usa lo stesso catalogo filtrabile di `/products`.

### Pagine informative

Percorsi:
- `/about`
- `/contact`
- `/faq`
- `/shipping`
- `/returns`
- `/privacy`
- `/terms`

Stato: contengono testi completi pre-produzione. Prima della pubblicazione vanno completate con dati fiscali, contatti definitivi e validazione finale dell'attivita.

## Area admin

Percorso principale: `/admin`

Nota sicurezza: l'area admin usa Supabase Auth. Le email autorizzate sono definite in `ADMIN_SUPER_EMAILS` e `ADMIN_EMAILS`.

### Dashboard

Percorso: `/admin`

Funzionalita:
- Dati reali Supabase.
- Vendite totali e ordini.
- Prodotti sotto scorta e prodotti catalogo.
- Coupon attivi, categorie, contenuti e social.
- Refresh manuale, refresh automatico e refresh al ritorno sulla tab.

### Gestione prodotti

Percorso: `/admin/products`

Funzionalita:
- Creazione prodotto.
- Modifica prodotto.
- Duplicazione prodotto.
- Eliminazione locale.
- Ricerca prodotti.
- Upload foto con preview.
- Categoria, prezzo, stock, intensita e durata.
- Note olfattive.
- Tag marketing.
- SEO title e SEO description.

Uso:
1. Compila il form nuovo prodotto.
2. Carica una foto.
3. Inserisci prezzo, stock, descrizione e note.
4. Salva.
5. Il prodotto appare nel catalogo nello stesso browser.

Le immagini vengono caricate su Supabase Storage quando le variabili server sono configurate.

### Inventario

Percorso: `/admin/inventory`

Funzionalita:
- Lista prodotti da Supabase, uguale alla gestione prodotti.
- Stato disponibile/sotto scorta/esaurito.
- Modifica rapida stock.
- Tracciamento movimenti in `inventory_movements`.

### Ordini

Percorso: `/admin/orders`

Funzionalita:
- Lista ordini Supabase.
- Dati cliente.
- Indirizzo.
- Totale.
- Cambio stato ordine.

Stati:
- `new`
- `paid`
- `preparing`
- `shipped`
- `delivered`
- `cancelled`

### Clienti

Percorso: `/admin/customers`

Funzionalita:
- CRM leggero.
- Raggruppamento clienti per email.
- Storico ordini.
- Valore cliente.
- Contatti.

### Sconti

Percorso: `/admin/discounts`

Funzionalita:
- Creazione coupon Supabase.
- Tipo percentuale/importo fisso.
- Valore.
- Minimo ordine.
- Rimozione coupon.

I coupon attivi vengono letti dal carrello, drawer e checkout.

### Social & Marketing

Percorso: `/admin/social`

Funzionalita:
- Selezione prodotto e canale.
- Generazione caption Instagram, TikTok e WhatsApp.
- Salvataggio bozze, post pianificati o pubblicati su Supabase.
- Storico contenuti social.

### Impostazioni

Percorso: `/admin/settings`

Funzionalita:
- Checklist variabili ambiente.
- Stato configurato/non configurato per Supabase, Stripe, Vercel, Resend e WhatsApp.

## Funzioni tecniche predisposte

### Supabase

File:
- `src/lib/supabase/client.ts`
- `supabase/migrations/001_initial_schema.sql`
- `supabase/seed.sql`

Predisposto per:
- Prodotti.
- Categorie.
- Ordini.
- Clienti.
- Coupon.
- Recensioni.
- Wishlist.
- Inventario.
- Marketing posts.
- Settings.

### Stripe

File:
- `src/lib/stripe/server.ts`
- `src/lib/stripe/checkout.ts`
- `src/app/api/checkout/route.ts`
- `src/app/api/webhooks/stripe/route.ts`

Predisposto per:
- Creazione checkout session da carrello reale.
- Creazione ordine interno Supabase in stato `pending`.
- Webhook `checkout.session.completed`.
- Aggiornamento ordine a `paid`.
- Scarico stock dopo pagamento confermato.
- Salvataggio ID sessione Stripe sull'ordine.
- Success/cancel URL.

Da completare:
- Replicare env Stripe live su Vercel Production.
- Configurare webhook Stripe live verso `/api/webhooks/stripe` Production.
- Email conferma pagamento ricevuto.
- Gestione rimborsi, cancellazioni e pagamenti falliti avanzata.

Stato validazione:
- Stripe test in Preview validato con carta sandbox.
- Webhook Preview validato con risposta HTTP 200.
- Ordine Supabase aggiornato a `paid` solo via webhook.
- Stock scalato dopo pagamento confermato e protetto da doppio webhook.

### PayPal

File:
- `src/lib/paypal/server.ts`
- `src/lib/paypal/checkout.ts`
- `src/app/api/paypal/orders/route.ts`
- `src/app/api/paypal/orders/[paypalOrderId]/capture/route.ts`
- `src/app/api/webhooks/paypal/route.ts`

Predisposto per:
- PayPal Orders API v2 server-side.
- Creazione ordine PayPal da carrello reale.
- Creazione ordine interno Supabase in stato `pending`.
- Capture PayPal dopo approvazione cliente.
- Aggiornamento ordine admin a `paid`, `ready_to_prepare` e `not_ready`.
- Webhook PayPal con verifica firma tramite `PAYPAL_WEBHOOK_ID`.

Variabili da configurare in `.env.local` e poi su Vercel Preview/Production:

```env
PAYPAL_ENVIRONMENT=sandbox
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_WEBHOOK_ID=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
NEXT_PUBLIC_PAYPAL_ENABLED=false
```

Come completare:
1. Crea account PayPal Business.
2. Entra in PayPal Developer Dashboard.
3. Crea una app REST in Sandbox.
4. Copia Client ID e Secret in `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` e il Client ID pubblico in `NEXT_PUBLIC_PAYPAL_CLIENT_ID`.
5. Crea webhook verso `/api/webhooks/paypal` sul dominio Preview/Production e copia l'ID in `PAYPAL_WEBHOOK_ID`.
6. Testa un pagamento in Preview con `NEXT_PUBLIC_PAYPAL_ENABLED=true`.
7. Solo dopo test riuscito, passa a `PAYPAL_ENVIRONMENT=live` e aggiorna le credenziali live.

### SEO

Presente:
- Metadata base.
- OpenGraph.
- JSON-LD Product.
- `robots.txt`.
- `sitemap.xml`.
- Manifest PWA.

Da completare:
- Sitemap dinamica da Supabase.
- Metadata dinamici da prodotto/categoria.
- SEO editor completo in admin.

## Persistenza dati

Attuale:
- Supabase: catalogo, admin, ordini, clienti, coupon, categorie, inventario, contenuti e marketing.
- `localStorage`: carrello anonimo, wishlist e fallback locale.

Produzione:
- Supabase deve diventare fonte unica di verita.
- `localStorage` puo restare solo per carrello anonimo temporaneo.
