-- Allow coaches/staff/admins to read all parent block bookings (e.g. coach attendance, floor views).
-- Run after `parent_block_bookings.sql` and `rls_profile_helpers.sql`.

drop policy if exists "parent_block_bookings_select_staff" on public.parent_block_bookings;
create policy "parent_block_bookings_select_staff"
  on public.parent_block_bookings for select
  using (public.formula_is_staff());
