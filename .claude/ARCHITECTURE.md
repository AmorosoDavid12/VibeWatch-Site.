# Architecture

## Tech Stack

- **Next.js 15.5.12** with App Router (`app/` directory)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4** (via `@tailwindcss/postcss`, configured in CSS with `@theme inline`)
- **Supabase** — auth + database (`@supabase/supabase-js` ^2.49.4)
- **Font:** Inter (Google Fonts, loaded via `next/font`)

## Directory Structure

```
app/
├── layout.tsx              # Root layout (Inter font, AuthProvider wrapper)
├── page.tsx                # Landing page (delegates to HomePage)
├── globals.css             # Design tokens + Tailwind @theme inline
├── favicon2.ico            # Favicon
├── admin/
│   ├── layout.tsx          # Admin layout wrapper
│   ├── login-form.tsx      # Admin login form component
│   ├── page.tsx            # Admin dashboard page
│   └── feedback/
│       └── page.tsx        # Feedback viewer page
├── api/
│   └── admin/
│       ├── auth/route.ts   # Admin authentication API
│       ├── feedback/route.ts # Feedback CRUD API
│       └── groups/route.ts # Group management API
├── auth/
│   └── callback/
│       └── page.tsx        # Client-side auth redirect handler (OAuth, email verify, recovery)
├── components/
│   ├── AuthBrandPanel.tsx  # Brand panel for auth pages (split layout left side)
│   ├── Header.tsx          # Site navigation header
│   ├── HomePage.tsx        # Landing page content (carousel, trending, celebs)
│   └── ui/                 # Base UI components (planned, currently empty)
├── delete-account/         # Account deletion page
├── forgot-password/        # Password reset request (with resend cooldown)
├── reset-password/         # Set new password (after email link)
├── privacy-policy/         # Privacy policy (server-rendered)
├── search/                 # Search page
├── signin/                 # Sign in / sign up (split layout, Google OAuth)
├── title/                  # Title detail page + subcomponents
│   ├── page.tsx            # Title detail page
│   ├── TitleDocs.txt       # Title page documentation
│   └── components/         # Gallery, RatingModal, Trailers, RelatedContent
├── utils/
│   ├── auth-provider.tsx   # React Context (signIn, signUp, signInWithGoogle, signOut)
│   ├── supabase.ts         # Supabase client init
│   ├── tmdb-api.ts         # TMDB API functions
│   └── watchlist.ts        # Watchlist CRUD operations
├── watched/                # Watched list page
└── watchlist/              # Watchlist page
```

## Design System

Design tokens are defined in two layers:

1. **CSS custom properties** (`:root` in `globals.css`) — used with `var()` in components
2. **Tailwind `@theme inline`** — maps tokens to utility classes (e.g., `bg-surface`, `text-accent`)

The `tailwind.config.js` file only defines content paths. All theme configuration lives in CSS.

Full design system spec: `.claude/skills/design-system/SKILL.md`

## Auth Flow

- **Email/password:** `AuthProvider` wraps the app, exposes `signIn`, `signUp`, `signOut`
- **Google OAuth:** `signInWithGoogle()` triggers Supabase OAuth redirect
- **Email verification:** Supabase emails link → `/auth/callback` handles token → session established
- **Password recovery:** Email link → `/auth/callback` detects recovery → redirects to `/reset-password`
- **Supabase project:** `gihofdmqjwgkotwxdxms.supabase.co`

## Deployment

Push to `main` branch to auto-deploy.
