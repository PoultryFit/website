# Find a Space KE

A Kenyan commercial space marketplace. Anyone, anywhere in the 47 counties, can browse shops, offices, warehouses, stalls and other commercial spaces for rent or sale, see exact map locations, and contact owners directly — no agents, no travel.

## Stack

- React 19 + TanStack Start (Vite 7)
- Tailwind CSS v4 + shadcn/ui
- Supabase (auth, Postgres with RLS, storage)
- Deploys to Cloudflare Workers (default) or Netlify

## Features

- Two account types: Space Seekers and Space Owners, each with separate signup, login, and dashboard
- 6-step publish wizard (basics → details → amenities → photos → location → review)
- Image uploads to `space-images` bucket, up to 10 per listing, first photo is the cover
- Browse with filters: county, town, space type, listing type, price, size, amenities
- Listing detail with gallery, amenities, map pin and "Open in Google Maps" link
- Save listings, contact owner, view counter
- Admin control center (read-only) for users, spaces and feedback
- Public feedback and support pages

## Getting started

```bash
bun install
bun run dev
```

The app expects the following environment variables (auto-provisioned by Lovable Cloud, or set manually in Netlify / Cloudflare):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
```

## Database

All schema lives in `supabase/migrations/` as versioned SQL files. Tables: `space_seekers`, `space_owners`, `spaces`, `saved_spaces`, `feedback`, `support_messages`, `space_waitlist`, `user_roles`. Roles are managed via the `app_role` enum (`seeker`, `owner`, `admin`) and a `has_role()` security-definer function. RLS is enabled on every table.

To grant the first admin, insert into `user_roles` after the user signs up:

```sql
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = 'you@example.com';
```

## Project structure

```
src/
  routes/              file-based routes (TanStack Router)
    _seeker/           authenticated seeker pages
    _owner/            authenticated owner pages
    _admin/            authenticated admin pages
  components/          UI, dashboard shell, space cards
  integrations/supabase/  auto-generated Supabase client and types
  lib/                 auth provider, counties, helpers
  styles.css           design tokens (Kenyan palette, Fraunces + Plus Jakarta Sans)
supabase/migrations/   versioned SQL migrations
```

## Deploy

- **Lovable**: push happens automatically on every change.
- **Netlify / Cloudflare**: connect the GitHub repo, set the three `VITE_SUPABASE_*` env vars, and deploy. No manual schema steps required — migrations are applied via Supabase.

## License

Proprietary. All rights reserved.