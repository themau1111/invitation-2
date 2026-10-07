# Invitation 2 — Agent Guide

## Scope

This is the frontend for the second wedding invitation. It is intentionally empty while requirements and the Supabase contract are being defined. Do not copy code, assets, credentials, or guest data from the original invitation without an explicit reuse decision.

## Read on demand

- Read `docs/project-overview.md` first for scope and repository relationships.
- Read `docs/plan.md` before beginning a feature; update `docs/progress.md` after a durable decision or completed milestone.
- Read `docs/frontend.md` for UI, accessibility, and asset work.
- Read `docs/supabase.md` only when working on persistence, authentication, or database contracts.
- Read `docs/security.md` before handling secrets, guest data, forms, or deployment.

## Rules

1. Treat guest information and Supabase credentials as sensitive. Never commit secrets or production exports.
2. Keep UI changes mobile-first, accessible, localized in Spanish unless the product brief says otherwise, and test the changed flow.
3. Prefer reusable components and explicit environment validation over hidden constants.
4. Do not deploy, change the existing Supabase project, or import production data without user authorization.
5. Preserve unrelated user changes and report blockers or findings in `docs/progress.md`.

## Commands

Commands will be documented when the application scaffold is approved.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
