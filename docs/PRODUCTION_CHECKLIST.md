# Production Checklist

Documenti collegati:

- `docs/FUNCTIONAL_GUIDE.md`: come usare tutte le funzionalita.
- `docs/PROJECT_STATUS.md`: cosa e gia sviluppato e cosa manca.
- `docs/ROADMAP.md`: priorita evolutive.
- `docs/SUPABASE_ADMIN_AUTH.md`: configurazione accesso admin/super admin.

## Supabase

- [x] Create the Supabase project.
- [x] Run `supabase/migrations/001_initial_schema.sql`.
- [x] Run `supabase/seed.sql`.
- [x] Create a Storage bucket named `product-images`.
- [x] Add `NEXT_PUBLIC_SUPABASE_URL`.
- [x] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [x] Add `SUPABASE_SERVICE_ROLE_KEY` only in server/Vercel env.
- [x] Read storefront catalog, categories and product SEO pages from Supabase with local fallback.
- [x] Save, duplicate, soft-delete and upload product images from admin to Supabase/Storage.
- [x] Add Supabase Auth login/logout for `/admin`.
- [x] Protect admin pages and admin product APIs behind authorized Supabase users.
- [x] Add `super_admin` for the project creator and `admin` for the store owner.
- [x] Run `supabase/migrations/002_admin_auth.sql`.
- [x] Create the two Supabase Auth users and put their emails in `ADMIN_SUPER_EMAILS` and `ADMIN_EMAILS`.
- [x] Set `ADMIN_AUTH_ENABLED=true` locally after users are created.
- [ ] Set the same admin auth env vars on Vercel when deployment is configured.
- [ ] Enable deeper RLS policies for customer-facing personal data before opening accounts to real customers.
- [ ] Replace localStorage order/customer/coupon flows with Supabase queries and server actions.

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
