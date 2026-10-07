# Supabase integration

The Supabase MCP configuration is project-scoped. Database writes require explicit user authorization; no secrets are stored in the repository. The initial RSVP schema is documented in `docs/schema.md` and versioned in `supabase/migrations/`. Public client credentials may be used only for browser-safe configuration; never expose service-role credentials.

The intended project is `jpykyhjaygxrjnurqzsv`. It was restored and verified as `ACTIVE_HEALTHY` on 2026-10-07. The three RSVP tables are empty, RLS is enabled, and the access-code migration is applied. Public-table RLS policies intentionally remain absent: the Vercel API, not the Data API, owns access to guest data.
