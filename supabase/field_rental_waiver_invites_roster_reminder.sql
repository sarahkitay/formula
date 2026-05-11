-- One-shot ops email ~1h before first booked session when roster still incomplete (cron-driven).

alter table public.field_rental_waiver_invites
  add column if not exists roster_incomplete_premeeting_reminder_sent_at timestamptz;

comment on column public.field_rental_waiver_invites.roster_incomplete_premeeting_reminder_sent_at is
  'When admin was emailed that this roster link still had missing waivers shortly before the first session (facility-local start from booking_rental_date + window).';
