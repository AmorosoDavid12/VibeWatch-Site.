# Handoff — What's Next

## What Was Done (This Session)

### Design Foundation
- `globals.css` — Full design token system (CSS custom properties + Tailwind `@theme inline`)
- `layout.tsx` — Switched font from Geist to Inter
- `tailwind.config.js` — Cleaned up (theme now lives in CSS)

### Auth Pages Redesigned
- `/signin` — Split layout, Google OAuth, password strength, username check, privacy checkbox (#8)
- `/forgot-password` — Split layout, Supabase integration, resend cooldown (#9)
- `/reset-password` — New page, password update form (#12)
- `/auth/callback` — Client-side handler for email verify + recovery + OAuth (#11)
- `AuthBrandPanel` component — Reusable left-side brand panel
- `auth-provider.tsx` — Added `signInWithGoogle()` method

### Supabase Dashboard (Manual)
- Site URL changed from `vibewatch://` to `https://vibewatch.app` (#10 — done)
- Added `https://vibewatch.app/**`, `http://localhost:3000/**`, `vibewatch://**`, `exp://192.168.1.128:8081/**`, `https://vibewatch.app/auth/callback` to redirect allowlist

### Android App Bridge (Mar 8, 2026)
- `SmartAppBanner.tsx` — Global "Open in App" banner for Android users on all pages (except `/reset-password`)
- `/auth/callback` — Android detection: shows "Open in VibeWatch App" button after verification/recovery
- `/signin` — Android detection: shows "Open in VibeWatch App" button after email verification
- Uses `intent://` URI for reliable app-or-Play-Store opening

### Issues Created
- #10 — Supabase redirect config (done)
- #11 — Auth callback handler (done)
- #12 — Reset password page (done)
- #13 — Email verification skips confirmation message (done — fixed)

---

## What's Next — Priority Order

### 1. Redesign: Search (#5) — Order 3 of 7
**Effort:** Medium
**What:** Connect search to TMDB API, add tabs (All/Movies/TV/People), filters, debounced input, infinite scroll, trending/recent searches.
**Key new TMDB functions needed:** `searchMulti()`, `searchMovies()`, `searchTV()`, `searchPeople()`
**Dependency:** None remaining — auth pages are done.

### 2. Redesign: Title Details (#4) — Order 4 of 7
**Effort:** Large
**What:** Unified detail page for movies/TV. Hero backdrop, action bar (watchlist/rate/remind/share), cast scroll, seasons accordion, watch providers, related content.
**Key new TMDB functions needed:** `getMovieDetails()`, `getTVDetails()`, `getCredits()`, `getWatchProviders()`, `getRecommendations()`, `getSimilar()`
**Dependency:** Benefits from #5 (search API functions).

### 3. Redesign: Watchlist (#6) — Order 5 of 7
**Effort:** Medium
**What:** Filtering (genre, year, rating), sorting, grid/list view toggle, multi-select bulk actions, URL state persistence.
**Dependency:** Blocked by #4 (reuses `PosterCard`), #5 (search patterns).

### 4. Redesign: Watched (#7) — Order 6 of 7
**Effort:** Medium
**What:** Stats header, user rating filter, re-rate flow, grid/list views.
**Dependency:** Blocked by #6 (reuses `FilterBar`, view toggle).

### 5. Redesign: Homepage (#3) — Order 7 of 7 (LAST)
**Effort:** Large
**What:** Logged-out conversion funnel (hero, vibe grid, trending, value props) + logged-in retention dashboard (greeting, airing this week, friend activity).
**Dependency:** Blocked by #4, #5, #6, #7. Reuses the most shared components.

---

## Uncommitted Changes

All work from this session is uncommitted. Files changed/added:

**Modified:**
- `CLAUDE.md`, `globals.css`, `layout.tsx`, `tailwind.config.js`
- `app/signin/page.tsx`, `app/forgot-password/page.tsx`
- `app/utils/auth-provider.tsx`

**New:**
- `app/components/AuthBrandPanel.tsx`
- `app/auth/callback/page.tsx`
- `app/reset-password/page.tsx`
- `.claude/skills/design-system/` (skill definition)
- `HANDOFF.md` (this file)
