# Production Checklist

## Supabase

- Create the Supabase project.
- Run `supabase/migrations/001_initial_schema.sql`.
- Run `supabase/seed.sql`.
- Create a Storage bucket named `product-images`.
- Enable RLS policies for admin/staff/customer flows before opening admin to real users.
- Replace localStorage product/order flows with Supabase queries and server actions.

## Stripe

- Add `STRIPE_SECRET_KEY`.
- Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- Configure webhook endpoint: `/api/webhooks/stripe`.
- Add `STRIPE_WEBHOOK_SECRET`.
- Test checkout completed, failed, cancelled and refund flows.

## Vercel

- Set every variable from `.env.example`.
- Set `NEXT_PUBLIC_SITE_URL` to the production domain.
- Enable Vercel Analytics and Speed Insights if desired.
- Add custom domain and verify DNS.

## Legal and Commerce

- Replace placeholder privacy, terms, returns and shipping pages.
- Add VAT/company data, contact email, phone and store policy.
- Configure cookie consent management before enabling analytics/pixels.

## Content

- Replace demo assets with product photography.
- Add real product descriptions, ingredients/warnings and shipping dimensions.
- Add reviews, FAQs and gift collection pages.
