-- Completed Stripe Checkout sessions (written from webhook only; use service role).
-- Run in Supabase SQL editor after enabling Stripe webhook to this project.

create table if not exists public.stripe_purchases (
  id uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id text not null unique,
  stripe_customer_id text,
  stripe_payment_intent_id text,
  customer_email text,
  checkout_type text not null,
  amount_total integer,
  currency text,
  payment_status text,
  sessions_credited integer,
  metadata jsonb,
  created_at timestamptz default now()
);

create index if not exists stripe_purchases_email_idx on public.stripe_purchases (customer_email);
create index if not exists stripe_purchases_type_idx on public.stripe_purchases (checkout_type);

alter table public.stripe_purchases enable row level security;

-- No policies: only service role (bypasses RLS) should access this table.
