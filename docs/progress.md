# Progress log

## 2026-09-08

- Repository identified as the empty frontend for the second invitation.
- Agent documentation baseline created.
- Pending: product brief, application scaffold, Supabase access and schema design.
- Supabase MCP authentication confirmed on 2026-09-10. The project is currently `INACTIVE`, so schema and migration inspection is blocked until it is restored from the Supabase dashboard. Security and performance advisors returned no findings.
- Supabase project was restored and inspected on 2026-09-10. It currently has no tables in `public` and no migrations; security and performance advisors reported no findings. The schema can now be designed from a clean baseline.
- Applied and versioned the initial RSVP schema on 2026-09-10. `guests`, `guest_companions`, and `admin_profiles` use RLS and deny public table access by default. The next milestone is the server API that implements token-scoped RSVP and administrator-only management.
- Defined the frontend/API contract on 2026-09-10 in `docs/api-contract.md`. It preserves administrator-only export while removing every public full-guest-list flow. The next implementation task is to scaffold the API and enforce this contract server-side.
- Added and applied `20260911031000_add_atomic_rsvp_submission.sql`. Its server-only function updates a guest and their companions in one transaction and has `EXECUTE` revoked from `PUBLIC`, `anon`, and `authenticated`. The Vercel API implementation now exists in `../invitation-2-api`; it has not been configured or deployed.
- Created and linked the Vercel projects `invitation-2` and `invitation-2-api` on 2026-09-11. Supabase Auth's Site URL and allow-list now use `https://invitation-2.vercel.app`. Two administrator profiles are active; a third requested invitation is pending Supabase's temporary email rate limit.
- The Supabase security advisor was rechecked on 2026-09-11. The only actionable recommendation, leaked-password protection, requires a Pro plan; the two RLS information messages are intentional because guest data is API-only.

## 2026-10-06

- Confirmed the original and new invitations are separate deployable products. The original repositories retain their own Supabase/Vercel contracts; the new invitation owns its API, Supabase project, configuration, and Vercel projects. Cross-repository references are documentation-only.
