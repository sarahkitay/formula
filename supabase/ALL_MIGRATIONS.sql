-- =============================================================================
-- FORMULA: consolidated schema (idempotent where possible)
--
-- Paste the whole file into the Supabase SQL editor and run once. Most sections use
-- IF NOT EXISTS / OR REPLACE / DROP IF EXISTS — safe to re-run when objects already exist.
--
-- Optional: comment out or skip the block labeled SOURCE: assessment_slots_seed_la_weekdays.sql
-- if you already have assessment slot rows you want to keep (that file inserts LA weekday slots).
--
-- Not bundled: rls_profile_helpers.sql (same helper functions as profiles.sql + fix_profiles_rls_recursion.sql).
--
-- Order: profiles → roster fix → players → portal service policies → assessments & slots →
--        parent block bookings → field rental → schedule config → Stripe ledger → coach notes → party deposits
--
-- ABOUT THE SQL EDITOR WARNING ("destructive operations"):
-- Supabase flags this script because it contains DROP POLICY (and a small DO block that drops
-- every policy on public.profiles before recreating a safe one). Nothing here DROP TABLE or
-- TRUNCATEs data. Those drops are intentional so policies can be recreated idempotently.
-- If you already ran these migrations before, confirming is still normal—the editor cannot
-- tell "safe" drops from dangerous ones. Review once, then proceed if this matches your repo.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- SOURCE: profiles.sql
-- -----------------------------------------------------------------------------
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


-- -----------------------------------------------------------------------------
-- SOURCE: fix_profiles_rls_recursion.sql
-- -----------------------------------------------------------------------------
-- Run in Supabase SQL Editor if you see:
--   "infinite recursion detected in policy for relation profiles"
--
-- Common causes:
-- (1) A policy ON public.profiles that subqueries public.profiles (EXISTS SELECT ... FROM profiles).
-- (2) A policy ON public.profiles that calls formula_is_staff() / formula_profile_role():
--     those functions SELECT from profiles, which re-evaluates RLS on profiles → infinite loop.
--
-- Fix: keep ONLY "read your own row" on profiles. Staff-wide reads must use service_role
-- or an Edge Function, not an RLS policy that calls a function which reads profiles again.

-- ---------------------------------------------------------------------------
-- 1) Helpers: still used by policies ON *other* tables (assessments, players, etc.).
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

-- Do NOT recreate profiles_select_staff_all using formula_is_staff(); it causes recursion.


-- -----------------------------------------------------------------------------
-- SOURCE: parent_players_players.sql
-- -----------------------------------------------------------------------------
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


-- -----------------------------------------------------------------------------
-- SOURCE: players_date_of_birth.sql
-- -----------------------------------------------------------------------------
-- Optional: athlete date of birth (portal signup + roster accuracy). Run after `parent_players_players.sql`.

alter table public.players
  add column if not exists date_of_birth date;

comment on column public.players.date_of_birth is 'Collected at parent portal signup; used with age_group for scheduling eligibility.';


-- -----------------------------------------------------------------------------
-- SOURCE: parent_portal_signup_service_policies.sql
-- -----------------------------------------------------------------------------
-- Run in Supabase SQL Editor if portal signup returns 500 on profile/player inserts.
-- No DROP statements: safe to run in the editor without "destructive query" warnings.
-- Idempotent: skips CREATE if the policy name already exists.
--
-- If you ever need to change a policy definition, drop it manually in the Dashboard
-- (Authentication → Policies) or run: drop policy "name" on public.tablename;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'profiles_insert_service'
  ) THEN
    CREATE POLICY "profiles_insert_service"
      ON public.profiles FOR INSERT
      WITH CHECK (auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'profiles_update_service'
  ) THEN
    CREATE POLICY "profiles_update_service"
      ON public.profiles FOR UPDATE
      USING (auth.role() = 'service_role')
      WITH CHECK (auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'players' AND policyname = 'players_insert_service'
  ) THEN
    CREATE POLICY "players_insert_service"
      ON public.players FOR INSERT
      WITH CHECK (auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'parent_players' AND policyname = 'parent_players_insert_service'
  ) THEN
    CREATE POLICY "parent_players_insert_service"
      ON public.parent_players FOR INSERT
      WITH CHECK (auth.role() = 'service_role');
  END IF;
END $$;


-- -----------------------------------------------------------------------------
-- SOURCE: assessments.sql
-- -----------------------------------------------------------------------------
-- Assessments recorded by staff; parents read rows for linked players only (via RLS).
-- Run after `parent_players_players.sql` so `public.players` exists.

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players (id) on delete cascade,
  summary text,
  completed_at timestamptz,
  pillar_scores jsonb not null default '{}'::jsonb,
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
drop policy if exists "assessments_select_linked_parent" on public.assessments;
create policy "assessments_select_linked_parent"
  on public.assessments for select
  using (
    exists (
      select 1 from public.parent_players pp
      where pp.player_id = assessments.player_id
        and pp.parent_user_id = auth.uid()
    )
  );


-- -----------------------------------------------------------------------------
-- SOURCE: assessments_pillar_scores.sql
-- -----------------------------------------------------------------------------
-- Optional pillar scores (0–100) stored with each assessment for parent-facing progress UI.
-- Run after `assessments.sql`.

alter table public.assessments
  add column if not exists pillar_scores jsonb not null default '{}'::jsonb;

comment on column public.assessments.pillar_scores is
  'Optional keys: technical, speed, agility, endurance, strength (numbers 0–100).';


-- -----------------------------------------------------------------------------
-- SOURCE: assessment_slots_bookings.sql
-- -----------------------------------------------------------------------------
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


-- -----------------------------------------------------------------------------
-- SOURCE: assessment_bookings_parent_select.sql
-- -----------------------------------------------------------------------------
-- Allow signed-in parents to read assessment rows linked to their account (portal + dashboard).
-- Run in Supabase SQL Editor after `assessment_slots_bookings.sql`.

drop policy if exists "assessment_bookings_select_own" on public.assessment_bookings;
create policy "assessment_bookings_select_own"
  on public.assessment_bookings for select
  using (auth.uid() is not null and auth.uid() = parent_user_id);


-- -----------------------------------------------------------------------------
-- SOURCE: assessment_slots_seed_la_weekdays.sql
-- -----------------------------------------------------------------------------
-- Skills Check windows: weekdays only, five starts per day, 8:00–16:00 Los Angeles wall time
-- (60 min blocks; last start 15:00 ends 16:00 — adjust times array if you want 16:00 starts ending 17:00).
--
-- Parent portal vs this data:
--   • Clearing ONLY assessment_slots / assessment_bookings does NOT delete auth users, profiles,
--     parent_players, or players.
--   • It DOES remove assessment booking rows (slot picks, stripe_session_id links). Portal
--     won’t show those past assessment bookings until they exist again in assessment_bookings.
--
-- If rows already reference slots, clear bookings first (or use cascade):
--   truncate table public.assessment_bookings;
--   truncate table public.assessment_slots;
--
-- Then run the INSERT below (safe to re-run: ON CONFLICT DO NOTHING on starts_at).

insert into public.assessment_slots (starts_at, capacity, label)
select
  (day_d + slot_t) at time zone 'America/Los_Angeles',
  4,
  'Formula Skills Check · ~60 min'
from generate_series(
  (timezone('America/Los_Angeles', now()))::date + 1,
  (timezone('America/Los_Angeles', now()))::date + 56,
  interval '1 day'
) as g (day_d)
cross join lateral (
  values
    (time '08:00'),
    (time '09:45'),
    (time '11:30'),
    (time '13:15'),
    (time '15:00')
) as t (slot_t)
where extract(isodow from day_d) between 1 and 5
on conflict (starts_at) do nothing;


-- -----------------------------------------------------------------------------
-- SOURCE: parent_block_bookings.sql
-- -----------------------------------------------------------------------------
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


-- -----------------------------------------------------------------------------
-- SOURCE: parent_block_bookings_staff_select.sql
-- -----------------------------------------------------------------------------
-- Allow coaches/staff/admins to read all parent block bookings (e.g. coach attendance, floor views).
-- Run after `parent_block_bookings.sql` and `rls_profile_helpers.sql`.

drop policy if exists "parent_block_bookings_select_staff" on public.parent_block_bookings;
create policy "parent_block_bookings_select_staff"
  on public.parent_block_bookings for select
  using (public.formula_is_staff());


-- -----------------------------------------------------------------------------
-- SOURCE: youth_block_booking_counts.sql
-- -----------------------------------------------------------------------------
-- Aggregate confirmed youth block bookings per slot for a week (public read via RPC; no PII in result).
-- Run in Supabase SQL editor after parent_block_bookings exists.

create index if not exists parent_block_bookings_week_slot_confirmed_idx
  on public.parent_block_bookings (week_start, slot_ref)
  where status = 'confirmed';

create or replace function public.youth_block_booking_counts(p_week_start date)
returns table (slot_ref text, enrolled bigint)
language sql
stable
security definer
set search_path = public
as $$
  select b.slot_ref, count(*)::bigint as enrolled
  from public.parent_block_bookings b
  where b.status = 'confirmed'
    and b.week_start = p_week_start
    and b.slot_ref like 'book-%'
  group by b.slot_ref;
$$;

revoke all on function public.youth_block_booking_counts(date) from public;
grant execute on function public.youth_block_booking_counts(date) to anon, authenticated;

comment on function public.youth_block_booking_counts(date) is
  'Confirmed booking counts per book-* slot_ref for marketing and portal capacity (RLS-safe aggregate).';


-- -----------------------------------------------------------------------------
-- SOURCE: field_rental_agreements.sql
-- -----------------------------------------------------------------------------
-- Field Rental Agreement & Facility Use Waiver submissions from the public site.
-- Inserts use SUPABASE_SERVICE_ROLE_KEY from Next.js server actions / API (bypasses RLS).
-- Admin UI lists rows the same way (trusted server only).
--
-- Run in Supabase SQL Editor after you are ready to persist waivers.

create table if not exists public.field_rental_agreements (
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default now(),
  rental_type text not null,
  participant_name text not null,
  participant_email text not null,
  participant_phone text,
  participant_address text,
  participant_dob date not null,
  parent_guardian_name text,
  participant_count integer,
  organization_name text,
  emergency_contact text,
  signature_name text not null,
  signature_data_url text not null,
  notes text,
  agreement_accepted boolean not null default true,
  risk_accepted boolean not null default true,
  rules_accepted boolean not null default true,
  stripe_checkout_session_id text,
  source text not null default 'public_site'
);

create index if not exists field_rental_agreements_submitted_at_idx
  on public.field_rental_agreements (submitted_at desc);

create index if not exists field_rental_agreements_email_idx
  on public.field_rental_agreements (participant_email);

comment on table public.field_rental_agreements is
  'Signed field rental waivers from marketing / book-assessment flows; PNG data URL in signature_data_url.';

alter table public.field_rental_agreements enable row level security;

-- Intentionally no policies: only the service role (server) reads/writes, same pattern as rental_slot_bookings.


-- -----------------------------------------------------------------------------
-- SOURCE: rental_slot_bookings.sql
-- -----------------------------------------------------------------------------
-- Field rental slot holds: one active row per field + date + time window.
-- Run in Supabase SQL editor when using production slot locking (optional; API falls back to in-memory store if table missing).

create table if not exists public.rental_slot_bookings (
  id uuid primary key default gen_random_uuid(),
  field_id text not null,
  session_date date not null,
  time_slot text not null,
  rental_ref text not null,
  stripe_checkout_session_id text,
  status text not null check (status in ('pending', 'confirmed')),
  pending_expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (field_id, session_date, time_slot)
);

create index if not exists rental_slot_bookings_date_idx on public.rental_slot_bookings (session_date);
create index if not exists rental_slot_bookings_ref_idx on public.rental_slot_bookings (rental_ref);

alter table public.rental_slot_bookings enable row level security;

-- No policies: service role only (API routes / webhook).


-- -----------------------------------------------------------------------------
-- SOURCE: facility_schedule_config.sql
-- -----------------------------------------------------------------------------
-- Singleton JSON config for published facility schedule (overrides, blackout days, cycle copy).
-- Apply with Supabase SQL editor or CLI. Server routes use service_role only (no anon/authenticated grants).

create table if not exists public.facility_schedule_config (
  id int primary key check (id = 1),
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.facility_schedule_config (id, payload)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

revoke all on public.facility_schedule_config from public;
revoke all on public.facility_schedule_config from anon;
revoke all on public.facility_schedule_config from authenticated;

grant select, insert, update, delete on public.facility_schedule_config to service_role;

alter table public.facility_schedule_config enable row level security;


-- -----------------------------------------------------------------------------
-- SOURCE: stripe_purchases.sql
-- -----------------------------------------------------------------------------
-- Completed Stripe Checkout sessions (written from webhook only; use service role).
-- Run in Supabase SQL editor after enabling Stripe webhook to this project.
--
-- Inserts use lib/stripe/record-purchase.ts; column names must match exactly.

create table if not exists public.stripe_purchases (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  stripe_customer_id text,
  stripe_payment_intent_id text,
  email text,
  type text not null,
  amount integer not null,
  currency text,
  payment_status text,
  metadata jsonb,
  created_at timestamptz default now()
);

create index if not exists stripe_purchases_email_idx on public.stripe_purchases (email);
create index if not exists stripe_purchases_type_idx on public.stripe_purchases (type);

alter table public.stripe_purchases enable row level security;

-- No policies: only service role (bypasses RLS) should access this table.


-- -----------------------------------------------------------------------------
-- SOURCE: coach_notes.sql
-- -----------------------------------------------------------------------------
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


-- -----------------------------------------------------------------------------
-- SOURCE: party_bookings.sql
-- -----------------------------------------------------------------------------
-- Paid party deposits ($1k) with required field-rental-style details. Service role inserts (webhook); admin lists read-only.
-- Run in Supabase SQL Editor when ready.

create table if not exists public.party_bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  stripe_checkout_session_id text not null unique,
  amount_total_cents integer not null default 100000,
  customer_email text,
  contact_name text not null,
  contact_phone text,
  party_preferred_date date not null,
  party_guest_count integer not null,
  party_child_name text,
  party_notes text,
  rental_field_id text not null,
  rental_session_date date not null,
  rental_time_slot text not null,
  rental_headcount integer not null,
  rental_organization text,
  rental_notes text
);

create index if not exists party_bookings_created_at_idx on public.party_bookings (created_at desc);
create index if not exists party_bookings_email_idx on public.party_bookings (customer_email);

comment on table public.party_bookings is
  'Stripe-paid party deposits; rental block mirrors public field rental picker for ops scheduling.';

alter table public.party_bookings enable row level security;


-- -----------------------------------------------------------------------------
-- SOURCE: field_rental_waiver_invites.sql
-- -----------------------------------------------------------------------------
-- Roster waiver links: expected N individual waivers; each `field_rental_agreements` row can reference `waiver_invite_id`.
-- Created after paid field-rental checkout (webhook) or manually; token is the public path segment.

create table if not exists public.field_rental_waiver_invites (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  expected_waiver_count int not null check (expected_waiver_count >= 1 and expected_waiver_count <= 500),
  rental_ref text,
  rental_type text,
  stripe_checkout_session_id text unique,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists field_rental_waiver_invites_created_idx
  on public.field_rental_waiver_invites (created_at desc);

comment on table public.field_rental_waiver_invites is
  'Shareable roster waiver links; token used at /rentals/waiver/[token]. expected_waiver_count vs agreements with waiver_invite_id.';

alter table public.field_rental_agreements
  add column if not exists waiver_invite_id uuid references public.field_rental_waiver_invites (id) on delete set null;

create index if not exists field_rental_agreements_waiver_invite_idx
  on public.field_rental_agreements (waiver_invite_id);

alter table public.field_rental_waiver_invites enable row level security;


-- -----------------------------------------------------------------------------
-- SOURCE: field_rental_agreements_checkout_snapshot.sql
-- -----------------------------------------------------------------------------
alter table public.field_rental_agreements
  add column if not exists checkout_amount_total_cents integer,
  add column if not exists checkout_currency text,
  add column if not exists booking_rental_field text,
  add column if not exists booking_rental_window text,
  add column if not exists booking_rental_date text,
  add column if not exists booking_rental_dates_compact text,
  add column if not exists booking_session_weeks integer,
  add column if not exists booking_headcount_at_checkout integer;

comment on column public.field_rental_agreements.checkout_amount_total_cents is
  'Stripe Checkout amount_total (cents) when snapshot was taken at waiver submit.';
comment on column public.field_rental_agreements.booking_headcount_at_checkout is
  'Headcount from checkout metadata (rental_participants), not per-waiver roster count.';


-- -----------------------------------------------------------------------------
-- SOURCE: field_rental_waiver_invites_checkout_snapshot.sql
-- -----------------------------------------------------------------------------
alter table public.field_rental_waiver_invites
  add column if not exists purchaser_name text,
  add column if not exists purchaser_email text,
  add column if not exists checkout_amount_total_cents integer,
  add column if not exists checkout_currency text,
  add column if not exists checkout_completed_at timestamptz,
  add column if not exists booking_rental_field text,
  add column if not exists booking_rental_window text,
  add column if not exists booking_rental_date text,
  add column if not exists booking_rental_dates_compact text,
  add column if not exists booking_session_weeks integer;

comment on column public.field_rental_waiver_invites.purchaser_name is
  'Cardholder / customer name from Stripe Checkout when the roster link was created.';
comment on column public.field_rental_waiver_invites.checkout_completed_at is
  'Approximate time the paid checkout was recorded (webhook handler).';


-- -----------------------------------------------------------------------------
-- SOURCE: field_rental_agreements_participant_address_emergency.sql
-- -----------------------------------------------------------------------------
alter table public.field_rental_agreements
  add column if not exists participant_address text,
  add column if not exists emergency_contact text;

comment on column public.field_rental_agreements.participant_address is
  'Street address as provided on the liability waiver.';
comment on column public.field_rental_agreements.emergency_contact is
  'Emergency contact name and phone as provided on the waiver (single field).';


-- -----------------------------------------------------------------------------
-- SOURCE: field_rental_slot_waiver_checkins.sql
-- -----------------------------------------------------------------------------
create table if not exists public.field_rental_slot_waiver_checkins (
  id uuid primary key default gen_random_uuid(),
  rental_slot_booking_id uuid not null references public.rental_slot_bookings (id) on delete cascade,
  field_rental_agreement_id uuid not null references public.field_rental_agreements (id) on delete cascade,
  checked_in_at timestamptz not null default now(),
  checked_in_by text,
  unique (rental_slot_booking_id, field_rental_agreement_id)
);

create index if not exists field_rental_slot_waiver_checkins_booking_idx
  on public.field_rental_slot_waiver_checkins (rental_slot_booking_id);

create index if not exists field_rental_slot_waiver_checkins_agreement_idx
  on public.field_rental_slot_waiver_checkins (field_rental_agreement_id);

comment on table public.field_rental_slot_waiver_checkins is
  'Staff check-in: confirms each waiver signer showed up for this rental_slot_bookings row.';

alter table public.field_rental_slot_waiver_checkins enable row level security;


-- -----------------------------------------------------------------------------
-- SOURCE: career_applications.sql
-- -----------------------------------------------------------------------------
create table if not exists public.career_applications (
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default now(),
  position text not null check (position in ('front_desk', 'coach')),
  full_name text not null,
  email text not null,
  phone text,
  message text not null,
  availability text,
  coaching_background text
);

create index if not exists career_applications_submitted_at_idx
  on public.career_applications (submitted_at desc);

create index if not exists career_applications_position_idx
  on public.career_applications (position);

comment on table public.career_applications is
  'Marketing /careers form submissions; coaching_background used when position = coach.';

alter table public.career_applications enable row level security;

