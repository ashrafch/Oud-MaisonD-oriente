# Guida funzionale ecommerce OUDE

Questa guida spiega come usare le funzionalita sviluppate nell'ecommerce OUDE Maison D'Oriente.

## Avvio locale

```bash
npm install
npm run dev
```

Apri `http://127.0.0.1:3000`.

Nota: oggi molte funzioni operative usano `localStorage`. Significa che carrello, wishlist, ordini locali e prodotti creati dall'admin restano nello stesso browser, ma non sono ancora salvati su Supabase.

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

### Checkout locale

Percorso: `/checkout`

Funzionalita:
- Form cliente.
- Dati spedizione.
- Note ordine.
- Riepilogo prodotti.
- Calcolo totale.
- Creazione ordine locale.
- Success page con numero ordine.

Campi richiesti:
- Nome e cognome.
- Email.
- Telefono.
- Indirizzo.
- Citta.
- CAP.

Nota: il checkout reale Stripe e predisposto, ma non ancora collegato alle credenziali di produzione.

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

Nota sicurezza: l'area admin non e ancora protetta da login reale. Prima della pubblicazione serve Supabase Auth con ruoli e middleware.

### Dashboard

Percorso: `/admin`

Funzionalita:
- Vendite totali.
- Ordini recenti.
- Prodotti sotto scorta.
- Fatturato periodo.
- Alert intelligenti.
- Prodotti da spingere.
- Ordini recenti.

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

Limite: le immagini sono salvate in locale come data URL. In produzione serve Supabase Storage.

### Inventario

Percorso: `/admin/inventory`

Funzionalita:
- Lista prodotti.
- Stato disponibile/sotto scorta/esaurito.
- Modifica rapida stock.

### Ordini

Percorso: `/admin/orders`

Funzionalita:
- Lista ordini locali.
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
- Creazione coupon locale.
- Tipo percentuale/importo fisso.
- Valore.
- Minimo ordine.
- Rimozione coupon.

Nota: il coupon manager prepara il flusso admin. La validazione completa dei coupon custom va collegata al backend.

### Social & Marketing

Percorso: `/admin/social`

Funzionalita:
- Selezione prodotto.
- Selezione canale.
- Generazione caption Instagram.
- Generazione caption TikTok.
- Generazione testo WhatsApp.
- Copia negli appunti.

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
- Prodotti demo: `src/data/catalog.ts`.
- Carrello, wishlist, ordini e prodotti creati in admin: `localStorage`.

Produzione:
- Supabase deve diventare fonte unica di verita.
- `localStorage` puo restare solo per carrello anonimo temporaneo.
