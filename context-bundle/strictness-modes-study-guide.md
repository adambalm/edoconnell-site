# Strictness Modes Study Guide — For HO Articulation Gate

> **Purpose:** Reference document for Ed to study and restate in his own words. This is the v0.5.4 spec distilled into its essential structure with enough detail that each concept stands on its own. Suitable for upload to NotebookLM.
>
> **What this is not:** A replacement for the spec. The spec is the authoritative document. This is a study aid organized around the conceptual architecture rather than the section numbering.

---

## The Problem This Solves

Transport friction during Lanesborough/Skill Forge deliberations currently takes an estimated 60-90 minutes per turn (manual copy-paste between model UIs). A transport CLI removes that friction — but speed creates a new risk: Ed chains invocations faster than he absorbs responses. The spec doesn't just automate transport. It defines an enforcement layer that makes the ceremony around each invocation proportional to the stakes.

---

## The Core Idea: Three Layers

The entire spec is three independent layers that compose.

### Layer 1: Modes (What Ed Is Doing)

Four levels of ceremony, named for what Ed is doing — not abstract severity grades.

| Mode | Analogy | What It Means |
|------|---------|---------------|
| **CONSULT** | Phone call | Quick question. No manifest needed. No enforcement. Output is citable only with a `[cannot verify: CONSULT mode]` tag. |
| **DELIBERATE** | Meeting with notes | Standard multi-agent deliberation. Auto-stub manifest (draft). Structured turns. No binding commitments. |
| **COMMIT** | Signed memo | Decision that binds future work. Requires HO-qualified manifest. Full traceability. Reversal possible but costly. |
| **RATIFY** | Constitutional amendment | Changing the rules themselves — schema, protocol, architecture. Full ceremony. Dry-run by default. |

CONSULT is the default. Every increase in ceremony is a conscious act.

### Layer 2: Floors (Minimum Ceremony From Tags)

The manifest contains HO-declared fields — seven tags Ed sets by hand. The tool reads them and computes a minimum mode via a deterministic cascade. First match wins:

1. `changes_protocol = true` → minimum RATIFY
2. `risk_class = critical` → minimum RATIFY
3. `changes_schema = true` AND `scope = global` → minimum RATIFY
4. `changes_schema = true` AND `scope = project` → minimum COMMIT
5. `risk_class = high` → minimum COMMIT
6. `data_sensitivity IN (student, personal)` → minimum COMMIT + forced dry-run
7. `risk_class = normal` → minimum DELIBERATE
8. `risk_class = trivial` → no floor (CONSULT OK)

Plus an additive constraint: if `data_sensitivity` is `student` or `personal`, `dry_run = ON` regardless of which rule set the floor.

The floor cascade is a pure function. No inference. No heuristics. It reads what Ed declared and computes the result.

**Critical precondition:** The floor cascade is only active when the manifest is `ho_qualified`. Draft manifests (including auto-generated stubs) bypass the cascade entirely.

### Layer 3: Pacing (When Ed Is In the Loop)

**v0 (ships now):** Every invocation is single-turn. Ed runs the command, gets one response, decides what to do next. Optional `--churn N` lets Ed opt into multi-turn operation with a counter-based budget.

**v0.5 (ships later):** Autonomous churn orchestration. Agents chain turns until a trigger fires, then stop and surface a structured package for Ed to review. Full surface protocol with provenance maps, unchallenged-claim flags, and the articulation gate.

---

## The Seven Manifest Fields

These are the fields Ed sets by hand. The tool never generates or infers them.

| Field | Type | What It Controls |
|-------|------|-----------------|
| `manifest_status` | `draft` or `ho_qualified` | Whether the floor cascade is active and whether COMMIT/RATIFY are available |
| `mode` | `consult`, `deliberate`, `commit`, `ratify` | Ed's chosen ceremony level |
| `risk_class` | `trivial`, `normal`, `high`, `critical` | Ed's assessment of decision criticality. Feeds the floor cascade. |
| `scope` | `project` or `global` | Whether this affects one repo or the protocol stack / multiple projects. Required when `changes_schema` or `changes_protocol` is true. |
| `changes_schema` | boolean | Does this deliberation propose Sanity schema changes? |
| `changes_protocol` | boolean | Does this deliberation propose protocol stack changes? |
| `touches_secrets` | boolean | Does the context include secrets, tokens, or credentials? |
| `data_sensitivity` | `public`, `internal`, `student`, `personal` | Classification of data flowing through the deliberation. `student`/`personal` force dry-run. |

---

## Manifest Qualification (The Anti-Rubber-Stamp Gate)

Auto-generated manifests must not count as HO intent. A manifest starts as `draft` and becomes `ho_qualified` only when Ed performs three specific edits:

1. Removes the `[auto-generated]` tag
2. Sets `manifest_status` to `ho_qualified`
3. Explicitly sets `risk_class` (may still be `normal`, but must be a conscious choice)

This is a deterministic three-field check. No inference. The purpose: prevent the tool from generating a stub with `risk_class: normal`, Ed not noticing, and the cascade treating that as Ed's assessment.

**What each state enables:**

| State | Available Modes | Floor Cascade | Enforcement |
|-------|----------------|---------------|-------------|
| `draft` | CONSULT, DELIBERATE only | Disabled | Mechanical-metric warnings only |
| `ho_qualified` | All four modes | Active | Full floor cascade + validation rules |

---

## Config Inheritance (CSS-Style Cascade)

Every setting resolves through a four-level value cascade. Most specific wins.

```
1. Tool defaults           → built-in fallbacks (hardcoded)
2. transport.config.yaml   → project-wide defaults (committed to git)
3. Manifest fields         → per-deliberation overrides
4. CLI flags               → per-invocation overrides (most specific)
```

After value resolution, two enforcement layers apply:

```
5. Floor cascade           → minimum mode; requires --override-risk to go below
6. Validation rules        → hard refusal; no override possible
```

Every resolved value prints its source in the invocation log. Ed never has to guess where a value came from.

### Project Config: `transport.config.yaml`

Lives at repo root. Committed to git. Four fields:

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `cost_cap_usd` | number | Yes | Per-invocation cost cap in USD |
| `token_cap` | number | Yes | Per-invocation input token cap |
| `consult_escalation_threshold` | integer | Yes | Nudge after N CONSULT invocations (0 to disable) |
| `default_model` | string | No | Default `--model` if not specified elsewhere |

Caps are always explicit. Even if permissive, they make cost bounds visible on every invocation.

---

## Cap Enforcement (Mode-Dependent)

Token and cost caps behave differently depending on mode:

| Mode | Cap behavior |
|------|-------------|
| CONSULT | Warn if exceeded. Do not block. |
| DELIBERATE | Warn if exceeded. Do not block. |
| COMMIT | Hard stop. Tool refuses to call the provider. |
| RATIFY | Hard stop. Plus: RATIFY clamps token cap to `min(resolved_token_cap, 50000)` — even if config says 100K, RATIFY caps at 50K unless `--override-risk acknowledge` is passed. |

Caps are enforced against pre-call estimates. Actual post-call costs are logged but not retroactively enforced.

During `--churn N`: in warn-only modes, a cap hit completes the in-flight turn but stops additional churn turns from starting. In hard-stop modes, the tool refuses to call the provider at all.

---

## The Override Mechanism

If Ed's chosen mode is below the computed floor, the tool refuses — unless Ed passes `--override-risk acknowledge`. This isn't punishment. It's an audit trail. The override is recorded as a structured log entry with the computed floor, requested mode, and override flag.

Ed might have good reasons to run below the floor. The spec doesn't prevent that. It makes it visible and recorded.

---

## Warnings and Nudges

### Size-Based Warnings (Non-Blocking)

- Log over 500 lines in CONSULT → suggests DELIBERATE
- Estimated tokens over 80K → suggests reducing context
- Tokens or cost over cap → warning (CONSULT/DELIBERATE) or hard stop (COMMIT/RATIFY)

### CONSULT Escalation Nudge

The tool counts CONSULT invocations per dialogue file by matching structured log entries it writes itself. When the count exceeds the threshold (default: 3), it prints an advisory suggesting DELIBERATE.

Counter-based. Non-blocking. Set threshold to 0 to disable.

### Safety Warnings (All Modes)

`touches_secrets` and `data_sensitivity` warnings fire in all modes including CONSULT. "Manifest ignored in CONSULT" means the floor cascade and validation rules don't apply — but safety-relevant fields are always read.

---

## Validation Rules (Hard Refusal — No Override)

These are not warnings. The tool refuses to proceed.

- COMMIT/RATIFY with no manifest or a draft manifest → error
- `changes_schema: true` or `changes_protocol: true` without `scope` → error
- RATIFY without ECM in manifest → error

---

## v0 Surface Triggers (What Can Stop Churn)

When Ed uses `--churn N`, these triggers stop the tool before the budget is exhausted. All are deterministic.

| Trigger | Mechanism |
|---------|-----------|
| Churn budget exhausted | Counter |
| Cost cap exceeded | Per-invocation estimate comparison |
| Token cap exceeded | Tokenizer estimate |
| `[REQUEST_HO]` in agent output | Regex match |
| `UG_CLOSING` / `AG_CLOSING` in log header | String match |
| CONSULT escalation nudge | Counter (advisory only, non-stopping) |

---

## What Remains Deliberately Manual

| Activity | Why Manual | What the Tool Provides Instead |
|----------|-----------|-------------------------------|
| Deciding when to escalate mode | Ed may sense something metrics don't catch | Escalation nudge after 3+ CONSULT invocations |
| Challenging agent claims | Judgment | Verification flags in COMMIT/RATIFY output |
| Articulating understanding | Must be Ed's words | Mirror/probe behavior at the gate |
| Writing `UG_CLOSING` / `AG_CLOSING` | Ed decides when a gate is approaching | Tool matches the marker and stops churn |
| Accepting or rejecting gate closure | Human checkpoint | Unresolved flags surfaced in output |
| Overriding ceremony | Ed's risk tolerance | `--override-risk acknowledge` with audit trail |

---

## Design Principles

1. **Named for what Ed is doing.** Modes are operational commitment, not abstract severity.
2. **Ladder, not cage.** Lower modes are not worse.
3. **Deterministic enforcement only (v0).** No inference. If a field is missing, warn or refuse — never guess.
4. **Separation of concerns.** HO declares intent. Tool computes metrics. Enforcement is the intersection.
5. **Three layers, not one.** Modes, floors, and pacing are independent.
6. **The agent is a mirror, not a ghostwriter.** At surface points, articulation must be Ed's words.
7. **One fork point at a time.** Batch logistics in a single message, but isolate questions that would materially change the spec.

---

## What v0 Does Not Do (The Boundary)

- No semantic detection (doesn't read dialogue content to guess risk)
- No auto-tagging (doesn't suggest `changes_schema: true` from keywords)
- No risk inference (missing `risk_class` defaults to `normal` with a warning)
- No autonomous churn orchestration (single-turn by default; `--churn N` is an opt-in counter)
- No surface packages or provenance maps (v0.5)
- No correction loop for opening distillation (v1+)

The v0 principle: **the tool enforces what Ed declares, not what it guesses.**

---

## Open Items

| Item | Status |
|------|--------|
| Billing model heterogeneity | Noted. `cost_cap_usd` assumes per-token billing. Claude Code (subscription) has no per-invocation cost. Token caps still apply. Design question for v0.5: should config support a `billing_model` field? |
| Opening distillation (v0 scope) | Agreed: v0 distillation produces decision question + key turns + uncertainties. No proposed risk tags (those feed enforcement and violate the v0 boundary). |
| v0.5 pacing | Specified for design continuity. Ships after single-turn transport is proven. |

---

## The Internal Architecture

The CLI is a single entry point (`deliberate`) that composes four internal modules:

```
deliberate (CLI entry point)
  |-- lib/distill.mjs    (--distill: question + turns + uncertainties)
  |-- lib/enforce.mjs    (manifest + floors + validation)
  |-- lib/transport.mjs  (context assembly + API call)
  |-- lib/pace.mjs       (v0: single-turn; v0.5: churn/surface)
```

Single command for the user. Modular internals for testing and separation of concerns.

---

## Protocol Compliance

- **LCE:** All modes produce artifacts with timestamps. Even CONSULT persists output. Override records are themselves artifacts.
- **Black Flag:** No mode infers silently. CONSULT carries no verification flags — honest, not negligent. Higher modes require them.
- **Human-in-loop:** No mode enables autopilot. Gate closure always requires Ed. The articulation gate requires Ed to restate the decision in his own words.

---

## The Time Commitment

| Mode | Approximate Ed time per invocation |
|------|------------------------------------|
| CONSULT | ~30 seconds (run command, read output) |
| DELIBERATE | ~5-10 minutes (review output, optionally qualify manifest) |
| COMMIT | ~15-30 minutes (write manifest, review flags, update headers) |
| RATIFY | ~30-60 minutes (full ceremony, ECM, dry-run review, articulation gate) |
