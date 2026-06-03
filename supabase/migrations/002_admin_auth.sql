alter type user_role add value if not exists 'super_admin';

create policy "users can read own profile" on profiles
  for select
  using (auth.uid() = id);

create policy "users can update own profile name" on profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.create_profile_for_new_user();
