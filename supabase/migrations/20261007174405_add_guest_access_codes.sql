alter table public.guests
  add column access_code_hash text,
  add column access_code_failed_attempts smallint not null default 0 check (access_code_failed_attempts between 0 and 20),
  add column access_code_locked_until timestamptz;

comment on column public.guests.access_code_hash is 'Server-generated hash of the four-digit RSVP access code. Plain codes are never stored.';

create index guests_access_code_lock_idx
  on public.guests (access_code_locked_until)
  where access_code_locked_until is not null;
