-- Singleton JSON config for published facility schedule (overrides, blackout days, cycle copy).
-- Apply with Supabase SQL editor or CLI. Server routes use service_role only (no anon/authenticated grants).

create table if not exists public.facility_schedule_config (
  id int primary key check (id = 1),
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.facility_schedule_config (id, payload)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

revoke all on public.facility_schedule_config from public;
revoke all on public.facility_schedule_config from anon;
revoke all on public.facility_schedule_config from authenticated;

grant select, insert, update, delete on public.facility_schedule_config to service_role;

alter table public.facility_schedule_config enable row level security;
