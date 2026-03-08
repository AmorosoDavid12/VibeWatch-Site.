---
name: update-docs
description: Refresh all project documentation files (CLAUDE.md and linked docs) based on current codebase state
---

Audit and update all documentation files for the VibeWatch Website project. Uses a **delta-based approach** — only inspects what changed since the last docs update to minimize token usage.

## Files to Update

1. **`CLAUDE.md`** (root) — main project instructions
2. **`.claude/CHANGELOG.md`** — history of fixes and features
3. **`.claude/ARCHITECTURE.md`** — project structure, tech stack, directory layout

## Audit Steps

### 1. Find the Baseline

Run these commands to determine what changed since docs were last updated:

```bash
# Find the last commit that touched any doc file
git log -1 --format="%H %as" -- CLAUDE.md .claude/CHANGELOG.md .claude/ARCHITECTURE.md
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

## Skip Conditions

If `git log --oneline BASELINE..HEAD` returns nothing AND there are no uncommitted changes, report "Docs are up to date" and stop — no reads or edits needed.

## Output

After updating, summarize:
- How many commits were processed
- Which doc files were changed and what sections
- Any structural changes detected (new pages, components, etc.)
