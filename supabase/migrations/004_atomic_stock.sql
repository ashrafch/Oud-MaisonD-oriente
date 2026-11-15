begin;

create or replace function public.apply_order_stock(p_order_id uuid, p_restore boolean default false)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  item record;
  current_stock integer;
  delta integer;
  movement_note text := 'ordine:' || p_order_id::text;
begin
  perform id from public.orders where id = p_order_id for update;
  if not found then raise exception 'Order not found'; end if;

  for item in
    select product_id, sum(quantity)::integer as quantity
    from public.order_items where order_id = p_order_id and product_id is not null
    group by product_id order by product_id
  loop
    select stock into strict current_stock from public.products where id = item.product_id for update;
    if p_restore then
      if exists (select 1 from public.inventory_movements
        where product_id = item.product_id and note = movement_note and reason in ('reso', 'rimborso')) then continue; end if;
      select -sum(quantity_delta)::integer into delta from public.inventory_movements
        where product_id = item.product_id and note = movement_note and reason = 'vendita';
      if delta is null or delta <= 0 then continue; end if;
    else
      if exists (select 1 from public.inventory_movements
        where product_id = item.product_id and note = movement_note and reason = 'vendita') then continue; end if;
      delta := -item.quantity;
      if current_stock + delta < 0 then raise exception 'Insufficient stock for product %', item.product_id; end if;
    end if;

    update public.products set stock = current_stock + delta,
      status = case when current_stock + delta = 0 then 'sold_out'::public.product_status
        when p_restore and status = 'sold_out' then 'published'::public.product_status else status end,
      updated_at = now() where id = item.product_id;
    insert into public.inventory_movements(product_id, quantity_delta, reason, note)
      values (item.product_id, delta, case when p_restore then 'reso' else 'vendita' end, movement_note);
  end loop;
end;
$$;

revoke all on function public.apply_order_stock(uuid, boolean) from public, anon, authenticated;
grant execute on function public.apply_order_stock(uuid, boolean) to service_role;

commit;
