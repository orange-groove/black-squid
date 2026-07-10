-- Multi-product support for the Black Squid hub.
--
-- The original EZStemz schema had a single `purchases` table with no notion of
-- *which* product was bought. Black Squid sells several apps (EZStemz,
-- KitForge, ...) from one Supabase project, so we add a `product` dimension.
--
-- `product` is a free-form text slug (matching src/lib/products.ts ids) rather
-- than an enum, so adding a new product never requires another migration.

alter table public.purchases
  add column if not exists product text not null default 'ezstemz';

-- Existing rows predate multi-product; they are all EZStemz licenses.
update public.purchases
  set product = 'ezstemz'
  where product is null or product = '';

-- Fast "does this user own product X (and is it paid)?" lookups, plus the
-- distinct-product scan used by the /my-products page.
create index if not exists purchases_user_product_status_idx
  on public.purchases (user_id, product, status);

-- Documents the intent for anyone reading the schema in the dashboard.
comment on column public.purchases.product is
  'Black Squid product slug this purchase grants (e.g. ezstemz, kitforge). Matches ids in src/lib/products.ts.';
