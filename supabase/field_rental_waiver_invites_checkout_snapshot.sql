-- Purchaser + booking snapshot when a roster link is created from paid field-rental checkout (webhook).
-- Lets admin see who paid, how much, session window/dates, and progress vs expected signers without re-querying Stripe.

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
