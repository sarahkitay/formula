-- Optional: athlete date of birth (portal signup + roster accuracy). Run after `parent_players_players.sql`.

alter table public.players
  add column if not exists date_of_birth date;

comment on column public.players.date_of_birth is 'Collected at parent portal signup; used with age_group for scheduling eligibility.';
