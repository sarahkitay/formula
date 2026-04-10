-- Run in Supabase SQL Editor if you see:
--   "infinite recursion detected in policy for relation profiles"
--
-- Common causes:
-- (1) A policy ON public.profiles that subqueries public.profiles (EXISTS SELECT ... FROM profiles).
-- (2) A policy ON public.profiles that calls formula_is_staff() / formula_profile_role():
--     those functions SELECT from profiles, which re-evaluates RLS on profiles → infinite loop.
--
-- Fix: keep ONLY "read your own row" on profiles. Staff-wide reads must use service_role
-- or an Edge Function — not an RLS policy that calls a function which reads profiles again.

-- ---------------------------------------------------------------------------
-- 1) Helpers — still used by policies ON *other* tables (assessments, players, etc.).
--    They only fetch the caller's row (auth.uid()); with a single "own row" policy on
--    profiles, that inner SELECT succeeds without recursion.
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

-- Optional: if profiles had FORCE RLS, table owner would still hit policies (rare).
-- alter table public.profiles no force row level security;

-- ---------------------------------------------------------------------------
-- 2) Remove every policy on public.profiles, then recreate safe SELECT only.
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

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- Do NOT recreate profiles_select_staff_all using formula_is_staff() — it causes recursion.
