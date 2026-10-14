-- ============================================================================
-- ម៉ែ — by FlowErs
-- Step 6: Premium Split, Entitlements Table & Daily Usage Schema
-- Run this in your Supabase Dashboard -> SQL Editor
-- ============================================================================

-- 1. Add `is_premium` column to users table (defaults to false) for backwards compatibility
alter table public.users
  add column if not exists is_premium boolean not null default false;

-- 2. Stop `is_premium` on users table from being modified by client-side apps.
-- A person can read her own value, but any client update to `is_premium`
-- is silently discarded, preserving the previous value (or false on insert).
-- Only you (via the Supabase Table Editor or service_role) can change it.

create or replace function public.protect_user_is_premium()
returns trigger as $$
begin
  -- If the operation comes from an authenticated user session (client app):
  if (current_setting('request.jwt.claim.role', true) = 'authenticated') then
    if (TG_OP = 'INSERT') then
      new.is_premium := false;
    elsif (TG_OP = 'UPDATE') then
      new.is_premium := old.is_premium;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Attach the trigger to public.users for both INSERT and UPDATE
drop trigger if exists tr_protect_user_is_premium on public.users;
create trigger tr_protect_user_is_premium
  before insert or update on public.users
  for each row
  execute function public.protect_user_is_premium();

-- 3. Entitlements Table (Step 6 / Entitlements Module)
-- No row means not premium. A user can read her own row, but only admin / dashboard can insert/update it.
create table if not exists public.entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_premium boolean not null default false,
  granted_at timestamptz not null default timezone('utc'::text, now()),
  notes text
);

alter table public.entitlements enable row level security;

drop policy if exists "Users can read their own entitlement" on public.entitlements;
create policy "Users can read their own entitlement"
  on public.entitlements
  for select
  using (auth.uid() = user_id);

-- 4. Daily Usage Table (Tracks opened summary_ids per day in Asia/Phnom_Penh date)
create table if not exists public.daily_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  summary_ids text[] not null default '{}',
  updated_at timestamptz not null default timezone('utc'::text, now()),
  primary key (user_id, date)
);

alter table public.daily_usage enable row level security;

drop policy if exists "Users can read their own daily usage" on public.daily_usage;
create policy "Users can read their own daily usage"
  on public.daily_usage
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own daily usage" on public.daily_usage;
create policy "Users can insert their own daily usage"
  on public.daily_usage
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own daily usage" on public.daily_usage;
create policy "Users can update their own daily usage"
  on public.daily_usage
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 5. Helper queries:
-- To grant premium to a tester in entitlements table:
-- insert into public.entitlements (user_id, is_premium)
--   values ('USER_UUID_HERE', true)
--   on conflict (user_id) do update set is_premium = true;

