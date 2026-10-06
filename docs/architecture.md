# Autonomous product boundary

`invitation-2` is deployed and operated as an independent frontend. It communicates only with its own API over HTTPS and never imports source files, assets, environment files, data, or credentials from another invitation.

## Runtime dependencies

- **Frontend:** this repository and its own Vercel project, `invitation-2`.
- **API:** the separately deployed `invitation-2-api` project. Its stable HTTP contract is summarized in `docs/api-contract.md`.
- **Data:** the dedicated Supabase project `jpykyhjaygxrjnurqzsv`; browser code has no direct guest-table access.

The original invitation repositories are portfolio references only. Paths to sibling repositories in documentation are orientation for local contributors, never runtime configuration or deployment dependencies.

## Configuration boundary

The frontend may use only browser-safe values such as its API base URL. The API owns Supabase service credentials, administrator authorization, guest export, and mail configuration if mail is later approved. Each deployment receives its own environment variables in Vercel.
