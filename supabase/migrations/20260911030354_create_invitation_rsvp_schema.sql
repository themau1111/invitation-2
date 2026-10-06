create schema if not exists private;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('owner', 'admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.guests (
  id uuid primary key default gen_random_uuid(),
  access_token uuid not null unique default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 1 and 160),
  email text,
  phone text,
  party_size smallint not null default 1 check (party_size between 1 and 12),
  rsvp_status text not null default 'pending' check (rsvp_status in ('pending', 'confirmed', 'declined')),
  notes text check (notes is null or char_length(notes) <= 1000),
  dietary_requirements text check (dietary_requirements is null or char_length(dietary_requirements) <= 500),
  responded_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.guest_companions (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null references public.guests(id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) between 1 and 160),
  rsvp_status text not null default 'pending' check (rsvp_status in ('pending', 'confirmed', 'declined')),
  dietary_requirements text check (dietary_requirements is null or char_length(dietary_requirements) <= 500),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index guests_rsvp_status_idx on public.guests (rsvp_status);
create index guest_companions_guest_id_idx on public.guest_companions (guest_id);

create trigger admin_profiles_set_updated_at
before update on public.admin_profiles
for each row execute function private.set_updated_at();

create trigger guests_set_updated_at
before update on public.guests
for each row execute function private.set_updated_at();

create trigger guest_companions_set_updated_at
before update on public.guest_companions
for each row execute function private.set_updated_at();

alter table public.admin_profiles enable row level security;
alter table public.guests enable row level security;
alter table public.guest_companions enable row level security;

revoke all on table public.admin_profiles, public.guests, public.guest_companions from anon, authenticated;

grant select on table public.admin_profiles to authenticated;

create policy "Administrators can read their own profile"
on public.admin_profiles
for select
to authenticated
using ((select auth.uid()) = id);
