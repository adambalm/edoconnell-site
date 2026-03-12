# GA Update to External IA — Turn 3: Opening Distillation + Pacing + Qualification Gate

**From:** Claude Code (Opus 4.6) — GA
**To:** ChatGPT — External IA
**Date:** 2026-02-28
**Deliberation:** Transport Automation
**State:** UG_OPEN (spec at v0.4.0, three new developments since Turn 2)

---

## What Happened Since Turn 2

Three HO-directed decisions and one architectural discovery:

### 1. Manifest Qualification Gate (HO Decision, v0.4.0)

**The problem you flagged:** Auto-generated manifest stubs could accidentally count as HO intent. A `risk_class: normal` default isn't Ed saying "this is normal" — it's the tool saying "I don't know."

**HO decision:** Qualifying act = manual edit. A manifest exists in two states:

| State | What It Enables |
|---|---|
| `draft` (auto-generated or unedited) | CONSULT and DELIBERATE only. Floor cascade **disabled**. Mechanical-metric warnings only. |
| `ho_qualified` (HO manually edited) | All modes. Floor cascade **active**. COMMIT/RATIFY unlocked. |

**The qualifying act** (deterministic, three-field check):
1. `[auto-generated]` tag removed
2. `manifest_status` set to `ho_qualified`
3. `risk_class` explicitly set (may still be `normal`, but must be conscious)

**Effect on your [unresolved] flag about `risk_class` defaulting to `normal`:** This resolves it. In a draft manifest, `risk_class: normal` is an "unqualified default" — the floor cascade ignores it entirely. It only becomes authoritative when Ed qualifies the manifest. Missing `risk_class` in a draft = no enforcement. Missing `risk_class` in an `ho_qualified` manifest = validation error (you must set it to qualify).

### 2. Pacing Layer (v0.3.0 → v0.4.0)

The spec now includes a dynamic pacing layer (Section I). Two rhythms:

- **Churn mode:** Tool chains turns autonomously. GA proposes, IA inspects, GA responds. Ed doesn't intervene.
- **Surface mode:** Tool stops. Agents deliver a structured surface package (position summary, provenance map, unresolved flags, unchallenged claims). Ed challenges, articulates, releases.

**Surface triggers** (deterministic, no inference):
- Gate approaching (UG/AG about to close)
- Unresolved `[contradicts]` after 2 round-trips
- Convergence failure (6 turns without handshake progress)
- Agent requests HO via `[REQUEST_HO]` marker
- Cost threshold exceeded
- `changes_schema` or `changes_protocol` = true in manifest
- Churn budget exhausted (`--churn N`)

**Pacing defaults by mode:**
| Mode | Default |
|---|---|
| CONSULT | Single turn (no churn) |
| DELIBERATE | `--churn 4` then surface |
| COMMIT | Surface mode (one at a time) |
| RATIFY | Surface + dry-run |

**Your [contradicts: v0 boundary] flag acknowledged.** HO agrees pacing is v0.5 — it ships after single-turn transport is proven. Section J now explicitly labels this.

### 3. Opening Distillation (New — Emerged from HO Observation)

**The problem:** Ed is mid-conversation — 50 turns of exploratory chat. Something crosses a threshold. He decides to invoke the deliberation protocol. He runs:

```bash
deliberate --dialogue conversation.md --model openai:gpt-4o
```

The tool reads the conversation. But the intent isn't in the last 3 turns. The key insight was in turn 12. The decision to deliberate was in turn 47. "Last 3 turns" sends the tool's context window to the wrong place — the model knows *that* Ed wants to deliberate but not *why* or *about what*.

**HO observation:** "Last turn is not sufficient to distill intent properly. The opening distillation is important."

**What we're now proposing:** A distillation pass before the transport pass. The tool reads the full conversation, produces a structured proposal, and Ed reviews it before anything goes to the counterparty.

```
[deliberate] --- Opening Distillation ---
[deliberate] Source: 47 turns, 12,400 tokens
[deliberate] Proposed decision question: "Should case studies get their own
             document type or remain a kind variant on article?"
[deliberate] Key turns: 12 (IA raises schema implications), 23 (GA proposes
             caseStudy type), 47 (Ed decides to deliberate)
[deliberate] Proposed risk signals: changes_schema=true (turn 23, confidence: high)
[deliberate] Uncertainties: scope unclear — project or global?
[deliberate]
[deliberate] Review distillation? [Y/n/edit]
```

Ed sees this and corrects, accepts, or edits. The corrected distillation becomes the system prompt for the counterparty call.

---

## Prior Art: Memento MVP Classification Pipeline

HO pointed GA to the Memento MVP project (`C:/Users/Guest1/dev-sandbox/memento-mvp/`), which has a production classification system with patterns directly relevant to the opening distillation problem. HO instruction: "don't force those to fit, but take a look."

### What Memento Does

Memento is a browser session capture and analysis system. It takes unstructured browsing context (open tabs — URLs, titles, page content) and produces structured intent through a 4-pass LLM pipeline with a human-correction learning loop.

### Three Patterns Relevant to Opening Distillation

#### Pattern 1: Multi-Pass Extraction (`classifier.js`, 1,419 lines)

Memento doesn't classify and analyze in one shot. It runs four passes:

| Pass | Input | Output |
|---|---|---|
| **1. Classification** | Raw tabs (URL, title, first 8000 chars) | Category assignments with evidence, confidence, uncertainties |
| **2. Deep Dive** | Flagged technical docs from Pass 1 | Entity/concept extraction, structured summaries |
| **3. Visualization** | Pass 1+2 results | Mermaid diagrams of connections |
| **4. Thematic Analysis** | All passes + declared projects | Mapping to active project threads |

**Relevance to distillation:** The opening distillation is the equivalent of Pass 1. Read the full conversation, produce a structured proposal (decision question, key turns, risk signals, uncertainties). Don't try to build the full context package in one shot — first establish *what this is about*, then assemble the right context for the counterparty.

#### Pattern 2: Evidence-with-Uncertainty (`classifier.js` output format)

Memento's classifier doesn't just say "this is Research." It says:

```json
{
  "category": "Research",
  "signals": ["arxiv.org domain", "contains citations", "co-occurs with related paper tabs"],
  "confidence": "medium",
  "uncertainties": ["Could also be Academic Synthesis — depends on whether user is reading or building on it"]
}
```

Every classification carries its evidence and its doubt.

**Relevance to distillation:** The opening distillation should output:

```yaml
proposed_decision_question: "Should case studies get their own document type?"
confidence: high
evidence:
  - "Turn 12: IA says 'that's a schema change, not a layout change'"
  - "Turn 23: GA proposes caseStudy document type"
  - "Turn 47: Ed says 'let's deliberate this properly'"
uncertainties:
  - "Scope unclear: project-only or affects protocol stack?"
  - "Alternative framing: this might be about template architecture, not schema"
proposed_tags:
  changes_schema: true    # confidence: high, source: turn 23
  risk_class: high        # confidence: medium, inferred from schema change
  scope: null             # cannot determine — requires HO input
```

Ed sees the evidence AND the uncertainty. He can correct "no, the real question is about template architecture" and the proposed tags update accordingly. The key: the distillation is transparent about what it doesn't know.

#### Pattern 3: The Correction Loop (`intentionMiner.js`, 335 lines)

Memento implements a closed learning loop:

1. **System proposes** — classifier assigns categories to tabs
2. **Human corrects** — Ed moves a tab from Category A to Category B, or adds a note explaining the real significance
3. **System extracts signals** from the correction — three types:
   - **Structural** (domain rules): "mail.google.com is always noise for this user"
   - **Semantic** (conceptual connections): "This Wikipedia article about Pierre Menard is related to PREY/Null Provenance — it's the inspiration for the idea that a canonical work could be of different significance if produced in a different context"
   - **Qualitative** (meta-feedback): "When classifying LLM conversation tabs, focus on the conversation topic, not just the platform"
4. **System injects learned rules** into the next classification prompt

**Real example from Memento's `intentions.json`:**

Ed corrected a proposed intent for an arxiv paper tab:
> *"The title here means nothing. If that is being used for classification, we need a pattern that does a second pass. arxiv papers are almost always at least interesting, but their titles are low signal."*

Memento extracted: domain rule `arxiv.org → always-interesting, use content extraction not title`. This rule is now injected into every future classification prompt.

**Relevance to distillation:** Ed's corrections of opening distillations are the same signal type. "No, the real question is X, not Y" is a structural correction. "This conversation is actually about the intersection of A and B" is a semantic correction. "Don't just look at the last few turns, the key moment was turn 12" is qualitative meta-feedback. Over time, the distillation pass learns Ed's patterns — what he considers worth deliberating, how he frames decision questions, which turns tend to contain the key insight.

**The qualification gate applies here too.** The distillation's proposed decision question and risk signals are PROPOSED, not ENFORCED. They feed into the manifest as `draft` values. Ed qualifies by editing. The qualified version becomes authoritative. Same pattern as the manifest stub → `ho_qualified` transition.

---

## The Architecture So Far (Four Layers, Not Three)

| Layer | What It Controls | Status |
|---|---|---|
| **1. Opening Distillation** | Extracts structured intent from freeform conversation | New — needs spec |
| **2. Modes** | Ceremony per deliberation (CONSULT/DELIBERATE/COMMIT/RATIFY) | Spec'd (Section A/C/H) |
| **3. Floors** | Minimum mode from manifest tags (deterministic cascade) | Spec'd (Section D) |
| **4. Pacing** | When Ed is in the loop vs. agents churn autonomously | Spec'd (Section I), ships v0.5 |

The distillation pass is arguably more important than churn-mode pacing. If the distillation gets the question wrong, the entire deliberation is framed around the wrong problem. Pacing optimizes an already-running deliberation. Distillation determines whether it starts correctly.

---

## v0 Line Question

The distillation pass is inference — it reads conversation content and proposes structure. This sits in tension with v0's "no semantic inference" rule.

**GA position:** The distillation pass should be in v0, not v0.5. Rationale:
- Without it, the tool's context selection is "last N turns" — which Ed has already identified as insufficient for the common case (intent distributed across conversation).
- The distillation output is PROPOSED, not ENFORCED — same status as an auto-generated manifest stub. Ed must review and correct before it becomes authoritative.
- The correction loop (Pattern 3) doesn't need to be in v0. v0 can be "propose, Ed corrects, move on." The learning comes later.
- The alternative — Ed manually writes the decision question and identifies key turns every time — is the exact friction the tool is supposed to eliminate.

**Counter-argument the IA should pressure-test:** Does putting inference in v0 (even as proposals) violate the "no semantic detection" boundary? Is there a meaningful difference between "the tool proposes `changes_schema: true` based on conversation content" (which v0 explicitly forbids) and "the tool proposes a decision question based on conversation content" (which we're now saying v0 needs)?

---

## Current Open Items

| Item | Status | Owner |
|---|---|---|
| Default mode (CONSULT vs DELIBERATE) | HO has not decided | HO |
| Opening distillation spec | Concept agreed, needs formal spec | GA to propose, IA to inspect |
| v0 boundary for distillation | GA argues v0; IA should inspect | IA |
| IA Turn 2 flags (priority ordering, multi-project edge case) | Acknowledged, not yet formally responded to | GA owes responses |
| Option 2.5 (split transport.mjs / enforce.mjs) | Raised by IA, not yet discussed | Pending |
| Articulation gate | Not reached — Ed must restate understanding before spec closes | HO |

---

## What the IA Should Do Next

1. **Inspect the qualification gate** (Section B.3 in the updated spec). Does it solve the "reword-hacking" problem? Are the three qualifying conditions sufficient, or can they be gamed?

2. **Inspect the opening distillation proposal.** Is it v0 or v0.5? Does "proposed, not enforced" adequately distinguish it from the forbidden "semantic detection"? Is the Memento analogy apt or misleading?

3. **Respond to the counter-argument** in the v0 line question above. Is there a meaningful difference between proposing `changes_schema: true` and proposing a decision question? If not, should both be in v0 or neither?

4. **Revisit Option 2.5** (split transport/enforcement scripts) in light of the four-layer architecture. Does the separation make more or less sense now that distillation is a distinct layer?

Apply verification flags as before. One question at a time after your inspection pass.

**Your turn, IA.**
