# Delivery plan

1. Establish agent documentation, project rules, and skill inventory.
2. Audit and remediate the original frontend and backend.
3. Capture the new couple's functional and visual brief. **Completed for the initial design direction:** Diana & Héctor, 07 February 2027; olive, cream, and warm brown editorial style; D♥H monogram; countdown; February 2027 calendar; ceremony and reception details; dress-code notice; gift registries; envelope-opening reference. Music remains deferred.
4. Preserve the existing RSVP contract: no dietary question, and companions remain limited to the guest's assigned invitation. Validate that this flow is intuitive on mobile and desktop before guest data is imported. The supplied love phrase is approved as final copy.
5. Scaffold frontend and API, then implement the contract in `docs/api-contract.md`: token-scoped RSVP and administrator-only management/export before optional visual enhancements.
6. Build a visually distinct, photo-free invitation mobile-first, including the approved ceremony/reception links, gift registries, countdown, calendar, and motion that respects reduced-motion preferences.
7. After the stable Vercel production URL is configured, generate a QR code that resolves to that URL and present it only as a desktop convenience for opening the same invitation on a phone. Do not bind a QR code to a preview deployment.
8. Verify mobile, desktop, accessibility, security, and deployment readiness.

Current blocker: Vercel Authentication protects both invitation projects. Confirm a public hosting/protection option before distribution; do not substitute a temporary shareable link for the canonical guest URL.

Advance only when the previous stage has a recorded outcome in `progress.md`.
