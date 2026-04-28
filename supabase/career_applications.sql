-- Public job applications (front desk + coaches). Inserts use SUPABASE_SERVICE_ROLE_KEY from server actions.
-- Admin UI lists rows the same way (trusted server only).

create table if not exists public.career_applications (
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default now(),
  position text not null check (position in ('front_desk', 'coach')),
  full_name text not null,
  email text not null,
  phone text,
  message text not null,
  availability text,
  coaching_background text
);

create index if not exists career_applications_submitted_at_idx
  on public.career_applications (submitted_at desc);

create index if not exists career_applications_position_idx
  on public.career_applications (position);

comment on table public.career_applications is
  'Marketing /careers form submissions; coaching_background used when position = coach.';

alter table public.career_applications enable row level security;
