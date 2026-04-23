-- Denormalized Stripe checkout + booking picker fields when a roster waiver is tied to a paid field-rental session.
-- Populated on waiver submit from the invite’s checkout session (server-side Stripe read).

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
