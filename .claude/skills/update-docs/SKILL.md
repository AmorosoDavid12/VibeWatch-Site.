---
name: update-docs
description: Refresh all project documentation files (CLAUDE.md and linked docs) based on current codebase state
---

Audit and update all documentation files for the VibeWatch Website project. The goal is to keep docs accurate and in sync with the actual codebase.

## Files to Update

1. **`CLAUDE.md`** (root) — main project instructions
2. **`.claude/CHANGELOG.md`** — history of fixes and features
3. **`.claude/ARCHITECTURE.md`** — project structure, tech stack, directory layout

## Audit Steps

### 1. Gather Current State
- Read `package.json` for dependency versions (next, react, supabase, tailwind, etc.)
- Read `next.config.ts` for any custom Next.js configuration
- Run `git log --oneline -20` to see recent commits
- Run `git log --oneline HEAD --not master` if on a feature branch (to see unmerged work)
- List files/directories in `app/` to check for new or removed routes
- List files in `app/api/` for API routes
- List files in `app/components/` for shared components
- List files in `app/utils/` for utility functions

### 2. Check CLAUDE.md
- Verify dependency versions match `package.json`
- Verify the "Key Pages" table matches actual routes in `app/`
- Check if new pages, API routes, or components need documentation
- Verify build commands are still accurate
- Verify the "Detailed Docs" table lists all files in `.claude/`

### 3. Check CHANGELOG.md
- Compare recent git commits against changelog entries
- Add entries for any features/fixes not yet documented
- Follow the existing format: heading with brief description

### 4. Check ARCHITECTURE.md
- Verify the directory structure matches the actual `app/` layout
- Check if new top-level directories or config files have been added
- Verify tech stack versions are current
- Update deployment notes if process has changed

## Output
After updating, summarize what changed in each file.
