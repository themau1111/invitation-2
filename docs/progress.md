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

## 2026-10-07

- Captured the initial couple brief for Diana & Héctor. The wedding is Sunday, 07 February 2027. Ceremony: Santuario Nuestra Señora de la Soledad, 6:00 pm; guests should arrive by 5:40 pm. Reception: La Yeguada A y E, 8:00 pm. The official map links and the Liverpool/Amazon gift registries are sourced from the couple's shared Drive document.
- Visual direction: editorial and romantic, with olive greens, cream, and warm brown; a D♥H monogram; refined serif and script accents; a countdown and February 2027 calendar. Dress is semiformal; guests should avoid white and the supplied olive palette. An envelope-opening animation is reference-only until motion scope is approved. Spotify playback/download is explicitly deferred.
- RSVP decision confirmed: retain the existing token-scoped confirmation flow; do not ask dietary questions; companions are those assigned to each invitation and the implementation must make that flow intuitive. The supplied love phrase is approved as final invitation copy.
- The initial experience will be photo-free and deliberately distinct from the original invitation while retaining an elegant, high-care visual finish. A QR code is required for desktop visitors; it will be generated only after the stable Vercel production URL is set, and will open the same invitation on mobile.
- Repository documentation and `progress.md` are present. No repository-level pre-compact hook configuration was found; no hook format was added without an approved runtime convention.
- Implemented the initial Next.js 16.4 frontend: photo-free editorial landing page, D♥H monogram, countdown, February 2027 calendar, ceremony/reception map links, dress guidance, gift registries, accessible reduced-motion behavior, desktop QR, and token-scoped `/rsvp/[accessToken]` UI. It uses only `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_SITE_URL`; no database credential is in browser code.
- The Vercel frontend project was renamed to `diana-y-hector` and deployed. The stable named URL is `https://diana-y-hector-themau1111s-projects.vercel.app`; Vercel retains a separate legacy alias. The QR is built from the named URL, not an ephemeral preview.
- Production dependency audit is clean (zero vulnerabilities) after moving to Next.js 16.4.0. Local production build and mobile/desktop visual checks passed.
- Deployment readiness remains blocked by Vercel Authentication: on 2026-10-07 the named production URL returned a Vercel SSO redirect. Both `diana-y-hector` and `invitation-2-api` show `Standard Protection` in the team-level Deployment Protection view. The current plan exposes no project-only public-access control, so no team-wide protection was changed and no secret-bearing share link was treated as the canonical guest URL. Resolve public hosting/protection before distributing the QR or invitation links.
- Assigned the short canonical alias `https://diana-y-hector.vercel.app` on 2026-10-07 and redeployed the frontend with it as `NEXT_PUBLIC_SITE_URL`; the desktop QR now encodes that short URL. It is the only URL intended for guests. The Vercel Authentication blocker remains and the alias must not be distributed until public access is enabled.
- Resolved the Vercel public-access blocker on 2026-10-07 by changing only this project's SSO policy from `all_except_custom_domains` to `prod_deployment_urls_and_all_previews`, matching the original invitation. `https://diana-y-hector.vercel.app` now returns a public `200`; previews and direct production deployment URLs remain protected.
- Began the second visual pass on 2026-10-07: bespoke editorial location illustrations, richer venue cards, elevated gift-registry cards, and restrained entrance/hover motion were added. The exact original name-autocomplete RSVP flow was intentionally not restored yet: it would expose guest names and allow invitation access based solely on a name. Await an explicit acceptance of that privacy trade-off or a safer personal-code alternative.
