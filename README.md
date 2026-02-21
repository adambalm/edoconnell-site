# edoconnell.org

Personal site — under active development.

## Stack

- [Astro](https://astro.build) — SSR for content pages, static prerendering for indexes, island architecture
- [Sanity](https://www.sanity.io) — structured content CMS
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

## Documentation

- `AGENTS.md` — architecture and standards reference for AI tooling
- `CLAUDE.md` — operational context for Claude Code
- `CONTRIBUTORS.md` — human and AI contributor credits with roles and contributions
