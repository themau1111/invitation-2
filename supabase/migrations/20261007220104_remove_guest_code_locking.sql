drop index if exists public.guests_access_code_lock_idx;

alter table public.guests
  drop column if exists access_code_failed_attempts,
  drop column if exists access_code_locked_until;

create unique index if not exists guests_access_code_hash_unique_idx
  on public.guests (access_code_hash)
  where access_code_hash is not null;
