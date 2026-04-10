-- Run in Supabase SQL editor (once) so login → profile lookup works.
-- Includes RLS helpers so policies never subquery `profiles` from a policy ON `profiles`
-- (that pattern causes infinite recursion).

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('parent', 'staff', 'coach', 'admin')),
  full_name text,
  email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Helpers (same definitions as `rls_profile_helpers.sql` / `fix_profiles_rls_recursion.sql`).
create or replace function public.formula_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select lower(coalesce(p.role::text, ''))
  from public.profiles p
  where p.id = auth.uid()
  limit 1;
$$;

create or replace function public.formula_is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.formula_profile_role() in ('admin', 'coach', 'staff');
$$;

revoke all on function public.formula_profile_role() from public;
grant execute on function public.formula_profile_role() to authenticated;
grant execute on function public.formula_profile_role() to service_role;
revoke all on function public.formula_is_staff() from public;
grant execute on function public.formula_is_staff() to authenticated;
grant execute on function public.formula_is_staff() to service_role;

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_select_staff_all" on public.profiles;

-- Own row only. Do NOT add "staff read all" via formula_is_staff() here: that function
-- SELECTs profiles, which re-runs these policies and causes infinite recursion.
-- Staff roster / admin reads: use service role on the server, or a dedicated RPC.
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);

-- Optional: allow users to update their own row
-- create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
