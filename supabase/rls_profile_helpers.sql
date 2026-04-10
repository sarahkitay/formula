-- SECURITY DEFINER helpers: read the caller's profile row (WHERE id = auth.uid()).
-- Use on policies for *other* tables (e.g. assessments) instead of subquerying profiles.
--
-- Never use these inside a policy ON public.profiles, and do not add "staff read all profiles"
-- with formula_is_staff(): that SELECT hits profiles RLS again → infinite recursion.
-- On profiles, only: using (auth.uid() = id).

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
