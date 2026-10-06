# Project overview

`invitation-2` is the independent frontend for a new, client-specific wedding invitation. It will be inspired by proven product flows, while receiving its own design, copy, assets, data model, deployment, and environment configuration.

Related repositories:

- `../invitation-2-api`: backend/API for this invitation.
- `../wedding-invitation`: original portfolio invitation; source of audited, selectively reusable patterns.
- `../wedding-backend`: original notification backend; source of audited, selectively reusable patterns.

The new Supabase project is connected through server-owned credentials only. The initial schema and access boundary are versioned; the frontend/API contract is in `docs/api-contract.md`. See `docs/architecture.md` for the runtime and configuration boundary.
