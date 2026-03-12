# Project Context: edoconnell-site

> **Purpose:** Project-specific overlay for the Context Transport bundle
> **Date:** 2026-02-27
> **Repo:** github.com/adambalm/edoconnell-site (private)

---

## What This Project Is

Rebuild of edoconnell.org as an Astro 5 + Sanity v3 + Vercel site. This is a portfolio piece — the repo itself demonstrates craftsmanship. Commit history, file structure, and quality infrastructure are all part of what reviewers see.

**Current state:** Executing (all deliberation gates closed). Live at edoconnell.org.

## Tech Stack

- **Frontend:** Astro 5, SSR via Vercel adapter (`output: 'server'`)
- **CMS:** Sanity v3, embedded Studio at `/admin`
- **Interactive:** React 19 islands via `@astrojs/react` — used only for stateful demos
- **Content flow:** Sanity -> GROQ + stega -> Astro component -> HTML
- **Visual editing:** Stega encoding + VisualEditing component, Presentation tool configured

## Published Content

- SA Brief (solution architecture brief) — technical writing sample
- The Bike Shop — personal essay (literary register)
- Three demo React islands: Memento, Context Sage, Skill Forge

## Protocol Usage in This Project

This project was built via a full Lanesborough + Skill Forge + LCE deliberation cycle:

- **Dialogue log:** `dialogues/001-site-rebuild.md` (105 KB, 1,560 lines)
- **FSM state:** AG_CLOSED -> EXECUTING (site is being built per the agreed plan)
- **Roles:** ChatGPT as GA, Claude Code as IA, Ed as HO
- **Transport:** Secret GitHub gist synced via `scripts/sync-dialogue.sh`
- **Gist ID:** `0209d571cb0e06a6382cdbbb8b2a4163`

## Governing Documents

| Document | Purpose | Location |
|----------|---------|----------|
| CLAUDE.md | Claude Code operational context | Repo root |
| AGENTS.md | AI agent navigation guide | Repo root |
| docs/voice-profile.md | Ed's writing voice constraints | Repo `docs/` |
| docs/design-brief.md | Design system specification | Repo `docs/` |

## Active Deliberation

**Topic:** Transport Automation (Option 2 vs Option 3)
**Status:** Pending HO decision, ChatGPT being onboarded as external IA
**Files:** See `deliberations/` directory in this bundle

## Environment Notes

- **Sanity project ID:** `zu6l9t4j` (public, personal account)
- **Dataset:** `production` (public ACL — intentional, no PII)
- **Dev server:** `localhost:4321` (conflicts with sca-website — only one at a time)
- **CI:** GitHub Actions — build + typecheck + Playwright a11y + Lighthouse

## What Is NOT in This Bundle

- `.env.local` (contains Sanity tokens — never shared)
- The full dialogue log (105 KB — too large for a gist; available via gist URL or repo)
- Demo source code (not relevant to protocol discussion)
- Design assets, fonts, CSS
