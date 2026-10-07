# Autonomous product boundary

`invitation-2` is deployed and operated as an independent frontend. It communicates only with its own API over HTTPS and never imports source files, assets, environment files, data, or credentials from another invitation.

## Runtime dependencies

- **Frontend:** this repository and its own Vercel project, `diana-y-hector`. Its public named alias is `https://diana-y-hector-themau1111s-projects.vercel.app`.
- **API:** the separately deployed `invitation-2-api` project. Its stable HTTP contract is summarized in `docs/api-contract.md`.
- **Data:** the dedicated Supabase project `jpykyhjaygxrjnurqzsv`; browser code has no direct guest-table access.
- **Administration:** `/admin` authenticates with Supabase Auth using only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. It sends the access token to the dedicated API, which checks `admin_profiles` and retains all privileged database access.

The original invitation repositories are portfolio references only. Paths to sibling repositories in documentation are orientation for local contributors, never runtime configuration or deployment dependencies.

## Configuration boundary

The frontend may use only browser-safe values such as its API base URL. The API owns Supabase service credentials, administrator authorization, guest export, and mail configuration if mail is later approved. Each deployment receives its own environment variables in Vercel.
