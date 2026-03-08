# VibeWatch Website Changelog

## Documentation Audit (Mar 8, 2026)

### Docs Sync
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

## Recent Changes (Mar 2026)

### Admin Feedback Dashboard
Added admin feedback dashboard and updated contact emails.

### Privacy Policy Update
Updated privacy policy with Google Sign-In disclosures.

### Next.js Security Patch
Updated Next.js 15.3.1 → 15.5.12 to patch CVE-2025-66478 RCE vulnerability.

### Privacy Policy SSR
Made privacy policy page server-rendered for app store review bots.

### Banner Title
Added conditional loading for the banner title.
