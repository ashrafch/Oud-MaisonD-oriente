# OUDÉ Maison D'Oriente — Design System

Documentazione completa di design token, componenti e pattern visivi del progetto ecommerce OUDÉ.  
Aggiornato automaticamente con il codice sorgente. File di riferimento autoritativo per AI agent e sviluppatori.

---

## Stack tecnico

| Layer | Tecnologia |
| --- | --- |
| Framework | Next.js 15 App Router (TypeScript strict) |
| Styling | Tailwind CSS v3 con config estesa |
| Font | Inter (sans) · Cormorant Garamond (serif) via Google Fonts |
| Icone | Heroicons (SVG inline) |
| Animazioni | Tailwind transitions + keyframe CSS custom |

---

## Token — Colori

I colori sono definiti in `tailwind.config.ts` con formato `rgb(R G B / <alpha-value>)` per supportare i modificatori di opacità Tailwind (`bg-oud/50`, `text-ink/40`, ecc.).

### Palette brand

| Token | Hex | RGB | Uso |
| --- | --- | --- | --- |
| `ink` | `#171412` | `23 20 18` | Testo primario, bordi, sfondo scuro |
| `oud` | `#741d12` | `116 29 18` | Bottoni primari, accent brand |
| `saffron` | `#c99b45` | `201 155 69` | Focus ring, dettagli lusso |
| `cream` | `#fbf5ec` | `251 245 236` | Background primario del sito |
| `mist` | `#f4efe6` | `244 239 230` | Hover state, secondary bg, skeleton |
| `bark` | `#4e3427` | `78 52 39` | Hover dei bottoni oud |
| `sage` | `#78866b` | `120 134 107` | Successo, ordine completato, badge positivi |

### Opacità frequenti

```
ink: /8 /10 /12 /20 /30 /40 /45 /55 /65 /70
oud: /5 /8 /10 /12 /15 /20 /25 /40 /55 /80
saffron: /15 /18 /30
sage: /8 /12 /15 /20
```

### Usi semantici

| Stato | Classe bg | Classe text |
| --- | --- | --- |
| Azione primaria | `bg-oud` | `text-white` |
| Hover primario | `bg-bark` | `text-white` |
| Successo / Evaso | `bg-sage/12` | `text-sage` |
| Attenzione | `bg-saffron/18` | `text-ink` |
| Errore / Pericolo | `bg-oud/10` | `text-oud` |
| Neutro / Secondario | `bg-mist` | `text-ink` |
| Disabilitato | `bg-mist` | `text-ink/40` |

---

## Token — Tipografia

### Font families

```ts
fontFamily: {
  sans:  ['Inter', 'system-ui', 'sans-serif'],
  serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
}
```

**Regola generale:** `font-serif` per titoli e nomi prodotto · `font-sans` per tutto il resto.

### Scala tipografica

| Classe | Font | Uso |
| --- | --- | --- |
| `text-5xl font-serif` | Cormorant 48px | Hero, H1 principale |
| `text-4xl font-serif` | Cormorant 36px | H1 pagine categoria/catalogo |
| `text-3xl font-serif` | Cormorant 30px | H2, titolo modale prodotto |
| `text-2xl font-serif` | Cormorant 24px | Nome prodotto in card |
| `text-xl font-semibold` | Inter 20px | Sottotitoli, admin headings |
| `text-base` | Inter 16px | Corpo testo |
| `text-sm` | Inter 14px | Label, UI elementi, descrizioni brevi |
| `text-xs` | Inter 12px | Micro-copy, badge, note |
| `text-xs font-semibold uppercase tracking-widest` | Inter 12px | Overline pattern (categoria, sezione) |

### Pattern Overline + Titolo

Pattern usato in ogni sezione del sito per stabilire gerarchia visiva:

```html
<p class="text-xs font-semibold uppercase tracking-widest text-oud">Categoria</p>
<h1 class="mt-1 font-serif text-4xl text-ink">Oud</h1>
```

Varianti del colore overline: `text-oud` (brand) · `text-ink/40` (neutro)

---

## Token — Spacing & Layout

| Token | Valore | Uso |
| --- | --- | --- |
| Container | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` | Wrapper principale |
| Section padding | `py-12` | Padding verticale sezioni |
| Card gap | `gap-5` | Grid prodotti |
| Touch target minimo | `min-h-11` (44px) | Bottoni, input |
| Sidebar admin | `lg:grid-cols-[240px_1fr]` | Filtri + catalogo |

---

## Token — Shadows & Radius

| Token | Valore | Uso |
| --- | --- | --- |
| `shadow-soft` | `0 24px 70px rgba(23, 20, 18, 0.12)` | Card hover, modale, toast |
| `rounded` | 4px | Input, bottoni |
| `rounded-lg` | 8px | Select, small cards |
| `rounded-xl` | 12px | Product card, modal panel |
| `rounded-full` | 50% | Badge, avatar, pill |

---

## Token — Animazioni

### Hover card — pattern premium

```css
/* Tailwind classes */
transition-all duration-300
hover:-translate-y-1 hover:shadow-soft hover:border-saffron/35
```

### Soft-shine shimmer (skeleton loading)

```css
@keyframes soft-shine {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}
/* applicato con ::after su elemento position: relative overflow-hidden */
```

### Nav underline

```css
/* Link navbar */
position: relative;
/* ::after */
position: absolute; bottom: 0; left: 0;
width: 0; height: 1.5px; background: oud;
transition: width 0.2s ease;
/* :hover::after */
width: 100%;
```

### Focus ring

```css
focus-visible:outline-2 focus-visible:outline-saffron focus-visible:outline-offset-2
```

---

## Componenti

### Product Card

File: `src/components/product/product-card.tsx`

```
bg-white border border-ink/10 rounded-xl overflow-hidden
hover: -translate-y-1 shadow-soft border-saffron/35
```

Struttura:
- Immagine `aspect-square` con overlay tag (Bestseller, Nuovo, Stock)
- Quick view button — slide-in dal basso al hover
- Body: brand (xs ink/40), nome (font-serif xl), descrizione (sm ink/60 line-clamp-2)
- Note olfattive: pill `bg-mist text-ink/60 rounded-full px-2 py-0.5`
- Footer: prezzo (font-serif 2xl) + compareAtPrice (sm line-through) + bottone acquista

Skeleton: stesse dimensioni con `bg-mist` + animazione shimmer sulle aree.

---

### Bottoni

| Variante | Classi |
| --- | --- |
| Primario | `min-h-11 px-8 bg-oud text-white text-sm font-semibold rounded hover:bg-bark transition-colors` |
| Secondario | `min-h-11 px-8 border border-ink/20 text-ink rounded hover:bg-mist transition-colors` |
| Outline oud | `min-h-11 px-8 border border-oud/30 text-oud rounded hover:bg-oud/5 transition-colors` |
| Danger | `min-h-11 px-8 bg-oud text-white rounded hover:bg-bark` |
| Ghost small | `min-h-9 px-3 text-sm hover:bg-mist rounded transition-colors` |
| Icon-only | `w-10 h-10 flex items-center justify-center rounded border border-ink/12 hover:bg-mist` |

---

### Badge / Status

**Stato ordine:**

```html
<!-- In attesa -->
<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-saffron/18 text-ink">In attesa</span>
<!-- Spedito -->
<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-ink/8 text-ink">Spedito</span>
<!-- Consegnato -->
<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-sage/12 text-sage">Consegnato</span>
<!-- Errore -->
<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-oud/10 text-oud">Fallito</span>
```

**Pattern con dot:**

```html
<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sage/15 text-sage">
  <span class="w-1.5 h-1.5 rounded-full bg-sage"></span>
  Consegnato
</span>
```

---

### Form Elements

Input standard:

```html
<input class="w-full min-h-11 px-4 rounded border border-ink/15 bg-white text-sm
              focus:outline-2 focus:outline-saffron focus:outline-offset-1 transition-colors" />
```

Select:

```html
<select class="w-full min-h-11 px-4 rounded border border-ink/15 bg-white text-sm
               focus:outline-2 focus:outline-saffron">
```

Label:

```html
<label class="block text-sm font-medium text-ink mb-1.5">Campo</label>
```

Stato errore:

```html
<input class="border-oud/50 bg-oud/5 focus:outline-oud" />
<p class="mt-1 text-xs text-oud">Messaggio errore</p>
```

---

### Order Flow Stepper

File: `src/components/admin/orders-client.tsx` — `OrderFlowStepper`

3 step: **Pagamento → Preparazione → Spedizione**

Step styles:
- Completato: `w-8 h-8 rounded-full bg-sage text-white` con `✓`
- Attivo: `w-8 h-8 rounded-full bg-oud text-white` con numero
- Futuro: `w-8 h-8 rounded-full bg-ink/10 text-ink/40` con numero

Connettore: `flex-1 h-0.5` — `bg-sage/50` (completato) · `bg-ink/10` (futuro)

---

### Toast Notifications

```html
<!-- Posizionamento -->
fixed bottom-4 right-4 z-50 max-w-sm w-full

<!-- Struttura -->
flex items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-soft

<!-- Varianti border -->
border-sage/25   → successo
border-oud/20    → errore
border-saffron/30 → avviso
border-ink/12    → info
```

---

### Modal / AdminModal

Backdrop:

```html
<div class="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4">
```

Panel:

```html
<div class="relative bg-white rounded-xl shadow-soft max-w-lg w-full">
  <!-- Header -->
  <div class="flex items-center justify-between border-b border-ink/8 px-6 py-4">
    <h2 class="font-serif text-2xl text-ink">Titolo</h2>
    <button class="w-8 h-8 ...">×</button>
  </div>
  <!-- Body -->
  <div class="p-6 space-y-4 max-h-96 overflow-y-auto">...</div>
  <!-- Footer -->
  <div class="border-t border-ink/8 px-6 py-4 flex justify-end gap-3">
    <button>Annulla</button>
    <button>Conferma</button>
  </div>
</div>
```

---

### Cart Drawer

File: `src/components/storefront/cart-drawer.tsx`

- Drawer laterale (right): `fixed right-0 top-0 h-full w-full sm:max-w-sm bg-cream`
- Item: immagine 64×64 + nome + taglia + controllo qtà + prezzo
- Totals section: subtotale + spedizione + totale font-serif 2xl
- CTA: `w-full min-h-11 bg-oud text-white` → Stripe checkout

---

## Layout

### Header

```
sticky top-0 z-30 bg-cream/95 backdrop-blur-sm border-b border-ink/10
height: h-16
```

Elementi:
- Logo: `font-serif text-2xl` + subtitle `text-[9px] tracking-[0.2em] text-ink/45`
- Nav: link con underline-hover animata
- Actions: ricerca, wishlist, carrello (con badge bg-oud)
- Mobile: hamburger → drawer menu

---

### Footer

```
bg-ink text-cream/80
```

4 colonne: Brand+social · Negozio links · Info links · Contatti+pagamenti  
Bottom bar: `border-t border-cream/10 py-5` · copyright + P.IVA

---

## File struttura design system

```
docs/
  DESIGN_SYSTEM.md              ← questo file
  design-system/
    tokens/
      colors.html               ← palette + scala opacità + uso semantico
      typography.html           ← font families + scala + pattern overline
    components/
      buttons.html              ← tutti i bottoni + stati
      badges.html               ← order status, stock, attributi
      forms.html                ← input, select, checkbox, search
      product-card.html         ← card default, skeleton, hover pattern
      toast.html                ← success, error, warning, info
      metrics.html              ← KPI admin cards, order summary
      modal.html                ← confirm dialog, create order modal
      cart-summary.html         ← cart drawer, checkout summary
      order-stepper.html        ← 3-step stepper tutti gli stati
    layout/
      header.html               ← header con announcement bar
      footer.html               ← footer 4 colonne + bottom bar
```

---

## Componenti React — mappa file

| Componente | File |
| --- | --- |
| ProductCard | `src/components/product/product-card.tsx` |
| ProductCatalogClient | `src/components/storefront/product-catalog-client.tsx` |
| ProductQuickViewDialog | `src/components/storefront/product-quick-view-dialog.tsx` |
| CartDrawer | `src/components/storefront/cart-drawer.tsx` |
| CheckoutForm | `src/components/storefront/checkout-form.tsx` |
| OrdersClient | `src/components/admin/orders-client.tsx` |
| ProductManager | `src/components/admin/product-manager.tsx` |
| AdminNav | `src/components/admin/admin-nav.tsx` |
| SiteHeader | `src/components/layout/site-header.tsx` |
| SiteFooter | `src/components/layout/site-footer.tsx` |
| Toast / Toaster | `src/components/ui/toast.tsx` |

---

*Generato il 17 giugno 2026 — OUDÉ Maison D'Oriente*
