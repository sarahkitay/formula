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
