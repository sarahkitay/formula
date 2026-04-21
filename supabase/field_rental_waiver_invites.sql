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
