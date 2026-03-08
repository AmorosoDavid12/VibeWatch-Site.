---
name: design-system
description: Blueprint for the complete VibeWatch website redesign — design tokens, component specs, and page blueprints for all screens
---

# VibeWatch Design System

Use this skill as the single source of truth when building or redesigning any page or component. Every UI decision should reference this document.

---

## 1. Design Tokens

### Color Palette

```
/* Backgrounds (surface hierarchy — each level slightly lighter) */
--bg-base:        #060608       /* page background */
--bg-surface:     #0c0c10       /* cards, panels */
--bg-elevated:    #14141a       /* elevated cards, dropdowns */
--bg-overlay:     #1a1a22       /* modals, popovers */
--bg-input:       #10101a       /* form inputs */

/* Borders */
--border-subtle:  rgba(255, 255, 255, 0.06)
--border-default: rgba(255, 255, 255, 0.10)
--border-hover:   rgba(255, 255, 255, 0.16)
--border-focus:   rgba(229, 9, 20, 0.5)

/* Text */
--text-primary:   #f0f0f0       /* headings, primary content */
--text-secondary: #a0a0a8       /* descriptions, metadata */
--text-tertiary:  #606068       /* placeholders, disabled */
--text-inverse:   #060608       /* text on light backgrounds */

/* Brand */
--accent:         #E50914       /* primary CTA, brand red */
--accent-hover:   #ff1a25       /* hover state */
--accent-muted:   rgba(229, 9, 20, 0.15)  /* subtle accent backgrounds */

/* Feature Colors (carried from mobile app tab colors) */
--color-watchlist:    #E50914
--color-search:       #3498db
--color-watched:      #8c52ff
--color-friends:      #2ecc71
--color-reminders:    #f39c12

/* Semantic */
--success:        #22c55e
--warning:        #f59e0b
--error:          #ef4444
--info:           #3b82f6

/* Glassmorphism */
--glass-bg:       rgba(255, 255, 255, 0.03)
--glass-border:   rgba(255, 255, 255, 0.08)
--glass-blur:     12px
```

### Typography

**Font stack:** `"Inter", system-ui, -apple-system, sans-serif`
Use Inter from Google Fonts. Fall back to system fonts.

```
/* Type Scale — use clamp() for fluid sizing */
--text-display:   clamp(2.5rem, 5vw, 4rem)      /* hero headlines */
--text-h1:        clamp(1.75rem, 3vw, 2.5rem)    /* page titles */
--text-h2:        clamp(1.25rem, 2.5vw, 1.75rem) /* section titles */
--text-h3:        clamp(1rem, 2vw, 1.25rem)      /* subsection titles */
--text-body:      1rem                            /* 16px body text */
--text-sm:        0.875rem                        /* 14px secondary text */
--text-xs:        0.75rem                         /* 12px captions, labels */
--text-overline:  0.625rem                        /* 10px overlines */

/* Font Weights */
--weight-normal:  400
--weight-medium:  500
--weight-semi:    600
--weight-bold:    700

/* Line Heights */
--leading-tight:  1.2    /* headings */
--leading-normal: 1.5    /* body */
--leading-relaxed: 1.7   /* long-form */

/* Letter Spacing */
--tracking-tight:  -0.02em  /* display text */
--tracking-normal:  0       /* body */
--tracking-wide:    0.05em  /* overlines, labels */
--tracking-wider:   0.1em   /* all-caps text */
```

### Spacing (8px Grid)

All spacing uses multiples of 8. For fine adjustments use 4px.

```
--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-5:   20px
--space-6:   24px
--space-8:   32px
--space-10:  40px
--space-12:  48px
--space-16:  64px
--space-20:  80px
--space-24:  96px
```

### Border Radius

```
--radius-sm:    6px    /* small elements, tags, chips */
--radius-md:    10px   /* buttons, inputs */
--radius-lg:    16px   /* cards */
--radius-xl:    24px   /* large cards, modals */
--radius-full:  9999px /* pills, avatars */
```

### Shadows & Elevation

```
--shadow-sm:    0 1px 2px rgba(0, 0, 0, 0.3)
--shadow-md:    0 4px 12px rgba(0, 0, 0, 0.4)
--shadow-lg:    0 8px 24px rgba(0, 0, 0, 0.5)
--shadow-xl:    0 16px 48px rgba(0, 0, 0, 0.6)
--shadow-glow:  0 0 20px rgba(229, 9, 20, 0.3)  /* accent glow */
```

### Motion

```
--ease-default:    cubic-bezier(0.4, 0, 0.2, 1)    /* general transitions */
--ease-in:         cubic-bezier(0.4, 0, 1, 1)       /* elements entering */
--ease-out:        cubic-bezier(0, 0, 0.2, 1)       /* elements exiting */
--ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1) /* bouncy interactions */

--duration-fast:   150ms   /* hover states, toggles */
--duration-normal: 250ms   /* most transitions */
--duration-slow:   400ms   /* modals, page transitions */
--duration-slower: 600ms   /* complex animations */
```

### Breakpoints

```
sm:    640px    /* mobile landscape */
md:    768px    /* tablets */
lg:    1024px   /* small desktops */
xl:    1280px   /* desktops */
2xl:   1536px   /* large screens */
```

---

## 2. Component Specifications

### Buttons

| Variant   | Background            | Border                  | Text            | Hover                         |
|-----------|-----------------------|-------------------------|-----------------|-------------------------------|
| Primary   | `--accent`            | none                    | white           | `--accent-hover` + glow       |
| Secondary | transparent           | `--border-default`      | `--text-primary`| `--bg-elevated` + brighter border |
| Ghost     | transparent           | none                    | `--text-secondary` | `--bg-surface`             |
| Danger    | transparent           | `--error` at 30%        | `--error`       | `--error` fill, white text    |

- All buttons: `--radius-md`, `--space-3` vertical / `--space-5` horizontal padding
- Sizes: `sm` (32px height), `md` (40px height), `lg` (48px height)
- Transitions: `--duration-fast` for bg/border, `--ease-default`
- Active state: scale(0.97) transform
- Disabled: 40% opacity, no pointer events

### Cards

**Standard Card (media items)**
- Background: `--bg-surface`
- Border: 1px `--border-subtle`
- Border-radius: `--radius-lg`
- Overflow: hidden (for poster images)
- Hover: translateY(-4px), `--shadow-md`, border brightens to `--border-hover`
- Transition: `--duration-normal` `--ease-default`
- Poster aspect ratio: 2/3

**Glass Card (featured/highlighted content)**
- Background: `--glass-bg`
- Border: 1px `--glass-border`
- Backdrop-filter: blur(`--glass-blur`)
- Border-radius: `--radius-xl`
- Subtle gradient overlay on hover

**Stat Card (profile/dashboard numbers)**
- Background: `--bg-surface`
- Centered number in `--text-h2` with `--weight-bold`
- Label in `--text-xs` with `--text-secondary`
- Optional accent color left border (4px)

### Inputs

- Background: `--bg-input`
- Border: 1px `--border-default`
- Border-radius: `--radius-md`
- Height: 44px
- Padding: `--space-3` vertical, `--space-4` horizontal
- Text: `--text-primary`
- Placeholder: `--text-tertiary`
- Focus: border changes to `--border-focus`, subtle glow ring
- Error: border changes to `--error`, error message below in `--text-xs`

### Modals

- Backdrop: rgba(0, 0, 0, 0.7) with backdrop-filter blur(4px)
- Container: `--bg-overlay`, `--radius-xl`, `--shadow-xl`
- Max-width: 480px (small), 640px (medium), 900px (large)
- Padding: `--space-8`
- Enter: fade in + scale from 0.95, `--duration-slow`
- Exit: fade out + scale to 0.95, `--duration-normal`
- Close button: top-right, ghost style

### Tags / Chips

- Background: `--accent-muted` or feature color at 15% opacity
- Text: matching feature color or `--text-primary`
- Border-radius: `--radius-full`
- Padding: `--space-1` vertical, `--space-3` horizontal
- Font: `--text-xs`, `--weight-medium`

### Tabs

- Bottom border: 2px, `--border-subtle` (inactive), feature color (active)
- Text: `--text-secondary` (inactive), `--text-primary` (active)
- Font: `--text-sm`, `--weight-medium` (inactive), `--weight-semi` (active)
- Transition: `--duration-fast`
- Active indicator slides with `--ease-default`

### Toast / Notifications

- Background: `--bg-elevated`
- Border: 1px `--border-default`
- Border-radius: `--radius-lg`
- Left accent border: 3px in semantic color (success/warning/error/info)
- Enter: slide in from right + fade, `--duration-normal`
- Auto-dismiss: 4 seconds
- Position: bottom-right, stacked with `--space-2` gap

### Skeleton Loaders

- Background: `--bg-surface`
- Animated gradient shimmer: left-to-right, 1.5s infinite
- Match exact shapes of the components they replace
- Border-radius matches target component

### Avatar

- Sizes: `xs` (24px), `sm` (32px), `md` (40px), `lg` (56px), `xl` (80px)
- Border-radius: `--radius-full`
- Border: 2px `--border-subtle`
- Fallback: initials on `--bg-elevated` background
- Online indicator: 10px green dot, bottom-right

### Empty States

- Centered layout
- Icon: 48px, `--text-tertiary`
- Heading: `--text-h3`, `--text-secondary`
- Description: `--text-sm`, `--text-tertiary`
- CTA button: primary variant
- Max-width: 400px

---

## 3. Layout Patterns

### Page Container
- Max-width: 1400px
- Horizontal padding: `--space-6` (mobile), `--space-10` (desktop)
- Center with margin auto

### Section
- Vertical padding: `--space-12` between sections
- Section header: `--text-h2` title + optional "See All" link right-aligned
- `--space-6` gap between header and content

### Media Grid
- CSS Grid with auto-fill
- Columns: `minmax(160px, 1fr)` (posters), `minmax(280px, 1fr)` (backdrop cards)
- Gap: `--space-4`
- Responsive: 2 cols mobile → 3 tablet → 5-6 desktop (posters)

### Horizontal Scroll Row
- Overflow-x: auto, hidden scrollbar (webkit)
- Snap: scroll-snap-type x mandatory, each item snap-align start
- Gap: `--space-4`
- Fade edges: gradient mask on left/right
- Navigation arrows: appear on hover (desktop), hidden mobile
- Padding: `--space-1` vertical (to show card hover lift)

### Sidebar Layout (for profile, settings)
- Sidebar: 280px fixed width on desktop, full-width drawer on mobile
- Content: flex-grow
- Gap: `--space-8`
- Sidebar nav items: `--space-3` vertical padding, `--radius-md`, highlight active

### Hero / Backdrop
- Full-width image with gradient overlay (bottom: transparent → `--bg-base`)
- Content overlay positioned bottom-left
- Min-height: 60vh (landing), 40vh (detail pages)
- Text shadow for readability

---

## 4. Page Blueprints

### EXISTING PAGES — Redesign

#### Landing Page `/`
- **Hero**: Full-width featured carousel (auto-rotate 8s) with backdrop image, glassmorphic info card overlay, watchlist CTA
- **Trending Now**: Horizontal scroll row of poster cards with rank numbers (#1, #2...)
- **Continue Watching**: (auth'd users) Horizontal row of in-progress items
- **Popular This Week**: Bento grid — 1 large + 4 small cards
- **Top Rated**: Horizontal scroll row with rating badges
- **Popular People**: Circular avatar cards in horizontal scroll
- **Browse by Genre**: Pill chips that link to filtered views

#### Title Details `/title?id=X&type=movie|tv`
- **Hero backdrop**: Full-width image, gradient overlay, poster + info floated left
- **Action bar**: Watchlist button, Rate/Mark watched button, Remind me, Share, Recommend to friend
- **Overview**: Expandable synopsis, genres as chips, keywords
- **Cast & Crew**: Horizontal scroll of person cards (circular avatar + name + role)
- **Seasons** (TV): Accordion or tab layout per season with episode list
- **Media**: Tabs for trailers | gallery
- **Where to Watch**: Provider logos (JustWatch integration potential)
- **Details sidebar**: Release date, runtime, budget/revenue, languages, production companies
- **Related**: Recommendations + Similar in two horizontal scroll rows
- **Friends Activity**: Which friends watched/want to watch this (when social is built)

#### Search `/search`
- **Search bar**: Large, centered, auto-focus, debounced (300ms)
- **Filter bar**: Media type chips (All, Movies, TV Shows, People), sort dropdown
- **Results**: Grid of poster cards with title, year, rating overlay
- **Trending searches**: Show when search is empty
- **Recent searches**: Persisted, clearable
- **No results**: Friendly empty state with suggestions

#### Watchlist `/watchlist`
- **Header**: Count badge, sort/filter controls
- **Filters**: Genre chips, year range, rating range (matching mobile app)
- **Grid**: Poster cards with hover overlay (remove, move to watched, details)
- **Multi-select mode**: Checkbox overlay, bulk actions bar (remove, move to watched)
- **Empty state**: Illustration + "Start discovering" CTA

#### Watched `/watched`
- **Header**: Count + average rating stat
- **Filters**: Same as watchlist + filter by user rating
- **Grid**: Poster cards with user rating badge (purple heart + score)
- **Hover overlay**: Re-rate, remove, view details
- **Empty state**: "Nothing watched yet" + link to trending

#### Sign In `/signin`
- **Split layout**: Left side brand visual/illustration, right side form
- **Tabs**: Log in | Sign up
- **Form**: Email, password, forgot password link
- **Social login**: Google Sign-In button
- **Sign up extras**: Username field, password requirements, privacy policy checkbox

#### Forgot Password `/forgot-password`
- **Centered card**: Email input, submit, success confirmation
- **Consistent** with sign-in page styling

---

### NEW PAGES — Build from Scratch

#### Profile `/profile`
- **Hero header**: Cover image (optional) + avatar + username + join date
- **Stats row**: Stat cards — Watchlist count, Watched count, Average rating, Friends count
- **Activity feed**: Recent watches, ratings, list additions (chronological)
- **Tabs**: Watchlist | Watched | Reviews | Friends
- **Settings gear**: Links to `/settings`
- **Public/Private toggle**: Profile visibility control

#### Settings `/settings`
- **Sidebar layout**: Navigation sections on left, content on right
- **Sections**:
  - Account (email, password change)
  - Profile (username, avatar upload, bio, privacy toggle)
  - Notifications (email preferences, push preferences)
  - Appearance (theme — dark/light/system)
  - Connected accounts (Google)
  - Data & Privacy (export data, delete account)
- **Each section**: Form with save button, success toast on save

#### Friends `/friends`
- **Tabs**: Friends | Requests | Find Friends
- **Friends tab**: Grid of friend cards (avatar, username, watchlist overlap stat), click to view profile
- **Requests tab**: Incoming (accept/reject) + Sent (cancel) — card layout
- **Find Friends tab**: Search by username, suggested friends based on taste overlap
- **Friend card hover**: Quick actions (view profile, remove, recommend)

#### Friend Profile `/friends/[username]`
- **Same layout as own profile** but read-only
- **Show**: Their public watchlist, watched list, recent activity
- **Actions**: Remove friend, recommend a title, compare tastes
- **Taste match**: Percentage overlap indicator

#### Recommendations `/recommendations`
- **Tabs**: Received | Sent
- **Received**: Cards with poster + sender avatar + personal message + timestamp
- **Actions**: Add to watchlist, mark as watched, dismiss
- **Sent**: Cards showing what you recommended + to whom + read status
- **Recommend flow**: Triggered from title detail page, pick friend(s) + add message

#### Reminders `/reminders`
- **Sections**: Upcoming | Past
- **Upcoming**: Cards sorted by date — poster, title, reminder date/time, countdown
- **Actions**: Edit date, delete, view title
- **Past**: Dimmed cards, option to re-set or dismiss
- **Set reminder flow**: From title detail page, date/time picker modal

#### Person Details `/person/[id]`
- **Hero**: Large photo + name + known-for department + birth info
- **Biography**: Expandable text
- **Filmography**: Tabbed by department (Acting, Directing, Writing, Production)
- **Each entry**: Poster card + title + year + role/character
- **Sort**: By year (newest first) or by popularity

#### Discover / Browse `/discover`
- **Genre grid**: Large genre cards with backdrop images
- **Curated lists**: "Oscar Winners", "Hidden Gems", "New This Week"
- **Mood-based**: "Feel-good", "Thrilling", "Mind-bending" — each links to filtered results
- **Filter page**: Full filter controls (genre, year, rating, language, provider)

#### Feedback `/feedback`
- **Form**: Category selector (Bug, Suggestion, Improvement)
- **Fields**: Title, description (textarea), image upload (up to 3)
- **Device info**: Auto-captured (browser, OS)
- **History tab**: Past submissions with status badges (open, in_progress, resolved)
- **Status colors**: Open (blue), In Progress (amber), Resolved (green), Closed (gray)

#### Notifications `/notifications` (or slide-out panel)
- **List**: Chronological, grouped by date
- **Types**: Friend request, recommendation received, reminder due, feedback response
- **Each item**: Icon + avatar + message + timestamp + read/unread indicator
- **Actions**: Mark read, click to navigate to relevant page
- **Mark all read**: Button in header

#### Collections `/collection/[id]`
- **Hero**: Collection backdrop + name + overview
- **Grid**: All movies in the collection, ordered by release date
- **Each card**: Poster + title + year + user's watched status

#### Episode Guide `/title/[id]/seasons/[season]`
- **Season selector**: Dropdown or horizontal tabs
- **Episode list**: Cards with still image + episode number + title + air date + rating
- **Expandable**: Click to show synopsis
- **Watch status**: Checkbox per episode for tracking

---

## 5. Interaction Patterns

### Hover States
- Cards: translateY(-4px) + shadow increase + border brighten
- Buttons: background shift + optional glow
- Links: color shift to `--accent`
- All transitions: `--duration-fast`

### Loading
- Initial page load: Full skeleton matching page layout
- Data fetching: Skeleton replacing content area only
- Button loading: Spinner icon replacing text, disabled state
- Infinite scroll: Skeleton row appended at bottom

### Transitions
- Page navigations: Fade in, `--duration-slow`
- Tab switches: Content crossfade, indicator slides
- Modal open: Backdrop fade in + content scale from 0.95
- Dropdown open: Scale from top + fade, `--duration-fast`
- List item add: Fade in + slide down
- List item remove: Fade out + collapse height

### Scroll Behavior
- Smooth scroll for anchor links
- Header: Shrinks/becomes more opaque on scroll (sticky)
- Back-to-top button: Appears after scrolling 500px
- Infinite scroll: Load more when 200px from bottom

### Responsive

#### Breakpoint Strategy
- Mobile-first: Design for 375px, enhance upward
- Navigation: Full header on desktop → hamburger menu on mobile
- Grids: Reduce columns at each breakpoint
- Horizontal scrolls: Touch-friendly on mobile, arrow buttons on desktop
- Modals: Full-screen on mobile, centered overlay on desktop
- Sidebar layouts: Stack vertically on mobile

#### Mobile / Tablet Adaptations
The website is a **companion to the Android app**, not a replacement. On smaller screens, provide a functional but simplified experience and actively guide Android users to download the app.

**Simplified mobile layout:**
- Reduce homepage sections: Show hero + vibe grid + trending only (skip bento grid, reduce scroll rows to 1-2)
- Hide non-essential UI: Collapse filter bars behind a "Filters" toggle button instead of always-visible chips
- Single-column grids on mobile (2 cols max for poster cards)
- Bottom sheet modals instead of centered overlays
- Swipe gestures on horizontal scroll rows (no arrow buttons)
- Tabs: Scrollable horizontal on mobile if more than 3 tabs
- Title details: Stack all sections vertically, reduce hero to 30vh
- Settings/Profile sidebar: Becomes a top nav with horizontal scroll or accordion sections

**Tablet (768px-1024px):**
- 3-column poster grids
- Sidebar layouts: Keep sidebar visible but narrower (220px)
- Hero height: 40vh
- Show all homepage sections but with reduced item counts per row

#### Android App Download Banner
**IMPORTANT:** On every page, detect Android user agents and show a persistent but dismissable banner prompting users to download the app for the best experience.

**Detection:**
```typescript
const isAndroid = /Android/i.test(navigator.userAgent);
```

**Banner component — `AppDownloadBanner`:**
- Position: Sticky top banner (above header) or smart banner at bottom
- Content: VibeWatch app icon (32px) + "Get the full experience on the VibeWatch app" + "Download" primary button + "X" dismiss
- "Download" links to the Google Play Store listing
- Dismiss: Sets `localStorage.setItem('app-banner-dismissed', 'true')` — do not show again for 7 days
- Style: `--bg-elevated` background, `--border-subtle` bottom border, compact (48px height)
- On mobile: Show on every page load (unless dismissed)
- On tablet: Show on first visit only
- On desktop: Never show

**Where to reference the app:**
- Homepage logged-out: Value props section — "Available on Android" with Play Store badge
- Homepage logged-in greeting: If Android, subtitle includes "or switch to the app for the full experience"
- Sign-in page: Below form — "VibeWatch is also available on Android" with Play Store link
- Settings page (future): "Get the App" link in sidebar nav
- 404 page: Include "Try the VibeWatch app" alongside other suggestions
- Empty states: When watchlist/watched is empty on mobile, include "Add items faster in the app"

### Keyboard & Accessibility
- All interactive elements focusable with visible focus ring (`--border-focus`)
- Modals trap focus
- Escape closes modals/dropdowns
- Arrow keys navigate within lists/carousels
- ARIA labels on all icon-only buttons
- Color contrast: WCAG AA minimum (4.5:1 for text, 3:1 for large text)
- Reduced motion: Respect `prefers-reduced-motion` — disable transforms/animations

---

## 6. Implementation Notes

### Tailwind Config
Map all design tokens above to the Tailwind theme. Extend (don't replace) defaults:
- `colors`: brand, surface, semantic
- `fontFamily`: Inter
- `fontSize`: use clamp values
- `spacing`: 8px grid multiples
- `borderRadius`: sm/md/lg/xl/full
- `boxShadow`: sm/md/lg/xl/glow
- `animation`: custom keyframes for skeleton shimmer, fade-in, scale-in

### File Structure Convention
```
app/
├── components/
│   ├── ui/           # Base components (Button, Card, Input, Modal, etc.)
│   ├── layout/       # PageContainer, Section, Header, Footer, Sidebar
│   ├── media/        # MediaCard, PersonCard, PosterGrid, ScrollRow
│   └── forms/        # SearchBar, FilterBar, RatingInput
├── [page]/
│   ├── page.tsx      # Page component (server component when possible)
│   └── components/   # Page-specific components
```

### Server vs Client Components
- **Server components** (default): Page shells, data fetching, static content
- **Client components** (`"use client"`): Interactive elements, auth-dependent UI, real-time subscriptions
- Keep client boundaries as small as possible — wrap only the interactive parts

### Image Handling
- TMDB posters: Use `w342` for grids, `w500` for detail pages, `original` for hero backdrops
- Next.js `<Image>`: Always use with `sizes` prop for responsive loading
- Blur placeholder: Low-quality base64 for posters (generate at build or use TMDB `w92`)
- Lazy load: All images below the fold
- Aspect ratio: Use CSS `aspect-ratio: 2/3` for posters, `16/9` for backdrops
