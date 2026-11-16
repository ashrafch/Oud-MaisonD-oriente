create table public.api_rate_limits (
  key text primary key,
  hits integer not null,
  expires_at timestamptz not null
);
alter table public.api_rate_limits enable row level security;
revoke all on public.api_rate_limits from anon, authenticated;
grant all on public.api_rate_limits to service_role;
create index api_rate_limits_expiry on public.api_rate_limits(expires_at);

create function public.consume_api_rate_limit(p_key text, p_limit integer, p_seconds integer)
returns boolean language plpgsql security invoker set search_path = public, pg_temp as $$
declare count_hits integer;
begin
  if p_limit < 1 or p_seconds < 1 or length(p_key) > 128 then raise exception 'Invalid rate limit'; end if;
  delete from public.api_rate_limits where expires_at < now();
  insert into public.api_rate_limits as limits(key,hits,expires_at)
    values(p_key,1,now()+make_interval(secs=>p_seconds))
    on conflict(key) do update set hits=limits.hits+1
    returning hits into count_hits;
  return count_hits <= p_limit;
end $$;
revoke all on function public.consume_api_rate_limit(text,integer,integer) from public,anon,authenticated;
grant execute on function public.consume_api_rate_limit(text,integer,integer) to service_role;
