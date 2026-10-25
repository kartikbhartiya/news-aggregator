-- ==============================================================================
-- PRISM NEWS AGGREGATOR - COMPLETE PRODUCTION SUPABASE SQL SCHEMA
-- ==============================================================================
-- Run this in your Supabase Dashboard -> SQL Editor -> New Query -> Run
-- Enables cross-device sync for:
--  1. User profiles & news preferences
--  2. Saved bookmarks & dossiers
--  3. Reading history & analytics
--  4. Custom RSS/Atom wire feeds
--  5. Newsletter subscribers
-- ==============================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. User Profiles Table (Linked with Supabase Auth users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  preferences jsonb default '{"categories": ["tech", "markets", "business"], "edition": "international", "dailyDigestEmail": true, "onboardingCompleted": false}'::jsonb,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. Bookmarks & Dossier Table
create table if not exists public.bookmarks (
  id text primary key,
  user_id uuid references auth.users on delete cascade,
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

-- Index for instant bookmark queries per user
create index if not exists idx_bookmarks_user_id on public.bookmarks(user_id);
create index if not exists idx_bookmarks_created_at on public.bookmarks(created_at desc);

-- 4. Reading History Table
create table if not exists public.reading_history (
  id text primary key,
  user_id uuid references auth.users on delete cascade,
  article_id text not null,
  read_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_history_user_id on public.reading_history(user_id);

-- 5. Custom RSS/Atom Wire Feeds
create table if not exists public.custom_feeds (
  id text primary key,
  user_id uuid references auth.users on delete cascade,
  name text not null,
  url text not null,
  category text default 'world',
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_custom_feeds_user on public.custom_feeds(user_id);

-- 6. Daily Newsletter Subscribers Table
create table if not exists public.newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  user_id uuid references auth.users on delete set null,
  edition text default 'international',
  categories text[] default array['tech', 'markets', 'business'],
  is_active boolean default true,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.bookmarks enable row level security;
alter table public.reading_history enable row level security;
alter table public.custom_feeds enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Profiles: Users can view and update their own profile; public profiles are readable
create policy "Allow public profile select"
  on public.profiles for select
  using (true);

create policy "Allow users to update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Allow users to insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Bookmarks: Users can only see & modify their own bookmarks (or anonymous session where user_id is null)
create policy "Allow user access to own bookmarks"
  on public.bookmarks for all
  using (auth.uid() = user_id or user_id is null);

-- Reading History: Users can access their reading history
create policy "Allow user access to reading history"
  on public.reading_history for all
  using (auth.uid() = user_id or user_id is null);

-- Custom Feeds: Users can manage their custom RSS feeds
create policy "Allow user access to custom feeds"
  on public.custom_feeds for all
  using (auth.uid() = user_id or user_id is null);

-- Newsletter: Anyone can subscribe, users can manage their subscription
create policy "Allow all to subscribe to newsletter"
  on public.newsletter_subscribers for all
  using (true);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
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

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
