-- ============================================================================
-- ម៉ែ — by FlowErs
-- Entitlements & Daily Usage Schema (Step 6 / Free & Paid Rules)
-- Run this in your Supabase Dashboard -> SQL Editor
-- ============================================================================

-- 1. Create entitlements table:
-- Premium status comes directly from this table.
-- No row means not premium.
create table if not exists public.entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_premium boolean not null default false,
  granted_at timestamptz not null default now(),
  notes text
);

-- Enable Row Level Security on entitlements
alter table public.entitlements enable row level security;

-- Users can read their own entitlement status:
drop policy if exists "Users can read own entitlements" on public.entitlements;
create policy "Users can read own entitlements"
  on public.entitlements
  for select
  using (auth.uid() = user_id);

-- Only admins / service_role can modify entitlements
-- (Client apps have no insert/update/delete policy on entitlements).


-- 2. Create daily_usage table:
-- Counts today's opened summaries per user, resetting daily at midnight Asia/Phnom_Penh.
create table if not exists public.daily_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  date text not null, -- 'YYYY-MM-DD' in Asia/Phnom_Penh timezone
  summary_ids text[] not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (user_id, date)
);

-- Enable Row Level Security on daily_usage
alter table public.daily_usage enable row level security;

-- Users can read their own usage:
drop policy if exists "Users can read own daily usage" on public.daily_usage;
create policy "Users can read own daily usage"
  on public.daily_usage
  for select
  using (auth.uid() = user_id);

-- Users can insert their own daily usage:
drop policy if exists "Users can insert own daily usage" on public.daily_usage;
create policy "Users can insert own daily usage"
  on public.daily_usage
  for insert
  with check (auth.uid() = user_id);

-- Users can update their own daily usage:
drop policy if exists "Users can update own daily usage" on public.daily_usage;
create policy "Users can update own daily usage"
  on public.daily_usage
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 3. Convenient helpers for tester access:
-- To grant a tester premium status:
-- insert into public.entitlements (user_id, is_premium, notes)
-- values ('USER_UUID_HERE', true, 'Beta tester')
-- on conflict (user_id) do update set is_premium = true;
