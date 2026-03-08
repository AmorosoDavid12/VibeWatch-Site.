# VibeWatch Website Changelog

## Android App Bridge & Smart App Banner (Mar 8, 2026)

### Smart App Banner (`SmartAppBanner.tsx`)
- Added global banner for Android users: app icon, "Better on the app" text, and "Open" button
- Rendered in root `layout.tsx`, appears on every page except `/reset-password`
- Uses Android `intent://` URI: opens app if installed, falls back to Play Store (`com.vibewatch.app`)
- Dismissible per session via `sessionStorage`
- Hidden in WebViews (detects `wv|WebView` in user agent)

### Android Deep Link Bridge on Auth Pages
- `/auth/callback` — Detects Android, shows "Open in VibeWatch App" button after email verification or password recovery instead of auto-redirecting
- `/signin` — Shows "Open in VibeWatch App" button when Android user lands after email verification (`?verified=true`)
- Deep links: `vibewatch://login` (verification), `vibewatch://reset-password` (recovery)
- Both pages include "Continue on web instead" fallback

### Supabase Config Change
- Site URL changed from `vibewatch://` to `https://vibewatch.app`
- Added `vibewatch://**`, `exp://192.168.1.128:8081/**`, `https://vibewatch.app/auth/callback` to redirect URLs
- Email verification and password recovery links now redirect to the website; the website bridges mobile users back to the app

**Files created:** `app/components/SmartAppBanner.tsx`
**Files modified:** `app/layout.tsx`, `app/auth/callback/page.tsx`, `app/signin/page.tsx`

---

## Auth Flow Bug Fixes (Mar 8, 2026)

### Password Recovery Redirect (#12)
- Fixed password recovery flow: `/auth/callback` now detects `type=recovery` and redirects to `/reset-password` after code exchange
- Added `PASSWORD_RECOVERY` event interception in `AuthProvider` as a fallback redirect mechanism

### Signup Verification Redirect (Bug #13)
- Fixed email verification UX: after clicking verification link, user now sees "Email verified!" confirmation with 3-second countdown before redirect
- Auth callback signs user out after email verification so they go through login intentionally
- Added hash-fragment fallback path for non-PKCE email verification flows
- Added 5-second timeout fallback if auth state change never fires

### URL Hash Capture Fix
- Fixed `supabase.ts` to capture URL hash parameters before `createClient()` clears them
- Ensures auth type (recovery, signup) is preserved from the hash fragment for proper routing

### Auth Provider Recovery Handling
- Added `PASSWORD_RECOVERY` event listener in `AuthProvider` that redirects to `/reset-password`
- Prevents recovery sessions from being treated as normal sign-ins

### Documentation Audit
- Audited and updated `CLAUDE.md`, `ARCHITECTURE.md`, and `CHANGELOG.md` to match actual codebase
- Added API Routes and Utility Modules tables to `CLAUDE.md`
- Added `/admin/feedback` page to Key Pages table
- Fixed `ARCHITECTURE.md` directory tree: removed non-existent `route.ts` from `auth/callback/`, expanded admin directory structure, added `favicon2.ico` and `TitleDocs.txt`
- Fixed `auth/callback` entry in Key Pages to reference `page.tsx` instead of directory

---

## Design System Foundation (Mar 7, 2026)

### Design Tokens & Theme Setup
- Replaced all CSS with design system tokens in `globals.css` (surface colors, text, borders, brand, semantic, glassmorphism)
- Mapped tokens to Tailwind v4 via `@theme inline` block (generates utility classes like `bg-surface`, `text-primary`, `text-accent`)
- Added custom shadows (`shadow-sm` through `shadow-glow`), border radii, motion/easing tokens
- Added `prefers-reduced-motion` support

### Font Switch: Geist → Inter
- Replaced Geist Sans/Mono with Inter from Google Fonts
- Updated `layout.tsx` to use Inter with `display: "swap"`
- Font variable `--font-inter` applied via `font-sans` utility

### Sign In Page Redesign (#8)
- Split layout: brand panel (desktop left) + form (right)
- Created `AuthBrandPanel` component (reusable across auth pages)
- Added Google OAuth button via `signInWithGoogle()` in auth provider
- Added password strength indicator (weak/medium/strong)
- Added username uniqueness check (debounced Supabase query)
- Added privacy policy checkbox for signup
- Added `returnUrl` query param support for post-auth redirect
- Animated tab indicator between Login/Sign Up
- Wrapped in `Suspense` boundary for `useSearchParams()`

### Forgot Password Page Redesign (#9)
- Split layout reusing `AuthBrandPanel`
- Integrated `supabase.auth.resetPasswordForEmail()` (was previously a no-op)
- Added 60-second resend cooldown with visible countdown timer
- Smooth transition between email input and success states
- Security: always shows success state regardless of email existence

### Auth Callback Handler (#11)
- Created client-side `/auth/callback/page.tsx`
- Handles OAuth code exchange, email verification (hash fragments), and password recovery redirects
- Routes recovery type to `/reset-password`

### Reset Password Page (#12)
- New page at `/reset-password` with split layout
- Session check: shows "Link expired" state if no recovery session
- Password + confirm fields with strength indicator and visibility toggle
- Calls `supabase.auth.updateUser()` to set new password
- Success state with auto-redirect to `/signin`

### Auth Provider: Google OAuth
- Added `signInWithGoogle()` method using `supabase.auth.signInWithOAuth({ provider: 'google' })`

---

## Earlier Changes (Feb-Mar 2026)

### Admin Feedback Dashboard (Mar 5)
- Added admin feedback dashboard at `/admin/feedback` with viewer page
- Added API routes: `/api/admin/auth`, `/api/admin/feedback`, `/api/admin/groups`
- Updated contact emails

### Privacy Policy Update (Mar 3)
- Updated privacy policy with Google Sign-In disclosures

### Next.js Security Patch (Feb 26)
- Updated Next.js 15.3.1 to 15.5.12 to patch CVE-2025-66478 RCE vulnerability

### Privacy Policy SSR (Feb 26)
- Made privacy policy page server-rendered for app store review bots

---

## Initial Development (Aug 2025)

### Banner Title
- Added conditional loading for the banner title

### Initial Commit
- Next.js project setup with image configuration fix
