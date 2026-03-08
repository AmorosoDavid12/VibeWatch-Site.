# VibeWatch Website - Claude Code Instructions

## Project Overview

- **Domain:** vibewatch.app
- **Framework:** Next.js 15+ (App Router) with TypeScript
- **Styling:** Tailwind CSS 4
- **Auth/DB:** Supabase
- **Font:** Inter (Google Fonts)
- **Deploy:** Push to `master` branch (auto-deploys)

## Related Projects

### VibeWatch Mobile App (React Native / Expo)

- **Local path:** `c:\dev\vibewatch-test\`
- **Purpose:** Android app (Play Store)
- **Its own CLAUDE.md:** `c:\dev\vibewatch-test\CLAUDE.md`

## Build Commands

```bash
npm run dev      # Local dev server
npm run build    # Production build
npm run lint     # ESLint
```

> **Do NOT run `npm run build` automatically.** The user will build and test manually.

## Key Pages

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Landing page |
| `/signin` | `app/signin/page.tsx` | Sign in / sign up (split layout, Google OAuth) |
| `/forgot-password` | `app/forgot-password/page.tsx` | Password reset request |
| `/reset-password` | `app/reset-password/page.tsx` | Set new password (after email link) |
| `/auth/callback` | `app/auth/callback/page.tsx` | Auth redirect handler (OAuth, email verify, recovery) |
| `/search` | `app/search/page.tsx` | Search page |
| `/title` | `app/title/page.tsx` | Title detail page |
| `/watchlist` | `app/watchlist/page.tsx` | User watchlist |
| `/watched` | `app/watched/page.tsx` | User watched list |
| `/privacy-policy` | `app/privacy-policy/page.tsx` | Privacy policy (server-rendered) |
| `/delete-account` | `app/delete-account/page.tsx` | Account deletion |
| `/admin` | `app/admin/page.tsx` | Admin dashboard (login + panel) |
| `/admin/feedback` | `app/admin/feedback/page.tsx` | Admin feedback viewer |

## Shared Components

| Component | File | Purpose |
|-----------|------|---------|
| `Header` | `app/components/Header.tsx` | Site navigation header |
| `HomePage` | `app/components/HomePage.tsx` | Landing page content |
| `AuthBrandPanel` | `app/components/AuthBrandPanel.tsx` | Left-side brand panel for auth pages |
| `SmartAppBanner` | `app/components/SmartAppBanner.tsx` | Android "Open in App" banner (global, rendered in layout.tsx) |
| `ui/` | `app/components/ui/` | Base UI components (planned, currently empty) |

## API Routes

| Route | File | Purpose |
|-------|------|---------|
| `/api/admin/auth` | `app/api/admin/auth/route.ts` | Admin authentication |
| `/api/admin/feedback` | `app/api/admin/feedback/route.ts` | Feedback CRUD |
| `/api/admin/groups` | `app/api/admin/groups/route.ts` | Group management |

## Utility Modules

| Module | File | Purpose |
|--------|------|---------|
| `auth-provider` | `app/utils/auth-provider.tsx` | React Context (signIn, signUp, signInWithGoogle, signOut, PASSWORD_RECOVERY redirect) |
| `supabase` | `app/utils/supabase.ts` | Supabase client init + `pendingAuthType` hash capture |
| `tmdb-api` | `app/utils/tmdb-api.ts` | TMDB API functions |
| `watchlist` | `app/utils/watchlist.ts` | Watchlist CRUD operations |

## Design System

All UI decisions should reference the design system skill:

- **Tokens:** CSS custom properties in `globals.css`, mapped to Tailwind via `@theme inline`
- **Colors:** Dark-first palette with `--bg-base` through `--bg-overlay` surface hierarchy
- **Brand:** `--accent: #E50914` (VibeWatch red)
- **Full spec:** `.claude/skills/design-system/SKILL.md`

## Detailed Docs

| File | Contents |
|------|----------|
| `.claude/CHANGELOG.md` | History of changes and fixes |
| `.claude/ARCHITECTURE.md` | Project structure, routing, and patterns |
| `HANDOFF.md` | Current status and what to work on next |

## Skills

| Skill | Purpose |
|-------|---------|
| `.claude/skills/update-docs/` | Audit and refresh all documentation files |
| `.claude/skills/design-system/` | Complete design system blueprint — tokens, components, and page specs for all screens |
