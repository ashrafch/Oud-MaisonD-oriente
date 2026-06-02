# Stato progetto e checklist sviluppo

Questo documento distingue cio che e gia stato sviluppato, cio che e predisposto e cio che resta da completare.

## Sviluppato

### Storefront

- [x] Home responsive.
- [x] Hero con CTA.
- [x] Catalogo prodotti.
- [x] Filtri categoria.
- [x] Ricerca catalogo.
- [x] Ordinamento prodotti.
- [x] Product card responsive.
- [x] Quick view prodotto.
- [x] Scheda prodotto.
- [x] Note olfattive testa/cuore/fondo.
- [x] Badge stock/bestseller/nuovo arrivo.
- [x] Recensioni demo.
- [x] Pairing prodotti consigliati.
- [x] Prodotti visti di recente.
- [x] Finder olfattivo.
- [x] Bundle builder.
- [x] Wishlist.
- [x] Carrello pagina.
- [x] Carrello drawer.
- [x] Coupon demo.
- [x] Checkout locale.
- [x] Success/cancel page.
- [x] Cookie banner.
- [x] WhatsApp floating button.
- [x] Footer e newsletter placeholder.
- [x] Pagine informative placeholder.

### Admin

- [x] Layout admin responsive.
- [x] Dashboard proprietario.
- [x] Alert stock e prodotti da spingere.
- [x] Gestione prodotti locale.
- [x] Creazione prodotto.
- [x] Modifica prodotto.
- [x] Duplicazione prodotto.
- [x] Eliminazione prodotto locale.
- [x] Upload immagine con preview.
- [x] Campi SEO prodotto.
- [x] Inventario con modifica stock.
- [x] Ordini locali con cambio stato.
- [x] Clienti/CRM leggero.
- [x] Coupon manager locale.
- [x] Generatore caption social.
- [x] Checklist impostazioni produzione.

### Tecnico

- [x] Next.js App Router.
- [x] TypeScript.
- [x] Tailwind CSS.
- [x] Zustand persist.
- [x] Supabase migrations iniziali.
- [x] Seed SQL.
- [x] Stripe route predisposte.
- [x] Webhook Stripe predisposto.
- [x] JSON-LD Product.
- [x] OpenGraph base.
- [x] Sitemap e robots statici.
- [x] Manifest PWA.
- [x] `.env.example`.
- [x] README.
- [x] AGENTS.
- [x] Production checklist.

## Predisposto ma non collegato a servizi reali

- [ ] Supabase database runtime.
- [ ] Supabase Auth admin/staff/customer.
- [ ] Supabase Storage immagini.
- [ ] Stripe Checkout reale dal carrello.
- [ ] Stripe webhook completo.
- [ ] Email Resend.
- [ ] Analytics e pixel reali.
- [ ] Cookie consent management professionale.

## Da sviluppare per produzione

### Sicurezza

- [ ] Protezione `/admin` con middleware.
- [ ] Login admin.
- [ ] Ruoli `admin`, `staff`, `customer`.
- [ ] RLS Supabase completa.
- [ ] Validazioni server-side per tutte le azioni admin.
- [ ] Nessuna operazione critica solo client-side.

### Database e backend

- [ ] Sostituire prodotti da `localStorage` con Supabase.
- [ ] Sostituire ordini locali con Supabase.
- [ ] Sostituire clienti locali con Supabase.
- [ ] Sostituire coupon locali con Supabase.
- [ ] Movimenti inventario reali.
- [ ] Storico modifiche prodotto.
- [ ] Import/export CSV prodotti.

### Checkout e ordini

- [ ] Creare sessione Stripe con carrello reale.
- [ ] Salvare ordine `pending` prima di Stripe.
- [ ] Confermare ordine da webhook.
- [ ] Aggiornare inventario da webhook.
- [ ] Inviare email conferma ordine.
- [ ] Inviare email stato spedizione.
- [ ] Gestire rimborsi/annullamenti.
- [ ] Tracking spedizione.

### Admin avanzato

- [ ] Product form con React Hook Form.
- [ ] Validazione Zod completa.
- [ ] Tabella prodotti con TanStack Table.
- [ ] Bulk actions.
- [ ] Modale conferma eliminazione custom.
- [ ] Gestione categorie reale.
- [ ] Gestione collezioni reale.
- [ ] Gestione recensioni.
- [ ] Gestione contenuti pagine informative.
- [ ] Gestione newsletter.

### Storefront avanzato

- [ ] Account cliente.
- [ ] Storico ordini cliente.
- [ ] Recupero carrello.
- [ ] Recensioni reali.
- [ ] FAQ prodotto dinamiche.
- [ ] Comparatore profumi.
- [ ] Gift card.
- [ ] Bundle con prezzo scontato reale.
- [ ] Campioncini/add-on checkout.
- [ ] Disponibilita ritiro in negozio.

### Marketing e conversione

- [ ] Newsletter reale.
- [ ] Automazioni email.
- [ ] Meta Pixel.
- [ ] TikTok Pixel.
- [ ] Google Analytics / Vercel Analytics.
- [ ] Eventi ecommerce.
- [ ] Landing collezioni stagionali.
- [ ] Countdown promo reale.
- [ ] Social scheduler.
- [ ] UGC/reviews media.

### Contenuti e legale

- [ ] Testi reali privacy.
- [ ] Testi reali cookie.
- [ ] Testi reali termini e condizioni.
- [ ] Policy spedizioni.
- [ ] Policy resi/rimborsi.
- [ ] Dati aziendali/fiscali.
- [ ] Ingredienti e avvertenze prodotto.
- [ ] Foto reali prodotto.
- [ ] Dimensioni/peso per spedizione.

## Priorita consigliata

1. Supabase Auth e protezione admin.
2. Supabase prodotti/categorie/storage.
3. Stripe Checkout reale e webhook.
4. Ordini, inventario ed email.
5. Pagine legali e cookie consent.
6. Analytics e pixel.
7. Recensioni e account cliente.
8. Automazioni marketing.
