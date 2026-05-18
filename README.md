# Find a Space KE

A Kenyan commercial space marketplace for browsing, saving, publishing, and managing shops, offices, warehouses, stalls, and other commercial spaces across all 47 counties.

## Tech stack

- Vite + React 19 + TypeScript
- React Router DOM v6 for client-side routing
- TanStack Query for async state
- Tailwind CSS v4 + shadcn/ui components
- Supabase client integration for auth, database, and storage
- Netlify static deployment with `dist` as the publish directory

## Features

- Public landing, feedback, and support pages
- Seeker signup/login, dashboard, browse filters, saved listings, and space details
- Owner signup/login, dashboard, and multi-step space publishing flow
- Admin view for users, spaces, feedback, support messages, and waitlist entries
- Image uploads to the public `space-images` storage bucket
- Database migrations with RLS policies and role-based access

## Local setup

```bash
npm install
npm run dev
```

Or with Bun:

```bash
bun install
bun run dev
```

Create a local `.env` file from `.env.example` and fill in your own Supabase project values:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
```

Only `VITE_*` variables are used by the browser build.

## Database

Schema migrations live in `supabase/migrations/`. They create the role system, profile tables, listings, saved spaces, feedback, support messages, waitlist, storage bucket policies, and helper functions.

Apply the migrations to your own Supabase project before using the hosted app. To grant the first admin after signup:

```sql
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = 'you@example.com';
```

## Project structure

```text
src/
  App.tsx                    React Router route tree
  main.tsx                   Vite React entry point
  pages/                     public, seeker, owner, and admin pages
  components/                layout, dashboard, listing, and UI components
  integrations/supabase/     Supabase browser client and generated types
  lib/                       auth provider, counties, and utilities
  styles.css                 Tailwind v4 theme and global styles
supabase/migrations/         SQL migrations
public/_redirects            Netlify SPA fallback
netlify.toml                 Netlify build config
```

## Netlify deployment

1. Connect the GitHub repo to Netlify.
2. Set environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_SUPABASE_PROJECT_ID`.
3. Use build command `npm run build`.
4. Use publish directory `dist`.

This is a static SPA. There is no SSR, no TanStack Start server, and no server functions required.

## License

Proprietary. All rights reserved.