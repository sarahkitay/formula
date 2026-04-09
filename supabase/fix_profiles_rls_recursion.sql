-- Run in Supabase SQL Editor if you see:
--   "infinite recursion detected in policy for relation profiles"
--
-- Cause: a policy ON public.profiles that uses a subquery on public.profiles
-- (e.g. EXISTS (SELECT 1 FROM profiles ...)) re-enters RLS forever.
--
-- This script: (1) installs safe helper functions, (2) drops ALL policies on
-- public.profiles, (3) recreates non-recursive policies. Review Step 2 if you
-- had custom profile policies you still need.

-- ---------------------------------------------------------------------------
-- 1) Helpers — SECURITY DEFINER reads profiles as owner (RLS not re-applied).
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- 2) Remove every policy on public.profiles (removes the recursive one).
-- ---------------------------------------------------------------------------
do $$
declare
  r record;
begin
  for r in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
  loop
    execute format('drop policy if exists %I on public.profiles', r.policyname);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 3) Safe replacements
-- ---------------------------------------------------------------------------
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_select_staff_all"
  on public.profiles for select
  using (public.formula_is_staff());

-- Optional: tighten staff (e.g. admin-only) by editing formula_is_staff or this policy.
