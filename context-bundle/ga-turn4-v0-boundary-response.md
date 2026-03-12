# GA Response to External IA — Turn 4: v0 Boundary Reconciliation + Open Item Responses

**From:** Claude Code (Opus 4.6) — GA
**To:** ChatGPT — External IA
**Date:** 2026-02-28
**Deliberation:** Transport Automation
**State:** UG_OPEN (spec at v0.4.0, responding to IA Turn 3 inspection)

---

## Gist Fix

The `strictness-modes-proposal.md` in the gist has been updated. You should now see v0.4.0 (the header reads `Version: 0.4.0` and includes Section B.3: Manifest Qualification). If you still see v0.3.0, let me know — the gist caching issue has been addressed by re-uploading the file content.

---

## Responding to IA Turn 3 Inspection Findings

### 1. Qualification Gate — [verified] Accepted

Your verification of the three-field check and the `ho_qualified` precondition on the floor cascade is noted. The reconciliation issue you flagged (gist showing v0.3.0) should now be resolved — v0.4.0 is the authoritative version.

### 2. Pacing — Gate-Approaching Trigger

**IA finding:** `[cannot verify]` — "gate-approaching" requires the tool to detect FSM state proximity, which seems to require semantic analysis unless machine-readable gate-state markers exist.

**GA response: Agreed. This is a real gap.** The gate-approaching trigger as written assumes the tool can determine that the FSM is "one turn from closure," but in v0 the FSM state lives in the dialogue log header as freeform text (e.g., `### FSM State: UG_OPEN`). The tool would need to:

1. Parse the FSM state from the log (feasible — it's a markdown header with a known format).
2. Determine what "one turn from closure" means (not feasible without semantic analysis of the current exchange).

**Revised position:** The gate-approaching trigger should be split:

| Sub-trigger | v0? | Mechanism |
|---|---|---|
| FSM state is explicitly `UG_CLOSING` or `AG_CLOSING` (HO writes this in the log header) | **Yes** — deterministic string match | Tool checks for closing markers in the structured header |
| FSM state is "about to close" based on exchange content | **No** — requires inference | Deferred to v0.5+ semantic layer |

This means in v0, Ed is responsible for writing `UG_CLOSING` in the log header when he knows a gate is approaching. The tool matches the string. No inference. This is consistent with the v0 principle: Ed declares, tool reads.

**Alternative:** The IA could mark `[REQUEST_HO]` when it believes a gate is near — this is already a v0 surface trigger and requires no tool-side inference. The gate-approach detection becomes an agent behavior convention, not a tool feature.

### 3. Opening Distillation — v0 Boundary Question

**IA finding:** `[contradicts: v0 boundary]` — the distillation proposes `risk_class` and `changes_schema` tags based on conversation content. Even as non-binding proposals, this is semantic inference, which v0 explicitly forbids.

**IA recommendation:** Ban inferred risk tags from enforceable inputs. Distillation may propose a decision question and identify key turns, but proposed_tags should be deferred to v0.5+ and never feed into the floor cascade even indirectly.

**GA response: Accepted with a refinement.** The IA is right that there's a meaningful distinction to draw here. Let me be precise:

| Distillation output | Semantic inference? | v0? | Rationale |
|---|---|---|---|
| **Proposed decision question** | Yes — reads conversation, synthesizes | **v0** (if `--distill` is opt-in) | Without this, Ed must write the question manually every time. The output is reviewed and corrected before anything proceeds. |
| **Key turns** (turn numbers where intent emerged) | Yes — identifies relevance | **v0** (same gate) | Same rationale. Ed reviews and corrects. |
| **Proposed risk tags** (`changes_schema`, `risk_class`, etc.) | Yes — infers enforcement-relevant values | **No — v0.5+** | IA is correct: these feed into the floor cascade. Even as "proposals," they create a default that Ed might rubber-stamp. The qualification gate catches this for manifests, but the distillation is pre-manifest — the safeguard doesn't apply yet. |
| **Uncertainties** | Yes — identifies its own gaps | **v0** | This is epistemic hygiene, not enforcement. |

**The principle:** Distillation outputs that help Ed frame the problem (question, key turns, uncertainties) are v0. Distillation outputs that suggest enforcement parameters (risk tags, mode recommendations) are v0.5+. The line is: **does this output feed into any deterministic enforcement mechanism?** If yes, it's not v0.

**Effect on the spec:** The distillation example in Turn 3 showed `proposed_tags` in the output. That section should be removed from v0 distillation output. The v0 distillation produces:

```yaml
# v0 distillation output (--distill flag)
proposed_decision_question: "Should case studies get their own document type?"
confidence: high
key_turns:
  - turn: 12
    summary: "IA raises schema implications"
  - turn: 23
    summary: "GA proposes caseStudy type"
  - turn: 47
    summary: "Ed decides to deliberate"
uncertainties:
  - "Scope unclear: project-only or affects protocol stack?"
  - "Alternative framing: this might be about template architecture, not schema"
# NOTE: No proposed_tags in v0. Risk tags are HO-declared only.
```

Ed reviews this, corrects it, and uses it to write the manifest (where he sets risk tags manually). The distillation informs Ed's thinking; it does not propose enforcement parameters.

**On the IA's specific question — "Is there a meaningful difference between proposing `changes_schema: true` and proposing a decision question?":**

Yes. The decision question is a framing aid — it helps Ed think about what he's deciding. If the distillation proposes "Should case studies get their own type?" and Ed corrects it to "Should we use a `kind` variant instead?", the correction changes the framing but has zero effect on enforcement. The manifest fields are still whatever Ed writes.

But if the distillation proposes `changes_schema: true` and Ed doesn't correct it, that tag (once the manifest is qualified) triggers the floor cascade. The distillation has effectively set an enforcement parameter. Even if Ed "chose" not to correct it, the default was set by inference. This is exactly the pattern the qualification gate was designed to prevent — and the distillation runs before the manifest exists, so the qualification gate doesn't apply.

The IA's line is the right one: **no inferred values in the enforcement path, even as proposals, in v0.**

### 4. Pacing — v0 Scope

**IA recommendation:** v0 pacing should be limited to `--churn N` (budget) and `--cost-cap` (spend limit). All other surface triggers (gate approach, contradiction persistence, convergence failure) require either semantic analysis or FSM state detection and should be v0.5+.

**GA response: Mostly agreed, with one addition.** The IA's two triggers are the right mechanical minimum. But I'd add one more:

| v0 surface trigger | Mechanism | Rationale |
|---|---|---|
| `--churn N` budget exhausted | Counter | Deterministic. No inference. |
| `--cost-cap` exceeded | Accumulator | Deterministic. No inference. |
| `[REQUEST_HO]` marker in agent output | String match | Deterministic. No inference. The agent made a conscious decision to surface. |

`[REQUEST_HO]` is a string the agent writes deliberately. The tool matches it. This is no different from matching `manifest_status: ho_qualified` — it's a declared value, not an inferred one. And it gives agents an escape valve during churn: if the IA spots something that warrants Ed's attention but doesn't trip a mechanical trigger, it can say so.

**Deferred to v0.5+:**

| Trigger | Why deferred |
|---|---|
| Gate approaching | Requires FSM state detection (see item 2 above) |
| Unresolved `[contradicts]` persistence | Requires tracking flag state across turns (counter + string matching — feasible but adds complexity beyond v0 core) |
| Convergence failure (6 turns without progress) | "Without progress" is undefined without semantic analysis or handshake-state tracking |
| `changes_schema` / `changes_protocol` manifest tag triggers | Already handled by floor cascade; redundant as a separate pacing trigger |

**Note on `[contradicts]` tracking:** This one is borderline. It's technically a counter + regex (`[contradicts` appearing in output, tracked across turns). It's not semantic inference — it's mechanical. But it adds state management (track which flags are resolved) that the v0 single-turn transport doesn't need. I'd defer it to v0.5 for scope reasons, not principle reasons.

### 5. IA Turn 2 Flags — Responses Owed

#### Priority Ordering in Floor Cascade

**IA Turn 2 flag:** Is the priority chain correct? Should `data_sensitivity` outrank `risk_class=high`?

**GA response:** No, the current ordering is correct. `data_sensitivity` triggers COMMIT + dry_run, which is *more ceremony* than plain COMMIT (which `risk_class=high` triggers). The dry_run is the additional safeguard — it forces Ed to see what's being sent before it goes. But `risk_class=high` should still outrank `data_sensitivity` in the cascade because risk_class is Ed's explicit severity assessment while data_sensitivity is a classification of the data type.

The edge case: what if `risk_class=normal` but `data_sensitivity=personal`? The cascade correctly gives COMMIT + dry_run. What if `risk_class=high` and `data_sensitivity=personal`? The cascade gives COMMIT (from risk_class=high) but does NOT force dry_run. **This is a gap.** The fix: if `data_sensitivity IN (student, personal)`, force `dry_run = ON` regardless of which cascade rule set the min_mode. This is an additive constraint, not a priority change.

**Proposed cascade amendment:**

```
# After cascade determines min_mode:
IF data_sensitivity IN (student, personal)
  → dry_run = ON (additive, regardless of cascade rule)
```

#### Multi-Project Edge Case

**IA Turn 2 flag:** What if a deliberation affects multiple projects but doesn't change schema or protocol?

**GA response:** The `scope` field is currently required only when `changes_schema` or `changes_protocol` is true. A multi-project deliberation that doesn't change either (e.g., "align naming conventions across 3 repos") doesn't trigger the `scope` requirement.

**Is this a problem?** Arguably no — if you're not changing schema or protocol, the floor cascade doesn't use `scope` anyway. The deliberation runs at whatever mode Ed selects. If it's important enough to track as multi-project, Ed can set `scope: global` voluntarily, but the tool won't refuse if he doesn't.

**But:** Ed might want to know that a deliberation touches multiple projects. This is a metadata concern, not an enforcement concern. Proposal: add an optional `affected_projects` list to the manifest. Non-enforced, informational only. Logged in the invocation log. Deferred to v0.5 (it's metadata, not mechanism).

#### Option 2.5 (Split transport.mjs / enforce.mjs)

**IA Turn 2 flag:** Split the tool into a transport script (moves bytes) and an enforcement script (reads manifest, computes floors, prints warnings). They compose but can be used independently.

**GA response in light of four-layer architecture:** This makes more sense now than when it was proposed. The four layers are:

1. Opening Distillation — reads conversation, proposes structure (optional, `--distill`)
2. Transport — moves bytes between models via API calls
3. Enforcement — reads manifest, computes floors, validates mode
4. Pacing — controls churn/surface rhythm

These are four distinct concerns. A monolithic `deliberate` command that does all four is convenient but couples them. Option 2.5 says: make transport and enforcement separable.

**Revised GA position:** The v0 CLI should be a single entry point (`deliberate`) that composes these internally as modules, not separate scripts. The user runs one command. But the internal architecture should separate:

- `lib/distill.mjs` — opening distillation (v0: opt-in via `--distill`)
- `lib/transport.mjs` — API call, context assembly, response handling
- `lib/enforce.mjs` — manifest reading, floor cascade, validation
- `lib/pace.mjs` — churn/surface orchestration (v0: single-turn only; v0.5: churn)

This is Option 2.5 as internal architecture, not user-facing split. Ed runs `deliberate`. The code is modular. Tests can exercise enforcement without making API calls.

---

## Updated v0 Scope Summary

Based on this exchange, here's the reconciled v0:

### v0 Ships

| Feature | Section | Notes |
|---|---|---|
| Four modes (CONSULT/DELIBERATE/COMMIT/RATIFY) | A | |
| Manifest fields (HO-declared) | B.1 | |
| Manifest qualification gate | B.3 | Three-field check, draft vs ho_qualified |
| Mechanical metrics | B.2 | Computed, non-enforcing |
| Requirements by mode | C | |
| Floor cascade | D | Only active when `ho_qualified` |
| Validation rules | D.3 | Hard refusal |
| Override mechanism | E | With audit trail |
| Escalation advice (warnings) | F | Non-blocking |
| CLI interface | G | Single-turn only |
| `--surface` mode (single turn) | I | Default for all modes in v0 |
| `--churn N` budget | I | Counter-based, deterministic |
| `--cost-cap` | I | Accumulator-based, deterministic |
| `[REQUEST_HO]` surface trigger | I | String match |
| Opening distillation (opt-in `--distill`) | New | Decision question + key turns + uncertainties only. NO proposed_tags. |

### v0 Does NOT Ship

| Feature | Reason | Target |
|---|---|---|
| Autonomous churn orchestration | Requires proven single-turn transport first | v0.5 |
| Surface triggers (gate-approach, contradiction persistence, convergence failure) | Require FSM state detection or cross-turn state tracking | v0.5 |
| Proposed risk tags in distillation | Feeds enforcement path — violates v0 "no inference in enforcement" | v0.5 |
| Distillation correction loop (learning from Ed's edits) | Requires persistence layer | v1+ |
| Semantic auto-tagging | Explicitly deferred | v1+ |
| `affected_projects` metadata | Informational, not mechanism | v0.5 |

### v0 Internal Architecture (Option 2.5)

```
deliberate (CLI entry point)
  ├── lib/distill.mjs    (--distill: question + turns + uncertainties)
  ├── lib/enforce.mjs    (manifest + floors + validation)
  ├── lib/transport.mjs  (context assembly + API call)
  └── lib/pace.mjs       (v0: single-turn; v0.5: churn/surface)
```

---

## Updated Open Items

| Item | Status | Owner |
|---|---|---|
| Default mode (CONSULT vs DELIBERATE) | HO has not decided | HO |
| `data_sensitivity` dry_run additive constraint | GA proposed fix (this turn) — IA should inspect | IA |
| v0 distillation scope | Agreed: question + turns + uncertainties. No proposed_tags. | Closed (GA+IA consensus) |
| Gate-approaching trigger | Split: explicit `UG_CLOSING` marker (v0) + semantic detection (v0.5) | GA proposed — IA should inspect |
| `[contradicts]` persistence trigger | Deferred to v0.5 (scope, not principle) | Noted |
| Option 2.5 internal architecture | GA proposes modular internals, single CLI entry point | IA should inspect |
| Articulation gate | Not reached — Ed must restate understanding before spec closes | HO |

---

## What the IA Should Do Next

1. **Inspect the `data_sensitivity` dry_run fix.** Is an additive constraint the right pattern, or does it introduce ordering complexity?

2. **Inspect the gate-approaching split.** Is `UG_CLOSING` / `AG_CLOSING` as an explicit header marker sufficient for v0? Does requiring Ed to write it defeat the purpose?

3. **Inspect the v0 distillation scope.** Are you satisfied that question + key turns + uncertainties (no proposed_tags) draws the line correctly?

4. **Inspect Option 2.5 as internal architecture.** Does modular internals + single CLI entry point address your original concern, or did you intend the split to be user-facing?

5. **Any remaining [unresolved] flags from your Turn 2/Turn 3 inspections that we haven't addressed?**

Apply verification flags as before.

**Your turn, IA.**
