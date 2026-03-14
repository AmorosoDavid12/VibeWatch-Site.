# VibeWatch — Product Vision

> *The app that makes you feel something before you even press play.*

---

## The One-Liner

**VibeWatch is where you discover what to watch based on how you feel, track everything you've seen, and share your taste with the people who get you.**

---

## What VibeWatch Is

VibeWatch is a social entertainment companion for movies and TV shows. It serves three core purposes:

1. **Discover** — Help people find something to watch, not by scrolling endlessly through streaming catalogs, but by matching content to their mood, taste, and trusted recommendations from friends.

2. **Track** — Keep a personal record of everything you've watched, what you thought of it, and what you plan to watch next. Your viewing history becomes a journal of your taste.

3. **Share** — Your profile is your taste identity. Your Top 4. Your ratings. Your diary. People should want to share their VibeWatch profile the way they share their Spotify Wrapped.

## What VibeWatch Is NOT

- Not a streaming service — we don't play content, we help you decide what to play
- Not a "where to watch" utility — we show streaming availability as a feature, not the product
- Not a data analytics platform — stats exist to delight, not to overwhelm
- Not a film criticism platform — we're personal and social, not academic
- Not a game — milestones celebrate you, but we don't manipulate with dark patterns

## Who VibeWatch Is For

Everyone who watches movies and TV — from the person who watches one movie a week to the cinephile who logs three films a day. The app should feel welcoming to a casual viewer and deep enough for an enthusiast.

- **Casual viewers** find value in easy discovery and simple tracking
- **Enthusiasts** find value in the diary, ratings, lists, and profile identity
- **Social users** find value in seeing what friends watch, sharing recommendations, and taste compatibility

The product scales with how much you put in. Light users get a useful watchlist. Power users get a rich personal entertainment archive.

## The Emotional Goal

When someone opens VibeWatch for the first time, the reaction should be:

> **"This is beautiful."**

Design and polish come first. Every screen should feel crafted, every interaction should feel smooth, every detail should feel intentional. VibeWatch should look and feel like a premium product from day one — not because it costs money, but because it respects the user's time and taste.

---

## The Three Pillars

### 1. Vibe-First Discovery

This is what the name promises. Discovery shouldn't start with a genre dropdown. It should start with a feeling.

- **Mood collections** — "Comfort watches", "Edge of your seat", "Emotionally devastating", "Background noise", "Date night", "Mind-bending"
- **Powered by TMDB keywords** — TMDB has thousands of keywords (time loop, heist, slow burn, road trip, found footage). These map to moods far better than genre lists. No competitor does this well
- **Present but not pushy** — Mood discovery should be accessible for people who want it, but never block the path for data-driven users who want to browse by genre, rating, or year. Think of it as an inviting shortcut, not a mandatory flow
- **Smart filters** — Combine moods with practical constraints: "Something light, under 2 hours, on Netflix." TMDB's Discover endpoint supports all of this in a single query

### 2. Unified Movies + TV

Letterboxd does movies brilliantly but has zero TV support. Serializd does TV but no movies. TV Time is declining. Trakt just alienated its users with a 300% price hike.

VibeWatch does both, in one app, with one profile, one diary, one watchlist. This alone fills the single biggest gap in the market.

- **TV tracking at the season level** — Users rate and track TV shows by season. "Game of Thrones Season 1 is a 10. Season 8 is a 3." This is the right granularity — episode-level tracking is tedious, show-level erases important distinctions
- **Franchise tracking** — TMDB links movies to their franchise via the `belongs_to_collection` field. "You've seen 5 of 8 Harry Potter films." Progress bars, viewing order suggestions. No competitor does this well

### 3. Social Identity

Your VibeWatch profile IS your taste identity. It should be something you're proud of and want to share.

- **Public by default** — Profiles should be publicly viewable (with option to go private). Public profiles drive organic growth — people share links, friends browse friends, discovery happens naturally
- **Shareable profile URLs** — vibewatch.app/@username
- **The profile is a showcase, not a settings page** — Top 4, taste description, stats, recent diary entries, reviews
- **Taste compatibility** — "You and Sarah have 82% taste match." Calculated from overlapping ratings. Makes the social layer feel alive and personal
- **Activity feed** — See what friends are watching, rating, and adding to their watchlist. This ambient social signal is more engaging than direct recommendations alone

---

## The Competitive Landscape

### Direct Competitors

| App | Strength | Weakness | VibeWatch Opportunity |
|-----|----------|----------|----------------------|
| **Letterboxd** | Beautiful design, strong community, beloved diary/lists feature, 17M+ users | Movies only — zero TV support, no streaming availability, social features are read-heavy (no real-time interaction) | Do movies AND TV with equal quality. Add real-time social features Letterboxd lacks |
| **TV Time** | Great TV episode tracking, large user base | Acquired by data company, core features gutted, declining trust, was briefly pulled from App Store | Be the trustworthy alternative that respects users |
| **Trakt** | Best data/stats, automatic scrobbling, API integrations | Just raised prices 300% (users furious), ugly interface, feels like a spreadsheet not an app | Beautiful design + good stats without the price shock |
| **Serializd** | Clean TV tracking with season-level ratings | TV only — no movies, small user base, limited discovery | Unified movies + TV in one premium experience |
| **IMDb** | Largest database, universal brand recognition | Watchlist is basic, no social features, corporate/Amazon feel, cluttered with ads | Personal and social where IMDb is cold and corporate |
| **JustWatch** | Best "where to watch" data, streaming price tracking | Utility-focused — no tracking, no social, no personality | Use their data (via TMDB) as a feature, not the product |

### The Gap No One Fills

No app does **movies + TV + social + mood-based discovery + beautiful design** together. Every competitor is strong in one or two of these and weak in the rest. That's the lane.

### Market Timing

The window is open right now:
- Trakt users are actively looking for alternatives after the pricing change
- Letterboxd users constantly ask for TV support (it's the #1 feature request for years)
- TV Time's decline has left a gap in the TV tracking space
- The "social entertainment" category is growing — people want to share taste, not just consume content

---

## Part 1: General — Both Apps

### Design Language

VibeWatch should feel **cinematic, warm, and personal**. Not cold and corporate (IMDb), not overly minimal (Serializd), not cluttered (TV Time).

- **Dark theme as the primary experience** — Content is visual (posters, backdrops). Dark backgrounds make imagery pop. This is an entertainment app — it should feel like a theater, not a spreadsheet
- **Color-coded personality** — The current multi-color tab system (coral, blue, purple, green) is a strength. Lean into it. Each section of the app can have its own color energy while maintaining a cohesive feel
- **Move away from Netflix-red** — The current primary red (#E50914) makes it look like a Netflix clone. Consider a signature color that's uniquely VibeWatch — something that stands out in a sea of red streaming apps
- **Motion and polish** — Smooth transitions, skeleton loaders (already implemented — good), satisfying micro-interactions on rating, bookmarking, and tracking. Every tap should feel responsive
- **Typography matters** — The font should feel premium. Consider a distinctive heading font paired with a clean body font
- **Imagery-forward** — Let TMDB's beautiful backdrops and posters do the heavy lifting. Large images, generous spacing, cinematic aspect ratios

### Rating System

The **1-10 scale with half-stars stays**. This is a deliberate choice that gives users more expression than a 5-star system.

- A 7 vs a 7.5 vs an 8 means something different to people, and that granularity is a feature
- Display as filled/half-filled icons for visual clarity
- Always show the user's personal rating alongside the TMDB community rating — the dual system is a strength
- Consider a quick-rate option: tap a star count for speed, long-press to fine-tune with half-stars

### The Diary (Rename "Watched")

"Watched" is functional. "Diary" is personal. Letterboxd proved this framing resonates — it implies a personal history, a journal of your life through what you watched. Not just a checklist.

- Every diary entry should capture: what you watched, when you watched it (date logged), your rating, and an optional short thought/review
- The diary becomes the backbone of stats, year-in-review, and your profile's story

### Lists (New Feature)

Custom collections are one of Letterboxd's most beloved features and one of the most requested features across all tracking apps.

- "My comfort movies"
- "Watch with Mom"
- "2025 Ranked"
- "Best plot twists"
- "Underrated gems"

Lists should be:
- Creatable by any user
- Shareable via link
- Orderable (drag to rank)
- Mixed (movies and TV in the same list)

### Stats & Milestones

People love data about themselves. Stats should feel like a reward for using the app, not a data dashboard.

**Core stats:**
- Total movies watched / total shows watched
- Hours spent watching (calculate from runtime data)
- Genre breakdown (visual chart)
- Rating distribution (are you generous or harsh?)
- Most-watched directors and actors
- Monthly/yearly trends

**Milestones & badges:**
- "100 movies watched!" — celebratory moment with a badge
- "First review written"
- "Watched something from every genre"
- "10 friends added"
- Badges appear on your profile and are subtle — they reward, they don't nag
- Push notification + optional email when you hit a milestone

**Recommendation notifications:**
- When the system identifies a strong match for a user based on their rating history, send a push notification: "Based on your love of dark thrillers, you might love [Movie]"
- This requires a background job/cron that periodically analyzes user ratings against TMDB recommendations
- Keep these rare and high-quality — one a week maximum. If every notification is a hit, users trust and look forward to them

### Year-in-Review (Annual Feature)

A "Wrapped" style experience, generated at the end of each year:

- Total movies and shows watched
- Hours spent
- Top-rated content
- Most-watched genres
- Rating patterns
- Taste evolution
- Shareable cards designed for Instagram Stories and social media

This is a growth engine. Spotify Wrapped drives millions of social shares. Letterboxd's year-in-review is their biggest traffic spike. VibeWatch should own this moment.

### Where to Watch (Already Implemented — Enhance)

The TMDB watch provider integration is already working with geolocation. Enhancements:

- **Let users select their subscriptions** during onboarding or in settings (Netflix, Disney+, HBO Max, etc.)
- **Filter discovery by "available on my services"** — "Show me only what I can watch right now on the services I pay for." TMDB Discover supports `with_watch_providers` filtering
- **Show free/ad-supported options** — TMDB provides "free" and "ads" monetization types. Highlight when something is available for free on Tubi, Pluto, etc.
- **Attribution** — JustWatch attribution is required when displaying streaming data. Include their logo where providers are shown

### Content to Leverage from TMDB (Underused Today)

These TMDB features are available but not yet utilized:

| Feature | What It Enables |
|---------|----------------|
| **Keywords** | Mood/vibe-based discovery ("time loop", "heist", "slow burn") |
| **Discover filters** | "Comedies on Netflix, rated 7+, under 2 hours, from the last 3 years" |
| **`next_episode_to_air`** | "New episode of The Bear in 3 days" countdown/notification |
| **`belongs_to_collection`** | Franchise progress tracking ("5/8 Harry Potter films watched") |
| **Release types** | "Coming to streaming" alerts, "just hit digital" notifications |
| **Network-based browsing** | "All HBO originals" or "New on Netflix" filtered browsing |
| **Certification filtering** | Family-friendly mode (G/PG only), date night mode (no kids' content) |
| **Budget/revenue data** | "Hidden gems" discovery (high rating + low budget + low vote count) |
| **Aggregate credits (TV)** | Complete cast across ALL seasons, not just the latest |
| **Recommendations endpoint** | Better than "similar" — uses behavior data, most apps don't use it |
| **Person tagged images** | Rich actor/director photo galleries for profile pages |
| **Find by external ID** | Resolve IMDb/Instagram/Twitter links to VibeWatch content instantly |

---

## Part 2: Mobile App — The Daily Companion

The mobile app is the personal, habitual experience. It's what you open on the couch, in bed, on the bus. It should be fast, satisfying, and feel like yours.

### Navigation Redesign

**Current problem:** The home tab is the Watchlist. When a new user opens the app, they see an empty watchlist. Dead end. No reason to stay.

**Proposed tab structure:**

| Tab | Icon | Purpose |
|-----|------|---------|
| **Discover** | Search/compass | The front door — trending, moods, friend activity, recommendations |
| **Watchlist** | Bookmark | Your "want to watch" queue |
| **Diary** | Clock/calendar | Everything you've watched, with dates and ratings |
| **Social** | People | Friends, activity feed, recommendations received |
| **Profile** | User | Your identity, stats, settings |

**Why Discover first:** A new user with an empty watchlist should land on a screen full of content — trending movies, mood collections, popular this week. The app should feel alive and full from the very first second, not empty and waiting.

### Screen-by-Screen Detail

#### Discover Screen (Currently "Search")

This is the most important screen in the app. It's where users find new content. Current implementation has Spotlight, Trending, For You, New Releases, Highest Rated — all data-driven. Add feeling-driven layers.

**Layout (top to bottom):**
1. **Search bar** — Always accessible at the top. Tap to expand into full search with filters
2. **Mood row** — Horizontal scrollable pills: "Comfort", "Intense", "Funny", "Cry", "Mind-bending", "Background", "Date night". Tapping one opens a curated collection powered by TMDB keywords
3. **Trending this week** — Large poster carousel (current Spotlight section, keep this)
4. **What friends are watching** — Horizontal row of posters with friend avatar overlays. Tapping shows which friend watched it and their rating. This is the social discovery engine in its simplest form
5. **New on your services** — Filtered by the user's selected streaming subscriptions. "New on Netflix this week" etc.
6. **For You** — Personalized recommendations based on rating history (using TMDB recommendations endpoint, not similar)
7. **Collections** — Franchise progress: "Continue the MCU — 18/33 watched", "Complete Harry Potter — 5/8"
8. **New releases** — In theaters and coming to streaming
9. **Hidden gems** — High TMDB rating + low vote count + lower budget. The stuff algorithms don't surface but people love when they find it

**Filters (accessible from search):**
- By genre (multiple select)
- By streaming service (from user's selected subscriptions)
- By year range
- By rating range
- By runtime ("Under 90 min", "90-120 min", "2+ hours")
- By content rating (family-friendly, etc.)
- Movies only / TV only / Both

#### Watchlist Screen

Currently works well with drag-to-reorder. Enhancements:

- **Sort options** — By date added, by release date, by rating, by runtime, alphabetical
- **Filter by type** — Movies / TV / Both
- **Filter by streaming service** — "Show me only what I can watch right now"
- **"Watch next" suggestion** — A highlighted card at the top suggesting the best pick from your watchlist based on mood, time available, or friends' ratings
- **Sections** — Optional grouping: "Movies", "TV Shows", "Recommended by friends"
- **Empty state** — When empty, don't just show a message. Show a big friendly prompt: "Start building your watchlist" with a button to Discover. Make it inviting, not sad

#### Diary Screen (Currently "Watched")

This is your personal viewing history. It should feel like a journal, not a database.

- **Default view: List by date** — Most recent at top. Each entry shows poster, title, your rating, and date watched
- **Calendar view toggle** — A mini calendar where each day shows small poster thumbnails of what you watched. Tap a day to see details. This is Letterboxd's most beloved feature and it translates well to mobile
- **Filter by type** — Movies / TV / Both
- **Filter by rating range** — "Show me everything I rated 9+"
- **Sort options** — By date watched, by rating, by title
- **Stats button** — Quick access to your viewing stats from the diary
- **When logging:** Tapping "mark as watched" should briefly prompt for a date (default today) and rating. Optional: add a short thought/review

#### Social Screen (Currently "Friends")

The current implementation is solid — friend list, activity section, recommendations tab. Enhancements:

**Activity Feed (primary view):**
- Full-screen scrollable feed of friend activity
- "David watched Dune: Part Two and rated it 9/10"
- "Sarah added Shōgun to her watchlist"
- "Mike recommended The Bear to you"
- Each entry shows the friend's avatar, the action, the content poster, and timestamp
- Tap any entry to go to that title's detail page
- This feed should feel alive — it's the social heartbeat of the app

**Recommendations tab (keep and enhance):**
- When receiving a recommendation, show the friend's personal message prominently
- Add a "Watch it" button that adds to watchlist in one tap
- After watching a recommended title, prompt: "Mike recommended this — want to send them your rating?"

**Taste Match:**
- On each friend's profile, show a compatibility percentage
- "You and Sarah agree on 82% of shared watches"
- Calculated from movies/shows you've both rated — how often your ratings are within 1-2 points of each other
- This makes the friend list feel meaningful, not just a contact list

**Friend discovery:**
- Currently requires exact username search
- Consider: "People you might know" based on mutual friends
- Shareable invite links

#### Profile Screen

**Currently:** Basically a settings page. This needs the biggest transformation.

**The profile should be the user's identity page — what others see when they visit.**

**Public Profile View (what friends and visitors see):**
- **Header:** Avatar (large), username, bio line (short optional tagline)
- **Top 4:** Four pinned favorite movies/shows displayed as posters in a row. This is the most personal expression on the profile — "These define my taste." Tapping any opens the detail page. (Letterboxd's Top 4 is iconic — people agonize over theirs)
- **Taste description:** Auto-generated from rating history. "Dark dramas. Sci-fi. Korean cinema. Comfort sitcoms." This gives visitors an instant sense of who you are
- **Stats summary:** X movies, Y shows, Z hours this year. Compact, visual
- **Recent diary entries:** Last 5-10 things watched with ratings
- **Milestone badges:** Displayed subtly — "100 movies", "Genre explorer", etc.
- **Favorite lists:** If they've created public lists, show them here

**Private view (what you see on your own profile):**
- Everything above, plus:
- Edit profile button (avatar, bio, Top 4)
- Settings section (account, email, password, privacy, notifications)
- Streaming services selection (which services you subscribe to)
- App preferences (theme, notification frequency)

**The profile should feel like a curated personal page, not an account settings screen.** Settings should be accessible from the profile but should not BE the profile.

#### Title Detail Screen

Already comprehensive and well-built. Enhancements:

- **Franchise indicator** — If the movie belongs to a collection, show "Part of the Harry Potter Collection — 5/8 watched" with a link to browse the full franchise
- **Friend ratings** — Already shows friends who watched it. Enhance: show their rating more prominently, and if they wrote a thought/review, show a snippet
- **"Your services" badge** — If the movie is available on a service the user subscribes to, show a prominent "Available on Netflix" badge near the top. If not available on their services, show "Rent from $3.99" or similar
- **Season ratings for TV** — Below the season list, show the user's rating for each season they've watched. Let them rate seasons individually
- **Mood tags** — Show relevant keywords as mood tags: "slow burn", "plot twist", "feel-good". These connect to the vibe discovery system
- **Next episode countdown** — For TV shows the user is tracking that are currently airing, show "New episode in 3 days" prominently

#### Person Screen (Actor/Director Detail)

- Photo, name, bio
- Known for section (most popular works)
- Full filmography divided by Movies and TV, sorted by year
- Filter by: movies only / TV only / ones you've watched / ones on your watchlist
- Show the user's average rating for this person's work: "You've watched 7 Christopher Nolan films, average rating: 8.5"

### Mobile-Specific Behaviors

**Onboarding flow for new users:**
1. Sign up (email or Google)
2. "Select your streaming services" — quick grid of service logos to tap
3. "Pick a few favorites" — Show popular movies/shows, user taps ones they've seen. This seeds their diary and teaches the app their taste
4. "Set your vibe" — Optional: pick 2-3 mood categories they gravitate toward
5. Land on Discover tab with personalized content already populated

**Pull-to-refresh** on all list screens.

**Haptic feedback** on rating, bookmarking, and marking as watched — make these actions feel physical and satisfying.

**Deep linking** — tapping a shared VibeWatch link (vibewatch.app/movie/123) should open the app directly to that title. Essential for social sharing.

**Offline behavior** — Already well-implemented. Ensure the diary, watchlist, and ratings all work offline and sync when reconnected.

**Notifications (push):**
- Friend sent you a recommendation
- Friend accepted your friend request
- New episode of a show you're tracking (via TMDB `next_episode_to_air`)
- Milestone reached ("You just watched your 100th movie!")
- Weekly: One strong personalized recommendation
- Release reminder (already implemented)

---

## Part 3: Web App — The Deep Experience

The web app is where users go for extended browsing, list management, stats exploration, and profile curation. It should feel expansive where mobile feels compact.

### Current State

The web app is roughly 65-70% complete. It has auth (email + Google), homepage with featured carousel, search with tabs, title details, watchlist, watched pages, and an admin feedback dashboard. It's missing: Profile page, Person pages, Friends/Social, Advanced filtering, Lists, Stats, Proper responsive design, Marketing landing page.

### What the Web Should Be (and Shouldn't Be)

**The web app is NOT a port of the mobile app.** Different context, different behaviors.

| Mobile | Web |
|--------|-----|
| Quick check-ins | Long browsing sessions |
| One-handed, on the couch | Keyboard and mouse, at a desk |
| Habitual, daily | Intentional, weekly |
| Action-oriented (log, rate, check) | Exploration-oriented (browse, read, curate) |

Features that shine on web: Lists (drag to reorder with a mouse), Stats (big beautiful charts), Profile (rich layout with space), Diary calendar view (full month visible), Detailed filmographies, Reviews/thoughts reading.

Features that DON'T belong on web: Push notifications, Release reminders (mobile push only), Episode countdowns (these are real-time, mobile moments).

### Landing Page (Logged-Out Experience)

When someone visits vibewatch.app without being logged in, they should see a **marketing page that sells the product**, not a login wall.

**Sections (top to bottom):**
1. **Hero** — Large headline: the VibeWatch value proposition. Subheadline explaining what it does. Screenshot/mockup of the app. "Get Started — It's Free" button. Link to Play Store. "App Store coming soon" note
2. **Feature highlights** — 3-4 cards showing core features: Discover by vibe, Track your diary, Share your taste, See where to watch. Each with a visual/screenshot
3. **Social proof** — If you have user count or ratings, show them. "Join X movie lovers" or similar
4. **How it works** — Simple 3-step visual: Sign up → Track what you watch → Discover what's next
5. **Trending right now** — Show some live trending content from TMDB. Proves the app has real content. Clicking any title should prompt sign-up
6. **Download section** — Play Store badge, App Store coming soon, "Or use it right here on the web"
7. **Footer** — Links, social media, about, contact

**The landing page should feel cinematic and premium.** Large imagery, smooth scroll, dark theme. This is the first impression for most web visitors.

### Logged-In Web Experience

#### Navigation

**Top navigation bar:**
- VibeWatch logo (home link)
- Search bar (always visible, expands on focus)
- Discover link
- Watchlist link
- Diary link
- Lists link (when implemented)
- User avatar dropdown → Profile, Stats, Settings, Logout

**No sidebar.** Keep it clean. Top nav gives quick access to everything. On mobile-width browsers, collapse to a hamburger menu.

#### Discover / Home Page (Logged In)

Similar to mobile but takes advantage of screen width:

- **Large hero banner** — Featured content or personalized pick
- **Mood pills row** — Same as mobile but with more visible at once
- **Content rows** — Trending, Friends activity, New on your services, For You, Hidden Gems
- **Each row:** Show more items (6-8 visible vs 3-4 on mobile), with a "See all" link
- **Friend activity sidebar** (optional) — A compact feed on the right side showing recent friend actions. Always visible while browsing

#### Search & Filter Page

**Powerful search with advanced filters visible on desktop:**

- Search bar with instant results dropdown
- Below: filter panel (always visible, not hidden in a modal)
  - Type: Movies / TV / Both (toggle)
  - Genres: Multi-select grid
  - Streaming services: Grid of logos (highlight user's subscriptions)
  - Year range: Slider
  - Rating range: Slider
  - Runtime: Dropdown
  - Sort by: Popularity, Rating, Release date, Title
- Results in a responsive grid of poster cards
- Each card: Poster, title, year, TMDB rating, user rating (if rated), watchlist/watched indicators

#### Title Detail Page (Enhance Current)

Already built. Desktop-specific enhancements:

- **Two-column layout** — Left: poster + action buttons + streaming availability. Right: title, metadata, overview, cast carousel
- **Full cast page** — "See all cast" link expands to a full grid. On mobile this is a separate screen; on web it can be an expandable section
- **Trailers embedded** — YouTube player inline (more natural on desktop than mobile)
- **Friend reviews section** — If friends have written thoughts, show them prominently
- **Related content** — "If you liked this" recommendations below the fold
- **Franchise section** — Full collection display with progress

#### Diary Page

**The calendar is the star feature here.** On desktop, you have room for a full-month calendar view.

- **Month view** — Grid calendar. Each day shows tiny poster thumbnails of what was watched. Hover to see title and rating. Click to expand
- **List view toggle** — Below or as an alternative: chronological list with poster, title, rating, date, and any thoughts written
- **Year navigation** — Easily browse back through months/years
- **Export** — Download your diary as CSV (power user feature)

#### Watchlist Page

- **Grid view** (poster grid) and **List view** (detailed rows) toggles
- **Sort and filter** — Same options as mobile: date added, release date, rating, runtime, streaming availability
- **Bulk actions** — Select multiple, mark as watched, remove. Desktop makes multi-select natural
- **Drag to reorder** — Works beautifully with a mouse

#### Profile Page (Not Built Yet — Most Important New Page)

**Public profile (vibewatch.app/@username):**

This is the page people share. It needs to be beautiful.

- **Header area:**
  - Large backdrop image (either user-chosen or generated from their Top 4)
  - Avatar (large, round)
  - Username
  - Bio line
  - Stats bar: X movies / Y shows / Z hours this year
  - "Add friend" button (for visitors)

- **Top 4 section:**
  - Four large posters in a row
  - Hover shows title and the user's rating
  - This is the most prominent section — it IS the profile's identity

- **Taste tags:**
  - Auto-generated from viewing history: "Dark dramas", "Sci-fi", "Comedy", "Korean cinema"
  - Displayed as stylish pills/tags

- **Tabs below:**
  - **Diary** — Recent entries in list format
  - **Watchlist** — Public view of what they plan to watch (if profile is public)
  - **Reviews** — Any thoughts/reviews they've written
  - **Lists** — Public lists they've created
  - **Stats** — Viewing statistics
  - **Badges** — Milestones achieved

- **Responsive:** On narrow screens, Top 4 can stack 2x2. Stats go vertical. Tabs become a scrollable row

#### Lists Page

- **My Lists** — Grid of list covers (auto-generated from first 4 items' posters). Click to open
- **Create New List** — Title, description, ranked or unranked
- **List detail view** — Items with poster, title, year, rating. Drag to reorder. Add/remove items
- **Share button** — Copy link to share

#### Stats Page

Big, beautiful, visual. This is a Pro feature candidate.

- **Overview cards** — Total movies, total shows, total hours, average rating
- **Genre breakdown** — Donut or bar chart, colorful, showing percentage per genre
- **Rating distribution** — Histogram of your ratings. "You average 7.2 — slightly generous"
- **Monthly trend** — Line chart of items watched per month. Shows viewing habits
- **Most-watched directors** — Top 5 with count and your average rating for their work
- **Most-watched actors** — Same format
- **Comparison cards** — Movies vs TV split. Average movie rating vs average TV rating
- **Longest and shortest** — Your longest movie watched, shortest, longest TV season

#### Settings Page

Accessible from profile. Clean, organized sections:

- **Account** — Email, password, delete account
- **Profile** — Edit avatar, bio, Top 4
- **Privacy** — Public/private profile toggle
- **Streaming services** — Select which services you subscribe to (grid of logos)
- **Notifications** — Email preferences for milestones, recommendations, friend activity
- **Data** — Export your data, clear cache

### Web-Specific Behaviors

- **Keyboard shortcuts** — Power users: 'S' for search, 'W' for watchlist, 'D' for diary, arrow keys to browse grids
- **Hover states everywhere** — Poster hover: show title overlay, rating, and quick-add buttons (bookmark, watched). Desktop is hover-driven
- **Responsive breakpoints** — Full desktop (1440px+), laptop (1024px), tablet (768px), mobile (375px). The web app should work on all sizes but is optimized for laptop/desktop
- **URL structure** — Clean, shareable URLs:
  - `/` — Home/Discover (logged in) or Landing (logged out)
  - `/@username` — Public profile
  - `/movie/{id}` or `/tv/{id}` — Title detail
  - `/person/{id}` — Person detail
  - `/search?q=...` — Search results
  - `/watchlist` — User's watchlist
  - `/diary` — User's diary
  - `/lists` — User's lists
  - `/stats` — User's stats

---

## Summary: What's Missing Today

### Critical (Foundation)
- [ ] Diary system (rename Watched, add date logging)
- [ ] Profile as identity page (Top 4, taste description, public view)
- [ ] Discover as default home tab on mobile
- [ ] Web marketing/landing page for logged-out visitors
- [ ] Web profile page

### Important (Differentiation)
- [ ] Mood/vibe-based discovery using TMDB keywords
- [ ] Activity feed (what friends are watching/rating)
- [ ] Taste compatibility between friends
- [ ] Season-level ratings for TV
- [ ] Franchise/collection progress tracking
- [ ] Short reviews/thoughts on diary entries
- [ ] Streaming service selection per user + filtered discovery

### Valuable (Engagement & Growth)
- [ ] Custom lists
- [ ] Stats dashboard
- [ ] Milestones and badges
- [ ] Year-in-Review / Wrapped
- [ ] Strong recommendation push notifications
- [ ] "Next episode in X days" countdown (from TMDB data)
- [ ] Shareable review cards for social media
- [ ] Person pages with filmography on web
- [ ] Advanced search filters on web

### Future (Expansion)
- [ ] Group watchlists ("What should we watch tonight?")
- [ ] Shareable invite links for friend discovery
- [ ] Family-friendly mode (certification-based filtering)
- [ ] "Hidden gems" discovery algorithm (high rating + low visibility)
- [ ] Network-based browsing ("All HBO originals")
- [ ] Budget/revenue data for trivia and discovery
- [ ] Public lists discovery (browse other users' lists)

---

## The North Star

A year from now, VibeWatch should be the app where:

1. You open it when you don't know what to watch — and it actually helps
2. You log what you watched because it's satisfying, not tedious
3. You check it to see what your friends are into — and find your next favorite thing
4. You share your profile because it says something real about who you are
5. You tell a friend about it because nothing else does movies AND TV this beautifully

**The name is the mission: Watch based on the vibe.**
