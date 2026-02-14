# Forensic Implementation Narrative — `edoconnell-site`

**Produced by:** Claude Code (Opus 4.6), acting as IA
**Date:** 2026-02-14
**Inputs:** Repository state at commit `ed835b2` (master), Lanesborough dialogue gist `001-site-rebuild.md`
**Validation:** `npm run typecheck` — 0 errors; `npm run build` — complete (72.12s)

---

## 1. Executive Summary

- Astro 5 + Sanity v3 + Vercel site replacing a React 19 SPA (`github.com/adambalm/portfolio`). Static output with embedded Sanity Studio at `/admin`.
- Built under the Lanesborough Protocol with LCE, Skill Forge, and Black Flag constraints. Formal FSM tracked state from INIT through AG_CLOSED to EXECUTING.
- 10 commits on master, 6 pre-application (governance infrastructure) + 4 application code. Quality infrastructure was committed before the first line of application code — deliberate signal.
- Content model includes 4 document types (`demoItem`, `article`, `page`, `siteSettings`) and 2 shared objects (`seo`, `provenance`). Epistemic governance fields (epistemicStatus, audienceContext, publicationReadiness, provenance) appear on content types that carry editorial weight.
- The `article` type uses a `kind` discriminator (brief/essay/case-study) with required validation — forces editorial decision at creation. Originally named `writingSample`, renamed during execution to be "boringly correct" while metadata carries the depth.
- Sanity project `zu6l9t4j` created on Ed's personal Sanity account, separated from the school account. CORS configured with credentials for embedded Studio.
- All pages carry hardcoded `<meta name="robots" content="noindex">` — policy is "noindex until HO authorizes indexing."
- CI pipeline (3 jobs: build, accessibility, Lighthouse) uses initialization guards and failure-masking patterns appropriate for early-stage development.
- Security headers deployed via `vercel.json`: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy.
- Design tokens established but palette deferred to design phase. Typographic scale (major third), spacing rhythm, prose measure constraint (65ch), and font stacks defined.
- No content exists in Sanity yet. The `/demos/` listing degrades gracefully to an empty state. The site is structural — semantic HTML with neutral tokens, ready for content and design.

---

## 2. Protocol-to-Code Traceability Matrix

| Claim | Dialogue Evidence | Repo Evidence | Status | Notes |
|-------|-------------------|---------------|--------|-------|
| Quality infrastructure before code | Dialogue: HO mandated 2026-02-11 | Commits `cac16e7`→`1057df2`→`fae8ea7` precede `1d2a710` (first app code) | **Aligned** | 6 governance commits before first app commit |
| noindex on all pages | PRT: `[human:attested]` — HO mandated 2026-02-11 | `BaseLayout.astro:16`: `<meta name="robots" content="noindex">` | **Aligned** | Hardcoded, not wired to Sanity toggle (intentional — see §4) |
| Fractal quality principle | PRT: `[human:attested]` — HO mandated 2026-02-11 | `AGENTS.md:116`: documented. `global.css`: typographic scale, semantic tokens, prose measure constraint | **Aligned** | Design tokens present; visual design deferred |
| Documentation triad | Dialogue: HO directed creation | `README.md`, `AGENTS.md`, `CLAUDE.md` all present and maintained | **Aligned** | Pre-commit hook enforces staleness check |
| demoItem schema v2 final | PRT: framing + renderMode + epistemicStatus + audienceContext + publicationReadiness + provenance + seo | `src/sanity/schemas/demoItem.ts`: all fields present | **Aligned** | |
| Epistemic governance fields | PRT: `[human:attested]` — HO mandated 2026-02-11 | `demoItem.ts`, `article.ts`: epistemicStatus, audienceContext, publicationReadiness, provenance all present | **Aligned** | |
| Provenance object | Dialogue: content carries origin story | `src/sanity/schemas/objects/provenance.ts`: author, generatedBy, reviewedBy, context, date | **Aligned** | |
| Astro 5 + Sanity v3 + Vercel | PRT: `[human:attested]` — HO batch 2026-02-12 | `package.json`: astro ^5.17.0, sanity ^3.0.0, @astrojs/vercel ^9.0.0 | **Aligned** | |
| Embedded Studio at `/admin` | Dialogue: architecture decision | `astro.config.mjs:19`: `studioBasePath: '/admin'` | **Aligned** | |
| Static output | Dialogue: architecture decision | `astro.config.mjs:10`: `output: 'static'` | **Aligned** | |
| `writingSample` → `article` rename | Execution decision (Claude Code session) | `article.ts` with `kind` discriminator | **Aligned** | Renamed during execution; dialogue predates this |
| Accessibility standards | PRT: non-negotiable | `ci.yml`: accessibility job exists. `BaseLayout.astro`: skip-link, landmarks, semantic HTML, ARIA labels | **Partially aligned** | CI job exists but uses failure-masking pattern |
| Lighthouse >= 95 | `AGENTS.md:65-69`, `CLAUDE.md:148` | `ci.yml:126-127`: Lighthouse step exists but no `lighthouserc.json` config | **Drift** | Threshold claimed in docs but not enforced — no config file exists |
| Demo detail routes `/demos/{slug}` | PRT: `[human:attested]` — HO batch 2026-02-12 | `demos/index.astro`: links to `/demos/${demo.slug?.current}` but no `[slug].astro` route exists | **Unimplemented** | Listing route exists; detail routes not yet built |
| React island migration | PRT: 2,476 LOC of React (SkillForge, ContextSage, Memento) | No React demo components exist in repo | **Unimplemented** | Migration has not started — expected |
| Voice profile | PRT: `[human:attested]` — HO directed creation | `docs/voice-profile.md` exists (confirmed by `CLAUDE.md:172`) | **Aligned** | Not inspected in this audit |
| SA brief adaptation | PRT: `[human:attested]` — HO mandated 2026-02-11 | No article content exists in Sanity | **Unimplemented** | Expected — content creation is Phase 2 |
| CI permissions hardened | Security review (Claude Code session) | `ci.yml:9-10`: `permissions: contents: read` | **Aligned** | Added in commit `ed835b2` |
| Security headers | Security review (Claude Code session) | `vercel.json`: 4 security headers | **Aligned** | Added in commit `ed835b2` |
| @lhci/cli pinned | Security review (Claude Code session) | `ci.yml:126`: `@lhci/cli@0.14.0` | **Aligned** | Pinned in commit `ed835b2` |

---

## 3. Chronological Reconstruction

| # | Commit | Date | Milestone | Confidence |
|---|--------|------|-----------|------------|
| 1 | `cac16e7` | 2026-02-11 | **Repository initialization.** `.gitignore` committed. No application code. | HIGH |
| 2 | `2fd35d9` | 2026-02-11 | **Governance layer 1.** `CLAUDE.md` and pre-commit hook. Operational context established before code. | HIGH |
| 3 | `1057df2` | 2026-02-11 | **Governance layer 2.** CI pipeline and self-review checklist. Quality floor established. | HIGH |
| 4 | `d7fd2b0` | 2026-02-11 | **Refinement.** Genericize reviewer references — removing employer-identifying information from checklist. | HIGH |
| 5 | `fae8ea7` | 2026-02-11 | **Documentation triad.** `AGENTS.md`, expanded pre-commit hook to watch architectural files. | HIGH |
| 6 | `e1c0f4e` | 2026-02-11 | **Cross-agent infrastructure.** Dialogue sync script, `.gist-id` for secret gist. Enables multi-agent access to deliberation history. | HIGH |
| 7 | `bb7716d` | 2026-02-11 | **Voice and design.** Voice profile document, design principles. Editorial constraints documented before visual work begins. | HIGH |
| 8 | `1d2a710` | 2026-02-12 | **Application foundation.** Astro 5 + Sanity v3 + Vercel adapter. Schemas, layouts, pages, design tokens. First application code, built on 7 commits of governance infrastructure. | HIGH |
| 9 | `351343a` | 2026-02-13 | **Sanity connection.** Real project ID (`zu6l9t4j`) wired. `writingSample` → `article` rename with `kind` discriminator. `CONTRIBUTORS.md` created. Tagline changed to "Cognition in context." | HIGH |
| 10 | `ed835b2` | 2026-02-13 | **CI + security hardening.** TypeScript fixes for CI environment (env type casting, virtual module types). `vercel.json` security headers. CI permissions and dependency pinning. | HIGH |

**Inferred phases:**
- **Phase 0** (commits 1–7): Governance infrastructure. Quality floor, documentation, cross-agent tooling. No application code.
- **Phase 1** (commits 8–10): Application foundation. Astro + Sanity + Vercel wired, schemas defined, CI passing, security reviewed.
- **Phase 2** (not started): Content migration, design direction, demo porting, article creation.

---

## 4. Alignment Findings

### Implemented as Intended

1. **Quality infrastructure before code.** 7 governance commits precede the first application commit. The commit history tells the story the dialogue prescribes.
2. **Epistemic governance fields.** `epistemicStatus`, `audienceContext`, `publicationReadiness`, and `provenance` appear on `demoItem` and `article` exactly as specified in the PRT.
3. **noindex policy.** Hardcoded in `BaseLayout.astro`. The Sanity `siteSettings.noindex` field exists as future infrastructure for policy change, not as current wiring. This is intentional.
4. **Embedded Studio architecture.** Single Astro app with Studio at `/admin`. No separate Studio process.
5. **Documentation triad.** All three files maintained, pre-commit hook enforces freshness checks.
6. **Static output with Vercel adapter.** As specified.
7. **Design tokens.** Typographic scale (major third), spacing rhythm, prose measure constraint, font stacks — all present in `global.css`. Palette explicitly deferred ("refined at design phase").
8. **Accessibility foundations.** Skip link, semantic landmarks, ARIA labels, `:focus-visible`, `prefers-reduced-motion`, heading hierarchy — built in from the start.
9. **Security posture.** `vercel.json` headers, CI permissions, dependency pinning, `.gitignore` comprehensive.

### Implemented but Drifted

1. **noindex wiring vs. siteSettings toggle.**
   - The dialogue establishes that `siteSettings.noindex` should control indexing. The layout hardcodes `noindex` and does not query Sanity.
   - **Assessment:** This is NOT drift — it's intentional staging. The hardcode is the correct implementation of the current policy ("noindex until HO authorizes"). The Sanity field is pre-positioned for the policy change. When HO authorizes indexing, the layout should be updated to query `siteSettings.noindex`. This is a known future change, not an oversight.

2. **Lighthouse thresholds.**
   - `AGENTS.md` and `CLAUDE.md` both claim "Lighthouse >= 95 across all categories."
   - CI has a Lighthouse job but no `lighthouserc.json` configuration file exists. The step runs `lhci autorun --config=lighthouserc.json || echo "No Lighthouse config yet"` — which always falls through to the echo.
   - **Assessment:** The *claim* is documented but the *enforcement* is not yet active. The `|| echo` pattern is appropriate for early development (no pages to meaningfully audit yet) but the docs should not claim enforcement that doesn't exist. **Signal risk:** A reviewer reading `AGENTS.md` and then inspecting CI would notice the gap.

### Stated Intent Not Yet Implemented

1. **React demo migration.** 2,476 LOC of React (SkillForge 1,176, ContextSage 850, Memento 450) has not been ported. No React components exist in the repo beyond the Sanity Studio. Expected — this is Phase 2 work.
2. **Demo detail routes.** `demos/index.astro` generates links to `/demos/${slug}` but no `[slug].astro` dynamic route exists. No demo data exists in Sanity either.
3. **Article content.** The `article` schema is defined but no article content exists in Sanity. The SA brief adaptation is tracked as a work item.
4. **Redirect strategy.** PRT specifies 301 redirects from old flat routes to `/demos/{slug}`. No redirects configured.
5. **Presentation tool / visual editing.** Sanity Studio has `structureTool()` and `visionTool()` only. No `presentationTool()`. Noted as backlog item (see Basic Memory: `workspace/backlog/presentation-tool-edoconnell-site`).

---

## 5. Risk Register (Current State)

| # | Risk | Severity | Likelihood | Category | Detail |
|---|------|----------|------------|----------|--------|
| R1 | **Signal risk: Lighthouse claims vs. enforcement** | MEDIUM | HIGH | Epistemic | `AGENTS.md` claims ">= 95 across all categories" but no `lighthouserc.json` exists. A technical reviewer inspecting CI would notice. This undermines the fractal quality signal. |
| R2 | **CI failure masking** | LOW | MEDIUM | Technical | Both accessibility and Lighthouse jobs use `|| echo` patterns that always succeed. Appropriate during scaffolding but must be removed when tests are added. |
| R3 | **Demo listing links for EXTERNAL renderMode** | LOW | LOW | Technical | `demos/index.astro:33` generates internal links regardless of `renderMode`. External demos should link to `externalUrl`. Currently latent — no demo data exists. |
| R4 | **Sanity `siteSettings` not queried** | LOW | LOW | Technical | Layout hardcodes noindex. `siteSettings` fields (siteTitle, siteDescription, noindex, default SEO) exist in schema but are not queried by any page. Intentional staging, not a bug. |
| R5 | **Chunk size warnings** | LOW | LOW | Performance | `studio-component.js` (4.9MB), `VideoPlayer.js` (1MB), `SanityVision.js` (595KB) — all Sanity Studio internals. Only load on `/admin` route. Non-blocking for portfolio pages. |
| R6 | **Codex PR regression** | MEDIUM | HIGH | Process | PR #1 from `codex/analyze-codebase` reverts 5 of 6 changes from commit `ed835b2` (security headers, type fixes, CI hardening). Must not be merged as-is. See detailed analysis below. |
| R7 | **`any` type usage** | LOW | LOW | Technical | `demos/index.astro:5`: `let demos: any[] = []` and `:33` `demo: any`. Should be typed when demo data shape is finalized. |

---

## 6. Remediation Plan

### Stage 1: Documentation Alignment (Low Risk)

| Change | Files | Validation | Rollback |
|--------|-------|------------|----------|
| Qualify Lighthouse claim — "enforced when `lighthouserc.json` is added" or remove threshold claim until config exists | `AGENTS.md`, `CLAUDE.md` | Manual review | Revert text changes |
| Add `lighthouserc.json` stub with >= 95 thresholds | `lighthouserc.json` (new) | `npm run build` (unchanged) | Delete file |

### Stage 2: CI Semantics (Low Risk)

| Change | Files | Validation | Rollback |
|--------|-------|------------|----------|
| Add `lighthouserc.json` with Vercel static output config | `lighthouserc.json` (new) | Local LHCI run if possible | Delete file |
| When first a11y test is added: remove `|| echo` from accessibility step | `.github/workflows/ci.yml` | Push to trigger CI | Restore `|| echo` |
| When `lighthouserc.json` is populated: remove `|| echo` from Lighthouse step | `.github/workflows/ci.yml` | Push to trigger CI | Restore `|| echo` |

### Stage 3: Demo Routing (Medium Risk — Deferred)

| Change | Files | Validation | Rollback |
|--------|-------|------------|----------|
| Add renderMode-aware linking in demo listing | `src/pages/demos/index.astro` | Add test demo data, verify links | Revert listing template |
| Create `[slug].astro` dynamic route for demo detail pages | `src/pages/demos/[slug].astro` (new) | Build + navigate | Delete file |

### Stage 4: Sanity Wiring (Deferred Until Content Exists)

| Change | Files | Validation | Rollback |
|--------|-------|------------|----------|
| Query `siteSettings` in BaseLayout for dynamic noindex | `src/layouts/BaseLayout.astro` | Toggle `siteSettings.noindex` in Studio, rebuild | Revert to hardcode |

---

## 7. Commit Plan Proposal

```
1. docs: qualify Lighthouse enforcement claims in documentation triad
   - AGENTS.md, CLAUDE.md: clarify that Lighthouse thresholds are target, not yet enforced

2. chore: add Lighthouse CI configuration
   - lighthouserc.json: >= 95 thresholds, static output collect config

3. docs: add forensic implementation narrative
   - docs/forensic-implementation-narrative.md: this document
   - docs/claude-code-handoff.md: Codex handoff prompt (extracted from PR #1)

4. fix: handle renderMode in demo listing links (when demo data exists)
   - src/pages/demos/index.astro: conditional href based on renderMode
```

Commits 1–3 are safe to make now. Commit 4 should wait until demo data exists to test against.

---

## 8. Open Questions for HO

1. **Codex PR #1 disposition.** The PR from `codex/analyze-codebase` reverts security headers, type fixes, and CI hardening from `ed835b2`. Recommend: close with comment explaining the regression. The useful artifact (`docs/claude-code-handoff.md`) has been extracted to master. **Decision needed from HO.**

2. **Lighthouse threshold timing.** Should `lighthouserc.json` be committed now (enforcing >= 95 against the current minimal pages) or deferred until content pages exist? The current pages are so minimal they'll score 100 trivially — the test becomes meaningful when real content and images are present.

3. **`|| echo` removal timing.** The failure-masking patterns in CI are intentional scaffolding. When should they be removed? Option A: when the first real test is added (per-job). Option B: all at once when Phase 2 content exists.

4. **Demo listing template.** The `renderMode` conditional linking is a latent issue. Should it be fixed now (proactive) or when the first demo is actually created in Sanity (reactive)?

---

## Appendix: Classification of Codex Initial Findings

| # | Finding | Status | Evidence |
|---|---------|--------|----------|
| 1 | CI branch trigger mismatch risk | **Not confirmed** | Default branch IS master. Workflow correctly triggers on push to master and PRs to master. No mismatch. |
| 2 | Accessibility CI failure masking | **Confirmed** | `ci.yml:89`: `|| echo "No accessibility tests yet"` always succeeds. Intentional scaffolding, but masks future failures if tests are added without removing the fallback. |
| 3 | Lighthouse CI failure masking | **Confirmed** | `ci.yml:127`: `|| echo "No Lighthouse config yet"` always succeeds. No `lighthouserc.json` exists. Same pattern as finding 2. |
| 4 | `noindex` wiring drift | **Partially confirmed** | Layout hardcodes `noindex` (confirmed). But this is intentional policy implementation, not drift. The Sanity `siteSettings.noindex` field is future infrastructure. Drift would occur only if HO authorizes indexing and the hardcode is not updated. |
| 5 | Demo routing drift by `renderMode` | **Confirmed** | `demos/index.astro:33` always generates `/demos/${slug}` regardless of `renderMode`. Currently latent — no demo data exists in Sanity. |

---

## Appendix: Codex PR #1 Regression Analysis

PR #1 (`codex/analyze-codebase` → master) was branched from commit `351343a`, before the CI + security hardening commit `ed835b2`. Five of six changes are regressions:

| Change | Effect |
|--------|--------|
| Adds `docs/claude-code-handoff.md` | ✅ Useful — extracted to master |
| Removes `permissions: contents: read` from ci.yml | ❌ Reverts security hardening |
| Unpins `@lhci/cli@0.14.0` → `@lhci/cli` | ❌ Reverts supply chain pin |
| Removes `Record<string, string | undefined>` cast in sanity.config.ts | ❌ Will break CI typecheck |
| Removes `/// <reference types="@sanity/astro/module" />` from env.d.ts | ❌ Will break CI typecheck |
| Deletes `vercel.json` | ❌ Removes all security headers |

**Recommendation:** Close PR with explanatory comment. The handoff document has been extracted.
