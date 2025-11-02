create extension if not exists "pgcrypto";

create table if not exists public.account (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.account is 'User accounts for Linked dashboard access.';

create table if not exists public.content (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.account (id) on delete cascade,
  section text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint content_account_section_unique unique (account_id, section)
);

comment on table public.content is 'Structured content per account and section.';

create table if not exists public.setting (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null unique references public.account (id) on delete cascade,
  domain text,
  billing_status text,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.setting is 'Account-level settings and preferences.';


-- Enable RLS
alter table public.account enable row level security;
alter table public.content enable row level security;
alter table public.setting enable row level security;

-- Account policies: only the authenticated user can read/update their own row
drop policy if exists "account_select_own" on public.account;
drop policy if exists "account_modify_own" on public.account;
create policy "account_select_own" on public.account
  for select
  using (auth.uid() = id);

create policy "account_modify_own" on public.account
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Content policies
drop policy if exists "content_select_public" on public.content;
drop policy if exists "content_modify_owner" on public.content;
create policy "content_select_public" on public.content
  for select
  using (true);

create policy "content_modify_owner" on public.content
  for all
  using (auth.uid() = account_id)
  with check (auth.uid() = account_id);

-- Setting policies
drop policy if exists "setting_select_own" on public.setting;
drop policy if exists "setting_modify_own" on public.setting;
create policy "setting_select_own" on public.setting
  for select
  using (auth.uid() = account_id);

create policy "setting_modify_own" on public.setting
  for all
  using (auth.uid() = account_id)
  with check (auth.uid() = account_id);

