# VibeWatch Website - Claude Code Instructions

## Project Overview

- **Domain:** vibewatch.app
- **Framework:** Next.js 15+ (App Router) with TypeScript
- **Styling:** Tailwind CSS 4
- **Auth/DB:** Supabase
- **Deploy:** Push to `main` branch (auto-deploys)

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

## Key Pages

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Landing page |
| `/privacy-policy` | `app/privacy-policy/page.tsx` | Privacy policy (linked from Play Store) |
| `/admin` | `app/admin/` | Admin dashboard |

## Detailed Docs

| File | Contents |
|------|----------|
| `.claude/CHANGELOG.md` | History of changes and fixes |
| `.claude/ARCHITECTURE.md` | Project structure, routing, and patterns |
