# Frontend guidance

Use a component-based, mobile-first implementation. Preserve semantic HTML, visible focus states, keyboard access, optimized image loading, and reduced-motion support. Keep invitation content separate from components so it can be revised without changing layout code.

Next.js 16.4 with the App Router is the selected framework. It supports a small, fast, component-based Spanish experience, a token-scoped dynamic RSVP route, server-rendered metadata, and deployment to the project's Vercel runtime. The initial product is intentionally photo-free and uses CSS-led editorial design rather than copying assets from the original invitation.

`/admin` is a separate responsive administration surface. It uses magic-link authentication through Supabase Auth and a server-verified API token, never direct guest-table access. The seating editor uses React-Konva only for visual interaction and PNG output; semantic plan/table/seat data remains in the API and its HTML inspector remains keyboard-operable. Excel exports are generated in the browser from the loaded administrative representation.
