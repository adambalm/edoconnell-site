# CLAUDE.md

> **Last verified:** 2026-02-20
> **Phase:** Executing (AG closed, foundation built)

## Project Overview

Rebuild of edoconnell.org as an Astro + Sanity + Vercel site. This is a portfolio piece — the repo itself demonstrates craftsmanship. Commit history, file structure, and quality infrastructure are all part of what reviewers see.

## Current State

The project is **executing**. All deliberation gates (OVG, UG, AG) are closed. Foundation is built — Astro 5 + Sanity v3 + Vercel + TypeScript. Live at edoconnell.org.

- **FSM state:** AG_CLOSED → EXECUTING
- **Build:** `npm run build` succeeds. `output: 'server'` — content pages are SSR, index pages are prerendered static.
- **Sanity project:** `zu6l9t4j` on personal account (see `.env.local`). CORS configured. Dataset seeded (`node scripts/seed.mjs`). All templates wired to CMS via `loadQuery`.
- **Visual editing:** Stega encoding and VisualEditing component working. Presentation tool configured and verified.
- **Articles:** SSR route at `/articles/[slug]`. SA Brief published with code blocks (Shiki highlighting via `@sanity/code-input`).
- Dialogue log: `dialogues/001-site-rebuild.md` (gitignored — local context only)
- Prior site: `github.com/adambalm/portfolio` (React 19 + Vite, deployed to Vercel)

<!-- verified: 2026-02-20 -->

## Session Startup — Read Basic Memory Context

Before doing any work in this repository:

1. **Read BOOTSTRAP:** `build_context` with `memory://BOOTSTRAP` for governing protocols
2. **Load project context:** `build_context` with `memory://continuity/cross-instance/` (when available)

The BOOTSTRAP document in Basic Memory contains the full protocol stack: Black Flag Protocol (epistemic hygiene), Temporal Validity Protocol (document lifecycle), Lanesborough Protocol (multi-agent collaboration), Naming and Structure Convention, and the governing principles (stare decisis, meta-pattern observance, sharpening over closure). All agents working in this repo operate under these protocols.

<!-- verified: 2026-02-11 -->

## Architecture

Single Astro 5 project with embedded Sanity Studio. Not a monorepo — simpler than sca-website's dual-app structure.

- **Frontend:** Astro 5, SSR via Vercel adapter (`output: 'server'`)
- **CMS:** Sanity v3, embedded Studio at `/admin`, schemas in `src/sanity/schemas/`
- **Interactive:** React 19 islands via `@astrojs/react` — used only for stateful demos
- **Content flow:** Sanity → `loadQuery` (GROQ + stega options) → Astro component → HTML
- **Rendering strategy:** Content detail pages (`/articles/[slug]`, `/demos/[slug]`) are SSR — they fetch from Sanity on each request so content changes appear immediately after publish. Index pages and homepage use `export const prerender = true` to remain static at build time.
- **Query layer:** `src/sanity/lib/load-query.ts` — wraps `sanityClient.fetch()` with per-fetch stega, perspective, and token options. All page templates use this instead of `sanityClient` directly.
- **Visual editing:** `VisualEditing` component in BaseLayout (gated by `PUBLIC_SANITY_VISUAL_EDITING_ENABLED`), `presentationTool` in `sanity.config.ts` with document-to-URL mapping, `stega.studioUrl` in `astro.config.mjs`.
- **Design system:** New design, borrows discipline (typographic scale, spacing, semantic structure) from sca-explainers. Custom properties cascade from `src/styles/global.css`.

<!-- verified: 2026-02-20 -->

## Commands

```bash
npm run dev          # Astro dev server (localhost:4321)
npm run build        # Production build (SSR server + static prerendered pages)
npm run typecheck    # TypeScript validation via astro check
npm run preview      # Preview built site locally
```

Sanity Studio is embedded at `/admin` — no separate `dev:studio` command needed.

**Dev server:** Always started by the user from their terminal, never by Claude Code in background. Default port 4321 conflicts with sca-website — only one at a time. Check `netstat -ano | grep LISTEN | grep 4321` before starting.

<!-- verified: 2026-02-20 -->

## Sanity Configuration

- **Project ID:** `zu6l9t4j` (personal account — see `.env.local` for credentials)
- **Dataset:** `production`
- **API Version:** `2025-01-01`
- **Tokens:** `.env.local` (never committed)
- **Studio:** Embedded at `/admin` via `@sanity/astro` — no separate Studio app

### Architecture vs. sca-website

This project uses an **embedded Studio** (single process, one origin). The sca-website uses a **monorepo with separate Studio** (two processes, two origins). This matters for CORS:

| | edoconnell-site | sca-website |
|---|---|---|
| **Structure** | Single Astro app | Monorepo: `apps/web` + `apps/sca-studio` |
| **Studio** | Embedded at `/admin` (same origin) | Separate app at `localhost:3333` |
| **Dev ports** | `4321` only | `4321` (web) + `3333` (studio) |
| **CORS origins** | `localhost:4321` + production URL | `localhost:4321` + `localhost:3333` + production URL |

### CORS Origins (manage.sanity.io → API Settings)

Only origins that actually exist as running applications:

- `http://localhost:4321` — dev (Astro + embedded Studio)
- Production URL — added at deploy time

### Visual Editing

Visual editing uses the canonical `@sanity/astro` pattern:

1. **`src/sanity/lib/load-query.ts`** — wraps `sanityClient.fetch()` with per-fetch options: `stega: true`, `resultSourceMap: 'withKeyArraySelector'`, `perspective: 'previewDrafts'`, and a read token. All page templates use this instead of `sanityClient.fetch()` directly.
2. **`VisualEditing` component** in `BaseLayout.astro` — renders the overlay UI for click-to-edit. Gated by `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` env var.
3. **`presentationTool`** in `sanity.config.ts` — document-to-URL mapping for `siteSettings`, `page`, and `demoItem` types.
4. **`stega.studioUrl`** in `astro.config.mjs` — tells stega-encoded strings where to link edits.

**Env vars for visual editing (`.env.local`):**
- `PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true` — enables stega + VisualEditing component
- `SANITY_API_READ_TOKEN` or `SANITY_API_WRITE_TOKEN` — required for authenticated draft fetches

**Resolved (2026-02-18):** Presentation tool `ViteDevServerStopped` error was caused by `@sanity/visual-editing` not being hoisted to top-level `node_modules`. Fixed by installing it as a direct dependency. Presentation tool fully verified via authenticated Playwright tests: Studio loads, Presentation tab visible, iframe renders site content (15,521 chars), stega encoding present in iframe (14,520 chars). Auth state captured via `pw-studio-capture-auth.js` and reused headlessly via `~/.claude/.sanity-auth-state.json`.

**Pattern — `stegaClean`:** Sanity fields used in logic (`===` comparisons, CSS class names, Record key lookups) must be stripped of stega encoding via `stegaClean()` from `@sanity/client/stega`. Display-only fields should NOT be cleaned — stega is what enables click-to-edit overlays. See `demos/[slug].astro` (renderMode, componentName) and `DemoMeta.astro` (epistemicStatus, publicationReadiness).

### Account Separation

Personal projects use personal Sanity account. SCA project (`wesg5rw8`) uses school account. CLI auth is global — `sanity login` switches identity for all projects on this machine. Account details in Basic Memory: `workspace/planning/sanity-account-map`.

<!-- verified: 2026-02-20 -->

## Quality Infrastructure

### Documentation Triad

Three public-facing documents are maintained in sync. Each serves a different consumer:

| File | Consumer | Purpose |
|------|----------|---------|
| `README.md` | Humans | Project description, setup, usage |
| `AGENTS.md` | Any AI agent | Architecture, standards, navigation |
| `CLAUDE.md` | Claude Code | Operational context, commands, deliberation state (this file) |

**Rule:** When architectural files change, all three should be reviewed for staleness. Not every change affects all three — but the pre-commit hook reminds you to check.

### Pre-commit Hook

A git pre-commit hook warns (non-blocking) when architectural files change without updating any of the three documentation files. It checks `CLAUDE.md`, `AGENTS.md`, and `README.md` against a list of watched architectural patterns.

**Setup after clone:**
```bash
git config core.hooksPath .githooks
```

This runs automatically via the `prepare` script after `npm install` once the project is initialized.

### CI Pipeline (`.github/workflows/ci.yml`)

Three-job pipeline that activates automatically when the project is initialized:

1. **build** — `npm ci`, TypeScript check, `astro build`, lint
2. **accessibility** — Playwright + axe-core a11y audit against built pages
3. **lighthouse** — Lighthouse CI with threshold enforcement (>= 95 all categories)

All jobs gracefully skip if `package.json` doesn't exist yet. The workflow is committed before the project so the quality floor is established from the first line of application code.

### Self-Review Practice (Articulation Gate for Code)

Before any deployment or PR, the implementing agent runs this checklist. This is not optional — it is the code equivalent of the Lanesborough articulation gate. The agent must be able to affirm each item, not just check a box.

**Structure & Craft:**
- [ ] Does the Astro component architecture demonstrate real Astro expertise? (Not just HTML in `.astro` files)
- [ ] Are React islands used only where client-side interactivity is genuinely needed?
- [ ] Are all component props typed with TypeScript?
- [ ] Is the component tree shallow and readable, or is it over-abstracted?

**Voice & Editorial:**
- [ ] Read every prose sentence aloud. Does it sound like Ed, or does it sound like a LinkedIn bio?
- [ ] No passion declarations, no consultant-speak, no generic sentences.
- [ ] The test: could this sentence appear on 10,000 other websites? If yes, rewrite or delete.

**Accessibility & Performance:**
- [ ] Semantic HTML: proper heading hierarchy, landmarks, button vs link distinction.
- [ ] Keyboard navigable: every interactive element reachable and operable via keyboard.
- [ ] Visible focus indicators on all focusable elements.
- [ ] `prefers-reduced-motion` respected for any animations.
- [ ] Lighthouse >= 95 across Performance, Accessibility, Best Practices, SEO.

**Security & Hygiene:**
- [ ] No secrets, tokens, or passwords in committed code.
- [ ] No employer-identifying information (institution names, internal references).
- [ ] Documentation triad (CLAUDE.md, AGENTS.md, README.md) reviewed if architectural files changed.
- [ ] Commit message is imperative, concise, and accurate.

**The Medium Is the Message:**
- [ ] Would a technical reviewer learn something about Astro by reading this code?
- [ ] Would a hiring manager at a CMS or developer tools company see evidence of structured content thinking?
- [ ] Does the commit history tell a coherent story of professional engineering?

### Conventions

- **Commit messages:** Imperative mood, concise. Co-author tag for AI-assisted commits.
- **No secrets in repo:** Tokens, passwords, API keys in `.env.local` only.
- **TypeScript:** Strict mode. Typed props for all components.
- **Accessibility:** WCAG AA minimum. Semantic HTML. Keyboard navigable.
- **Performance:** Lighthouse >= 95 across all categories.
- **noindex:** Controlled via `siteSettings.noindex` in Sanity. Currently `true` — all pages carry noindex until HO authorizes indexing.
- **Commit history:** Each commit is self-contained and functional at the time it's made. No placeholder files. No "will fix later" commits. The history is part of the portfolio.
- **Commit lookback:** Each major commit includes explicit verification that all quality policies remain in effect and new additions resonate with the existing structure.
- **Fractal quality:** Deep inspection should reveal deeper levels of quality. Semantic HTML, proper CSS inheritance (custom properties, cascade, logical nesting), AI-readable structure.
- **Voice:** All prose reviewed against `docs/voice-profile.md`. No passion declarations, no consultant-speak, no LinkedIn bio energy.

<!-- verified: 2026-02-11 -->

## Deliberation Context

This project uses the **Lanesborough Protocol** (Skill Forge pattern) for architectural decisions. The append-only dialogue log at `dialogues/001-site-rebuild.md` contains the full decision history.

**Roles:**
- **HO** (Ed O'Connell): Human orchestrator, owns all gates
- **GA** (ChatGPT): Generalizing Agent — proposes architecture, schemas, design
- **IA** (Claude Code): Inspecting Agent — verifies, tests, implements

**Prior art:** Memento MCP Architecture dialogue (2026-01-01) in the portfolio repo.

If you are an agent starting work in this repo, read the dialogue log first. It contains the agreed architecture, schema decisions, and open questions.

<!-- verified: 2026-02-11 -->

## Cross-Project Context

| Project | Path | Relevance |
|---------|------|-----------|
| portfolio (current site) | `C:/Users/Guest1/dev-sandbox/portfolio/` | Migration source — React 19, 3 interactive demos |
| sca-explainers | `C:/Users/Guest1/dev-sandbox/sca-explainers/` | Solution Architecture brief (writing sample) |
| sca-website | `C:/Users/Guest1/dev-sandbox/sca-website/` | Sanity schema patterns (reference only) |

**Basic Memory:**
- **BOOTSTRAP (read first):** `memory://BOOTSTRAP` — governing protocols, principles, canonical decisions
- Skill Forge case studies: `memory://case-studies/`
- Voice profile (literary register): `memory://creative-writing/eds-voice-portrait`
- Voice contract: extracted from prior engagements (see dialogue log)

<!-- verified: 2026-02-11 -->
