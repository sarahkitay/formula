-- Run in Supabase SQL editor (once) so login → profile lookup works.
-- Adjust policies if you use service role on the server later.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('parent', 'staff', 'coach', 'admin')),
  full_name text,
  email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);

-- Optional: allow users to update their own row
-- create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
