# RSVP data model

The first migration is `supabase/migrations/20260911030354_create_invitation_rsvp_schema.sql`.

## Tables

- `guests`: one invitation recipient. `access_token` is an opaque UUID used only by the future server API; it is not an incremental or guessable public identifier.
- `guest_companions`: optional accompanying guests, linked to a primary guest and removed automatically if that guest is removed.
- `admin_profiles`: the small allow-list of Supabase Auth users allowed to administer the invitation.

## Access model

All tables have RLS enabled. `guests` and `guest_companions` intentionally have no browser-access policies: requests must pass through the API, which validates the opaque access token for RSVP or an authenticated administrator for management/export. The server-only Supabase service-role key must never be exposed to the frontend.

`admin_profiles` lets authenticated users read only their own role. Creating or changing administrators remains server-only.

`public.submit_rsvp` is a `SECURITY DEFINER` function used only by the API's service role to write a guest and their companions atomically. It locks the matching invitation and verifies all supplied companion IDs belong to it. `EXECUTE` is revoked from `PUBLIC`, `anon`, and `authenticated`; the function is not a browser endpoint.

## Known advisor messages

The Supabase security advisor reports that `guests` and `guest_companions` have RLS but no policies. This is expected while all access is server-owned. The unused-index messages are expected on a new empty database.
