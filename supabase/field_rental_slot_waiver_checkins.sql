-- Per rental slot booking: which signed waivers (field_rental_agreements) were marked present at check-in.
-- One row per (rental_slot_booking, agreement); staff toggles from admin schedule rental modal.

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
