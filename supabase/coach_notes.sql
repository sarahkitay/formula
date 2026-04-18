-- Coach session notes (staff-authored). Run after `players.sql` / `rls_profile_helpers.sql`.

create table if not exists public.coach_notes (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players (id) on delete cascade,
  coach_user_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists coach_notes_player_created_idx
  on public.coach_notes (player_id, created_at desc);

create index if not exists coach_notes_coach_created_idx
  on public.coach_notes (coach_user_id, created_at desc);

alter table public.coach_notes enable row level security;

drop policy if exists "coach_notes_select_staff" on public.coach_notes;
create policy "coach_notes_select_staff"
  on public.coach_notes for select
  using (public.formula_is_staff());

drop policy if exists "coach_notes_insert_staff" on public.coach_notes;
create policy "coach_notes_insert_staff"
  on public.coach_notes for insert
  with check (
    public.formula_is_staff()
    and coach_user_id = auth.uid()
  );

drop policy if exists "coach_notes_update_own" on public.coach_notes;
create policy "coach_notes_update_own"
  on public.coach_notes for update
  using (public.formula_is_staff() and coach_user_id = auth.uid())
  with check (public.formula_is_staff() and coach_user_id = auth.uid());

drop policy if exists "coach_notes_delete_own" on public.coach_notes;
create policy "coach_notes_delete_own"
  on public.coach_notes for delete
  using (public.formula_is_staff() and coach_user_id = auth.uid());

comment on table public.coach_notes is
  'Short staff notes tied to a roster player; visible to all staff, editable by author.';
