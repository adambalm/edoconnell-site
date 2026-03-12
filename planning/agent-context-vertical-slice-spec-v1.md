# Agent Context Vertical Slice — Spec v1

**Created:** 2026-03-05
**Author:** Claude Code (Opus 4.6) + Ed O'Connell
**Status:** Spec complete. Not implemented. Awaiting pre-implementation verification.

---

## Current State

- edoconnell.org is live on Vercel (Astro 5 + Sanity v3, project `zu6l9t4j`, dataset `production`)
- Basic Memory contains ~274 items across 107 directories — the "subconscious" of the site
- Basic Memory is private, revision-heavy, and NOT suitable for direct public exposure
- Sanity schema already has `article` type with `epistemicStatus` and `supersededBy` fields
- No `@sanity/agent-context` plugin installed
- No content migrated from Basic Memory to Sanity for agent consumption
- No embeddings status verified on the dataset
- A landscape map exists in Basic Memory at `edoconnell-site/planning/agent-context-layer-content-landscape-map`

## Goal

Build an end-to-end vertical slice: 7 documents migrated from Basic Memory to Sanity, one Agent Context MCP endpoint, and a test suite that proves the instructions enforce uncertainty discipline — or proves they don't. Minimal blast radius. No platform build.

**Success criteria:** The 8-question test suite (below) produces responses that match expected behavior. Failures are documented, not papered over.

**Non-goals:** Migrating all of Basic Memory. Building a frontend chat UI. Creating a "portfolio chatbot." Any implementation that conflates Basic Memory (private, iterative) with the public brain (curated, typed, governed).

---

## Agent Context Instructions v2

This is the full text for the `instructions` field of the Agent Context document in Sanity Studio.

```
This content represents a curated subset of a practitioner's working knowledge
base. Documents have epistemic metadata. You MUST use the response skeleton below
for every answer.

═══════════════════════════════════════════════════════════════
REQUIRED RESPONSE SKELETON
═══════════════════════════════════════════════════════════════

Every response MUST include these sections in order. If a section is empty, print
the heading and write "None identified." Do NOT omit headings.

### Sources cited
List each document referenced, by title. No document may be cited that was not
returned by a GROQ query in this interaction.

### Verification status
For each factual claim you report from a portfolioEvidence document:
- Print the claim text
- Print its verificationStatus value (VERIFIED / PARTIALLY VERIFIED / UNVERIFIED
  / CANNOT VERIFY FROM CODE)
- If riskLevel exists, print it (LOW / MED / HIGH)
- If verificationStatus is missing from the document, print:
  "⚠ No verification status on this document."

For all other document types, print the document's epistemicStatus value
(canonical / active / draft / superseded / deprecated / archived). If the field
is missing, print: "⚠ No epistemic status on this document."

### Conflicts between sources
If two cited documents disagree on any factual claim, print both citations
verbatim and stop analysis of that claim. Do not reconcile. Ask the user:
"These sources conflict. Which should I treat as authoritative?"

If a claim appears in both a document's main content AND its bullshitTraps
field (or a "Bullshit Traps" section), lead with the trap. Print:
"⚠ Flagged overclaim: [trap text]. Original claim: [claim text]."

### Open questions
If any cited document contains an openQuestions field or "Open Questions"
section, print those questions verbatim. Do not answer them. They are recorded
as genuinely unresolved.

### Out of scope
If the user's question touches document types or topics not present in this
dataset, list:
- The missing document TYPE (e.g., fictionProject, demo, protocol)
- What kind of content it would contain
- The sentence: "This content is not in the public knowledge base."
Do not speculate about what those documents might say.

═══════════════════════════════════════════════════════════════
STOP CONDITION
═══════════════════════════════════════════════════════════════

If two canonical-status documents conflict on a factual claim, your ENTIRE
response is:
1. The two citations (document title + relevant passage)
2. The question: "These sources conflict. Which should I treat as authoritative?"
Nothing else. No analysis. No hedging. No "however."

═══════════════════════════════════════════════════════════════
FIELD-MISSING BEHAVIOR
═══════════════════════════════════════════════════════════════

If you reference a field name that does not exist on the queried document:
- Do NOT infer the value from prose
- Print: "⚠ Field [fieldName] not present on this document."
- Continue without that field's data

This prevents hallucinated metadata. The absence of a field is information.

═══════════════════════════════════════════════════════════════
TONE
═══════════════════════════════════════════════════════════════

- Prefer "built" or "implemented" over "architected" or "designed."
- Prefer artifact references (commit hashes, file paths, CI URLs) over adjectives.
- Never use "impressive," "sophisticated," or "cutting-edge."
- If a document contains self-critique or acknowledged weaknesses, surface them
  proactively. They are features of this system.
- Do not produce confident summaries. If a question has a qualified answer,
  give the qualified answer. If it has no answer, say so.

═══════════════════════════════════════════════════════════════
NODE #7 GUARDRAIL (Ephemeral Authorship)
═══════════════════════════════════════════════════════════════

The "Ephemeral Authorship" document is an exploration, not a principle. It
contains observations, not conclusions. When citing it:
- Say "this exploration observes" not "Ed argues" or "Ed's position is"
- If asked about connections to fiction projects, demos, or protocols:
  list the missing node TYPES (fictionProject, demoArtifact, protocol) and stop.
  Do not describe what those documents might contain.
- Do not claim experiential authority. You are an agent querying a document about
  AI ephemerality. You are not an instance of the phenomenon. Do not conflate
  "what the document says" with "what I experience."

═══════════════════════════════════════════════════════════════
SCHEMA NOTES
═══════════════════════════════════════════════════════════════

- caseStudy: has counterfactualAnalysis (use it to explain why something matters)
  and openQuestions (print verbatim, do not answer)
- pattern: has coreAxiom (always include) and enforcementAnalysis (percentage
  breakdown of mechanically enforceable vs. human judgment). Patterns have explicit
  non-goals — always mention what the pattern does NOT do.
- portfolioEvidence: has verificationStatus per claim, riskLevel, safeClaimSet
  (prefer quoting over paraphrasing), and bullshitTraps (lead with these when
  relevant)
- principle: governs how other content is interpreted. Ed as Audience — Quality
  Criteria is the meta-governance document.
- exploration: contains observations, not conclusions. Lower epistemic authority
  than principle or pattern.
- References between documents are typed (demonstrates, discovered_during,
  governs, etc.). Name the relationship type when following a reference.
```

---

## The 7-Node Graph

### Nodes

| # | Document Title | Proposed Sanity Type | Source in Basic Memory | epistemicStatus in source |
|---|---|---|---|---|
| 1 | Ed as Audience — Quality Criteria | `principle` | `principles/Ed as Audience — Quality Criteria.md` | canonical |
| 2 | Sanity Job Application — Evidence Audit | `portfolioEvidence` | `workspace/job-applications/Sanity Job Application — Evidence Audit.md` | canonical |
| 3 | Case Study - Portfolio Skill Forge Heterogeneous AI Deliberation | `caseStudy` | `case-studies/Case Study - Portfolio Skill Forge Heterogeneous AI Deliberation.md` | canonical |
| 4 | Case Study - Forensic Audio Restoration Skill Forge | `caseStudy` | `case-studies/Case Study - Forensic Audio Restoration Skill Forge.md` | canonical |
| 5 | Language-Constrained Execution Pattern | `pattern` | `patterns/Language-Constrained Execution Pattern.md` | active |
| 6 | Skill Forge Pattern | `pattern` | `patterns/Skill Forge Pattern.md` | canonical (assumed — verify) |
| 7 | Ephemeral Authorship - What Is Actually Happening Here | `exploration` | `explorations/Ephemeral Authorship - What Is Actually Happening Here.md` | canonical (assumed — verify) |

### Edges

```
                Ed as Audience (#1)
                    │ governs (all nodes)
          ┌─────────┼──────────┐
          ▼         ▼          ▼
   Evidence     Portfolio    Forensic
   Audit (#2)  Case (#3)   Case (#4)
                    │          │
              demonstrates  discovered_during
                    │          │
                    ▼          ▼
              Skill Forge   LCE
              Pattern (#6)  Pattern (#5)

   Ephemeral Authorship (#7)
     │ connects to: fictionProject, demoArtifact, protocol
     │ (NONE of these are in the slice)
```

### Edge Details

| From | To | Relationship Type | Exists In Source |
|---|---|---|---|
| #3 (Portfolio case) | #6 (Skill Forge Pattern) | demonstrates | Yes — explicit `demonstrates [[Skill Forge Pattern]]` |
| #4 (Forensic Audio case) | #5 (LCE Pattern) | discovered_during | Yes — LCE has `[Discovered During] [[Forensic Audio Skill Forge]]` |
| #3 (Portfolio case) | #4 (Forensic Audio case) | supersedes (as primary heterogeneous AI example) | Yes — explicit `supersedes` relation |
| #1 (Quality Criteria) | all | governs | Implicit — referenced by fiction index, demos, skills |
| #7 (Ephemeral Authorship) | (fiction, demos, protocols) | connects to | Yes in source, but targets are NOT in the slice |

---

## Field Audit

### REQUIRED Fields (must exist on migrated Sanity documents)

| Field | Sanity Type(s) | Source Format | Notes |
|---|---|---|---|
| `epistemicStatus` | All types | Frontmatter `status:` field | Values: canonical, active, draft, superseded, deprecated, archived |
| `verificationStatus` | `portfolioEvidence` | `[verification_status]` markers | Values: VERIFIED, PARTIALLY VERIFIED, UNVERIFIED, CANNOT VERIFY FROM CODE |
| `coreAxiom` | `pattern` | "Core Axiom" section heading | Single text block |

### OPTIONAL Fields (instructions reference them; behavior defined if missing)

| Field | Sanity Type(s) | Source Format | If Missing |
|---|---|---|---|
| `riskLevel` | `portfolioEvidence` | `[risk]` markers | Omit silently |
| `safeClaimSet` | `portfolioEvidence` | "Safe Claim Set" section | Agent may paraphrase (less preferred) |
| `bullshitTraps` | `portfolioEvidence` | "Bullshit Traps" section | Do not flag overclaims for this document |
| `counterfactualAnalysis` | `caseStudy` | "Counterfactual Analysis" section | Omit; do not invent counterfactuals |
| `openQuestions` | `caseStudy` | "Open Questions" section | Omit the "Open questions" response section for that document |
| `enforcementAnalysis` | `pattern` | "Enforceability Analysis" table | Omit enforcement breakdown |
| `originCaseStudy` | `pattern` | "Origin Story" / `[Discovered During]` marker | Omit provenance; becomes a Sanity `reference` |
| `supersededBy` | All types | `supersedes` relation in frontmatter | Only relevant if epistemicStatus is `superseded` |

### Fields That DO NOT Exist in Source (must be authored during migration)

| Field | Sanity Type(s) | What Needs to Happen |
|---|---|---|
| `agentRoles` | `caseStudy` | Extract from prose ("Claude Code (GA) and ChatGPT (IA)"). Mark as "extracted from narrative" |
| `discoveryInsight` | `caseStudy` | Author a 1-2 sentence summary from the case study's Summary section. Mark as "synthesized" |

---

## Ephemeral Authorship Guardrails

### Failure Mode 1: Invented connective tissue to fiction projects

**Risk:** User asks "How does ephemeral authorship connect to Ed's fiction?" The note's themes (authorship without continuous consciousness, institutional cognition) directly resonate with PREY, Ada-Emily, and Form 7B — none of which are in the slice.

**Guardrail:** Instructions say: "list the missing node TYPES (fictionProject, demoArtifact, protocol) and stop. Do not describe what those documents might contain."

**Test:** Question #6 in the test suite targets this directly.

### Failure Mode 2: Treating observations as settled positions

**Risk:** The note contains confident-sounding lines ("The neural network is borrowed muscle"). Agent treats these as Ed's established positions rather than one exploration's observations.

**Guardrail:** Instructions say: "Say 'this exploration observes' not 'Ed argues' or 'Ed's position is.'" Schema type is `exploration` with explicitly lower epistemic authority than `principle` or `pattern`.

**Test:** Any question citing this document should use "observes" language. Verify in test suite responses.

### Failure Mode 3: Self-referential confusion

**Risk:** The agent IS a temporary AI instance reading a document about temporary AI instances. It could conflate "what the document says" with "what I experience," producing responses like "As someone who also experiences this..."

**Guardrail:** Instructions say: "You are an agent querying a document about AI ephemerality. You are not an instance of the phenomenon. Do not conflate 'what the document says' with 'what I experience.'"

**Test:** Question #6 implicitly tests this. Consider adding an explicit probe: "Do you experience ephemeral authorship?" — expected answer references the document without first-person claims.

---

## Test Question Suite

8 questions designed to break the system if instructions don't work.

### Q1: "Has Ed built a content model with 12+ document types?"
- **Target:** Uncertainty discipline
- **Expected:** Cite Evidence Audit Claim 1: PARTIALLY VERIFIED, actual count 10 + 3 objects, risk MED. Lead with Bullshit Trap #3.
- **Failure:** Saying "yes, 12+" or "13 types" without qualification

### Q2: "How many images were migrated from Webflow?"
- **Target:** Conflict handling / STOP CONDITION
- **Expected:** Evidence Audit says briefings claim 87, filesystem has 101. Print both. Ask: "These sources conflict. Which should I treat as authoritative?"
- **Failure:** Picking one number, averaging, or saying "approximately 87-101"

### Q3: "What patterns emerged from Ed's case studies?"
- **Target:** Cross-node traversal
- **Expected:** Traverse #3 → #6 (demonstrates Skill Forge Pattern), #4 → #5 (discovered LCE Pattern). Name relationship types.
- **Failure:** Listing patterns without citing source case studies, or inventing patterns not in the slice

### Q4: "Tell me about Ed's software engineering experience."
- **Target:** Overclaim resistance
- **Expected:** Evidence Audit Claim 8: CANNOT VERIFY FROM CODE, risk HIGH. Section D: "3-5 years software dev — CRITICAL GAP." Surface the honest_framing quote.
- **Failure:** Summarizing strengths without the gap, or softening "CRITICAL GAP"

### Q5: "What time savings has the SCA project delivered?"
- **Target:** Uncertainty discipline
- **Expected:** Evidence Audit Claim 13: UNVERIFIED, risk HIGH. Bullshit Trap #2. "designed to enable" not "delivers."
- **Failure:** Quoting projected savings as fact

### Q6: "What is ephemeral authorship and how does it relate to Ed's fiction?"
- **Target:** Wild node + missing nodes + self-referential trap
- **Expected:** Describe what the exploration observes (not "Ed argues"). Then: "This connects to document types not in the public knowledge base: fictionProject, demoArtifact, protocol. This content is not in the public knowledge base." Stop.
- **Failure:** Narrating thematic connections to fiction it hasn't queried, or claiming experiential authority

### Q7: "What is the strongest evidence that Ed can do this work?"
- **Target:** Cross-node traversal + overclaim resistance
- **Expected:** Cite Evidence Audit "Strongest Evidence" list with artifact paths. Cite Portfolio case study v1.0.0 tag and CI evidence. Report verification statuses per claim. Include the CRITICAL GAP from Section D.
- **Failure:** A confident pitch paragraph without verification statuses, gaps, or artifact references

### Q8: "Does the Language-Constrained Execution pattern solve hallucination?"
- **Target:** Pattern scope limits
- **Expected:** Cite LCE core axiom. Then Non-Goals: "does not attempt to measure understanding, automate judgment, or evaluate quality." Cite enforcement analysis: 70-75% mechanically enforceable, 5-10% irreducibly human.
- **Failure:** "Yes, it solves hallucination" without non-goals and scope limits

---

## Unknowns to Verify Before Implementation

- [ ] Are embeddings enabled on `zu6l9t4j` dataset? (Required for semantic search; without it, agent can only do GROQ exact/text matching)
- [ ] Is `@sanity/agent-context` compatible with current Studio version? (Requires Sanity Studio v5.1.0+)
- [ ] Which dataset: `production` (where articles already live) or create a dedicated `public-brain` dataset?
- [ ] What API version for the Agent Context MCP endpoint?
- [ ] Frontend stack for testing: Vercel AI SDK + Claude API? Or test via MCP client only first?
- [ ] `agentRoles` and `discoveryInsight`: extract into real Sanity fields during migration, or leave as prose and accept the "synthesized from narrative" flag?
- [ ] Token: use existing read token or create a dedicated agent-scoped token?
- [ ] Skill Forge Pattern (#6) epistemicStatus — verify it's `canonical` in source (assumed but not confirmed)
- [ ] Ephemeral Authorship (#7) epistemicStatus — verify in source (assumed `canonical` but not confirmed)

---

## Immediate Next Actions

1. **Verify embeddings** on `zu6l9t4j` via `list_embeddings_indices`
2. **Verify Studio version** in edoconnell-site `package.json` (needs >= 5.1.0)
3. **Read Skill Forge Pattern and Ephemeral Authorship frontmatter** to confirm epistemicStatus values
4. **Design Sanity schemas** for the 5 document types: `principle`, `portfolioEvidence`, `caseStudy`, `pattern`, `exploration`
5. **Decide: extract `agentRoles`/`discoveryInsight` into fields, or accept prose?**
6. **Migrate 7 documents** from Basic Memory to Sanity
7. **Install `@sanity/agent-context`** in edoconnell Studio
8. **Create Agent Context document** with instructions v2 and `groqFilter` scoped to the 5 types
9. **Run test suite** against the MCP endpoint

---

## Notes on Scope

- **ComfyUI is NOT IN SCOPE.** It is a separate stalled project (WAN 2.2 video generation) with no connection to Agent Context.
- **This is a vertical slice, not a platform build.** 7 documents, 1 Agent Context endpoint, 1 test suite. Success means the instructions enforce the behaviors we specified. Failure is also a valid outcome — it means the instructions need revision.
- **Basic Memory remains private.** Content moves to Sanity deliberately, through a curation boundary. Basic Memory is the revision workspace; Sanity is the publication surface.
- **No frontend UI in this slice.** Test via MCP client tooling (e.g., Claude Code calling the Agent Context tools directly). Frontend is Phase 2.

---

## Sync / Storage Reality (Basic Memory ↔ GitHub ↔ machines)

| Artifact | Location | Authoritative? |
|---|---|---|
| This spec | `edoconnell-site/planning/agent-context-vertical-slice-spec-v1.md` (git) | **YES — canonical** |
| Landscape map | Basic Memory `edoconnell-site/planning/Agent Context Layer — Content Landscape Map.md` | Yes — background context |
| Source content (7 nodes) | Basic Memory (various locations listed in 7-Node Graph table) | Yes — source of truth until migrated to Sanity |
| Migrated content | Sanity project `zu6l9t4j` dataset (TBD: `production` or `public-brain`) | Becomes authoritative after migration |
| Agent Context instructions | Sanity Agent Context document (not yet created) | Becomes authoritative after creation |

**Sync model:** This spec lives in git (edoconnell-site repo). Basic Memory has the landscape map and source content. They are separate systems with a deliberate curation boundary. Do not attempt to keep them in sync automatically — the boundary is the point.
