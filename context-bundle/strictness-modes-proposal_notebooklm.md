# Strictness Modes — Transport CLI Enforcement Spec (v0)

> **Note:** This is the read-aloud version of the spec, formatted for NotebookLM audio. Role abbreviations are spelled out in running prose. The canonical spec is `strictness-modes-proposal.md`.

> **Version:** 0.5.6-notebooklm
> **Date:** 2026-03-01
> **Status:** Orchestrator-directed v0 — deterministic enforcement, manifest qualification gate, v0/v0.5 pacing split resolved, CONSULT default, config schema formalized, mode-dependent cap enforcement, IA inspection findings resolved (v0.5.3), no semantic inference. **v0.5.5: Background section added. v0.5.6: IA precision pass on Background — softened overclaims, defined gate closure semantics, scoped "significant action," removed unverifiable etymology.**
> **Scope:** Cross-project. Applies to any transport CLI invocation across GLOBAL protocol pack + PROJECT overlays.
> **Prior art:** Unified Design Cycle abbreviated cycles, ECM (Engagement Constraint Matrix) severity levels, TAC (Test/Acceptance Criteria) verification types, LCE (Language-Constrained Execution) enforceability tiers. None defined switchable modes — this spec synthesizes them.
> **Human Orchestrator decision:** Deterministic escalation via explicit tags + `scope` field. No guessing. Future semantic layer may propose tags; the Human Orchestrator must accept them explicitly before enforcement applies.

---

## Background: Protocols and Terminology

This spec references governance protocols and patterns developed for human-AI collaborative workflows. Each is summarized here so the spec can be read without prior familiarity with the system.

### Multi-Agent Deliberation Protocol (Lanesborough)

Complex decisions are made through structured multi-agent deliberation with three roles:

- **Human Orchestrator:** The human operator who conducts the process. Sets goals, grants approvals, intervenes at impasses, and makes final decisions.
- **Generalizing AI (GA):** The architect. Proposes plans, abstractions, and high-level approaches.
- **Inspecting AI (IA):** The ground-truth checker. Paraphrases GA proposals, challenges assumptions, validates against concrete evidence, and executes tests.

Deliberation proceeds through a refinement loop: GA proposes, IA mirrors and counters, GA refines. The loop continues until a handshake or a Human Orchestrator intervention trigger (e.g., an impasse, or an optional max-iteration policy if configured).

Progress is tracked through a **finite state machine (FSM)** with two key gates:

| Gate | What It Tests | States |
|------|--------------|--------|
| **Understanding Gate (UG)** | Has the IA demonstrated understanding of the GA's proposal? | `UG_OPEN` → `UG_CLOSING` → `UG_CLOSED` |
| **Agreement Gate (AG)** | Have GA and IA reached consensus? | `AG_OPEN` → `AG_CLOSING` → `AG_CLOSED` |

UG is satisfied when the IA can paraphrase the proposal AND enumerate open verification flags (contradictions, cannot-verify items, and uncertainties) without papering over them. Agreement may include unresolved items that are explicitly logged and accepted by the Human Orchestrator as risks or open questions; `AG_CLOSED` does not imply certainty.

Additional FSM states referenced in this spec:
- **`PLAN_LOCKED`:** The plan has been finalized and locked. No further plan changes without explicitly re-opening AG (Orchestrator-controlled) and recording the change in the log.
- **`EXECUTING`:** Implementation is underway based on the locked plan.

Gate closure requires explicit handshake markers in the deliberation log. The the Human Orchestrator must approve execution after the Agreement Gate closes.

### Epistemic Hygiene Protocol (Black Flag)

Rules preventing unverified claims from propagating as facts across agents:

- **Source hierarchy:** Primary sources (direct observation, official docs) outrank secondary (cross-referenced inference) and tertiary (single-agent opinion).
- **Verify before assert:** If a claim can be checked (file exists, command works), it must be checked before being stated as fact.
- **Uncertainty signaling:** Agents state confidence levels — certain, confident, uncertain, or speculating.
- **No silent failures:** Failed operations are reported explicitly, never hidden.
- **Contradiction flagging:** Conflicting information is surfaced to the Human Orchestrator rather than silently resolved by an agent.

The name is a shorthand: claims without proper backing receive no automatic trust.

### Artifact-Grounded Execution (Language-Constrained Execution / LCE)

LCE divides enforcement into three tiers based on what can actually be mechanically verified:

| Tier | ~Proportion | Examples in This Spec |
|------|------------|----------------------|
| **Mechanical** (tool-enforceable) | 70-75% | Floor cascade, token caps, validation rules, log format |
| **Gated** (requires human checkpoint) | 15-20% | Articulation gate, manifest qualification |
| **Irreducibly human** | 5-10% | Judging quality, assessing risk, deciding intent |

**Core axiom:** Every significant action (mode changes, floor/override decisions, gate state transitions, execution starts, and state-changing writes) must produce an **artifact** — a log entry, a file, a record with bytes that persist. If it persists, it's auditable. If it doesn't, it isn't enforceable.

### Reusable Skill Extraction (Skill Forge)

A meta-pattern for converting one-time problem-solving into reusable instructions. After completing a deliberation, the knowledge that worked is extracted into a documented skill stored in the knowledge base. Future sessions prefer executing the extracted skill instructions, unless conditions drift or constraints change enough to justify re-deliberation. This amortizes the cost of full deliberation: the first engagement is expensive (multi-agent, human gates), but subsequent uses are cheap (read instructions, execute steps).

### Acronym Reference

| Acronym | Full Name | Purpose |
|---------|-----------|---------|
| **ECM** | Engagement Constraint Matrix | Defines severity levels (MUST / MUST_NOT / SHOULD / ESCALATE) for a deliberation. Prevents constraint violations. |
| **TAC** | Test/Acceptance Criteria | Defines what "done" looks like before work begins. |
| **EDT** | Execution Decision Tree | Maps decision points to expected outcomes before execution begins. |
| **PRT** | Provenance Registration Table | Running record of verified facts with their sources, tagged by verification status (`verified:artifact`, `derived`, `assumed`, `human:attested`). |
| **FSM** | Finite State Machine | The state-tracking mechanism for deliberation gates (UG, AG) and execution phases. |

### The Articulation Gate

A recurring concept throughout this spec. Before a decision is marked canonical (authoritative and citable), the human operator must restate the decision **in their own words**. The agent's role at this point is mirror, not ghostwriter — it reflects, probes, and surfaces contradictions, but never writes the articulation on the operator's behalf. If the operator says "yeah, what you said," the gate has not been passed.

This serves as a cognitive forcing function: it ensures the operator has actually internalized the decision, not merely approved an AI-generated summary.

---

## Design Principles

1. **Named for what Ed is doing.** Modes represent operational commitment, not abstract severity.
2. **Ladder, not cage.** Lower modes are not worse. A phone call doesn't need meeting minutes.
3. **Deterministic enforcement only (v0).** The tool reads explicit fields from the manifest. It never infers risk class, scope, or schema impact. If a field is missing, the tool warns or refuses — it does not guess.
4. **Separation of concerns.** the Human Orchestrator declares intent (manifest fields). Tool computes metrics (log size, tokens, cost). Enforcement is the intersection: declared intent sets floors, computed metrics trigger warnings.
5. **Three layers, not one.** Modes set ceremony per deliberation. Floors enforce minimum ceremony from manifest tags. Pacing controls when Ed is in the loop vs. when agents churn autonomously. All three are explicit and deterministic.
6. **The agent is a mirror, not a ghostwriter.** At surface points, the agent reflects Ed's intent back to him for sharpening. The articulation must be Ed's words. If the agent writes it and Ed approves it, the gate hasn't been passed.
7. **One fork point at a time.** Agents may batch logistics (format preferences, delivery method, minor clarifications) in a single message. But when the next the Human Orchestrator's response would materially change the spec — defaults, floors, enforcement semantics, artifact structure, or gate advancement — isolate that question. The rule prevents accidental commitment at AI speed without creating procedural friction on non-binding exchanges. When in doubt whether something is a fork point, isolate it.

---

## A) Mode Definitions

### Mode 0: CONSULT (default)

**What Ed is doing:** Asking a model for input. Not making a binding decision.

**When to use:** Quick questions, brainstorming, ad-hoc analysis.

**Analogy:** Phone call. No minutes.

### Mode 1: DELIBERATE

**What Ed is doing:** Running a standard multi-agent deliberation within established patterns. The output guides implementation within existing architecture.

**When to use:** Feature decisions, content strategy, implementation approach. Most structured multi-agent deliberation (Lanesborough) and skill-extraction (Skill Forge) cycles.

**Analogy:** Meeting with notes.

### Mode 2: COMMIT

**What Ed is doing:** Making a decision whose output binds future work. Reversal is possible but costly. Must be traceable.

**When to use:** API design, dependency choices, content model changes within existing schema, cross-project decisions, anything Ed would explain to a future collaborator.

**Analogy:** Signed memo. Filed and referenced.

### Mode 3: RATIFY

**What Ed is doing:** Changing the rules themselves. Schema changes, protocol amendments, architectural foundations.

**When to use:** Sanity schema changes, protocol stack amendments, architecture pivots, anything that invalidates prior deliberation assumptions or requires CLAUDE.md/AGENTS.md/README.md updates.

**Analogy:** Constitutional amendment. Full record, full ceremony.

---

## B) Manifest Fields

### B.1) Orchestrator-Declared Fields (Explicit, Human-Authored)

These are set by Ed in the manifest. The tool reads them; it never generates or infers them.

```yaml
deliberation:
  id: "transport-automation-2026-02-27"
  project_id: "edoconnell-site"
  decision_question: >
    How should we automate the manual copy-paste transport?

  # --- Manifest qualification ---
  manifest_status: ho_qualified  # draft | ho_qualified
  # Remove [auto-generated] tag and set this to ho_qualified
  # to enable enforcement floors and COMMIT/RATIFY modes.

  # --- Strictness fields (all Orchestrator-declared) ---
  mode: deliberate          # consult | deliberate | commit | ratify
  risk_class: normal        # trivial | normal | high | critical
  scope: project            # project | global
  changes_schema: false     # true | false
  changes_protocol: false   # true | false
  touches_secrets: false    # true | false
  data_sensitivity: internal  # public | internal | student | personal
```

**Field definitions:**

| Field | Type | Default | Required? | Description |
|---|---|---|---|---|
| `manifest_status` | enum | `draft` | No | `draft` = auto-generated or not yet reviewed by the Human Orchestrator. `ho_qualified` = the Human Orchestrator has consciously edited and accepted the manifest. See B.3 for qualification rules. |
| `mode` | enum | `consult` | No | the Human Orchestrator's chosen enforcement level. Sets defaults for ceremony requirements. |
| `risk_class` | enum | `normal` + warn | No | the Human Orchestrator's assessment of decision criticality. If missing, defaults to `normal` and tool prints: `WARNING: risk_class not declared, defaulting to 'normal'`. In a `draft` manifest, this is an unqualified default — floors do not enforce it. |
| `scope` | enum | — | **Conditional** | `project` = affects this repo only. `global` = affects protocol pack or multiple projects. **REQUIRED if `changes_schema: true` OR `changes_protocol: true`.** Tool refuses to run if missing when required. |
| `changes_schema` | bool | `false` | No | Does this deliberation propose changes to Sanity schema structure (new types, field changes, removed types)? |
| `changes_protocol` | bool | `false` | No | Does this deliberation propose changes to the protocol stack itself? |
| `touches_secrets` | bool | `false` | No | Does the deliberation context include or reference secrets, tokens, or credentials? |
| `data_sensitivity` | enum | `internal` | No | Classification of data flowing through the deliberation. `student` and `personal` trigger additional safeguards. |

### B.3) Manifest Qualification (Human Orchestrator Decision: Qualifying Act = Manual Edit)

A manifest exists in one of two states:

| State | How It Gets There | What It Enables |
|---|---|---|
| **`draft`** | Auto-generated by tool, or created by the Human Orchestrator but not yet qualified | CONSULT and DELIBERATE only. Floor cascade **disabled**. Tool prints mechanical-metric warnings only. |
| **`ho_qualified`** | the Human Orchestrator manually edits the manifest (see qualifying act below) | All modes. Floor cascade **active**. COMMIT and RATIFY unlocked. |

**The qualifying act** is a deliberate manual edit. A manifest becomes `ho_qualified` when ALL of the following are true:

1. The `[auto-generated]` tag is removed (if it was present).
2. `manifest_status` is set to `ho_qualified`.
3. `risk_class` is explicitly set (may still be `normal`, but it must be a conscious choice, not an unedited default).

This is deterministic. The tool checks three fields — no inference, no heuristics. Either the manifest passes all three checks or it doesn't.

**Why this exists:** Auto-generated stubs must not count as Human Orchestrator intent. A stub with `risk_class: normal` is not Ed saying "this is normal risk" — it's the tool saying "I don't know, here's a placeholder." The qualifying act forces Ed to touch the manifest before anything binding proceeds. This prevents reword-hacking: the human must perform a minimal, deliberate edit before the system treats the manifest as authoritative.

**Auto-generated stub format:**

```yaml
# [auto-generated] — This manifest was created by deliberate-cli.
# It does NOT represent Human Orchestrator intent. Edit and qualify before using
# COMMIT or RATIFY mode.
deliberation:
  id: "transport-automation-2026-02-28"
  manifest_status: draft
  mode: deliberate
  risk_class: normal  # unqualified default — edit to qualify
```

**Audit trail:**

| Event | Log Entry |
|---|---|
| Stub generated | `### MANIFEST STUB GENERATED` — timestamp, type: housekeeping, author: deliberate-cli |
| Orchestrator qualifies | `### MANIFEST ORCHESTRATOR-QUALIFIED` — timestamp, type: housekeeping, author: deliberate-cli, detected: [auto-generated] removed + manifest_status=ho_qualified + risk_class explicitly set |

### B.2) Mechanical Metrics (Computed by Tool)

These are calculated automatically at invocation. Used for warnings only — they never set enforcement floors. Token and cost estimates are approximate: the tokenizer is implementation-dependent (e.g., `tiktoken` for OpenAI models, provider-specific for others), and cost estimates derive from pricing tables bundled with the tool (which may lag actual provider pricing). Caps are enforced against **pre-call estimates**; actual post-call costs are logged but not retroactively enforced.

```
[deliberate] --- Computed Metrics ---
[deliberate] Log: 1,560 lines / 87,432 bytes
[deliberate] Turns: 8 (last turn by: GA)
[deliberate] Estimated input tokens: ~42,000
[deliberate] Provider/model: openai:gpt-4o
[deliberate] Dry-run: off
[deliberate] Cost estimate: ~$0.12
```

| Metric | Source | Used For |
|---|---|---|
| `log_lines` | `wc -l` on dialogue file | Warning if above threshold |
| `log_bytes` | `stat` on dialogue file | Warning if above threshold |
| `turn_count` | Count of `=== HANDSHAKE TURN` markers | Warning if context selection seems under-scoped |
| `estimated_tokens` | Tokenizer estimate of assembled context | Warn or hard-stop depending on mode (see Section C) |
| `provider` / `model` | From `--model` flag | Logged for audit; used to select API |
| `dry_run` | From mode default + flag override | Controls whether API call is made |
| `cost_cap_usd` | Config cascade (see Section G) | Warn or hard-stop depending on mode (see Section C) |

---

## C) Requirements by Mode

| Requirement | CONSULT | DELIBERATE | COMMIT | RATIFY |
|---|---|---|---|---|
| **Manifest** | Not enforced (read for safety warnings†) | Optional (auto-stub, `draft` status) | Required + `ho_qualified` | Required + `ho_qualified` + versioned |
| **Header status updates** | Ignored | Optional | Required | Required |
| **Context selection** | Last 3 turns (default) | Last N turns (configurable) | Explicit `context_includes` in manifest | Explicit `context_includes` + full protocol pack |
| **Verification flags** | Not required | Optional (warn if absent) | Required in IA responses | Required in all responses |
| **Dry-run default** | Off | Off | Off (tool prompts on first invocation) | **On** (must pass `--execute`) |
| **Token cap** | Warn if exceeded | Warn if exceeded | **Hard stop** | **Hard stop** (RATIFY clamp: min of resolved `token_cap` and 50K) |
| **Cost cap** | Warn if exceeded | Warn if exceeded | **Hard stop** | **Hard stop** |
| **ECM** (Engagement Constraint Matrix) | Not required | Not required | Recommended (warn if absent) | Required — tool refuses without it |
| **TAC** (Test/Acceptance Criteria) | Not required | Not required | Required before PLAN_LOCKED | Required before AG_CLOSED |
| **PRT** (Provenance Registration Table) | Not required | Optional | Required — `[assumed]` logged | Required — `[assumed]` blocks output |
| **Handshake artifacts** | Not required | Required for gate closure | Required for gate closure | Required + Human Orchestrator articulation |
| **EDT** (Execution Decision Tree) | Not required | Not required | Required before EXECUTING | Required before PLAN_LOCKED |
| **Log format** | Freeform + timestamp | Structured turns (append-only) | Structured turns + manifest cross-ref | Structured turns + manifest + provenance chain |
| **Output persistence** | Append to log or stdout | Append to log | Append to log + gist update | Append to log + gist update + git commit prompt |

**Token cap resolution rule:** The config cascade (Section G) resolves `token_cap` to a single value. In CONSULT/DELIBERATE, the resolved value triggers a warning. In COMMIT, it's a hard stop. In RATIFY, the tool applies a **clamp**: `effective_token_cap = min(resolved_token_cap, 50000)`. This means RATIFY never exceeds 50K even if the config or manifest sets a higher value. To override, use `--token-cap N` (which, being most-specific in the cascade, becomes the resolved value before the clamp applies — but the RATIFY clamp still caps it at 50K unless `--override-risk acknowledge` is passed).

**Manifest "Ignored" in CONSULT:** CONSULT ignores manifest fields for enforcement purposes — floor cascade is not evaluated, validation rules are not applied, and structured ceremony is not required. However, the tool still reads the manifest (if present) for safety-relevant warnings: `touches_secrets` and `data_sensitivity` warnings (F.2) fire in all modes including CONSULT. "Ignored" means "not enforced," not "not read."

---

## D) Deterministic Minimum-Mode Floors

The tool computes a minimum mode from the manifest's Orchestrator-declared fields. This is a pure function — no inference, no heuristics, no model consultation. The cascade evaluates top-to-bottom; first match wins.

**Critical precondition:** The floor cascade is ONLY active when `manifest_status = ho_qualified`. If the manifest is `draft` (including auto-generated stubs), the cascade is bypassed entirely — the tool runs in the Orchestrator-selected mode with no floor enforcement, printing only mechanical-metric warnings. This prevents unqualified defaults from triggering binding ceremony requirements.

### D.1) Floor Cascade

```
PRECONDITION: manifest_status = ho_qualified
  (If draft: skip cascade, use Orchestrator-selected mode, print WARNING)

IF changes_protocol = true
  → min_mode = RATIFY

ELSE IF risk_class = critical
  → min_mode = RATIFY

ELSE IF changes_schema = true AND scope = global
  → min_mode = RATIFY

ELSE IF changes_schema = true AND scope = project
  → min_mode = COMMIT

ELSE IF risk_class = high
  → min_mode = COMMIT

ELSE IF data_sensitivity IN (student, personal)
  → min_mode = COMMIT
  → dry_run = ON (additional safeguard)

ELSE IF risk_class = normal
  → min_mode = DELIBERATE

ELSE (risk_class = trivial)
  → min_mode = CONSULT (no floor)

# Additive constraint (applied AFTER cascade determines min_mode):
IF data_sensitivity IN (student, personal)
  → dry_run = ON (regardless of which cascade rule set min_mode)
```

### D.2) Floor Cascade as Decision Table

For quick reference — same logic, tabular form. **All rows require `manifest_status = ho_qualified`.** If `draft`, cascade is bypassed.

| `changes_protocol` | `risk_class` | `changes_schema` | `scope` | `data_sensitivity` | **min_mode** | **dry_run forced?** |
|---|---|---|---|---|---|---|
| `true` | any | any | any | any | RATIFY | yes (RATIFY default) |
| `false` | `critical` | any | any | any | RATIFY | yes (RATIFY default) |
| `false` | any | `true` | `global` | any | RATIFY | yes (RATIFY default) |
| `false` | any | `true` | `project` | any | COMMIT | if `student`/`personal`† |
| `false` | `high` | `false` | any | any | COMMIT | if `student`/`personal`† |
| `false` | `normal`/`trivial` | `false` | any | `student`/`personal` | COMMIT | **yes**† |
| `false` | `normal` | `false` | any | `public`/`internal` | DELIBERATE | no |
| `false` | `trivial` | `false` | any | `public`/`internal` | CONSULT | no |

†`data_sensitivity IN (student, personal)` forces `dry_run = ON` as an additive constraint, regardless of which cascade rule determined the min_mode.

### D.3) Validation Rules (Deterministic, Hard Refusal)

These are not warnings. The tool refuses to proceed until the condition is met.

| Condition | Error |
|---|---|
| Mode is COMMIT/RATIFY and no manifest exists | `ERROR: {MODE} mode requires an Orchestrator-qualified manifest. Create and qualify one, or use --mode deliberate.` |
| Mode is COMMIT/RATIFY and `manifest_status` is `draft` | `ERROR: {MODE} mode requires an Orchestrator-qualified manifest. Current manifest is draft. Remove [auto-generated] tag, set manifest_status: ho_qualified, and explicitly set risk_class.` |
| Mode is COMMIT/RATIFY and `[auto-generated]` tag still present | `ERROR: Manifest still contains [auto-generated] tag. Remove it and set manifest_status: ho_qualified to use {MODE} mode.` |
| `changes_schema: true` AND `scope` missing | `ERROR: scope is REQUIRED when changes_schema=true. Set scope: project\|global in manifest.` |
| `changes_protocol: true` AND `scope` missing | `ERROR: scope is REQUIRED when changes_protocol=true. Set scope: project\|global in manifest.` |
| Mode is RATIFY and no ECM in manifest | `ERROR: RATIFY mode requires an ECM section. Add engagement constraints or use --mode commit.` |

---

## E) Override Mechanism

If the Orchestrator-selected mode is below the computed floor, the tool refuses unless Ed explicitly acknowledges:

```bash
# Rejected:
deliberate --mode consult --dialogue dialogues/002-transport.md --model openai:gpt-4o
# ERROR: Manifest declares changes_schema=true, scope=project.
# Computed minimum mode: COMMIT. Requested mode: CONSULT.
# To override: add --override-risk acknowledge

# Proceeds with logged warning:
deliberate --mode consult --dialogue dialogues/002-transport.md --model openai:gpt-4o \
  --override-risk acknowledge
# WARNING: Running CONSULT below computed floor COMMIT.
# Override acknowledged by the Human Orchestrator. Logging to deliberation transcript.
```

### Override Audit Record

Appended to the dialogue log as a structured entry (this is an artifact in the LCE sense — it has bytes, it persists, and is therefore auditable):

```markdown
### RISK OVERRIDE

**Timestamp:** 2026-02-27T18:00:00Z
**Type:** housekeeping
**Author:** deliberate-cli (automated)
**Computed floor:** COMMIT (changes_schema=true, scope=project)
**Requested mode:** CONSULT
**Override flag:** --override-risk acknowledge

Human Orchestrator acknowledged running below computed minimum mode.
```

This is an audit trail, not a punishment. Ed might have good reasons. The record ensures the next agent reviewing the log knows the ceremony was consciously reduced.

---

## F) Escalation Advice (Non-Binding Warnings)

These are suggestions based on computed metrics. They never block execution.

### F.1) Size-Based Warnings

| Condition | Warning |
|---|---|
| `log_lines > 500` AND mode is CONSULT | `ADVICE: Log is {N} lines. Consider --mode deliberate for better context handling.` |
| `estimated_tokens > 80000` | `ADVICE: Estimated {N} tokens. Consider --last-turns to reduce context, or raise --token-cap.` |
| `estimated_tokens > token_cap` | `WARNING: Estimated {N} tokens exceeds cap of {cap}. Reduce context or raise --token-cap.` (**hard stop** in COMMIT/RATIFY) |
| `cost_estimate > cost_cap_usd` | `WARNING: Estimated cost ${N} exceeds cap of ${cap}.` (**hard stop** in COMMIT/RATIFY) |

### F.2) Missing-Field Warnings (Non-Blocking)

| Condition | Warning |
|---|---|
| `risk_class` missing | `WARNING: risk_class not declared in manifest. Defaulting to 'normal'.` |
| Mode is DELIBERATE and no manifest | `INFO: No manifest found. Auto-generating stub with [auto-generated] tag.` |
| Mode is COMMIT and `context_includes` missing | `WARNING: COMMIT mode expects explicit context_includes in manifest. Using last-N fallback.` |
| `touches_secrets: true` | `WARNING: touches_secrets=true. Verify no secrets in context before sending. Consider --dry-run.` |

### F.3) CONSULT Escalation Nudge

The tool counts CONSULT invocations per dialogue file. Every invocation appends a housekeeping entry to the dialogue log:

```markdown
### INVOCATION

**Timestamp:** 2026-02-28T14:30:00Z
**Type:** housekeeping
**Author:** deliberate-cli
**Mode:** CONSULT
**Provider/model:** openai:gpt-4o
**Cost estimate:** ~$0.03
```

The tool counts entries where `Mode: CONSULT` to derive `consult_count`. This is deterministic — it's a string match on structured log entries that the tool itself writes. On every run, the tool prints the current count and threshold with source:

```
[deliberate] consult_count: 4                          (source: invocation log)
[deliberate] consult_escalation_threshold: 3           (source: transport.config.yaml)
```

When `consult_count` exceeds the threshold (fires on the 4th+ invocation when threshold = 3):

```
ADVICE: consult_count=4 exceeds threshold=3 (source: transport.config.yaml).
Consider --mode deliberate for structured tracking.
```

Counter-based advisory. Non-blocking. Set threshold to `0` to disable.

| Setting | Default | Override sources (most specific wins) |
|---|---|---|
| `consult_escalation_threshold` | `3` | tool default → `transport.config.yaml` → manifest → `--consult-nudge` flag |

---

## G) CLI Interface

### Basic Usage

```bash
# Default invocation (CONSULT — no --mode needed)
deliberate --dialogue dialogues/002-transport.md --model openai:gpt-4o

# Standard deliberation (explicit mode)
deliberate --mode deliberate --dialogue dialogues/002-transport.md --model openai:gpt-4o

# High-stakes decision
deliberate --mode commit --dialogue dialogues/002-transport.md --model openai:gpt-4o

# Schema/architecture change (dry-run by default)
deliberate --mode ratify --dialogue dialogues/002-transport.md --model openai:gpt-4o
deliberate --mode ratify --dialogue dialogues/002-transport.md --model openai:gpt-4o --execute
```

### Flag Reference

| Flag | Type | Default | Description |
|---|---|---|---|
| `--mode` | enum | `consult` | Enforcement level: `consult\|deliberate\|commit\|ratify` |
| `--dialogue` | path | (required) | Dialogue log file |
| `--model` | `provider:model` | (required) | Target model (e.g., `openai:gpt-4o`, `google:gemini-2.5-pro`) |
| `--manifest` | path | auto-detect | Manifest file path (overrides auto-detection from dialogue header) |
| `--dry-run` | boolean | mode-dependent | Show assembled context + prompt without sending |
| `--execute` | boolean | — | Override dry-run default in RATIFY mode |
| `--last-turns` | number | mode-dependent | Include only last N turns in context |
| `--token-cap` | number | mode-dependent | Input token cap. Overrides `token_cap` from config/manifest. |
| `--cost-cap` | string | — | Max cost per invocation (e.g., `"$0.50"`). Overrides `cost_cap_usd` from config/manifest. |
| `--override-risk` | `acknowledge` | — | Acknowledge running below computed minimum mode |
| `--context-includes` | paths | manifest value | Explicit file list for context (comma-separated) |
| `--require-flags` | boolean | mode-dependent | Require verification flags in model output |
| `--consult-nudge` | number | `3` | CONSULT escalation threshold override. Set to `0` to disable. |

### Config Inheritance (Most Specific Wins)

Every setting in the transport CLI resolves through a CSS-style cascade. Most specific wins. No silent defaults — every resolved value prints its source.

**Value resolution cascade:**

```
1. Tool defaults           → built-in fallbacks (hardcoded)
2. transport.config.yaml   → project-wide defaults (committed to git, repo root)
3. Manifest fields         → per-deliberation overrides (dialogue-local)
4. CLI flags               → per-invocation overrides (most specific)
```

**Enforcement (applied after value resolution):**

```
5. Floor cascade           → hard minimum; requires --override-risk to go below
6. Validation rules        → hard refusal; no override possible
```

**Resolution algorithm:** For each setting, the tool walks the cascade top-to-bottom. The last source that declares a value wins. If no source declares a value, the tool default applies. Enforcement layers 5-6 are not overridable by the value cascade — they are applied after resolution.

**Logged per invocation:** Every resolved value prints `(source: ...)` showing which layer provided it. This makes the cascade observable — Ed never has to guess where a value came from.

### Project Config: `transport.config.yaml`

A single project-level config file at repo root. **Committed to git.** Provides project-wide defaults that apply to all deliberations in this repo. Any key can be overridden by a dialogue-local manifest or CLI flag.

**Schema:**

| Field | Type | Required | Description |
|---|---|---|---|
| `cost_cap_usd` | number | Yes | Per-invocation cost cap in USD. Enforcement varies by mode (see Section C). |
| `token_cap` | number | Yes | Per-invocation input token cap. Enforcement varies by mode (see Section C). |
| `consult_escalation_threshold` | integer | Yes | Nudge after N CONSULT invocations. Set to `0` to disable. |
| `default_model` | string | No | Default `--model` if not specified on CLI or in manifest. Format: `provider:model`. |

**Default config (ships with tool):**

```yaml
# transport.config.yaml — project-wide defaults
# Committed to git. Overridden by manifest fields and CLI flags.
# NOT a secrets file. No keys, no tokens.

cost_cap_usd: 1.00                # per-invocation cost cap in USD
token_cap: 100000                 # per-invocation input token cap
consult_escalation_threshold: 3   # nudge after N CONSULT invocations (0 = disable)
# default_model: "openai:gpt-4o" # uncomment to set project-wide default
```

**Rules:**
- **Caps are always explicit.** `cost_cap_usd` and `token_cap` are required fields. Even if permissive, they make cost bounds visible on every invocation.
- Keep this file small. Only keys that genuinely affect behavior across dialogues.
- The tool reads this at invocation. If the file doesn't exist, tool uses built-in defaults.
- Every resolved value prints its source in the invocation log (see below).
- This is NOT a secrets file. No API keys, no tokens. Safe to commit.

### Invocation Log (Always Printed)

Every invocation prints its resolved configuration with the source of each value. No silent defaults. Caps and thresholds are always visible.

```
[deliberate] --- Configuration ---
[deliberate] Mode: COMMIT                          (source: CLI flag)
[deliberate] Config: transport.config.yaml         (found)
[deliberate] Manifest: deliberations/transport-automation_manifest.yaml
[deliberate] Manifest status: ho_qualified
[deliberate] risk_class: high                      (source: manifest)
[deliberate] scope: project                        (source: manifest)
[deliberate] changes_schema: false                 (source: manifest)
[deliberate] changes_protocol: false               (source: manifest)
[deliberate] data_sensitivity: internal            (source: transport.config.yaml)
[deliberate] Computed floor: COMMIT (risk_class=high)
[deliberate] Floor satisfied: yes
[deliberate] --- Caps & Thresholds ---
[deliberate] cost_cap_usd: 1.00                    (source: transport.config.yaml)
[deliberate] token_cap: 100000                     (source: transport.config.yaml)
[deliberate] consult_escalation_threshold: 3       (source: transport.config.yaml)
[deliberate] consult_count: 0                      (source: invocation log)
[deliberate] --- Computed Metrics ---
[deliberate] Log: 1,560 lines / 87,432 bytes / 8 turns
[deliberate] Estimated input tokens: ~42,000
[deliberate] Provider/model: openai:gpt-4o         (source: manifest)
[deliberate] Dry-run: off                          (source: mode default)
[deliberate] Cost estimate: ~$0.12
[deliberate] --- Context ---
[deliberate] context_includes: 3 files from manifest
[deliberate] Verification flags: required (COMMIT mode)
```

Example with no manifest (CONSULT, 4th invocation — nudge fires):

```
[deliberate] --- Configuration ---
[deliberate] Mode: CONSULT                         (source: tool default)
[deliberate] Config: transport.config.yaml         (found)
[deliberate] Manifest: none
[deliberate] --- Caps & Thresholds ---
[deliberate] cost_cap_usd: 1.00                    (source: transport.config.yaml)
[deliberate] token_cap: 100000                     (source: transport.config.yaml)
[deliberate] consult_escalation_threshold: 3       (source: transport.config.yaml)
[deliberate] consult_count: 4                      (source: invocation log)
[deliberate] --- Computed Metrics ---
[deliberate] Log: 320 lines / 18,200 bytes / 3 turns
[deliberate] Estimated input tokens: ~9,000
[deliberate] Provider/model: openai:gpt-4o         (source: transport.config.yaml)
[deliberate] Dry-run: off                          (source: tool default)
[deliberate] Cost estimate: ~$0.03
[deliberate] ---
ADVICE: consult_count=4 exceeds threshold=3 (source: transport.config.yaml).
Consider --mode deliberate for structured tracking.
```

---

## H) Operational Commitment — What Ed Does Differently

### CONSULT: ~30 Seconds

**Ed does:** Run command, read output.
**Ed doesn't do:** Write manifest, track flags, update headers.
**Buys:** Speed. No ceremony.
**Accepts:** Output citable only with `[cannot verify: CONSULT mode]`. Context may be incomplete.

### DELIBERATE: ~5-10 Minutes

**Ed does:** Ensure log header is current. Review output. Optionally write/qualify manifest.
**Ed doesn't do:** Qualify manifest (unless escalating to COMMIT). Write ECM/TAC/EDT.
**Buys:** Structured turns. Auto-stub manifest (draft, no enforcement). Flag warnings catch drift. Mechanical-metric warnings still active.
**Accepts:** Floor cascade disabled on draft manifests — Ed is responsible for choosing the right mode. Context is auto-selected (last-N). "Done" is a judgment call.
**Transition to COMMIT:** When Ed decides the deliberation warrants traceability, he edits the manifest: removes `[auto-generated]`, sets `manifest_status: ho_qualified`, consciously sets `risk_class`. This single act unlocks floors and COMMIT/RATIFY modes.

### COMMIT: ~15-30 Minutes

**Ed does:** Write manifest with `risk_class`, `scope`, `context_includes`, `roles`, `protocol_versions`. Set boolean tags (`changes_schema`, etc.). Review verification flags. Update headers. Write TAC before planning.
**Buys:** Full traceability. Explicit context. Verification catches agent disagreements. TAC defines "done."
**Accepts:** More ceremony per turn. Manual manifest maintenance.

### RATIFY: ~30-60 Minutes

**Ed does:** Full manifest with all fields. Write ECM with severity levels. Review dry-run before every send. Write TAC before agreement (not just planning). Write EDT before execution. Pass Articulation Gate (restate decision in own words). Update gist after state transitions.
**Buys:** Self-contained record. ECM prevents constraint violations. Dry-run forces contact with reality. Articulation Gate ensures understanding, not just approval.
**Accepts:** Significant time. Risk of ceremony fatigue if overused. (This is why RATIFY is not the default.)

---

## I) Pacing Layer

### I.1) v0 Pacing — Single-Turn + Mechanical Triggers

#### The Problem Pacing Solves

Without the tool, transport friction takes an estimated 60-90 minutes per turn (Human Orchestrator estimate, anecdotal — based on manual copy-paste across model UIs during prior deliberations). That friction is annoying, but it forces Ed to engage cognitively — he can't skim past a turn because he has to manually handle it. With the tool, transport takes seconds. The risk is not that the tool auto-chains (it doesn't in v0) — the risk is that Ed chains invocations faster than he can absorb what's coming back.

#### v0 Default: Single-Turn

In v0, every invocation is single-turn. Ed runs the command, gets one response, decides what to do next. There is no autonomous churn — Ed invokes each turn manually.

The `--churn N` flag is available as an opt-in budget: "run up to N turns, then stop." This is a counter, not orchestration — the tool decrements on each turn and stops at zero.

| Command | Meaning |
|---|---|
| `deliberate` (no flag) | Single turn. Ed invokes each turn. |
| `deliberate --churn 4` | Run up to 4 turns, then stop. Stop earlier if a trigger fires. |
| `deliberate --cost-cap "$0.50"` | Single turn. Warn if estimated cost exceeds cap (hard-stop in COMMIT/RATIFY). |

#### v0 Surface Triggers (Mechanical Only)

When Ed uses `--churn N`, these triggers can stop the tool before the budget is exhausted. All are deterministic — no content reading, no inference.

**Cap triggers and mode interaction:** In CONSULT/DELIBERATE (warn-only modes), cap triggers do not block the current provider call — the tool warns and completes the in-flight turn. But they **do** stop additional autonomous churn turns from starting. In COMMIT/RATIFY, cap triggers are hard stops — the tool refuses to call the provider at all. This means `--churn 4` in DELIBERATE mode may complete fewer than 4 turns if a cap is hit, but the turn that hit the cap still completes.

| Trigger | Mechanism | Input |
|---|---|---|
| **Churn budget exhausted** | Counter: decrement per turn, stop at 0 | `--churn N` flag |
| **Cost cap exceeded** | Compare pre-call estimate to `cost_cap_usd`; warn (CONSULT/DELIBERATE) or hard-stop (COMMIT/RATIFY). During `--churn N`, cumulative spend is tracked for reporting only. | `--cost-cap` flag, manifest, or config `cost_cap_usd` |
| **Token cap exceeded** | Tokenizer estimate vs threshold | `--token-cap` flag, manifest, or config `token_cap` |
| **`[REQUEST_HO]` marker** | Regex match: `/\[REQUEST_HO\]/` on agent output | Current invocation response |
| **`UG_CLOSING` / `AG_CLOSING` header** (Understanding/Agreement Gate approaching closure) | String match on dialogue log header | Dialogue file structured header |
| **CONSULT escalation nudge** | Counter: invocations per dialogue file | Invocation history in log (advisory only, non-stopping) |

When a stopping trigger fires, the tool stops and prints why:

```
[deliberate] --- STOPPED ---
[deliberate] Reason: churn budget exhausted (4/4 turns)
[deliberate] Accumulated cost: $0.31
[deliberate] To continue: deliberate --churn N
```

#### What Remains Manual (By Design)

These parts of the system are deliberately not automated. They require human cognition.

| Activity | Why It's Manual | What the Tool Provides Instead |
|---|---|---|
| **Deciding when to escalate mode** | Ed may sense something the metrics don't catch | Turn-count advisory nudge after 3+ CONSULT invocations (F.3) |
| **Challenging agent claims** | Judgment about what matters | Verification flags in agent output (COMMIT/RATIFY) |
| **Articulating understanding** | The whole point is Ed's words, not the agent's | Mirror/probe behavior at the Articulation Gate |
| **Writing `UG_CLOSING` / `AG_CLOSING`** | Ed decides when a gate is approaching | Tool matches the marker and stops churn |
| **Accepting or rejecting a gate closure** | Gates are human checkpoints | Unresolved flags surfaced in agent output |
| **Overriding ceremony** | Ed's risk tolerance for a specific situation | `--override-risk acknowledge` with audit trail |
| **Judging quality and intent** | Irreducibly human (LCE's 5-10%) | Mechanical metrics to surface what needs judging |

### I.2) v0.5 Pacing Roadmap — Churn Orchestration + Surface Protocol

> **Status:** Specified for design continuity. Not implemented in v0. Ships after single-turn transport is proven.

#### Two Rhythms (v0.5)

**Churn mode:** The tool chains turns autonomously. GA proposes, IA inspects, GA responds to flags. Ed doesn't intervene because the agents are doing routine back-and-forth within established parameters. The tool invokes the next turn automatically after each response.

**Surface mode:** The tool stops. Agents produce a structured summary. Ed reads, challenges, articulates, and decides what happens next. One response at a time, orchestrated by Ed.

#### v0.5 Surface Triggers

In addition to the v0 mechanical triggers, v0.5 adds triggers that require cross-turn state tracking or FSM detection:

| Trigger | Condition | Mechanism |
|---|---|---|
| **Gate approach (semantic)** | FSM state is one turn from `UG_CLOSED` (understanding confirmed) or `AG_CLOSED` (agreement reached) | Requires semantic analysis of exchange content |
| **Unresolved contradiction** | A `[contradicts]` flag persists after 2 round-trips | Cross-turn flag state tracking |
| **Convergence failure** | Turn count exceeds 6 without handshake progress | Requires handshake-state tracking |
| **Manifest tag** | `changes_schema: true` OR `changes_protocol: true` | Manifest field read (redundant with floor cascade — may be removed) |

#### v0.5 Pacing Defaults by Mode

| Mode | v0 Default | v0.5 Default |
|---|---|---|
| CONSULT | Single turn | Single turn (unchanged) |
| DELIBERATE | Single turn | `--churn 4` then surface |
| COMMIT | Single turn | `--surface` (one at a time) |
| RATIFY | Single turn + dry-run | `--surface` + dry-run |

Ed can always override: `deliberate --mode ratify --churn 2` runs 2 turns of churn even in RATIFY mode. The tool logs this the same way it logs mode overrides — explicit, recorded, not punished.

#### Surface Protocol (v0.5)

When a surface trigger fires in v0.5, the tool pauses and the surface protocol begins. This is not "agents dump a summary and wait." It's a structured interaction.

**Step 1: Agents deliver the surface package.**

The tool assembles and presents:

```markdown
### SURFACE POINT — [trigger reason]

**Trigger:** Unresolved [contradicts] flag after 2 round-trips (turn 7)
**Turns since last surface:** 4
**Accumulated cost this phase:** $0.08

#### Position Summary
- GA position: [2-3 sentence summary with provenance references]
- IA position: [2-3 sentence summary with provenance references]

#### Provenance Map
| Claim | Status | Source |
|---|---|---|
| "Multi-model support is needed" | [contradicts: evidence] | GA turn 5, challenged by IA turn 6 |
| "Protocol stack is stable enough to parse" | [assumed] | GA turn 3, not challenged |
| "Option 2 effort is 30-60 min" | [verified: artifact] | IA turn 2, cross-ref scripts/ask-ia-stub.mjs |

#### Unresolved Flags
- [contradicts] "FSM-aware context packaging reduces token waste" — GA claims yes (turn 5), IA claims no evidence (turn 6)

#### Since Last Surface
- Claims entered without challenge: 1 ("Protocol stack is stable enough to parse" — [assumed], not yet inspected by IA)
```

**Step 2: Ed challenges.**

Ed reads the surface package. He asks questions: "Where did 'protocol stack is stable enough to parse' come from?" "What artifact backs the 30-60 minute estimate?" The agents answer with artifact references, not assertions. If an agent can't point to an artifact, the claim is downgraded to `[cannot verify]` and logged.

The tool assists by making provenance queries easy:
```bash
# Ed asks about a specific claim during surface mode
deliberate --surface --show-provenance "protocol stack is stable"
# Tool searches log for the claim's origin turn and any challenges
```

**Step 3: Ed articulates.**

Before the agents resume, Ed states — in his own words — what he understands and what he wants the next phase to accomplish. This is the generalized articulation gate.

The agent's role here is **mirror, not ghostwriter:**
- Reflect back: "You said X — does that mean Y or Z?"
- Probe edges: "This implies A — is that intended?"
- Surface contradictions: "Earlier you said B, but now you're saying C. Which one?"
- **Never** write the articulation for Ed. If Ed says "yeah, what you said," the gate hasn't been passed.

Ed's articulation is recorded as an artifact:

```markdown
### HUMAN ORCHESTRATOR ARTICULATION

**Timestamp:** 2026-02-28T10:30:00Z
**Type:** articulation
**Author:** the Human Orchestrator
**Surface trigger:** Unresolved [contradicts] after 2 round-trips

I understand the GA is arguing that context packaging per FSM state will reduce token waste,
but the IA has pointed out there's no evidence of low-quality responses from too much context.
I want the next phase to focus on: what is the actual measured cost of sending the full log
vs. sending last-N turns? Get me numbers, not arguments.
```

**Step 4: Ed releases.**

Ed decides what happens next:

```bash
# Resume churn with a budget
deliberate --churn 4    # "run 4 more turns, then surface"

# Stay in surface mode (Ed orchestrates each turn)
deliberate --surface    # one turn at a time, Ed invokes each

# Resume churn until next trigger
deliberate --churn      # churn until a trigger fires
```

#### Context Hygiene at Surface Points (v0.5)

The surface package is not just a summary. It's a **provenance audit**. The tool's job is to make it hard to accidentally let ungrounded claims through.

At every surface point, the tool:

1. **Presents the PRT state.** Which scalars are `verified:artifact`, `derived`, `assumed`, `human:attested`.
2. **Flags claims resting on `[assumed]` provenance.** These are highlighted, not hidden.
3. **Flags unchallenged claims.** Anything that entered the deliberation after the last surface point and hasn't been inspected by the opposing agent gets a `[unchallenged since turn N]` marker.
4. **Makes "show me the artifact" easy.** Ed can query any claim's provenance chain without digging through the log manually.

The tool doesn't decide what's real and what's fantasy. Ed does. But the tool makes the provenance visible so Ed can't accidentally rubber-stamp something ungrounded.

---

## J) Separation of Concerns (v0 Boundary)

> **v0/v0.5 split:** Section I.1 is v0. Section I.2 is v0.5. v0 pacing is single-turn by default with opt-in `--churn N` (counter-based budget). v0 surface triggers are mechanical only: budget exhausted, cost cap exceeded, token cap exceeded, `[REQUEST_HO]` string match, `UG_CLOSING`/`AG_CLOSING` header match, CONSULT escalation nudge. Churn orchestration, surface packages, provenance maps, and semantic triggers ship in v0.5 after single-turn transport is proven.

### What v0 Does

- Reads Orchestrator-declared manifest fields (explicit tags)
- Computes mechanical metrics from the dialogue file
- Evaluates deterministic floor cascade (pure function, no inference)
- Enforces floors and validation rules
- Enforces cost/token caps as hard stops in COMMIT/RATIFY; warns in CONSULT/DELIBERATE
- Prints warnings from computed metrics
- Logs overrides as artifacts

### What v0 Does NOT Do

- **No semantic detection.** The tool does not read the dialogue content to guess whether schema changes are being discussed.
- **No auto-tagging.** The tool does not suggest `changes_schema: true` based on seeing the word "schema" in the log.
- **No risk inference.** If `risk_class` is missing, it defaults to `normal` with a warning. It does not estimate risk from content.

### NOTE — Semantic Suggestions Are Non-Binding (Design Boundary)

This spec intentionally forbids semantic inference from feeding enforcement in v0.

A future "semantic layer" may be added to propose tags (e.g., `proposed_risk_class`, `proposed_changes_schema`) based on natural-language context. However:
- These outputs are advisory only and MUST be labeled `proposed`.
- They MUST NOT be consumed by the floor cascade, validation rules, or mode enforcement unless the Human Orchestrator explicitly copies/accepts them into the manifest (making them an auditable artifact).
- The transport tool never "auto-escalates" based on inferred risk.

**Rationale:** inference is useful for drafting, but enforcement requires explicit, reviewable declarations to prevent hidden state and accidental commitment.

### Future Semantic Layer (v1+, Not Implemented)

A future version may add an optional semantic layer:

```yaml
# Tool-proposed tags (not yet accepted by the Human Orchestrator):
proposed_tags:
  changes_schema: true    # Detected: "add a new document type" in turn 7
  risk_class: high        # Detected: schema change in project scope
  confidence: 0.85
  source_turn: 7
  source_text: "we should add a new document type for case studies"
```

**Rules for the semantic layer (when implemented):**
1. Proposed tags are **advisory only** — displayed to the Human Orchestrator, never enforced.
2. the Human Orchestrator must explicitly accept a proposed tag into the manifest before the floor cascade uses it.
3. Acceptance is recorded as a housekeeping log entry with provenance: `"Human Orchestrator accepted proposed_tag changes_schema=true from semantic layer (turn 7, confidence 0.85)"`.
4. Rejected proposals are logged too: `"Human Orchestrator rejected proposed_tag risk_class=high — reason: exploratory only"`.
5. The semantic layer is opt-in per project. Projects that don't want it never see it.

This preserves the v0 principle: **the tool enforces what Ed declares, not what it guesses.**

---

## K) Compatibility Notes

### LCE Compliance (Artifact-Grounded Execution)

All modes produce artifacts (appended log entries with timestamps). Even CONSULT persists output. The LCE core axiom — every significant action must produce a persistent, auditable record — is satisfied at every level. Modes vary *how much metadata accompanies the artifact*, not whether it exists. Override records are themselves artifacts.

### Black Flag Compliance (Epistemic Hygiene)

No mode infers anything silently. CONSULT outputs carry no verification flags — this is honest, not negligent. DELIBERATE warns when flags are absent. COMMIT/RATIFY require them. The tool never generates verification flags on behalf of the model.

### Cross-Project Compatibility

Modes are per-invocation (CLI flag) or per-deliberation (manifest `mode` field). The GLOBAL protocol pack doesn't change between modes. A CONSULT in edoconnell-site and a RATIFY in sca-website both reference the same protocol pack by version+hash. The `scope` field declares whether this deliberation affects one project or the global stack.

### Human-in-Loop

No mode enables autopilot. In v0, all modes are single-turn — the operator invokes each turn manually. The `--churn N` budget allows opt-in multi-turn operation with mechanical stop triggers. RATIFY adds dry-run by default. The tool never auto-commits, auto-publishes, or auto-advances gates. Gate closure always requires the operator's presence — in v0, the operator writes `UG_CLOSING` (Understanding Gate approaching) or `AG_CLOSING` (Agreement Gate approaching) in the log header when a gate is approaching, and the tool matches the string and stops. The articulation gate (see Background) requires the operator to restate the decision in their own words before the spec can close.

---

## L) Resolved: Default Mode

**Human Orchestrator Decision:** CONSULT is the default mode for new deliberations.

DELIBERATE is the first conscious step up. The tool's zero-config path is the lightest path — every increase in ceremony is a deliberate act. The CONSULT escalation nudge (F.3) provides a mechanical advisory when Ed has run 3+ CONSULT invocations on the same dialogue file, preventing habituation without adding ceremony to the common case.

---

## M) Open: Billing Model Heterogeneity

**Status:** Noted. Not solved. Target: v0.5+.

`cost_cap_usd` assumes per-token billing, but not all provider paths have per-call costs. Claude Code (subscription), OAuth-delegated models, and future provider arrangements may have no meaningful per-invocation cost. In those cases, `cost_cap_usd` enforces a constraint that doesn't map to reality. Token caps still apply (context window limits are real regardless of billing model).

**Design question for v0.5:** Should `transport.config.yaml` support a `billing_model` field (`per_token | subscription | unknown`) that tells the tool whether cost caps apply?

---

## Internal Abbreviations (Not for Audio)

These abbreviations are used in the canonical spec and codebase for brevity. They are spelled out in this document's running prose.

| Abbreviation | Full Form |
|---|---|
| HO | Human Orchestrator |
| GA | Generalizing AI |
| IA | Inspecting AI |
| UG | Understanding Gate |
| AG | Agreement Gate |
