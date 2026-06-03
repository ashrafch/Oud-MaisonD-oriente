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
- Footer con newsletter placeholder.
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

Nota: in questa fase il cliente non paga online. Il negozio verifica disponibilita e contatta il cliente per conferma e pagamento. Stripe resta il prossimo step.

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

Stato: sono placeholder. Prima della pubblicazione vanno sostituite con testi reali.

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
- Creazione checkout session.
- Webhook `checkout.session.completed`.
- Success/cancel URL.

Da completare:
- Passaggio dinamico carrello reale.
- Creazione ordine nel database.
- Aggiornamento inventario.
- Email conferma.

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
