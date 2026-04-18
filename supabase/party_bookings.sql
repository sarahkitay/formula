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
