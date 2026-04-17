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
  participant_dob date not null,
  parent_guardian_name text,
  participant_count integer,
  organization_name text,
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
