begin;

-- Preserve server service-role access while denying browser access to private data.
alter table public.product_images enable row level security;
alter table public.product_categories enable row level security;
alter table public.collections enable row level security;
alter table public.order_items enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.coupons enable row level security;
alter table public.marketing_posts enable row level security;
alter table public.settings enable row level security;

revoke update on public.profiles from anon, authenticated;
grant update (full_name) on public.profiles to authenticated;

commit;
