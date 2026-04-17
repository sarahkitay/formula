-- Aggregate confirmed youth block bookings per slot for a week (public read via RPC; no PII in result).
-- Run in Supabase SQL editor after parent_block_bookings exists.

create index if not exists parent_block_bookings_week_slot_confirmed_idx
  on public.parent_block_bookings (week_start, slot_ref)
  where status = 'confirmed';

create or replace function public.youth_block_booking_counts(p_week_start date)
returns table (slot_ref text, enrolled bigint)
language sql
stable
security definer
set search_path = public
as $$
  select b.slot_ref, count(*)::bigint as enrolled
  from public.parent_block_bookings b
  where b.status = 'confirmed'
    and b.week_start = p_week_start
    and b.slot_ref like 'book-%'
  group by b.slot_ref;
$$;

revoke all on function public.youth_block_booking_counts(date) from public;
grant execute on function public.youth_block_booking_counts(date) to anon, authenticated;

comment on function public.youth_block_booking_counts(date) is
  'Confirmed booking counts per book-* slot_ref for marketing and portal capacity (RLS-safe aggregate).';
