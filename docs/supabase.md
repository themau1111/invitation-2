# Supabase integration

The Supabase MCP configuration is project-scoped. Database writes require explicit user authorization; no secrets are stored in the repository. The initial RSVP schema is documented in `docs/schema.md` and versioned in `supabase/migrations/`. Public client credentials may be used only for browser-safe configuration; never expose service-role credentials.

As of 2026-10-07, the intended project (`jpykyhjaygxrjnurqzsv`) is `INACTIVE`. Table and migration reads time out until it is restored in the Supabase dashboard; do not retry or apply migrations until its status is active.
