-- Add `organizer` to profiles.role for field-rental portal accounts.
-- Run in Supabase SQL editor once on existing projects (idempotent with IF EXISTS).

alter table public.profiles drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('parent', 'organizer', 'staff', 'coach', 'admin'));
