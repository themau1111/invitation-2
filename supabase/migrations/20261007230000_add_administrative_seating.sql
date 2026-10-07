create table public.seating_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 120),
  canvas_width integer not null default 1200 check (canvas_width between 600 and 4000),
  canvas_height integer not null default 800 check (canvas_height between 480 and 4000),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.seating_tables (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.seating_plans(id) on delete cascade,
  label text not null check (char_length(trim(label)) between 1 and 80),
  shape text not null check (shape in ('round', 'rectangle')),
  x numeric(8,2) not null check (x >= 0),
  y numeric(8,2) not null check (y >= 0),
  width numeric(8,2) not null check (width between 80 and 800),
  height numeric(8,2) not null check (height between 80 and 800),
  rotation numeric(7,2) not null default 0 check (rotation between -360 and 360),
  seat_count smallint not null default 8 check (seat_count between 1 and 24),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (plan_id, label)
);

create table public.seating_seats (
  id uuid primary key default gen_random_uuid(),
  table_id uuid not null references public.seating_tables(id) on delete cascade,
  seat_number smallint not null check (seat_number between 1 and 24),
  guest_id uuid references public.guests(id) on delete set null,
  companion_id uuid references public.guest_companions(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (table_id, seat_number),
  constraint seating_seat_one_person check (
    (guest_id is null and companion_id is null)
    or (guest_id is not null and companion_id is null)
    or (guest_id is null and companion_id is not null)
  )
);

create unique index seating_seats_unique_guest_idx
  on public.seating_seats (guest_id) where guest_id is not null;
create unique index seating_seats_unique_companion_idx
  on public.seating_seats (companion_id) where companion_id is not null;
create index seating_tables_plan_id_idx on public.seating_tables (plan_id);
create index seating_seats_table_id_idx on public.seating_seats (table_id);

create trigger seating_plans_set_updated_at
before update on public.seating_plans
for each row execute function private.set_updated_at();
create trigger seating_tables_set_updated_at
before update on public.seating_tables
for each row execute function private.set_updated_at();
create trigger seating_seats_set_updated_at
before update on public.seating_seats
for each row execute function private.set_updated_at();

alter table public.seating_plans enable row level security;
alter table public.seating_tables enable row level security;
alter table public.seating_seats enable row level security;

revoke all on table public.seating_plans, public.seating_tables, public.seating_seats from anon, authenticated;
