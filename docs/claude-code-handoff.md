# Claude Code Handoff Prompt — `edoconnell-site`

## Intent
This handoff is for Claude Code to disclose and reconcile the implementation history that informed the current build, using both repository state and the full Lanesborough dialogue log from gist `001-site-rebuild.md`.

## Verified Inputs
- Repository inspected at: `/workspace/edoconnell-site`
- Dialogue source: `https://gist.github.com/adambalm/0209d571cb0e06a6382cdbbb8b2a4163` (file: `001-site-rebuild.md`)

## Current Build Snapshot (from repository)
- Astro 5 + TypeScript app with embedded Sanity Studio at `/admin`.
- Static output with Vercel adapter.
- React integration present for islands.
- Sanity schemas include `demoItem`, `article`, `page`, `siteSettings`, and shared `seo`/`provenance` objects.
- `BaseLayout` currently hardcodes `<meta name="robots" content="noindex">`.
- `/demos/` listing queries Sanity and degrades gracefully on fetch failure.
- CI workflow defines build/accessibility/lighthouse jobs, but contains failure-masking patterns in accessibility/lighthouse steps.

## Key Context from Dialogue Gist (high-level)
- Protocol stack invoked: Lanesborough + LCE + Skill Forge + Black Flag.
- FSM indicated execution state after AG closure.
- Explicit non-negotiables include accessibility standards, no secrets, and non-destructive migration.
- Content-model intent emphasizes epistemic governance metadata and structured content.
- Project-level thesis, voice constraints, and quality-as-signal posture are part of the build rationale.

## Initial Findings to Carry Forward
These are the pre-read findings already identified and should be treated as starting hypotheses to verify, not final conclusions:

1. **CI branch trigger mismatch risk**: workflow currently targets `master` only; confirm default branch strategy and trigger scope.
2. **Accessibility CI failure masking**: command pattern can hide genuine test failures; verify fail-fast semantics.
3. **Lighthouse CI failure masking**: current step can report success even when thresholds fail or config is missing.
4. **`noindex` wiring drift**: Sanity `siteSettings.noindex` exists but layout currently hardcodes `noindex`.
5. **Demo routing drift by `renderMode`**: listing route builds internal links even for `EXTERNAL` demos.

For each finding, require Claude Code to classify status as one of: `confirmed`, `partially confirmed`, `not confirmed`, or `superseded by newer evidence`.

## Prompt for Claude Code
Use this exactly as the working brief:

####
You are Claude Code operating inside the `edoconnell-site` repository.

### Objective
Produce a **forensic implementation narrative** that explains *how this build came to be*, reconciling:
1. The current file-level repository state.
2. The Lanesborough dialogue history in gist `001-site-rebuild.md`.

### Required outputs
Return one markdown document with these sections in order:

1. **Executive Summary**
   - 8–12 bullets describing what is built, why, and what governance constraints shaped it.

2. **Protocol-to-Code Traceability Matrix**
   - Table mapping major protocol/decision claims from the dialogue to concrete files/lines in repo.
   - Columns: `Claim`, `Dialogue Evidence`, `Repo Evidence`, `Status (Aligned/Drift/Unimplemented)`, `Notes`.

3. **Chronological Reconstruction**
   - Reconstruct likely implementation sequence from initial scaffolding to current architecture.
   - Include inferred milestones and confidence labels (`high`, `medium`, `low`).

4. **Alignment Findings**
   - Distinguish:
     - **Implemented as intended**
     - **Implemented but drifted**
     - **Stated intent not yet implemented**
   - Be explicit about noindex policy wiring, demo render-mode behavior, and CI enforcement semantics.

5. **Risk Register (Current State)**
   - Include technical, process, and epistemic risks.
   - Prioritize by `severity` and `likelihood`.
   - Flag any “signal risk” where portfolio claims are undermined by implementation details.

6. **Remediation Plan**
   - Propose a staged plan with minimal-risk ordering.
   - For each item: `change`, `files touched`, `validation command`, `rollback note`.

7. **Commit Plan Proposal**
   - Suggest 3–6 logically atomic commits with imperative commit messages.
   - Keep history portfolio-readable.

8. **Open Questions for HO**
   - Only unresolved decisions that require human judgment.
   - No speculative questions.

### Method constraints
- Do not invent facts. Mark uncertain claims as uncertain.
- Prefer repository evidence over inference when conflict exists.
- Quote dialogue snippets only where necessary; otherwise summarize.
- Use concise, technical prose (no motivational language).

### Must-inspect files (minimum)
- `README.md`
- `AGENTS.md`
- `CLAUDE.md`
- `.github/workflows/ci.yml`
- `.githooks/pre-commit`
- `astro.config.mjs`
- `sanity.config.ts`
- `src/layouts/BaseLayout.astro`
- `src/pages/index.astro`
- `src/pages/demos/index.astro`
- `src/sanity/schemas/**/*.ts`
- `src/styles/global.css`

### Validation commands (run and report)
- `npm run typecheck`
- `npm run build`

If environment prevents a command, report exact blocker and proceed with available evidence.
####

## Optional Addendum (if Claude has token budget)
Ask Claude Code to append:
- A concise `DRIFT_REPORT.md` draft for immediate commit.
- A `PR_BODY.md` draft summarizing narrative, risks, and remediation.
