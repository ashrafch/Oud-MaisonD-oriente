create extension if not exists "uuid-ossp";

create type user_role as enum ('admin', 'staff', 'customer');
create type product_status as enum ('draft', 'published', 'hidden', 'sold_out');
create type order_status as enum ('new', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'customer',
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  is_visible boolean not null default true,
  sort_order int not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  brand text,
  sku text unique,
  barcode text,
  status product_status not null default 'draft',
  price numeric(10,2) not null check (price >= 0),
  compare_at_price numeric(10,2),
  stock int not null default 0 check (stock >= 0),
  low_stock_threshold int not null default 5,
  short_description text,
  long_description text,
  fragrance_family text,
  top_notes text[],
  heart_notes text[],
  base_notes text[],
  intensity text,
  longevity text,
  occasion text,
  season text,
  gender text check (gender in ('uomo', 'donna', 'unisex')),
  tags text[] not null default '{}',
  is_featured boolean not null default false,
  is_bestseller boolean not null default false,
  is_new boolean not null default false,
  is_gift_idea boolean not null default false,
  seo_title text,
  seo_description text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  alt text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table collections (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table product_categories (
  product_id uuid references products(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  primary key (product_id, category_id)
);

create table customers (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references customers(id),
  stripe_checkout_session_id text unique,
  status order_status not null default 'new',
  payment_status text,
  fulfillment_status text,
  shipping_status text,
  total_amount numeric(10,2) not null default 0,
  currency text not null default 'EUR',
  tracking_code text,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
  quantity int not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table inventory_movements (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  quantity_delta int not null,
  reason text not null check (reason in ('vendita', 'carico_magazzino', 'reso', 'correzione_manuale', 'danneggiato')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table carts (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references customers(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table cart_items (
  id uuid primary key default uuid_generate_v4(),
  cart_id uuid not null references carts(id) on delete cascade,
  product_id uuid not null references products(id),
  quantity int not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table wishlist_items (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references customers(id),
  product_id uuid not null references products(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table coupons (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value numeric(10,2) not null,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  customer_id uuid references customers(id),
  rating int not null check (rating between 1 and 5),
  title text,
  body text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table marketing_posts (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id),
  channel text not null,
  caption text not null,
  hashtags text[],
  status text not null default 'draft',
  scheduled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table settings (
  id uuid primary key default uuid_generate_v4(),
  key text not null unique,
  value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_status_idx on products(status);
create index products_slug_idx on products(slug);
create index orders_status_idx on orders(status);
create index inventory_movements_product_id_idx on inventory_movements(product_id);

alter table profiles enable row level security;
alter table products enable row level security;
alter table categories enable row level security;
alter table orders enable row level security;
alter table customers enable row level security;
alter table reviews enable row level security;

create policy "public can read published products" on products for select using (status = 'published' and deleted_at is null);
create policy "public can read visible categories" on categories for select using (is_visible = true);
