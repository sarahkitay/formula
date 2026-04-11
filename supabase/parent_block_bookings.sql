-- Parent-saved youth block / schedule holds (portal bookings). Run after `parent_players_players.sql`.

create table if not exists public.parent_block_bookings (
  id uuid primary key default gen_random_uuid(),
  parent_user_id uuid not null references auth.users (id) on delete cascade,
  player_id uuid not null references public.players (id) on delete cascade,
  slot_ref text not null,
  week_start date not null,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (parent_user_id, player_id, slot_ref, week_start)
);

create index if not exists parent_block_bookings_parent_starts_idx
  on public.parent_block_bookings (parent_user_id, starts_at desc);

alter table public.parent_block_bookings enable row level security;

drop policy if exists "parent_block_bookings_select_own" on public.parent_block_bookings;
create policy "parent_block_bookings_select_own"
  on public.parent_block_bookings for select
  using (auth.uid() = parent_user_id);

drop policy if exists "parent_block_bookings_insert_linked" on public.parent_block_bookings;
create policy "parent_block_bookings_insert_linked"
  on public.parent_block_bookings for insert
  with check (
    auth.uid() = parent_user_id
    and exists (
      select 1 from public.parent_players pp
      where pp.parent_user_id = auth.uid()
        and pp.player_id = parent_block_bookings.player_id
    )
  );

drop policy if exists "parent_block_bookings_update_own" on public.parent_block_bookings;
create policy "parent_block_bookings_update_own"
  on public.parent_block_bookings for update
  using (auth.uid() = parent_user_id)
  with check (auth.uid() = parent_user_id);

drop policy if exists "parent_block_bookings_delete_own" on public.parent_block_bookings;
create policy "parent_block_bookings_delete_own"
  on public.parent_block_bookings for delete
  using (auth.uid() = parent_user_id);

comment on table public.parent_block_bookings is
  'Parent portal schedule reservations; slot_ref matches generated bookable slot ids or legacy session ids.';
