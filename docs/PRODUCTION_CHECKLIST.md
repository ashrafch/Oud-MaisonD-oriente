# Production Checklist

Documenti collegati:

- `docs/FUNCTIONAL_GUIDE.md`: come usare tutte le funzionalita.
- `docs/PROJECT_STATUS.md`: cosa e gia sviluppato e cosa manca.
- `docs/ROADMAP.md`: priorita evolutive.

## Supabase

- [ ] Create the Supabase project.
- [ ] Run `supabase/migrations/001_initial_schema.sql`.
- [ ] Run `supabase/seed.sql`.
- [ ] Create a Storage bucket named `product-images`.
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL`.
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY` only in server/Vercel env.
- [ ] Enable RLS policies for admin/staff/customer flows before opening admin to real users.
- [ ] Replace localStorage product/order/customer/coupon flows with Supabase queries and server actions.

## Stripe

- [ ] Add `STRIPE_SECRET_KEY`.
- [ ] Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- [ ] Configure webhook endpoint: `/api/webhooks/stripe`.
- [ ] Add `STRIPE_WEBHOOK_SECRET`.
- [ ] Test checkout completed, failed, cancelled and refund flows.
- [ ] Create order before redirecting to Stripe.
- [ ] Confirm paid order only from webhook.
- [ ] Update inventory only after payment confirmation.

## Vercel

- [ ] Import GitHub repository into Vercel.
- [ ] Set every variable from `.env.example`.
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production domain.
- [ ] Enable Vercel Analytics and Speed Insights if desired.
- [ ] Add custom domain and verify DNS.
- [ ] Run a production deploy and test storefront/admin routes.

## Legal and Commerce

- [ ] Replace placeholder privacy, terms, returns and shipping pages.
- [ ] Add VAT/company data, contact email, phone and store policy.
- [ ] Configure cookie consent management before enabling analytics/pixels.
- [ ] Add real shipping rules and return/refund rules.
- [ ] Add product ingredients, warnings and allergen notes where needed.

## Content

- [ ] Replace demo assets with product photography.
- [ ] Add real product descriptions, ingredients/warnings and shipping dimensions.
- [ ] Add reviews, FAQs and gift collection pages.
- [ ] Add real category images.
- [ ] Add store photography and brand storytelling.
