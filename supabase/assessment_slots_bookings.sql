-- Published assessment time slots + paid bookings (capacity per slot, typically 4 kids total).
-- Run in Supabase SQL Editor after `profiles.sql`. Webhook + service role write bookings; public reads slots via API (service aggregates).

create table if not exists public.assessment_slots (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  capacity integer not null default 4 check (capacity >= 1 and capacity <= 20),
  label text,
  created_at timestamptz default now(),
  unique (starts_at)
);

create index if not exists assessment_slots_starts_at_idx on public.assessment_slots (starts_at);

create table if not exists public.assessment_bookings (
  id uuid primary key default gen_random_uuid(),
  assessment_slot_id uuid not null references public.assessment_slots (id) on delete cascade,
  num_kids integer not null check (num_kids >= 1 and num_kids <= 4),
  stripe_session_id text not null unique,
  parent_full_name text,
  parent_email text,
  parent_user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz default now()
);

create index if not exists assessment_bookings_slot_idx on public.assessment_bookings (assessment_slot_id);
create index if not exists assessment_bookings_parent_user_idx on public.assessment_bookings (parent_user_id);

alter table public.assessment_slots enable row level security;
alter table public.assessment_bookings enable row level security;

-- Slots are not sensitive; allow read for anon (optional if you only use service API).
drop policy if exists "assessment_slots_select_all" on public.assessment_slots;
create policy "assessment_slots_select_all"
  on public.assessment_slots for select
  using (true);

-- Bookings: no client policies (service role bypasses RLS for inserts/updates).
