# Find a Space KE — Build Plan

A standalone Kenyan commercial space marketplace. Independent project — no shared code or data with Find a Keja KE.

## Phase 1 — Backend (Lovable Cloud / Supabase)

Enable Lovable Cloud, then create schema via migration:

- `space_seekers`, `space_owners` (profile tables, FK to `auth.users`)
- `spaces` (full listing with lat/lng, images[], amenities[], listing_type, status)
- `saved_spaces`, `feedback`, `support_messages`, `space_waitlist`
- `user_roles` table + `app_role` enum (`seeker`, `owner`, `admin`) + `has_role()` SECURITY DEFINER
- RLS on every table; indexes on county, town, space_type, listing_type, price, status
- Storage bucket `space-images` (public read, owner-scoped write)
- Trigger to auto-create seeker/owner profile row on signup based on metadata
- Trigger to assign role on signup

Auth: Email/password via Supabase Auth, two separate signup flows. Session persists via Supabase default (cannot truly "end on tab close" without breaking refresh-token UX — will use `sessionStorage` persistence so closing the tab clears the session, matching the requirement).

## Phase 2 — Design system (Kenyan identity)

`src/styles.css` tokens:
- Terracotta/ochre primary, deep highland green secondary, savanna gold accent, Maasai red highlight, charcoal foreground on warm off-white background
- Display font: **Fraunces** (characterful serif) for headings; **Plus Jakarta Sans** for body
- Subtle SVG kikoi/beadwork pattern as section dividers
- Generous spacing scale, soft shadows, rounded-2xl cards

## Phase 3 — Routes

Public:
- `/` landing (hero, what-is, 10 featured spaces, how-it-works, who-it-is-for, live stats, onboarding notice, footer)
- `/seeker/signup`, `/seeker/login`
- `/owner/signup`, `/owner/login`
- `/feedback`, `/support`

Authenticated seeker (`/_seeker/*`):
- `/seeker` dashboard
- `/seeker/browse` (filters: county, town, type, listing type, price, size, amenities)
- `/seeker/spaces/$id` detail (gallery, Google Maps satellite pin, contact card)
- `/seeker/saved`

Authenticated owner (`/_owner/*`):
- `/owner` dashboard (greeting, stats, top performing, list with edit/delete)
- `/owner/publish` (6-step wizard: basics → details → amenities → photos → location → review)
- `/owner/spaces/$id/edit`

Admin (`/_admin/*`):
- `/admin` read-only control center

Route guards enforce role via `_seeker.tsx`, `_owner.tsx`, `_admin.tsx` layouts using `beforeLoad`. Logged-in users hitting `/` redirect to their dashboard.

## Phase 4 — Maps

Google Maps embed via `@vis.gl/react-google-maps` requires an API key. Will request `GOOGLE_MAPS_API_KEY` as a build secret (`VITE_GOOGLE_MAPS_API_KEY`). For owner location step: draggable marker with auto-geocode from county/town/estate. For seeker detail: static satellite pin + "Open in Google Maps" link.

## Phase 5 — Listings & uploads

- Image upload to `space-images` bucket with progress, drag-reorder, 1–10 limit, first = cover
- Featured spaces query: 10 most-recent active, auto-backfills
- View counter increments on detail page open

## Phase 6 — Admin

Seeded via SQL: first admin assigned by inserting into `user_roles`. Read-only feedback inbox, user/space management with deactivate/delete.

## Technical notes

- Stack: React 19 + TanStack Start + Tailwind v4 + shadcn + Supabase (Lovable Cloud)
- Env vars `VITE_SUPABASE_*` are auto-managed by Lovable Cloud; the GitHub→Netlify workflow described in the brief works out of the box once Cloud is enabled
- Session: switch Supabase client to `sessionStorage` so closing the tab logs the user out
- All copy hyphen-free, natural Kenyan English

## Scope note

This is a large build (~40+ files, migration, wizard, maps, admin). I'll ship it in one pass but the first version will focus on a solid end-to-end flow: auth → publish wizard → browse → detail with map → save → dashboards → admin. Polish passes (animations, empty states, edge cases) can follow on iteration.

## Confirmation needed

1. OK to enable **Lovable Cloud** now (provisions Supabase backend automatically)?
2. OK to request a **Google Maps API key** from you as a secret for the map features?
3. Who is the first **admin**? Provide an email after signup so I can grant the admin role.
