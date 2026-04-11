-- Allow signed-in parents to read assessment rows linked to their account (portal + dashboard).
-- Run in Supabase SQL Editor after `assessment_slots_bookings.sql`.

drop policy if exists "assessment_bookings_select_own" on public.assessment_bookings;
create policy "assessment_bookings_select_own"
  on public.assessment_bookings for select
  using (auth.uid() is not null and auth.uid() = parent_user_id);
