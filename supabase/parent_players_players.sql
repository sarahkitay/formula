-- Optional schema for parent hub + staff roster. Run after `profiles.sql` if you use linked athletes.

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  age_group text,
  date_of_birth date,
  created_at timestamptz default now()
);

create table if not exists public.parent_players (
  id uuid primary key default gen_random_uuid(),
  parent_user_id uuid not null references auth.users (id) on delete cascade,
  player_id uuid not null references public.players (id) on delete cascade,
  created_at timestamptz default now(),
  unique (parent_user_id, player_id)
);

create index if not exists parent_players_parent_idx on public.parent_players (parent_user_id);
create index if not exists parent_players_player_idx on public.parent_players (player_id);

alter table public.players enable row level security;
alter table public.parent_players enable row level security;

-- Parent: read own links
drop policy if exists "parent_players_select_own" on public.parent_players;
create policy "parent_players_select_own"
  on public.parent_players for select
  using (auth.uid() = parent_user_id);

-- Parent: read players linked to them
drop policy if exists "players_select_for_linked_parent" on public.players;
create policy "players_select_for_linked_parent"
  on public.players for select
  using (
    exists (
      select 1 from public.parent_players pp
      where pp.player_id = players.id and pp.parent_user_id = auth.uid()
    )
  );

-- Requires `formula_is_staff()` from `profiles.sql` / `rls_profile_helpers.sql`.

-- Staff roles: read all players (adjust if you need tighter scope)
drop policy if exists "players_select_staff" on public.players;
create policy "players_select_staff"
  on public.players for select
  using (public.formula_is_staff());

-- Staff: read parent_players for ops (optional; tighten later)
drop policy if exists "parent_players_select_staff" on public.parent_players;
create policy "parent_players_select_staff"
  on public.parent_players for select
  using (public.formula_is_staff());
