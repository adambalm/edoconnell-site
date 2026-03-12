# Context Transport Bundle — edoconnell-site

> **Bundle version:** 2026-02-27
> **Project:** edoconnell-site (Astro 5 + Sanity v3 + Vercel portfolio site)
> **Purpose:** Provide everything an external AI model needs to participate in deliberations about this project's protocol stack and transport automation.

---

## How to Use This Bundle to Start a Deliberation

1. **Read this file first.** It tells you what's here and what's missing.
2. **Read the project context:** `project/edoconnell-site-context.md` — what this project is, tech stack, current state.
3. **Read the active deliberation summary:** `deliberations/transport-automation_summary.md` — the decision being made and the 5 questions to inspect.
4. **Read the full GA and IA positions** (if you want depth): `deliberations/transport-automation_ga.md` and `deliberations/transport-automation_ia.md`.
5. **Consult protocols as needed** — they're in `protocols/`. You don't need to read all of them upfront, but they're here if claims reference them.
6. **The Context Transport Standard** (`context-transport-standard.md`) is a cross-project spec — read it if you're evaluating how this bundling approach should work across projects.

---

## Current Decision Focus: Transport Automation

**Decision question:** How should we automate the manual copy-paste transport between AI models during Lanesborough/Skill Forge deliberations?

**Options under deliberation:**
- **Option 2:** Simple API script (`ask-ia.mjs`, ~60 lines, 30-60 min to build)
- **Option 3:** Multi-model deliberation CLI (`deliberate.mjs`, ~200-400 lines, 1-4 hours to build)

### Five Decision Questions

1. **Is the GA's phased approach genuinely different from Option 2, or is it Option 2 wearing a trenchcoat?** Phase 1 is "functionally equivalent to Option 2" by the GA's own admission.
2. **Is context packaging actually the bottleneck?** IA says no (Ed never reported low-quality responses due to too much context). GA says yes (future deliberations will be longer).
3. **Protocol instability — blocker or non-issue?** The unified protocol was drafted today (2026-02-27). IA says any FSM parser built now will be wrong. GA says it's a simple lookup table.
4. **Are we missing a third option?** Both positions assume Node.js. Are there simpler or more powerful approaches?
5. **The meta-question:** We're using the protocol to decide how to automate the protocol. Does this create a blind spot?

---

## File Tree

```
INDEX.md                                    ← You are here
context-transport-standard.md               ← Cross-project spec (NEW)

protocols/
  lanesborough.md                           ← Canonical (2025-09-01)
  skill-forge.md                            ← Draft (2025-12-28) — treated as canonical
  lce.md                                    ← Active (2026-01-15)
  black-flag.md                             ← Canonical (2024-11-26)
  lce-lanesborough-mapping.md               ← Active (2026-01-15)
  unified-design-cycle-draft.md             ← Draft (2026-02-27) — NOT ratified

deliberations/
  transport-automation_ga.md                ← Full GA position (uncondensed)
  transport-automation_ia.md                ← Full IA position (uncondensed)
  transport-automation_summary.md           ← Derived synthesis

project/
  edoconnell-site-context.md                ← Project overlay

scripts/
  README.md                                 ← How to run the stubs
  ask-ia-stub.mjs                           ← Option 2 interface stub
  deliberate-stub.mjs                       ← Option 3 interface stub
```

---

## Protocol Status and Hashes

| File | Status | Valid From | Hash (SHA-256, first 12) |
|------|--------|-----------|--------------------------|
| `lanesborough.md` | **canonical** | 2025-09-01 | `9ee0e14ed30b` |
| `skill-forge.md` | draft (treated as canonical) | 2025-12-28 | `a2fdc6462541` |
| `lce.md` | active | 2026-01-15 | `e181cfdb8b5f` |
| `black-flag.md` | **canonical** | 2024-11-26 | `08aa01b29900` |
| `lce-lanesborough-mapping.md` | active | 2026-01-15 | `80f3bfb00449` |
| `unified-design-cycle-draft.md` | **draft** | 2026-02-27 | `5f787ee8d1c3` |

**Note:** These are hashes of the bundle copies, not the Basic Memory originals. The bundle copies were extracted on 2026-02-27 and include a source header block not present in the originals.

---

## Exclusions / Missing Items

| Item | Reason | Action Needed |
|------|--------|---------------|
| Full dialogue log (`dialogues/001-site-rebuild.md`, 105 KB) | Too large for gist; contains full deliberation history | Available in repo or via existing gist (`0209d571cb0e06a6382cdbbb8b2a4163`) |
| Temporal Validity Protocol | Exists in Basic Memory but partially folded into Black Flag (Clauses 15-17) | HO to decide if standalone doc needed in bundle |
| LCE-Skill Forge Mapping | Exists in Basic Memory, not included to keep bundle focused | Add if Skill Forge extraction becomes the topic |
| LCE-Basic Memory Mapping | Exists in Basic Memory, not included | Add if Basic Memory integration becomes the topic |
| `.env.local` contents | Secrets — never shared | N/A |
| Deliberation manifest YAML | Defined in transport standard but not yet created for this deliberation | Create when manifest format is ratified |
| Prior portfolio deliberation | In Basic Memory as case study, not extracted | Add if cross-project comparison needed |

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-02-27 | Initial bundle created. 6 protocols extracted from Basic Memory. GA/IA deliberation outputs persisted from conversation context. Context Transport Standard drafted. Script stubs created. | Claude Code (Opus 4.6) |

---

## Recommendation: Split Into Two Gists?

**Yes.** The bundle should be split into:

1. **Global Protocol Pack gist** (stable URL, changes rarely):
   - `lanesborough.md`, `skill-forge.md`, `lce.md`, `black-flag.md`, `lce-lanesborough-mapping.md`
   - `unified-design-cycle-draft.md` (when ratified, moves from draft to canonical)
   - `context-transport-standard.md`
   - Version-stamped INDEX for the protocol pack

2. **edoconnell-site project gist** (stable URL, changes per deliberation):
   - `INDEX.md` (this file, referencing the GPP gist by URL + version)
   - `edoconnell-site-context.md`
   - `transport-automation_*.md` (deliberation files)
   - Script stubs
   - Future deliberation packets appended as new files

**Rationale:** The protocols are reusable across edoconnell-site, memento-mvp, sca-website, and any future project. Bundling them per-project creates drift. A single GPP gist is the single source of truth that all projects reference.

**For now:** Creating a single combined gist to unblock the current deliberation. The split can happen when a second project needs the protocol pack.
