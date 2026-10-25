-- ==============================================================================
-- PRISM NEWS AGGREGATOR - FAIL-SAFE PRODUCTION SUPABASE SCHEMA
-- ==============================================================================
-- Run this in your Supabase Dashboard -> SQL Editor -> New Query -> Run
-- This script is 100% idempotent:
--   • Creates tables if they don't exist
--   • Adds missing columns (like user_id) if tables already existed
--   • Safely recreates indexes, policies, and triggers without errors
-- ==============================================================================

-- 1. Enable required extensions
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- 2. PROFILES TABLE
-- ==============================================================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  preferences jsonb default '{"categories": ["tech", "markets", "business"], "edition": "international", "dailyDigestEmail": true, "onboardingCompleted": false}'::jsonb,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Ensure all columns exist in case table was previously created with fewer columns
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists preferences jsonb default '{"categories": ["tech", "markets", "business"], "edition": "international", "dailyDigestEmail": true, "onboardingCompleted": false}'::jsonb;
alter table public.profiles add column if not exists created_at timestamptz default timezone('utc'::text, now());
alter table public.profiles add column if not exists updated_at timestamptz default timezone('utc'::text, now());

-- ==============================================================================
-- 3. BOOKMARKS TABLE
-- ==============================================================================
create table if not exists public.bookmarks (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  content text,
  url text not null,
  image_url text,
  source jsonb,
  category text,
  published_at timestamptz,
  read_time integer default 3,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Crucial: Add missing columns if public.bookmarks existed without them
alter table public.bookmarks add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.bookmarks add column if not exists title text;
alter table public.bookmarks add column if not exists description text;
alter table public.bookmarks add column if not exists content text;
alter table public.bookmarks add column if not exists url text;
alter table public.bookmarks add column if not exists image_url text;
alter table public.bookmarks add column if not exists source jsonb;
alter table public.bookmarks add column if not exists category text;
alter table public.bookmarks add column if not exists published_at timestamptz;
alter table public.bookmarks add column if not exists read_time integer default 3;
alter table public.bookmarks add column if not exists created_at timestamptz default timezone('utc'::text, now());

-- Indexes
create index if not exists idx_bookmarks_user_id on public.bookmarks(user_id);
create index if not exists idx_bookmarks_created_at on public.bookmarks(created_at desc);

-- ==============================================================================
-- 4. READING HISTORY TABLE
-- ==============================================================================
create table if not exists public.reading_history (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  article_id text not null,
  read_at timestamptz default timezone('utc'::text, now()) not null
);

-- Crucial: Add missing columns if public.reading_history existed without them
alter table public.reading_history add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.reading_history add column if not exists article_id text;
alter table public.reading_history add column if not exists read_at timestamptz default timezone('utc'::text, now());

create index if not exists idx_history_user_id on public.reading_history(user_id);

-- ==============================================================================
-- 5. CUSTOM RSS FEEDS TABLE
-- ==============================================================================
create table if not exists public.custom_feeds (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  url text not null,
  category text default 'world',
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Crucial: Add missing columns if public.custom_feeds existed without them
alter table public.custom_feeds add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.custom_feeds add column if not exists name text;
alter table public.custom_feeds add column if not exists url text;
alter table public.custom_feeds add column if not exists category text default 'world';
alter table public.custom_feeds add column if not exists created_at timestamptz default timezone('utc'::text, now());

create index if not exists idx_custom_feeds_user on public.custom_feeds(user_id);

-- ==============================================================================
-- 6. NEWSLETTER SUBSCRIBERS TABLE
-- ==============================================================================
create table if not exists public.newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  user_id uuid references auth.users(id) on delete set null,
  edition text default 'international',
  categories text[] default array['tech', 'markets', 'business'],
  is_active boolean default true,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.newsletter_subscribers add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.newsletter_subscribers add column if not exists edition text default 'international';
alter table public.newsletter_subscribers add column if not exists categories text[] default array['tech', 'markets', 'business'];
alter table public.newsletter_subscribers add column if not exists is_active boolean default true;
alter table public.newsletter_subscribers add column if not exists created_at timestamptz default timezone('utc'::text, now());

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.bookmarks enable row level security;
alter table public.reading_history enable row level security;
alter table public.custom_feeds enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Drop any previous policies to prevent 'policy already exists' errors
drop policy if exists "Allow public profile select" on public.profiles;
drop policy if exists "Allow users to update own profile" on public.profiles;
drop policy if exists "Allow users to insert own profile" on public.profiles;
drop policy if exists "Allow user access to own bookmarks" on public.bookmarks;
drop policy if exists "Allow user access to reading history" on public.reading_history;
drop policy if exists "Allow user access to custom feeds" on public.custom_feeds;
drop policy if exists "Allow all to subscribe to newsletter" on public.newsletter_subscribers;

-- Create policies
create policy "Allow public profile select"
  on public.profiles for select
  using (true);

create policy "Allow users to update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Allow users to insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Allow user access to own bookmarks"
  on public.bookmarks for all
  using (auth.uid() = user_id or user_id is null);

create policy "Allow user access to reading history"
  on public.reading_history for all
  using (auth.uid() = user_id or user_id is null);

create policy "Allow user access to custom feeds"
  on public.custom_feeds for all
  using (auth.uid() = user_id or user_id is null);

create policy "Allow all to subscribe to newsletter"
  on public.newsletter_subscribers for all
  using (true);

-- ==============================================================================
-- 8. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, preferences)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/initials/svg?seed=' || new.email),
    coalesce(new.raw_user_meta_data->'preferences', '{"categories": ["tech", "markets", "business"], "edition": "international", "dailyDigestEmail": true, "onboardingCompleted": false}'::jsonb)
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
