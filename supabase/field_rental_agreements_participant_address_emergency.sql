-- Participant address and emergency contact for Golazo / Formula Soccer waiver records.

alter table public.field_rental_agreements
  add column if not exists participant_address text,
  add column if not exists emergency_contact text;

comment on column public.field_rental_agreements.participant_address is
  'Street address as provided on the liability waiver.';
comment on column public.field_rental_agreements.emergency_contact is
  'Emergency contact name and phone as provided on the waiver (single field).';
