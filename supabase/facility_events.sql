-- Booked facility events (tournaments, rentals-as-events, etc.) — admin-managed.
-- Optional roster waiver invite for attendee waivers; schedule block is added manually on Admin → Schedule.

create table if not exists public.facility_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  event_date date not null,
  start_minute int not null check (start_minute >= 0 and start_minute < 1440),
  duration_minutes int not null check (duration_minutes >= 15 and duration_minutes <= 960),
  field_scope text not null check (field_scope in ('field_1', 'field_2', 'field_3', 'full_facility')),
  status text not null default 'draft' check (status in ('draft', 'requested', 'confirmed', 'cancelled')),
  organizer_name text,
  organizer_email text,
  notes text,
  waiver_invite_id uuid references public.field_rental_waiver_invites (id) on delete set null
);

create index if not exists facility_events_event_date_idx on public.facility_events (event_date desc);
create index if not exists facility_events_created_at_idx on public.facility_events (created_at desc);
create index if not exists facility_events_status_idx on public.facility_events (status);

comment on table public.facility_events is
  'Admin-booked events: date, local wall-clock span, field scope. waiver_invite_id links attendee roster waivers.';

alter table public.facility_events enable row level security;
