-- ============================================================================
-- ម៉ែ — by FlowErs
-- STEP R0: Database Additions
-- Run this script in your Supabase Dashboard -> SQL Editor
-- ============================================================================

-- 1. Add new profile fields & entitlements to public.users
alter table public.users
  add column if not exists occupation text,
  add column if not exists is_first_pregnancy boolean default true,
  add column if not exists due_date date,
  add column if not exists tier text not null default 'free' check (tier in ('free', 'premium')),
  add column if not exists premium_until timestamptz;

-- 2. Add safety flag & audio support to existing public.resources (reusing existing structure, NO duplicate tables)
alter table public.resources
  add column if not exists is_safety_critical boolean not null default false,
  add column if not exists audio_url text,
  add column if not exists audio_duration text,
  add column if not exists audio_transcript_kh text,
  add column if not exists audio_transcript_en text;

-- Mark key safety articles as safety-critical (warning signs, emergency symptoms)
update public.resources
set is_safety_critical = true
where id in ('res-nmchc-warning-signs')
   or title_kh like '%សញ្ញាគ្រោះថ្នាក់%'
   or title_en ilike '%danger sign%'
   or title_en ilike '%warning sign%';

-- Seed / update the Breastfeeding Preparation Audio resource in existing public.resources
insert into public.resources (
  id,
  title_kh,
  title_en,
  source_name,
  source_url,
  category,
  pregnancy_stage,
  pregnancy_weeks,
  summary_kh,
  summary_en,
  summary_purpose,
  weekly_focus,
  status,
  audio_url,
  audio_duration,
  audio_transcript_kh
) values (
  'res-psi-breastfeeding-prep',
  'ការត្រៀមខ្លួនសម្រាប់ការបំបៅដោះកូន',
  'Preparing for Breastfeeding',
  'កម្មវិធីគ្រួសារប្រពៃ កូនវៃឆ្លាត / អង្គការ PSI',
  'https://psi.org.kh',
  'ការត្រៀមខ្លួនសម្រាល (Preparation for Birth)',
  'ត្រីមាសទី ៣ (សប្ដាហ៍ ២៨-៤០)',
  array[28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
  'ការសន្ទនាប្រកបដោយភាពកក់ក្តៅរវាងឆ្មប និងស្ត្រីមានផ្ទៃពោះ អំពីការប្រែប្រួលសុដន់ ការផលិតទឹកដោះដំបូង (Colostrum) និងការបំបៅដោះកូនភ្លាមៗក្នុងម៉ោងដំបូងក្រោយសម្រាល។',
  'A supportive conversation between a midwife and an expectant mother discussing breast changes during pregnancy, colostrum production, and early breastfeeding within the first hour after delivery.',
  'ជួយឱ្យម្តាយយល់ដឹងពីការប្រែប្រួលរាងកាយធម្មជាតិ ទឹកដោះដំបូង និងត្រៀមចិត្តបំបៅដោះកូនដោយក្តីស្ងប់ចិត្ត។',
  'ស្តាប់ការណែនាំពីឆ្មបអំពីការបំបៅដោះកូន និងទឹកដោះដំបូង។',
  'Published',
  'Psi_audio/1.mp3',
  '2:15',
  'ឆ្មប៖ ជម្រាបសួរ! ខ្ញុំជាឆ្មបណារី ទូរស័ព្ទមកពីកម្មវិធីគ្រួសារប្រពៃ កូនវៃឆ្លាត។

ម្តាយ៖ ជម្រាបសួរអ្នកគ្រូណារី!

ឆ្មប៖ ថ្ងៃសម្រាលរបស់ប្អូនកាន់តែជិតមកដល់ហើយ។ ខ្ញុំជឿថាប្អូនបានត្រៀមខ្លះហើយសម្រាប់ថ្ងៃសម្រាល។

ម្តាយ៖ ចាស ខ្ញុំនិងប្តី ព្រមទាំងសាច់ញាតិត្រៀមរួចរាល់ហើយ។

ឆ្មប៖ ល្អណាស់។ នៅពេលដែលគ្រួសារប្អូនត្រៀមស្វាគមន៍ទារក រាងកាយរបស់ប្អូនក៏ត្រៀមក្លាយជាម្តាយដែរ។ ប្អូនអាចសង្កេតឃើញសុដន់ប្អូនរីកធំ និងលេចសរសៃខៀវ ជាសញ្ញាដែលសុដន់ត្រៀមជាស្រេចដើម្បីបំបៅដោះកូន។

ម្តាយ៖ អ៊ីចឹងបានចុងដោះខ្ញុំប្រែពណ៌ក្រម៉ៅ និងរីកធំជាងមុន ត្រូវអត់អ្នកគ្រូ?

ឆ្មប៖ ត្រឹមត្រូវហើយ។ អំឡុងពេលនេះ ក្បាលដោះចាប់ផ្តើមផលិតទឹកដោះដំបូងរបស់ប្អូន។ វាជារឿងធម្មតាទេ កុំបារម្ភអីណា!

ម្តាយ៖ អរគុណ បានស្តាប់អ្នកគ្រូ ខ្ញុំលែងបារម្ភហើយ!

ឆ្មប៖ សារធាតុនៅក្នុងទឹកដោះដំបូងពិសេសខ្លាំងណាស់។ ដូច្នេះប្អូនត្រូវប្រាកដថាបំបៅដោះកូនក្នុងម៉ោងដំបូងបន្ទាប់ពីសម្រាលរួច។ មិនត្រូវឱ្យកូនបៅអ្វីក្រៅពីទឹកដោះដំបូងរបស់ប្អូនឡើយ។ ត្រូវផ្តល់តែទឹកដោះតែមួយមុខគត់។ ទឹកដោះដំបូងអាចជួយការពារទារកពីជំងឺជាច្រើន។

ម្តាយ៖ ចាស ខ្ញុំចាំហើយ អ្នកគ្រូ។

ឆ្មប៖ សូមឱ្យការត្រៀមសម្រាលកូនរបស់ប្អូនដំណើរការល្អណា!'
)
on conflict (id) do update set
  audio_url = excluded.audio_url,
  audio_duration = excluded.audio_duration,
  audio_transcript_kh = excluded.audio_transcript_kh,
  summary_kh = excluded.summary_kh,
  summary_en = excluded.summary_en,
  title_kh = excluded.title_kh,
  title_en = excluded.title_en;

-- 3. Create public.daily_usage table for tracking 2-per-day free tier limit
create table if not exists public.daily_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  date date not null default (timezone('Asia/Phnom_Penh', now()))::date,
  articles_opened text[] not null default '{}',
  count integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint unique_user_daily_usage unique (user_id, date)
);

-- Index for fast daily query lookups
create index if not exists idx_daily_usage_user_date on public.daily_usage(user_id, date);

-- 4. Enable Row Level Security (RLS) on daily_usage
alter table public.daily_usage enable row level security;

-- Authenticated users can view their own daily usage
create policy "Users can view own daily usage"
  on public.daily_usage for select
  to authenticated
  using (auth.uid() = user_id);

-- Authenticated users can insert their own daily usage
create policy "Users can insert own daily usage"
  on public.daily_usage for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Authenticated users can update their own daily usage
create policy "Users can update own daily usage"
  on public.daily_usage for update
  to authenticated
  using (auth.uid() = user_id);

-- 5. Helper function for atomic article open tracking (resets at midnight Cambodia time)
create or replace function public.record_article_open(
  p_article_id text,
  p_cambodia_date date default (timezone('Asia/Phnom_Penh', now()))::date
)
returns table (
  opened_today integer,
  already_opened boolean,
  is_allowed boolean
)
language plpgsql
security definer
as $$
declare
  v_user_id uuid := auth.uid();
  v_tier text := 'free';
  v_articles text[] := '{}';
  v_already boolean := false;
  v_new_count integer := 0;
begin
  if v_user_id is null then
    -- Anonymous / guest: handled by frontend local storage
    return query select 0, false, true;
    return;
  end if;

  -- Check user tier
  select tier into v_tier from public.users where id = v_user_id;

  -- Upsert daily record
  insert into public.daily_usage (user_id, date, articles_opened, count)
  values (v_user_id, p_cambodia_date, array[p_article_id], 1)
  on conflict (user_id, date) do update
  set updated_at = now()
  returning articles_opened into v_articles;

  -- Check if already opened today
  if p_article_id = any(v_articles) then
    v_already := true;
  else
    -- Add to array and increment
    update public.daily_usage
    set articles_opened = array_append(articles_opened, p_article_id),
        count = count + 1,
        updated_at = now()
    where user_id = v_user_id and date = p_cambodia_date
    returning count into v_new_count;
  end if;

  select count into v_new_count from public.daily_usage where user_id = v_user_id and date = p_cambodia_date;

  return query select
    v_new_count,
    v_already,
    (v_tier = 'premium' or v_already or v_new_count <= 2);
end;
$$;
