create or replace function public.submit_rsvp(
  p_access_token uuid,
  p_rsvp_status text,
  p_dietary_requirements text,
  p_companions jsonb default '[]'::jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_guest public.guests%rowtype;
  v_companion jsonb;
  v_companion_id uuid;
  v_companion_name text;
  v_companion_status text;
  v_companion_dietary_requirements text;
begin
  if p_rsvp_status not in ('pending', 'confirmed', 'declined') then
    raise exception 'invalid RSVP status' using errcode = '22023';
  end if;

  if p_dietary_requirements is not null and char_length(p_dietary_requirements) > 500 then
    raise exception 'dietary requirements are too long' using errcode = '22023';
  end if;

  if jsonb_typeof(p_companions) <> 'array' then
    raise exception 'companions must be an array' using errcode = '22023';
  end if;

  select *
  into v_guest
  from public.guests
  where access_token = p_access_token
  for update;

  if not found then
    raise exception 'invitation not found' using errcode = 'P0002';
  end if;

  if jsonb_array_length(p_companions) > v_guest.party_size - 1 then
    raise exception 'too many companions' using errcode = '22023';
  end if;

  update public.guests
  set
    rsvp_status = p_rsvp_status,
    dietary_requirements = p_dietary_requirements,
    responded_at = timezone('utc', now())
  where id = v_guest.id;

  for v_companion in select value from jsonb_array_elements(p_companions)
  loop
    v_companion_id := nullif(v_companion ->> 'id', '')::uuid;
    v_companion_name := nullif(btrim(v_companion ->> 'fullName'), '');
    v_companion_status := v_companion ->> 'rsvpStatus';
    v_companion_dietary_requirements := nullif(v_companion ->> 'dietaryRequirements', '');

    if v_companion_name is null or char_length(v_companion_name) > 160
      or v_companion_status not in ('pending', 'confirmed', 'declined')
      or (v_companion_dietary_requirements is not null and char_length(v_companion_dietary_requirements) > 500) then
      raise exception 'invalid companion' using errcode = '22023';
    end if;

    if v_companion_id is null then
      insert into public.guest_companions (
        guest_id,
        full_name,
        rsvp_status,
        dietary_requirements
      ) values (
        v_guest.id,
        v_companion_name,
        v_companion_status,
        v_companion_dietary_requirements
      );
    else
      update public.guest_companions
      set
        full_name = v_companion_name,
        rsvp_status = v_companion_status,
        dietary_requirements = v_companion_dietary_requirements
      where id = v_companion_id and guest_id = v_guest.id;

      if not found then
        raise exception 'companion not found' using errcode = 'P0002';
      end if;
    end if;
  end loop;
end;
$$;

revoke execute on function public.submit_rsvp(uuid, text, text, jsonb)
from public, anon, authenticated;
grant execute on function public.submit_rsvp(uuid, text, text, jsonb) to service_role;
