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
