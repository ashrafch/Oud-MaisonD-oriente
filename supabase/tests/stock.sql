-- Run only against a disposable database initialized with the migrations.
begin;
do $$
declare
  product uuid := uuid_generate_v4();
  sale uuid := uuid_generate_v4();
  available integer;
begin
  insert into products(id, name, slug, price, stock, status) values(product, 'Test', product::text, 10, 5, 'published');
  insert into orders(id, status, payment_status) values(sale, 'paid', 'paid');
  insert into order_items(order_id, product_id, product_name, quantity, unit_price) values(sale, product, 'Test', 2, 10);
  perform apply_order_stock(sale, false);
  perform apply_order_stock(sale, false);
  select stock into available from products where id = product;
  if available <> 3 then raise exception 'Duplicate sale changed stock: %', available; end if;
  perform apply_order_stock(sale, true);
  perform apply_order_stock(sale, true);
  select stock into available from products where id = product;
  if available <> 5 then raise exception 'Duplicate refund changed stock: %', available; end if;
  if has_function_privilege('authenticated', 'public.apply_order_stock(uuid,boolean)', 'execute') then
    raise exception 'Customer can mutate stock';
  end if;
  if has_column_privilege('authenticated', 'public.profiles', 'role', 'update') then
    raise exception 'Customer can update own role';
  end if;
end $$;
rollback;
