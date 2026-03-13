---
name: update-docs
description: Refresh all project documentation files (CLAUDE.md, linked docs, and vision.md) based on current codebase state
---

Audit and update all documentation files for the VibeWatch Website project. Uses a **delta-based approach** — only inspects what changed since the last docs update to minimize token usage.

## Files to Update

1. **`CLAUDE.md`** (root) — main project instructions
2. **`.claude/CHANGELOG.md`** — history of fixes and features
3. **`.claude/ARCHITECTURE.md`** — project structure, tech stack, directory layout
4. **`vision.md`** (root) — unified product vision, feature roadmap, and screen specs

## Audit Steps

### 1. Find the Baseline

Run these commands to determine what changed since docs were last updated:

```bash
# Find the last commit that touched any doc file
git log -1 --format="%H %as" -- CLAUDE.md .claude/CHANGELOG.md .claude/ARCHITECTURE.md vision.md
```

Save that commit hash as `BASELINE`.

### 2. Gather the Delta

Run these in parallel:

```bash
# Commits since last docs update
git log --oneline BASELINE..HEAD

# Files changed since last docs update (committed)
git diff --name-only BASELINE..HEAD

# Uncommitted changes (staged + unstaged)
git diff --name-only HEAD
git diff --name-only --cached

# Untracked files in app/
git ls-files --others --exclude-standard app/
```

Combine all file lists into a single `CHANGED_FILES` set.

### 3. Decide What to Audit

Only audit doc sections relevant to the changed files:

| If CHANGED_FILES includes... | Then audit... |
|------------------------------|---------------|
| `app/*/page.tsx` (new or removed) | CLAUDE.md "Key Pages" table |
| `app/api/**` | CLAUDE.md "API Routes" table |
| `app/components/**` | CLAUDE.md "Shared Components" table |
| `app/utils/**` | CLAUDE.md "Utility Modules" table |
| `package.json` | CLAUDE.md dependency versions + ARCHITECTURE.md tech stack |
| `app/**` (any structural change) | ARCHITECTURE.md directory tree |
| `.claude/skills/**` | CLAUDE.md "Skills" table |
| `.claude/*.md` (non-changelog) | CLAUDE.md "Detailed Docs" table |
| Any feature-level change | `vision.md` (see Vision Update Protocol below) |

**Always update:** `.claude/CHANGELOG.md` with new commits (this is the primary purpose).

### 4. Read Only What's Needed

- Only read `package.json` if it's in CHANGED_FILES
- Only list `app/` directories if routes were added/removed
- Only read doc files for sections that need updating
- Do NOT re-read the entire codebase

### 5. Update CHANGELOG.md

- Read the existing changelog
- Group new commits (since BASELINE) into a logical section
- Write a new entry at the top following the existing format:
  - `## Section Title (Mon DD, YYYY)` heading
  - Sub-sections with `###` for related changes
  - `**Files created:**` and `**Files modified:**` at the end
  - `---` separator after the section
- Include uncommitted/staged changes under a "Pending" note if significant

### 6. Update CLAUDE.md and ARCHITECTURE.md

Only edit the specific tables/sections identified in step 3. Do not rewrite untouched sections.

---

## Vision Update Protocol

`vision.md` is the source of truth for what VibeWatch is, who it's for, and where it's going. **Misrepresenting the vision is worse than not updating it at all.** Follow this protocol carefully.

### When to Touch vision.md

Update `vision.md` when the delta reveals any of these:

| Signal in CHANGED_FILES / commits | What it might mean for vision |
|-----------------------------------|-------------------------------|
| New page or route added | A planned feature was implemented — check the checkbox, update "Current State" |
| Feature removed or significantly reworked | Direction may have changed — **ASK before updating** |
| New component pattern or UI system | Design language may be evolving — **ASK before updating** |
| New API integration or data source | New capability unlocked — may affect feature roadmap |
| Auth, social, or profile changes | Core pillar may be shifting — **ASK before updating** |
| Naming changes (e.g., "Watched" → "Diary") | Terminology shift — update consistently throughout |
| New third-party dependency | May indicate a new technical direction |

### The Question-First Rule

**NEVER silently update vision.md.** Before making any change, follow this escalation:

#### Level 1 — Safe Updates (still confirm)
These are low-risk but still require a brief confirmation with the user:

- Checking off a completed feature in the "What's Missing Today" checklist
- Updating the "Current State" paragraph with factual progress (e.g., "65-70% complete" → "75% complete")
- Adding a newly implemented feature to an existing section

**Ask:** "I see [feature X] was implemented. I'd like to check it off in vision.md and update the current state. Does this match your understanding?"

#### Level 2 — Interpretive Updates (always ask)
These require the user's input because they involve reading intent:

- A feature was built differently than vision.md describes (e.g., different UI layout, different data source)
- A feature was partially implemented (some parts done, others not)
- Implementation suggests a pivot from the original plan (e.g., episode-level tracking added when vision says season-level)
- New features appear that aren't mentioned in vision.md at all

**Ask:** Present what you observed, what vision.md currently says, and ask the user how they want to reconcile it. Example:

> "vision.md says TV tracking should be at the season level, but I see episode-level tracking components in the delta. Should I:
> 1. Update vision.md to reflect episode-level tracking?
> 2. Keep vision.md as-is (season-level is still the goal, episode-level is intermediate)?
> 3. Something else?"

#### Level 3 — Structural Changes (deep discussion)
These affect the core identity of the product and require thorough discussion:

- Changes that touch the Three Pillars (Vibe-First Discovery, Unified Movies + TV, Social Identity)
- Changes to the competitive positioning or "What VibeWatch Is / Is NOT"
- Shifts in target audience
- Removal or fundamental rethinking of a major planned feature
- Changes to the North Star goals
- New product direction not covered by existing vision

**Ask:** Explain what you observed, why you think it might indicate a vision shift, and ask open-ended questions. Example:

> "I noticed several commits adding [X capability] which isn't in the vision doc. This seems like it could be a new direction. Can you tell me:
> 1. Is this a new pillar/priority for VibeWatch?
> 2. Where does it fit in the existing vision?
> 3. Does it replace or complement anything currently planned?"

### How to Edit vision.md

When you have user confirmation:

1. **Preserve voice and tone** — vision.md is written in a specific passionate, opinionated voice. Match it. Don't make it sound like a changelog
2. **Keep it aspirational** — vision.md describes the destination, not just current state. Don't strip out future plans just because they aren't built yet
3. **Update surgically** — Edit only the specific sections affected. Don't reorganize or rewrite surrounding content
4. **Maintain the checklist** — The "What's Missing Today" section is a living roadmap. Check off items, add new ones, move items between priority tiers — but always with user confirmation
5. **Add "Last updated" context** — When making changes, add a small inline note if helpful (e.g., "Season-level ratings for TV — *implemented Mar 2026*") but keep these subtle
6. **Never delete aspirational content** — If a feature hasn't been built, that doesn't mean it should be removed. Only remove if the user confirms the direction has changed

### Questions to Always Ask Yourself

Before proposing any vision.md edit, internally verify:

- [ ] Am I stating a fact, or am I interpreting intent?
- [ ] Could this change be read as a shift in product direction?
- [ ] Is the user aware this feature/change happened (or was it an incremental side effect)?
- [ ] Would the user be surprised to see this change in their vision doc?

**If the answer to any of these is uncertain — ASK.**

---

## Skip Conditions

If `git log --oneline BASELINE..HEAD` returns nothing AND there are no uncommitted changes, report "Docs are up to date" and stop — no reads or edits needed.

## Output

After updating, summarize:
- How many commits were processed
- Which doc files were changed and what sections
- Any structural changes detected (new pages, components, etc.)
- **Vision updates:** List any changes made to vision.md, or questions that need user input before vision.md can be updated
