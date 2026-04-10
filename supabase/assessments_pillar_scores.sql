-- Optional pillar scores (0–100) stored with each assessment for parent-facing progress UI.
-- Run after `assessments.sql`.

alter table public.assessments
  add column if not exists pillar_scores jsonb not null default '{}'::jsonb;

comment on column public.assessments.pillar_scores is
  'Optional keys: technical, speed, agility, endurance, strength (numbers 0–100).';
