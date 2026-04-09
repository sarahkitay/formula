-- Assessments recorded by staff; parents read rows for linked players only (via RLS).
-- Run after `parent_players_players.sql` so `public.players` exists.

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players (id) on delete cascade,
  summary text,
  completed_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists assessments_player_id_idx on public.assessments (player_id);
create index if not exists assessments_completed_at_idx on public.assessments (completed_at desc nulls last);

alter table public.assessments enable row level security;

-- Requires `formula_is_staff()` from `profiles.sql` / `rls_profile_helpers.sql` (security definer; avoids profiles RLS recursion).

-- Staff: create assessments for any player
drop policy if exists "assessments_insert_staff" on public.assessments;
create policy "assessments_insert_staff"
  on public.assessments for insert
  with check (public.formula_is_staff());

-- Staff: read all assessments (roster + history)
drop policy if exists "assessments_select_staff" on public.assessments;
create policy "assessments_select_staff"
  on public.assessments for select
  using (public.formula_is_staff());

-- Parent: read assessments only for athletes linked in parent_players
create policy "assessments_select_linked_parent"
  on public.assessments for select
  using (
    exists (
      select 1 from public.parent_players pp
      where pp.player_id = assessments.player_id
        and pp.parent_user_id = auth.uid()
    )
  );
