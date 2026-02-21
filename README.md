# edoconnell.org

Portfolio site. Astro 5 frontend with embedded Sanity v3 Studio, deployed on Vercel. Content is structured data — authored once in the CMS, queried via GROQ, rendered through typed components. Content pages are server-rendered for immediate publish visibility; index pages are statically prerendered.

The Sanity content model uses epistemic governance fields (provenance, epistemic status, publication readiness) on authored content types — tracking not just *what* was written but *who* produced it, *how*, and *at what confidence level*. Visual editing is wired via the Presentation Tool with stega encoding.

## Stack

- [Astro 5](https://astro.build) — SSR for content pages, static prerendering for indexes, island architecture
- [Sanity v3](https://www.sanity.io) — structured content, embedded Studio at `/admin`, visual editing
- [Vercel](https://vercel.com) — deployment
- TypeScript throughout

## Setup

```bash
git clone https://github.com/adambalm/edoconnell-site.git
cd edoconnell-site
npm install
```

The `prepare` script activates git hooks automatically after install.

### Sanity

Copy `.env.local.example` to `.env.local` and add your Sanity project ID:

```bash
cp .env.local.example .env.local
```

The Sanity project is connected and the dataset is seeded. GROQ queries degrade gracefully if Sanity is unreachable — the site builds with hardcoded fallbacks.

## Development

```bash
npm run dev          # Astro dev server (localhost:4321)
npm run build        # Production build
npm run typecheck    # TypeScript validation
npm run preview      # Preview built site
```

Sanity Studio is embedded at `/admin` — no separate command needed.

## Quality

CI runs on every push: build, TypeScript check, Playwright accessibility tests, and Lighthouse audits. Thresholds are enforced — Lighthouse >= 95 for Accessibility and Best Practices, with Performance and SEO as warnings (SEO is depressed by intentional `noindex` during development).

A pre-commit hook warns when architectural files change without corresponding documentation updates.

## Scripts

- `scripts/seed.mjs` — seed Sanity dataset with initial documents (`--dry-run` supported)
- `scripts/patch-sa-brief.mjs` — editorial patches to the Solution Architecture Brief via Portable Text manipulation (workaround for [agent-toolkit #20](https://github.com/sanity-io/agent-toolkit/issues/20))
- `scripts/sync-dialogue.sh` — sync local deliberation log to a private GitHub Gist for cross-agent access

## Documentation

- `AGENTS.md` — architecture and standards reference for AI tooling
- `CLAUDE.md` — operational context for Claude Code
- `CONTRIBUTORS.md` — human and AI contributor credits with roles and contributions
- `docs/voice-profile.md` — editorial voice properties for prose-generating agents
