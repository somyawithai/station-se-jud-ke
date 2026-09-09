-- ==============================================================================
-- STATION SE JUD KE (स्टेशन से जुड़ के) - SUPABASE DATABASE SCHEMA
-- Authoritative Data Source: Metro-List.xlsx
-- ==============================================================================

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. CITIES TABLE (Metro Master Data)
-- ------------------------------------------------------------------------------
create table if not exists public.cities (
  id text primary key,
  name text not null,
  hindi_name text not null,
  state text not null,
  region text not null,
  status text not null default 'Operational',
  active_lines_count integer not null default 1,
  total_stations_count integer not null default 0,
  interchange_count integer not null default 0,
  description text,
  pdf_page integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 2. METRO LINES TABLE (Metro Master Data)
-- ------------------------------------------------------------------------------
create table if not exists public.metro_lines (
  id text primary key,
  city_id text not null references public.cities(id) on delete cascade,
  name text not null,
  color_hex text not null,
  text_color_hex text,
  status text not null default 'Operational',
  station_count integer not null default 0,
  first_station text not null,
  last_station text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 3. STATIONS TABLE (Metro Master Data)
-- ------------------------------------------------------------------------------
create table if not exists public.stations (
  id text primary key,
  city_id text not null references public.cities(id) on delete cascade,
  line_id text not null references public.metro_lines(id) on delete cascade,
  name text not null,
  station_number integer not null,
  is_interchange boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 4. STATION SELECTIONS TABLE (Active Station Connections)
-- Crucial Rule:
-- A visitor can select only ONE station per city (UNIQUE constraint on visitor_token, city_name).
-- A visitor can select stations in multiple different cities.
-- Only the fields the app actually collects are stored: the visitor's name,
-- which city/station they picked, and their visibility preference. Line/city
-- metadata (ids, colors, line names) is static app data, not persisted here.
-- social_platform / social_handle have been removed — the app collects name only.
-- ------------------------------------------------------------------------------
create table if not exists public.station_selections (
  id bigint generated always as identity primary key,
  visitor_token text not null,
  user_name text not null,
  is_public boolean not null default true,
  city_name text not null,
  station_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  -- Database constraint: Guarantees at most 1 station selection per visitor per city
  constraint unique_visitor_per_city unique (visitor_token, city_name)
);

-- Indices for fast aggregation and querying
create index if not exists idx_station_selections_city_station 
  on public.station_selections (city_name, station_name);

create index if not exists idx_station_selections_visitor 
  on public.station_selections (visitor_token);

create index if not exists idx_station_selections_public 
  on public.station_selections (city_name, station_name, is_public);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on all tables
alter table public.cities enable row level security;
alter table public.metro_lines enable row level security;
alter table public.stations enable row level security;
alter table public.station_selections enable row level security;

-- Metro master data: Read-only access for everyone (anon and authenticated)
create policy "Allow public read access to cities" 
  on public.cities for select using (true);

create policy "Allow public read access to metro_lines" 
  on public.metro_lines for select using (true);

create policy "Allow public read access to stations" 
  on public.stations for select using (true);

-- Station Selections: Anyone can read aggregated counts, insert, and update their station
create policy "Allow public read station selections" 
  on public.station_selections for select using (true);

create policy "Allow visitors to insert and update station selection" 
  on public.station_selections for all using (true) with check (true);
