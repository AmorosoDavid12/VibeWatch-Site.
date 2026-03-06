# Architecture

## Tech Stack

- **Next.js 15+** with App Router (`app/` directory)
- **TypeScript**
- **Tailwind CSS 4** (via `@tailwindcss/postcss`)
- **Supabase** — auth helpers (`@supabase/auth-helpers-nextjs`) + JS client

## Directory Structure

```
app/
├── layout.tsx          # Root layout
├── page.tsx            # Landing page
├── globals.css         # Global styles (Tailwind)
├── admin/              # Admin dashboard
├── api/                # API routes
├── auth/               # Auth pages
├── components/         # Shared components
├── delete-account/     # Account deletion page
├── forgot-password/    # Password reset
├── privacy-policy/     # Privacy policy (server-rendered)
├── search/             # Search page
├── signin/             # Sign-in page
├── title/              # Title page
├── utils/              # Utility functions
├── watched/            # Watched list page
└── watchlist/          # Watchlist page
```

## Deployment

Push to `main` branch to auto-deploy.
