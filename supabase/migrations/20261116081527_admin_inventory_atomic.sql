create function public.set_admin_product_stock(p_product_id uuid, p_stock integer, p_note text)
returns void language plpgsql security invoker set search_path=public,pg_temp as $$
declare old_stock integer;
begin
  if p_stock < 0 or p_stock > 1000000 or length(p_note) > 1200 then raise exception 'Invalid stock'; end if;
  select stock into strict old_stock from public.products where id=p_product_id for update;
  update public.products set stock=p_stock,
    status=case when p_stock=0 and status='published' then 'sold_out'::public.product_status
      when p_stock>0 and status='sold_out' then 'published'::public.product_status else status end,
    updated_at=now() where id=p_product_id;
  if old_stock <> p_stock then
    insert into public.inventory_movements(product_id,quantity_delta,reason,note)
      values(p_product_id,p_stock-old_stock,case when p_stock>old_stock then 'carico_magazzino' else 'correzione_manuale' end,p_note);
  end if;
end $$;
revoke all on function public.set_admin_product_stock(uuid,integer,text) from public,anon,authenticated;
grant execute on function public.set_admin_product_stock(uuid,integer,text) to service_role;
