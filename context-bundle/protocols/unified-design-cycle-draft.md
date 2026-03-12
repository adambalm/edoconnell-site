# Unified Design Cycle Protocol (Draft)

> **Source:** Basic Memory (`proposals/unified-design-cycle-protocol-draft-proposal`)
> **Status:** draft — requires HO review and approval before becoming canonical
> **Valid from:** 2026-02-27
> **Last verified:** 2026-02-27
> **Bundle version:** 2026-02-27

**Purpose:** Single reference document for running a full human-AI collaborative design cycle. Consolidates Lanesborough Protocol, Skill Forge Pattern, Language-Constrained Execution, Black Flag Protocol, and Temporal Validity Protocol into one operational specification.

**Origin:** Synthesized from protocol stack deep inventory + specification engineering gap analysis + automation/repeatability analysis, February 2026.

---

## What This Document Replaces

This document is intended to **consolidate** the following into a single operational reference:

| Source Document | What This Document Inherits |
|----------------|---------------------------|
| Lanesborough Protocol | Roles (HO, GA, IA), deliberation structure, handshake convergence, log rules |
| Skill Forge Pattern | Articulation Gate, skill extraction, amortization, heterogeneous model requirement |
| Language-Constrained Execution | Core axiom, Proposer/Inspector/Registrar/Executor roles, OVG, PRT provenance |
| Black Flag Protocol | Epistemic hygiene clauses (all 17), confidence signaling, escalation thresholds |
| Temporal Validity Protocol | Document lifecycle, supersession chains, staleness detection |
| LCE-Lanesborough Mapping | Formal FSM, PRT schema, gate-to-state transformation |

**What is genuinely new** (not in any source document):

1. ELICITING state (Requirements Elicitation Phase)
2. Task Acceptance Criteria (TAC) format
3. Engagement Constraint Manifest (ECM)
4. Execution Decomposition Template (EDT)
5. Consolidated verification marker vocabulary
6. Unified escalation rules

---

## Roles

### Core Roles (from Lanesborough)

| Role | Function | Authority |
|------|----------|-----------|
| **HO** (Human Orchestrator) | Defines goals, sets constraints, grants gate approvals, exercises judgment | Supreme |
| **GA** (Generalizing AI) | Architect — produces proposals, plans, skill drafts | None (Proposer) |
| **IA** (Inspecting AI) | Ground truth — paraphrases, challenges, validates, executes | None for claims; High for tool use |

### Functional Roles (from LCE)

| Functional Role | Capability | Authority | Typical Holder |
|----------------|------------|-----------|----------------|
| **Proposer** | Generates language | None | GA, IA |
| **Inspector** | Produces artifacts from reality | High | Tools, IA (when running tools) |
| **Registrar** | Writes immutable facts derived from artifacts | Absolute | PRT, Basic Memory |
| **Executor** | Performs actions using registered facts | Absolute | IA + Tools |

**Critical insight:** IA's adversarial paraphrase is Proposer activity, not Inspector activity. Only tool output has Inspector authority over scalars.

**HO's special status:** HO transcends the functional role structure. HO can override any gate, certify any scalar (with `human:attested` provenance), and exercise judgment that no protocol can automate.

---

## Finite State Machine

```
ELICITING
  | [Requirements Summary produced, zero NEEDS_CLARIFICATION markers]
INIT
  | [ECM produced, artifact inspection complete, all scalars registered]
OVG_CLOSED
  | [zero [assumed] scalars in PRT]
PRT_LOCKED
  | [GA paraphrase + IA paraphrase exist, all verification flags responded to]
UG_CLOSED
  | [all [contradicts] resolved or marked [unresolved:accepted], handshake achieved]
AG_CLOSED
  | [Implementation Plan produced, TAC defined per task, Articulation Gate cleared by HO]
PLAN_LOCKED
  | [EDT produced, subtasks decomposed with dependencies, HO approves execution]
EXECUTING
  | [all subtask acceptance criteria met, all deliverables exist]
COMPLETE
  | [SEG checklist passed, skills written with provenance]  (Skill Forge only)
EXTRACTING
  | [>=1 skill artifact written, each references engagement artifacts]
SKILL_FORGE_COMPLETE
```

### Transition Rules (Hard)

- **No backward transitions** — ever. If a problem is discovered, the protocol resets to the appropriate earlier state.
- **No skipping states** — every state must be entered and exited via its defined transition.
- **Scalar mutation after PRT_LOCKED** -> reset to OVG_CLOSED
- **Plan edit after PLAN_LOCKED** -> reset to AG_CLOSED
- **Subtask failure during EXECUTING** -> subtask loops, unless failure reveals a plan-level problem (then reset to AG_CLOSED)

### When to Use Full vs. Abbreviated Cycles

| Problem Type | States Used | Skip |
|-------------|------------|------|
| Novel problem requiring multi-agent deliberation | All states | Nothing |
| Known problem with existing skill | ELICITING -> INIT -> EXECUTING -> COMPLETE | OVG through AG |
| Simple task with clear requirements | INIT -> EXECUTING -> COMPLETE | ELICITING, OVG, deliberation |
| Skill Forge extraction cycle | All states + EXTRACTING -> SKILL_FORGE_COMPLETE | Nothing |

**Rule:** When in doubt, use the full cycle.

---

## Phase 1: ELICITING (NEW)

**Purpose:** Transform vague intent into actionable requirements before deliberation begins.

**Process:**
1. HO states intent (may be vague)
2. Agent asks structured questions, max 3 per turn:
   - **Scope:** "What is in scope? What is explicitly out of scope?"
   - **Constraints:** "What must be true? What must not happen?"
   - **Success:** "How will you know this is done?"
   - **Stakeholders:** "Who uses this? Who reviews this? Who approves?"
3. Agent produces Requirements Summary with `[NEEDS_CLARIFICATION: specific question]` markers
4. HO reviews, resolves markers
5. Iterate until zero markers remain

**Transition:** ELICITING -> INIT when `Open questions: []` is empty.

---

## Phase 2: INIT

**Purpose:** Establish engagement parameters, inspect source artifacts, register verified scalars.

**Artifacts produced:**

### Engagement Constraint Manifest (ECM) — NEW

```yaml
engagement: "[engagement name]"
constraints:
  - rule: "[constraint description]"
    severity: MUST | MUST_NOT | SHOULD | ESCALATE
    provenance: "[source: incident, decision, policy]"
inherits:
  - "Black Flag Protocol (all clauses)"
  - "LCE core axiom"
```

### Parameter Reconciliation Table (PRT)

```yaml
parameters:
  [scalar_name]:
    value: [value]
    unit: [unit]
    provenance: verified:artifact | derived | human:attested
    source: [artifact path or reference]
    extracted_at: [ISO 8601 timestamp]
```

**Transition:** INIT -> OVG_CLOSED when all artifacts inspected, all scalars registered, ECM produced.

---

## Phase 3: Deliberation (OVG_CLOSED -> AG_CLOSED)

### Understanding Gate (UG)

**Process:**
1. GA produces initial proposal
2. IA paraphrases with verification flags: `[verified]`, `[contradicts: X]`, `[cannot verify: Y]`, `[unverifiable]`, `[unresolved]`
3. GA responds to each flag
4. IA confirms paraphrase captures consequences

**UG closes when:** All flags addressed (not when all green).

### Agreement Gate (AG)

**Process:**
1. IA delivers substantive critique (only after UG closed)
2. GA paraphrases critique with flags; IA confirms
3. Iterate until: Summary of Agreement + "Agreed." from both parties

**AG closes when:** All `[contradicts]` resolved, zero `[assumed]` scalars, handshake achieved, ECM compliance verified.

---

## Phase 4: Planning (AG_CLOSED -> PLAN_LOCKED)

### Articulation Gate (Skill Forge Only)

HO must restate the core decision in their own words before approving. This is a **gate**, not a production step.

### Task Acceptance Criteria (TAC) — NEW

Each implementation step gets acceptance criteria:

```yaml
task: "[task description]"
acceptance:
  - condition: "[what must be true when done]"
    type: artifact-verifiable | scalar-verifiable | human-attestable
ambiguity_markers: []  # must be empty before PLAN_LOCKED
```

**Transition:** AG_CLOSED -> PLAN_LOCKED when Implementation Plan produced, TAC defined, zero ambiguity markers.

---

## Phase 5: Execution (PLAN_LOCKED -> COMPLETE)

### Execution Decomposition Template (EDT) — NEW

```yaml
execution_plan:
  - id: E1
    task: "[specific action]"
    owner: [agent]
    depends_on: []
    parallel_group: [A | B | null]
    acceptance: "[from TAC]"
    verification: artifact | scalar | human
    status: pending | executing | passed | failed
```

### Execution Rules

- Execute subtasks in dependency order
- After each subtask, verify acceptance criteria
- If subtask fails: loop that subtask
- If failure reveals plan-level problem: reset to AG_CLOSED
- No gate discussion during execution; no execution during gate discussion

---

## Phase 6: Skill Extraction (COMPLETE -> SKILL_FORGE_COMPLETE)

Skill Forge cycles only. Extract reusable skills with provenance.

---

## Epistemic Hygiene (Black Flag Protocol — Always Active)

### Verification Rules
1. **No Hallucination Pass** — never state uncertain information as fact
2. **Verify Before Assert** — if a claim can be verified, verify it
3. **Source Attribution** — indicate source: memory, search, inference, tool
4. **Contradiction Flagging** — flag contradictions, don't silently choose

### Confidence Signaling
- **Certain:** Direct verification performed
- **Confident:** Strong inference from verified facts
- **Uncertain:** Reasonable inference, unverified
- **Speculating:** Guessing, flagged as such

### The Three Questions
1. "Did I inspect or assume?" — If assumed -> run a tool
2. "Can I cite the artifact?" — If no -> don't write the claim
3. "Is this in the right state?" — If executing -> no gate discussion

---

## Context Loading Guide

| State | Load Into Context |
|-------|------------------|
| ELICITING | This document (sections: Roles, ELICITING phase) |
| INIT | This document + project CLAUDE.md + MEMORY.md |
| OVG_CLOSED -> AG_CLOSED | This document (Deliberation section) + PRT + ECM |
| AG_CLOSED -> PLAN_LOCKED | This document (Planning section) + agreed architecture |
| PLAN_LOCKED -> EXECUTING | EDT + TAC + ECM (not full deliberation history) |
| COMPLETE -> EXTRACTING | This document (Extraction section) + engagement log |

---

## Open Questions for HO Review

1. **LCE applicability scope:** Is OVG mandatory for ALL engagements, or only for those involving verifiable technical parameters?
2. **Articulation Gate scope:** Currently Skill Forge only. Should it apply to all Lanesborough engagements?
3. **EDT granularity threshold:** How fine should subtask decomposition go? Proposed: 3-10 subtasks per phase.
4. **Log naming convention:** Should logs be called "engagement log," "dialogue log," or something else?
5. **Skill Forge "draft" status:** The Skill Forge Pattern document has `status: draft` but is treated as canonical. Should it be promoted?
