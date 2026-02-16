/*
MANIFEST
=========
Artifact: SkillForgeVisualizer
Version: 3.0.0
Generated: 2026-01-08T00:00:00Z
Migrated: 2026-02-15 to edoconnell-site (Astro 5 + React island)
Generator: Claude (Opus 4.5) via Claude Code
Protocol: SKILL-FORGE-V2.2.0-GOVERNANCE (Heterogeneous AI Deliberation)

SECTIONS:
- Process (~lines 1550-1640) [ENHANCED: Swimlane layout]
- Verification (~lines 1600-1640)
- Example (~lines 1640-1680) [ENHANCED: FeaturedExample, RelatedExamples, GateProgress]
- Economics (~lines 1680-1750) [ENHANCED: Responsive SVG]
- Accumulation (~lines 1750-1900)
- References (~lines 1900-2000)

SUBCOMPONENTS:
- CitationLink (~lines 850-865) — APA 7th external links
- SkipLink (~lines 865-875) — WCAG skip navigation
- FlowStep (~lines 875-895) — Process step button
- Gate (~lines 895-910) — UG/AG status indicator
- SwissCheeseVisualization (~lines 910-925) — SVG diagram
- Slider (~lines 925-935) — Accessible range input (44px touch target)
- CostCurve (~lines 955-985) — Economics SVG chart (viewBox + preserveAspectRatio)
- NavTab (~lines 985-1000) — ARIA tab button
- ExpandablePanel (~lines 1000-1020) — Accordion
- RewordGate (~lines 1005-1125) — Human Articulation Gate (v3.0.0)
- SkillInventoryTable (~lines 1129-1167) — Thin skill inventory
- GateProgress (~lines 1169-1207) — Gate status progress indicator (NEW v3.0.0)
- FeaturedExample (~lines 1210-1339) — Hero card for primary example (NEW v3.0.0)
- RelatedExamples (~lines 1349-1423) — Collapsible secondary examples (NEW v3.0.0)
- LaTeX (~lines 750-800) — KaTeX with fallback
- ConditionalLink (~lines 800-830) — Props-based linking

DEPENDENCIES:
- react (useState, useEffect, useRef)
- lucide-react (Check, X, AlertCircle, User, Layers, TrendingUp, Clock, FileText, Target, GitBranch, ChevronRight, ChevronDown, ExternalLink, Database, Zap)

CONSTRAINTS:
- Claude Desktop preview compatible
- No localStorage
- Tailwind core utilities only
- Single default export
- Links prop contract for parent site composition
- 44px minimum touch targets (WCAG)
- Responsive grid layouts (mobile-first)

CHANGES FROM 2.2.0 (v3.0.0 - BREAKING):
- Added RewordGate component (Human Articulation Gate with 50-char minimum)
- Added Swimlane layout for Process section (3-column HO/GA/IA grid)
- Added layout toggle (swimlane vs classic view)
- Enhanced CostCurve SVG with preserveAspectRatio for mobile
- Enhanced Slider with 44px touch targets
- Made Economics section responsive (1-col mobile, 2-col desktop)
- ~20 new i18n keys for v3.0.0 features

BREAKING CHANGE:
The RewordGate in Example section adds friction to the approval flow.
Users must articulate their understanding (50+ chars) before approval.

ROLLBACK:
git checkout skillforge-v2.2.0-pre-v3 -- src/artifacts/SkillForgeVisualizer.jsx

CANARY: SKILLFORGE-V3.0.0-2026-01-08
*/

import React, { useState, useEffect, useRef } from 'react';
import {
  Check, X, AlertCircle, User,
  Layers, TrendingUp, Clock, FileText, Target,
  GitBranch, ChevronRight, ChevronDown, ExternalLink,
  Database, Zap
} from 'lucide-react';
import styles from './SkillForgeVisualizer.module.css';

declare global {
  interface Window {
    katex?: any;
  }
}

// =============================================================================
// i18n INFRASTRUCTURE
// =============================================================================

const i18n: Record<string, Record<string, string>> = {
  en: {
    // Header
    title: 'Skill Forge Pattern',
    subtitle: 'Deliberation → Human Qualification → Reusable Skill',
    
    // Navigation
    navProcess: 'Process Flow',
    navVerification: 'Verification',
    navExample: 'Example',
    navEconomics: 'Economics',
    navAccumulation: 'Accumulation',
    navReferences: 'References',
    
    // Introduction
    introStrong: 'Skill Forge',
    introText: 'is a deliberative process for decisions too complex or consequential to trust to a single model or a single human judgment. Building on',
    introIrvingCite: 'Irving et al.\'s (2018)',
    introInsight: 'insight that humans can judge debates they couldn\'t generate, but departing from same-model debate by exploiting',
    introHeterogeneous: 'heterogeneous priors',
    introHeterogeneousExplain: '—the pattern uses models with genuinely different training to surface each other\'s blindspots. Unlike consensus-seeking approaches (',
    introAHMAD: 'A-HMAD',
    introLLMCouncil: 'LLM Council',
    introGoalNot: '), the goal is not model agreement but',
    introQualifiedJudgment: 'qualified human judgment',
    introQualifiedExplain: ': the human must articulate the decision before approving a model-produced skill. Unlike agent-centric skill accumulation (',
    introExpeL: 'ExpeL',
    introFinalClause: '), nothing enters the skill library without a human who demonstrated understanding.',
    
    // Process
    processTitle: 'Single Problem Flow Through the Forge',
    processDesc: 'Unlike role-specialized approaches (A-HMAD\'s researcher/critic/synthesizer), models here aren\'t assigned roles—they\'re chosen for genuinely different priors. The value comes from different training, not from prompting one model to act as critic.',
    processRefImpl: 'See the full Portfolio Integration deliberation for a reference implementation of this flow.',
    processRefImplLink: 'View reference deliberation',
    step1Title: 'Novel Problem Arrives',
    step1Desc: 'Existing skills don\'t apply or have failed',
    step2Title: 'Model A Proposes',
    step2Desc: 'Human prompts first model for initial approach',
    step3Title: 'Model B Verifies',
    step3Desc: 'Paraphrases AND flags each claim with status',
    step4Title: 'Understanding Gate',
    step4Desc: 'Model A responds to all flags (not when all green)',
    step5Title: 'Model B Critiques',
    step5Desc: 'Only after UG: surfaces failure modes, proposes tests',
    step6Title: 'Agreement Gate',
    step6Desc: 'Executable test or qualified agreement',
    step7Title: 'Human Articulation Gate',
    step7Desc: 'Must restate decision to prove qualification',
    step8Title: 'Skill Compiled',
    step8Desc: 'Model skeleton + human approval = authorized skill',
    step1Example: 'Example: The portfolio site needs to display AI-generated artifacts with clear epistemic status markers—existing React components don\'t handle provenance display.',
    step2Example: 'Example: Claude proposes four boundary components: ProvenanceHeader (agent, date, context), EpistemicBadge (VERIFIED/ILLUSTRATIVE/EXPLORATORY), AuthorshipMarker (Human/AI/Collaborative), and DemoContainer (visual containment).',
    step3Example: 'Example: GPT paraphrases the proposal and flags concerns: "How do nested markers behave? Are badge colors WCAG 2.1 AA compliant? What\'s the fallback when evidence URLs return 404?"',
    step5Example: 'Example: After UG closes, GPT surfaces failure modes: "VERIFIED status implies evidence exists—what if the URL breaks post-deploy? Badge colors may fail contrast on dark backgrounds."',
    step8Example: 'Example: Skill \'boundary-marker-components\' compiles with component API specs, WCAG color constraints (#1d4ed8, #1e40af for blue badges), and fallback behaviors for missing evidence.',
    step4Example: 'Example: Claude responds to GPT\'s flags—concedes the WCAG concern (commits to testing badge colors), defends the nesting approach (markers won\'t nest in practice), acknowledges uncertainty on 404 handling (proposes fallback badge).',
    step6Example: 'Example: Models reach "AG-QUALIFIED": boundary markers approved with named uncertainty—"evidence URL validation deferred to build-time checks." Executable test: Lighthouse accessibility audit must pass.',
    step7Example: 'Example: The human articulates: "We\'re adding four components that mark AI content boundaries. VERIFIED needs evidence URLs. Colors must pass WCAG." This grounds their qualification to approve.',
    stepOf: 'of',
    completed: 'Completed',
    currentStep: 'Current step',
    ugDetailText: 'Model A must respond to every flag—defend, concede, or acknowledge uncertainty. The gate closes when A has responded, not when all flags are green.',
    agDetailText: 'Three outcomes possible: AG-HIGH (full agreement with executable test), AG-QUALIFIED (agreement with named uncertainties), or ESCALATE.',
    agBlocksOnAssumed: '⚠ Blocks on [assumed]',
    agBlocksOnAssumedDetail: 'AG cannot close while any parameter is marked [assumed]. All claims must be [verified:artifact] or [verified:test].',
    hagDetailTitle: 'Human Articulation Gate',
    hagDetailText: 'The human must restate the core decision in their own words. This qualifies them to steer the outcome and anchors their judgment in something that compounds—cognitive capital that amortizes across future decisions.',
    gateOpen: 'Open',
    gateClosed: 'Closed',
    gateFailed: 'Failed',
    understandingGate: 'Understanding',
    agreementGate: 'Agreement',

    // Precondition Band (LCE)
    preconditionTitle: 'Precondition: Object Verification',
    preconditionDesc: 'Before deliberation begins, the object under discussion must be inspected—not assumed.',
    preconditionReq1: 'Artifact inspection complete',
    preconditionReq1Detail: 'Run tools (ffprobe, stat, etc.) on source artifacts',
    preconditionReq2: 'All parameters [verified:artifact]',
    preconditionReq2Detail: 'No parameter may be asserted from "general knowledge"',
    preconditionWhy: 'Why this matters:',
    preconditionWhyText: 'In the Forensic Audio case, both models agreed on 48kHz sample rate from "typical iPhone behavior." The actual file was 44.1kHz. Inspection saved the project.',

    // Postcondition Band (LCE)
    postconditionTitle: 'Postcondition: Skill Provenance',
    postconditionDesc: 'Skills compiled from the forge must cite their evidence.',
    postconditionReq1: 'Turn number where technique validated',
    postconditionReq2: 'Command that ran',
    postconditionReq3: 'Output artifact produced',

    // Verification
    swissCheeseTitle: 'Swiss Cheese Model: Heterogeneous models cover each other\'s blindspots',
    swissCheeseDesc: 'Diagram showing two cheese slices representing Claude and GPT models, each with holes in different positions representing blindspots. When combined, the holes don\'t align, resulting in full coverage.',
    swissCheeseCoverage: 'Coverage',
    swissCheeseSection: 'Swiss Cheese Coverage',
    swissCheeseExplain: 'James Reason\'s (2000) accident causation model: stack defenses with different failure modes.',
    swissCheeseApplied: 'applied this to AI safety guardrails. We apply it to',
    swissCheeseEpistemic: 'epistemic coverage',
    swissCheeseEpistemicExplain: '—different training corpora create different blindspots.',
    verificationTitle: 'Why Paraphrase? Adversarial Verification Through Different Priors',
    coreInsight: 'The Core Insight',
    coreInsightText: 'showed that humans can judge debates they couldn\'t generate. But same-model debate shares blindspots. Our mechanism is',
    coreInsightMechanism: 'active adversarial verification across different priors',
    coreInsightFinal: ': each model must treat the other\'s output as suspect and possibly hallucinated.',
    
    // Economics
    economicsTitle: 'When Does Skill Forge Pay Off?',
    economicsDesc: 'Most multi-agent patterns don\'t account for cost. Skill Forge makes the tradeoff explicit: deliberation is expensive, but amortizes when the problem class recurs. If N=1, don\'t use the forge.',
    paramDeliberation: 'Deliberation Cost',
    paramSkill: 'Skill Invocation Cost',
    paramFailure: 'Skill Failure Rate',
    paramProblems: 'Problem Count',
    formulaTitle: 'Formulas',
    formulaWithout: 'Without Forge',
    formulaWith: 'With Forge',
    formulaBreakeven: 'Break-even',
    costForge: 'forge',
    costWithout: 'without',
    probFail: 'fail',
    totalWithout: 'Total without Forge',
    totalWith: 'Total with Forge',
    savings: 'Savings',
    units: 'units',
    problems: 'problems',
    
    // Accumulation - EXPANDED
    accumulationTitle: 'What Builds Up Over Time?',
    accumulationDesc: 'Unlike agent workflow memory (ExpeL, MACLA) where skills accumulate automatically from execution traces, Skill Forge accumulation is human-gated: nothing enters the skill library without a human who demonstrated understanding by articulating the decision.',
    
    skillLibrary: 'Skill Library',
    skillLibraryDesc: 'Each forged skill becomes available for future problems. More skills = more domain coverage = fewer full deliberations needed.',
    skillLibraryCount: 'skills forged',
    skillName: 'Skill',
    skillDomain: 'Domain',
    skillStatus: 'Status',
    
    humanExpertise: 'Human Expertise',
    humanExpertiseDesc: 'The human\'s ability to articulate outcomes improves. Pattern recognition develops. Executive capacity compounds. Skills can accumulate in an institution (organizational knowledge base) or travel with the practitioner (personal skill library)—the infrastructure supports both.',
    
    provenanceRecord: 'Provenance Record',
    provenanceDesc: 'Not all decisions have equal weight. Well-contested decisions with clear rationale score higher than quick judgments.',
    
    // Thin Skill Architecture - NEW
    thinSkillTitle: 'Thin Skill Architecture',
    thinSkillSubtitle: 'How forged skills persist and compound',
    
    thinSkillIntro: 'Forged skills compile to',
    thinSkillName: 'thin skills',
    thinSkillIntroEnd: '— lightweight instruction files that live in the knowledge base, not bundled with code.',
    
    thinSkillWhatTitle: 'What is a Thin Skill?',
    thinSkillWhat: 'A thin skill is a markdown file containing execution instructions, quality criteria, and anti-patterns. Any model with MCP access can read and execute it. The key insight: the neural network is borrowed capability—an instance does work and ceases to exist. The instructions persist.',
    
    thinSkillVsNativeTitle: 'Thin Skills vs Native Plugins',
    thinSkillVsNativeIntro: 'Platform-native plugins (like Anthropic\'s .claude-plugin format) bundle instructions with execution code. Thin skills separate them:',
    
    comparisonNative: 'Native Plugin',
    comparisonThin: 'Thin Skill',
    comparisonStorage: 'Storage',
    comparisonStorageNative: 'Bundled with code',
    comparisonStorageThin: 'Knowledge base',
    comparisonPortability: 'Portability',
    comparisonPortabilityNative: 'Single platform',
    comparisonPortabilityThin: 'Any MCP client',
    comparisonLearning: 'Learning Loop',
    comparisonLearningNative: 'None',
    comparisonLearningThin: 'Feedback → update → next use benefits',
    comparisonGating: 'Human Gating',
    comparisonGatingNative: 'Optional',
    comparisonGatingThin: 'Required (Skill Forge)',
    
    thinSkillBenefits: 'This architecture means a skill forged in Claude can be executed by GPT, Gemini, or any future model with Basic Memory access. Knowledge compounds across the entire system, not locked to one vendor.',
    
    // Skill Inventory - NEW
    inventoryTitle: 'Current Skill Inventory',
    inventoryIntro: 'Skills currently registered in the Context Sage knowledge base:',
    inventorySkill: 'Skill',
    inventoryPurpose: 'Purpose',
    inventoryStatus: 'Status',
    inventoryLastVerified: 'Last Verified',
    
    skillTriage: 'Session Triage',
    skillTriagePurpose: 'Surface open work at session start',
    skillArtifactBuilder: 'Artifact Builder',
    skillArtifactBuilderPurpose: 'Generate React artifacts with manifests',
    skillArtifactIntegration: 'Artifact Integration',
    skillArtifactIntegrationPurpose: 'Deploy artifacts to portfolio site',
    skillSkillForge: 'Skill Forge',
    skillSkillForgePurpose: 'Multi-model deliberation for complex decisions',
    skillContextSageDemo: 'Context Sage Demo',
    skillContextSageDemoPurpose: 'Generate knowledge graph visualization',
    skillMementoDemo: 'Memento Demo',
    skillMementoDemoPurpose: 'Generate memory persistence demo',
    skillChromeExtension: 'Chrome Extension Builder',
    skillChromeExtensionPurpose: 'Build browser extensions with manifest',
    skillGovernanceDashboard: 'Governance Dashboard',
    skillGovernanceDashboardPurpose: 'Visualize KB health metrics',
    skillBasicMemoryDemo: 'Basic Memory Demo',
    skillBasicMemoryDemoPurpose: 'Generate Context Sage presentation',
    
    statusCanonical: 'canonical',
    statusDraft: 'draft',
    
    inventoryNote: 'Each skill includes a canary string proving it was loaded from the KB, not hallucinated. Stale skills (>14 days unverified) are flagged for review.',
    
    learnMoreThinSkill: 'Learn more about Thin Skill Architecture',
    
    // References
    referencesTitle: 'References',
    referencesDesc: 'Skill Forge draws on several research threads while differing from each in important ways. Citations follow APA 7th Edition format.',
    whatsNovel: 'What\'s Novel in Skill Forge',
    novel1: 'Heterogeneous models with genuinely different priors',
    novel1Note: '— not just role specialization',
    novel2: 'Adversarial paraphrase as active verification',
    novel2Note: '— each model flags claims with status',
    novel3: 'Human articulation as qualification gate',
    novel3Note: '— must restate before approval',
    novel4: 'Human certification with accountability',
    novel4Note: '— certify only after articulating',
    novel5: 'Model produces skill, human approves',
    novel5Note: '— clear division of labor',
    novel6: 'Amortization economics',
    novel6Note: '— explicit cost model for recurring problems',
    
    // Example - Forensic Audio Deliberation
    exampleTitle: 'Example: Forensic Audio Restoration',
    exampleDesc: 'A real Skill Forge deliberation recovering vocals from a gymnasium recording. Explore how heterogeneous models surface constraints a single model would miss.',

    exStep1Title: 'Step 1: Novel Problem Arrives',
    exStep1Summary: 'Portfolio needs clear visual distinction for AI-generated artifacts',
    exStep1Content: 'The portfolio umbrella site will display demo artifacts generated by AI. Users need to immediately understand: (1) that content is AI-generated, (2) what epistemic status claims are being made, (3) who authored/approved it, and (4) that it\'s demo content not production features. No existing React component library handles this combination of concerns.',

    exStep2Title: 'Step 2: Model A (Claude) Proposes',
    exStep2Summary: 'Claude proposes four orthogonal boundary marker components',
    exStep2Content: 'I propose four boundary marker components, each addressing one concern:\n\n1. **ProvenanceHeader** — Shows agent (Claude/GPT), generation date, context description, and source link\n2. **EpistemicBadge** — VERIFIED (with evidence URL), ILLUSTRATIVE, or EXPLORATORY status\n3. **AuthorshipMarker** — Human, AI, or Collaborative attribution\n4. **DemoContainer** — Visual containment with dashed border and "Demo Content" label\n\nThese are orthogonal: any combination is valid. A demo could be VERIFIED (tested behavior) but AI-authored.',

    exStep3Title: 'Step 3: Model B (GPT) Verifies',
    exStep3Summary: 'GPT paraphrases and flags three concerns',
    exStep3Content: '**Paraphrase**: The proposal defines four independent components for marking AI artifact boundaries—provenance metadata, epistemic claims, authorship type, and visual containment.\n\n**Flags**:\n• 🟡 UNCERTAIN: How do nested markers behave? (DemoContainer inside DemoContainer)\n• 🟡 UNCERTAIN: Are badge colors WCAG 2.1 AA compliant? (4.5:1 contrast ratio)\n• 🔴 GAP: What\'s the fallback when VERIFIED evidence URLs return 404?',

    exStep4Title: 'Step 4: Understanding Gate',
    exStep4Summary: 'Claude responds: defend nesting, concede WCAG, acknowledge 404 uncertainty',
    exStep4Content: '**Nesting (DEFEND)**: Markers won\'t nest in practice—each artifact gets one DemoContainer at its root. The component doesn\'t need to handle recursion.\n\n**WCAG (CONCEDE)**: Valid concern. I commit to using tested color values: #1d4ed8 (blue), #1e40af (dark blue), #475569 (slate) which pass AAA.\n\n**404 Fallback (ACKNOWLEDGE UNCERTAINTY)**: This is a real gap. Proposal: VERIFIED badge shows warning state if evidence URL fails health check at build time. Runtime 404s show "Evidence unavailable" tooltip.',

    exStep5Title: 'Step 5: Model B (GPT) Critiques',
    exStep5Summary: 'GPT surfaces failure modes and proposes executable tests',
    exStep5Content: '**Failure Modes Identified**:\n1. Evidence URL validation at build-time may miss URLs that fail later\n2. "Demo Content" label may be missed by screen readers if only visual\n3. Epistemic badge colors alone may not distinguish states for colorblind users\n\n**Proposed Tests**:\n• Lighthouse accessibility audit must score 100\n• All badges must have aria-label with full status text\n• Evidence URLs should include Last-Modified check, not just 200 OK',

    exStep6Title: 'Step 6: Agreement Gate',
    exStep6Summary: 'AG-QUALIFIED reached: approved with named uncertainties',
    exStep6Content: '**Status**: AG-QUALIFIED\n\n**Approved**: Four-component boundary marker architecture with WCAG-compliant colors and accessibility requirements.\n\n**Named Uncertainties**:\n• Evidence URL runtime validation deferred to build-time checks only\n• Long-term URL stability not guaranteed\n\n**Executable Tests**:\n1. npm run lint passes (ESLint a11y plugin)\n2. Lighthouse accessibility = 100\n3. Manual test: each badge readable with color filter simulation',

    exStep7Title: 'Step 7: Human Articulation Gate',
    exStep7Summary: 'Human demonstrates understanding by restating the decision',
    exStep7Content: '"We\'re implementing four React components that visually mark AI-generated content boundaries:\n\n• ProvenanceHeader shows who made it and when\n• EpistemicBadge claims VERIFIED/ILLUSTRATIVE/EXPLORATORY\n• AuthorshipMarker distinguishes human/AI/collaborative\n• DemoContainer wraps everything with a visual boundary\n\nVERIFIED status requires a working evidence URL—we check at build time, show warning if it fails. All colors pass WCAG AA. This decision compounds: future artifacts use the same markers."',

    exStep8Title: 'Step 8: Skill Compiled',
    exStep8Summary: 'Skill "boundary-marker-components" enters the library',
    exStep8Content: '**Skill**: boundary-marker-components\n**Status**: canonical | **Verified**: 2026-01-05\n\n**Instructions**: When creating demo artifacts for the portfolio site:\n1. Wrap in DemoContainer with "Demo Content" label\n2. Add ProvenanceHeader with agent, date, context\n3. Add EpistemicBadge matching content status\n4. Add AuthorshipMarker if authorship is relevant\n\n**Constraints**:\n• Colors: #1d4ed8, #1e40af, #475569 only\n• VERIFIED requires evidence URL (validated at build)\n• All badges need aria-label\n\n**Anti-patterns**:\n• Don\'t nest DemoContainers\n• Don\'t use VERIFIED without evidence\n• Don\'t rely on color alone for status',

    exSpeakerContext: 'Context',
    exSpeakerClaude: 'Claude (GA)',
    exSpeakerGPT: 'GPT (IA)',
    exSpeakerHuman: 'Human (HO)',
    exSpeakerOutcome: 'Outcome',

    // Reword Gate (v3.0.0)
    rewordGateTitle: 'Your Turn: Articulate the Decision',
    rewordGateEpigraph: '"Bring me to the test, and I the matter will reword, which madness would gambol from."',
    rewordGateAttribution: '— Hamlet (III.iv)',
    rewordGatePlaceholder: 'Restate the core decision in your own words. What are we doing? What are the key constraints? Why does this approach make sense?',
    rewordGateCharCount: 'characters',
    rewordGateMinChars: 'minimum',
    rewordGateButtonLocked: 'Articulate to Unlock',
    rewordGateButtonUnlocked: 'Approve Decision',
    rewordGateApproved: 'Decision Approved',
    rewordGateApprovedDetail: 'You have demonstrated understanding. The skill may now compile.',
    rewordGateOptional: 'Optional: demonstrate your understanding',
    rewordGateExpand: 'Qualify my understanding',
    rewordGateCollapse: 'Collapse',

    // Featured Example Section (v3.0.0)
    featuredExampleLabel: 'Featured Example',
    featuredExampleTitle: 'Forensic Audio Restoration Skill Forge',
    featuredExampleDesc: 'Multimodal deliberation recovering hip-hop performance from gymnasium acoustics using distributed AI inference.',
    featuredLiveBadge: 'Live',
    featuredLiveTooltip: 'This deliberation is actively in progress. Gates remain open for review.',
    featuredCompiledBadge: 'Compiled',
    featuredCompiledTooltip: 'This skill has been ratified and is canonical.',
    featuredModels: 'Models',
    featuredModalities: 'Modalities',
    featuredSize: 'Size',
    featuredTurns: 'Turns',
    featuredGateStatus: 'Gate Status',
    featuredDeliberationFlow: 'Full Deliberation',
    featuredHOLabel: 'HO',
    featuredGALabel: 'GA',
    featuredIALabel: 'IA',
    // Problem statement
    featuredProblem: 'Recover intelligible vocals from a single-source iPhone recording of a spontaneous rap performance in a gymnasium.',
    // 8-turn deliberation showing real pushback
    featuredTurn1: 'Standard approach: duplicate the track, process one for clarity with high-pass filter and compression, then sidechain duck the vibe track when vocals hit.',
    featuredTurn2: 'That won\'t work. Single-source iPhone means the compressor triggers on crowd noise, not just vocals. You\'ll get a "pumping" effect where everything ducks when the audience cheers.',
    featuredTurn3: 'Fair. We need Voice Isolation on the clarity track first—separate the vocal envelope from crowd noise before using it as a sidechain trigger.',
    featuredTurn4: 'The crowd response builds as this goes along—it\'s not just reaction to punchlines, it\'s them recognizing what\'s happening in real time. When it switches to "crime against nature" is when they start going nuts. Be on the lookout for that.',
    featuredTurn5: 'That changes the success metric. We can\'t duck aggressively or we lose the build. Those soft vowel endings on "nature" and "overrate ya" are easy to lose when the crowd peaks.',
    featuredTurn6: 'Revised approach: two-pass MDX-Net centrifuge. Pass 1 separates vocals from crowd, Pass 2 strips gym reverb. Headless GPU inference on Adambalm—16GB VRAM gives us full segment sizes without seams.',
    featuredTurn7: 'Verified. I\'ve analyzed the artifact—frequency masking is worst at the "crime against nature" punchline. Success criteria: consonants sharp above 6kHz, no digital chirping in silent gaps, 6-12dB separation between voice and roar.',
    featuredTurn8: 'Ok—write me the full spec. I want the reasoning laid out and a success matrix so we know which parts actually work.',
    // Gate passage markers
    featuredUGMarker: 'UG',
    featuredAGMarker: 'AG',
    featuredEAMarker: 'EA',
    featuredUGNote: 'Understanding Gate — constraint surfaced',
    featuredAGNote: 'Agreement Gate — approach locked',
    featuredEANote: 'Execution Authorization granted',
    // Value Demonstrated section
    featuredValueTitle: 'Value Demonstrated',
    featuredValueWithout: 'Without deliberation',
    featuredValueWithoutText: 'GA implements sidechain ducking → fails on crowd noise → rework required. Single-model approach misses the technical constraint.',
    featuredValueWith: 'With deliberation',
    featuredValueWithText: 'IA catches failure mode before execution. HO surfaces artistic constraint. Correct approach implemented first time.',
    featuredValueHeterogeneity: 'Why heterogeneity matters',
    featuredValueHeterogeneityText: 'IA (Gemini) can analyze the actual video artifact and identify where frequency masking is worst. GA (Claude) can\'t process video but can architect distributed compute solutions. Different capabilities catch different failure modes.',
    featuredValueSkill: 'Skill extracted',
    featuredValueSkillText: 'Distributed GPU orchestration for source separation under VRAM constraints. Reusable pattern: centrifuge multi-pass architecture with cloud/local hybrid inference.',
    featuredValueNotAuto: 'Not automatable',
    featuredValueNotAutoText: 'Requires domain expertise (what makes rap intelligible), artistic judgment (preserve crowd energy), and heterogeneous model capabilities. No single model covers all three.',
    featuredViewDialogue: 'View Full Dialogue',
    featuredViewSpec: 'View Technical Spec',

    // Gate Progress (reuses gateOpen/gateClosed from Process section)
    gateUG: 'UG',
    gateAG: 'AG',
    gateEA: 'EA',
    gateUGFull: 'Understanding Gate',
    gateAGFull: 'Agreement Gate',
    gateEAFull: 'Execution Authorization',
    gateProgress: 'of gates closed',

    // Related Examples
    relatedExamplesTitle: 'Related Examples',
    relatedCompiledSection: 'Compiled Skills',
    relatedPatternsSection: 'Extracted Patterns',

    // Related Example Items
    relatedPortfolio: 'Portfolio Skill Forge Case Study',
    relatedPortfolioMeta: 'v1.0.0 • 8 turns • Claude + ChatGPT',
    relatedNuclearOption: 'Nuclear Option Memento Convergence',
    relatedNuclearOptionMeta: '6 turns • MCP tool proposals',
    relatedInfrastructure: 'Infrastructure Epistemic Gap',
    relatedInfrastructureMeta: '5 turns • Black Flag Clause 4.1',
    relatedMemento: 'Memento 4-Pass Classifier',
    relatedMementoMeta: 'Technical architecture • 4-pass pipeline',

    // Provenance Signals
    provenanceModelDiversity: 'Multiple AI models participated',
    provenanceTurnDepth: 'deliberation turns',
    provenanceMultimodal: 'Multimodal analysis',
    provenanceGates: 'gates closed',
    provenanceRatified: 'Ratified',

    // Modality Icons
    modalityAudio: 'Audio',
    modalityVideo: 'Video',
    modalityText: 'Text',

    // Swimlane Layout (v3.0.0)
    swimlaneHO: 'Human Orchestrator',
    swimlaneGA: 'Model A (GA)',
    swimlaneIA: 'Model B (IA)',
    swimlaneHODesc: 'Owns decisions, qualifies output',
    swimlaneGADesc: 'Proposes approaches, responds to flags',
    swimlaneIADesc: 'Verifies claims, surfaces failure modes',
    layoutToggle: 'Toggle Layout',
    layoutSwimlane: 'Swimlane View',
    layoutClassic: 'Classic View',

    // Accessibility
    skipToMain: 'Skip to main content',
    selectView: 'Select a view',
    processSteps: 'Process steps',
    costModelParams: 'Cost Model Parameters',
    costCurveTitle: 'Cost Comparison Chart',
    costCurveDesc: 'Line chart comparing cumulative costs with and without Skill Forge across problem count N.',
    linkOpensNewTab: 'opens in new tab',
    
    // Footer
    footerTitle: 'Skill Forge Pattern Visualization',
    footerVersion: 'Version 3.0.0 | WCAG 2.1 AA | APA 7th Edition',
    footerAuthor: '© Ed O\'Connell',
    footerPubDate: 'January 2026',
    canary: 'SKILLFORGE-V3.0.0-2026-01-08',
  },
  
  es: {
    title: 'Patrón Skill Forge',
    subtitle: 'Deliberación → Cualificación Humana → Habilidad Reutilizable',
    navProcess: 'Flujo del Proceso',
    navVerification: 'Verificación',
    navExample: 'Ejemplo',
    navEconomics: 'Economía',
    navAccumulation: 'Acumulación',
    navReferences: 'Referencias',
    introStrong: 'Skill Forge',
    introText: 'es un proceso deliberativo para decisiones demasiado complejas o importantes para confiar en un solo modelo o un solo juicio humano. Basándose en',
    introIrvingCite: 'la perspectiva de Irving et al. (2018)',
    introInsight: 'de que los humanos pueden juzgar debates que no podrían generar, pero apartándose del debate de modelos idénticos al explotar',
    introHeterogeneous: 'priors heterogéneos',
    introHeterogeneousExplain: '—el patrón usa modelos con entrenamiento genuinamente diferente para revelar los puntos ciegos mutuos. A diferencia de enfoques de búsqueda de consenso (',
    introAHMAD: 'A-HMAD',
    introLLMCouncil: 'LLM Council',
    introGoalNot: '), el objetivo no es el acuerdo entre modelos sino',
    introQualifiedJudgment: 'juicio humano cualificado',
    introQualifiedExplain: ': el humano debe articular la decisión antes de aprobar una habilidad producida por el modelo. A diferencia de la acumulación de habilidades centrada en agentes (',
    introExpeL: 'ExpeL',
    introFinalClause: '), nada entra a la biblioteca de habilidades sin un humano que demostró comprensión.',
    processTitle: 'Flujo de un Problema Individual a Través de la Forja',
    processDesc: 'A diferencia de enfoques con roles especializados, aquí los modelos no tienen roles asignados—se eligen por sus priors genuinamente diferentes.',
    processRefImpl: 'Vea la deliberación completa de Integración del Portafolio como implementación de referencia.',
    processRefImplLink: 'Ver deliberación de referencia',
    step1Title: 'Llega Problema Nuevo',
    step1Desc: 'Las habilidades existentes no aplican o han fallado',
    step2Title: 'Modelo A Propone',
    step2Desc: 'Humano solicita enfoque inicial al primer modelo',
    step3Title: 'Modelo B Verifica',
    step3Desc: 'Parafrasea Y marca cada afirmación con estado',
    step4Title: 'Portal de Entendimiento',
    step4Desc: 'Modelo A responde a todas las marcas (no cuando todas verdes)',
    step5Title: 'Modelo B Critica',
    step5Desc: 'Solo después de PE: revela modos de fallo, propone pruebas',
    step6Title: 'Portal de Acuerdo',
    step6Desc: 'Prueba ejecutable o acuerdo cualificado',
    step7Title: 'Portal de Articulación Humana',
    step7Desc: 'Debe reformular decisión para probar cualificación',
    step8Title: 'Habilidad Compilada',
    step8Desc: 'Esqueleto del modelo + aprobación humana = habilidad autorizada',
    stepOf: 'de',
    completed: 'Completado',
    currentStep: 'Paso actual',
    ugDetailText: 'El Modelo A debe responder a cada marca—defender, conceder o reconocer incertidumbre. El portal se cierra cuando A ha respondido, no cuando todas las marcas son verdes.',
    agDetailText: 'Tres resultados posibles: PA-ALTO, PA-CUALIFICADO, o ESCALAR.',
    agBlocksOnAssumed: '⚠ Bloquea en [asumido]',
    agBlocksOnAssumedDetail: 'PA no puede cerrarse mientras algún parámetro esté marcado [asumido]. Todas las afirmaciones deben ser [verificado:artefacto] o [verificado:prueba].',
    hagDetailTitle: 'Portal de Articulación Humana',
    hagDetailText: 'El humano debe reformular la decisión central en sus propias palabras. Esto es un portal, no un paso de producción.',
    gateOpen: 'Abierto',
    gateClosed: 'Cerrado',
    gateFailed: 'Fallido',
    understandingGate: 'Entendimiento',
    agreementGate: 'Acuerdo',
    preconditionTitle: 'Precondición: Verificación del Objeto',
    preconditionDesc: 'Antes de que comience la deliberación, el objeto en discusión debe ser inspeccionado—no asumido.',
    preconditionReq1: 'Inspección del artefacto completa',
    preconditionReq1Detail: 'Ejecutar herramientas (ffprobe, stat, etc.) en artefactos fuente',
    preconditionReq2: 'Todos los parámetros [verificado:artefacto]',
    preconditionReq2Detail: 'Ningún parámetro puede ser afirmado desde "conocimiento general"',
    preconditionWhy: 'Por qué esto importa:',
    preconditionWhyText: 'En el caso de Audio Forense, ambos modelos acordaron 48kHz basándose en "comportamiento típico de iPhone." El archivo real era 44.1kHz. La inspección salvó el proyecto.',
    postconditionTitle: 'Postcondición: Procedencia de Habilidad',
    postconditionDesc: 'Las habilidades compiladas de la forja deben citar su evidencia.',
    postconditionReq1: 'Número de turno donde se validó la técnica',
    postconditionReq2: 'Comando que se ejecutó',
    postconditionReq3: 'Artefacto de salida producido',
    swissCheeseTitle: 'Modelo Queso Suizo: Modelos heterogéneos cubren los puntos ciegos mutuos',
    swissCheeseDesc: 'Diagrama mostrando dos rebanadas de queso representando modelos Claude y GPT.',
    swissCheeseCoverage: 'Cobertura',
    swissCheeseSection: 'Cobertura Queso Suizo',
    swissCheeseExplain: 'El modelo de causación de accidentes de James Reason (2000).',
    swissCheeseApplied: 'aplicó esto a barreras de seguridad de IA. Nosotros lo aplicamos a',
    swissCheeseEpistemic: 'cobertura epistémica',
    swissCheeseEpistemicExplain: '—diferentes corpus de entrenamiento crean diferentes puntos ciegos.',
    verificationTitle: '¿Por Qué Parafrasear? Verificación Adversarial',
    coreInsight: 'La Idea Central',
    coreInsightText: 'demostró que los humanos pueden juzgar debates que no podrían generar. Nuestro mecanismo es',
    coreInsightMechanism: 'verificación adversarial activa a través de priors diferentes',
    coreInsightFinal: ': cada modelo debe tratar la salida del otro como sospechosa.',
    economicsTitle: '¿Cuándo Conviene Skill Forge?',
    economicsDesc: 'La mayoría de patrones multi-agente no consideran el costo. Skill Forge hace explícito el intercambio.',
    paramDeliberation: 'Costo de Deliberación',
    paramSkill: 'Costo de Invocación',
    paramFailure: 'Tasa de Fallo',
    paramProblems: 'Cantidad de Problemas',
    formulaTitle: 'Fórmulas',
    formulaWithout: 'Sin Forja',
    formulaWith: 'Con Forja',
    formulaBreakeven: 'Punto de equilibrio',
    costForge: 'forja',
    costWithout: 'sin',
    probFail: 'fallo',
    totalWithout: 'Total sin Forja',
    totalWith: 'Total con Forja',
    savings: 'Ahorro',
    units: 'unidades',
    problems: 'problemas',
    accumulationTitle: '¿Qué Se Acumula con el Tiempo?',
    accumulationDesc: 'La acumulación de Skill Forge está controlada por humanos: nada entra a la biblioteca sin un humano que demostró comprensión.',
    skillLibrary: 'Biblioteca de Habilidades',
    skillLibraryDesc: 'Cada habilidad forjada queda disponible para problemas futuros.',
    humanExpertise: 'Experiencia Humana',
    humanExpertiseDesc: 'La capacidad del humano para articular resultados mejora.',
    provenanceRecord: 'Registro de Procedencia',
    provenanceDesc: 'No todas las decisiones tienen igual peso.',
    thinSkillTitle: 'Arquitectura de Habilidades Ligeras',
    thinSkillSubtitle: 'Cómo las habilidades forjadas persisten y se acumulan',
    thinSkillIntro: 'Las habilidades forjadas se compilan a',
    thinSkillName: 'habilidades ligeras',
    thinSkillIntroEnd: '— archivos de instrucciones ligeros que viven en la base de conocimiento, no empaquetados con código.',
    thinSkillWhatTitle: '¿Qué es una Habilidad Ligera?',
    thinSkillWhat: 'Una habilidad ligera es un archivo markdown con instrucciones de ejecución, criterios de calidad y anti-patrones. Cualquier modelo con acceso MCP puede leerlo y ejecutarlo.',
    thinSkillVsNativeTitle: 'Habilidades Ligeras vs Plugins Nativos',
    thinSkillVsNativeIntro: 'Los plugins nativos empaquetan instrucciones con código. Las habilidades ligeras los separan:',
    comparisonNative: 'Plugin Nativo',
    comparisonThin: 'Habilidad Ligera',
    comparisonStorage: 'Almacenamiento',
    comparisonStorageNative: 'Empaquetado con código',
    comparisonStorageThin: 'Base de conocimiento',
    comparisonPortability: 'Portabilidad',
    comparisonPortabilityNative: 'Una sola plataforma',
    comparisonPortabilityThin: 'Cualquier cliente MCP',
    comparisonLearning: 'Bucle de Aprendizaje',
    comparisonLearningNative: 'Ninguno',
    comparisonLearningThin: 'Feedback → actualizar → siguiente uso beneficia',
    comparisonGating: 'Control Humano',
    comparisonGatingNative: 'Opcional',
    comparisonGatingThin: 'Requerido (Skill Forge)',
    thinSkillBenefits: 'Esta arquitectura significa que una habilidad forjada en Claude puede ser ejecutada por GPT, Gemini, o cualquier modelo futuro con acceso a Basic Memory.',
    inventoryTitle: 'Inventario Actual de Habilidades',
    inventoryIntro: 'Habilidades actualmente registradas en la base de conocimiento de Context Sage:',
    inventorySkill: 'Habilidad',
    inventoryPurpose: 'Propósito',
    inventoryStatus: 'Estado',
    inventoryLastVerified: 'Última Verificación',
    skillTriage: 'Triaje de Sesión',
    skillTriagePurpose: 'Revelar trabajo abierto al inicio de sesión',
    skillArtifactBuilder: 'Constructor de Artefactos',
    skillArtifactBuilderPurpose: 'Generar artefactos React con manifiestos',
    skillGovernanceDashboard: 'Panel de Gobernanza',
    skillGovernanceDashboardPurpose: 'Visualizar métricas de salud de KB',
    skillBasicMemoryDemo: 'Demo de Basic Memory',
    skillBasicMemoryDemoPurpose: 'Generar presentación de Context Sage',
    statusCanonical: 'canónico',
    statusDraft: 'borrador',
    inventoryNote: 'Cada habilidad incluye una cadena canary que prueba que fue cargada desde la KB.',
    learnMoreThinSkill: 'Más sobre Arquitectura de Habilidades Ligeras',
    referencesTitle: 'Referencias',
    referencesDesc: 'Skill Forge se basa en varias líneas de investigación.',
    whatsNovel: 'Qué es Novedoso en Skill Forge',
    novel1: 'Modelos heterogéneos con priors genuinamente diferentes',
    novel1Note: '— no solo especialización de roles',
    novel2: 'Paráfrasis adversarial como verificación activa',
    novel2Note: '— cada modelo marca afirmaciones con estado',
    novel3: 'Articulación humana como portal de cualificación',
    novel3Note: '— debe reformular antes de aprobar',
    novel4: 'Certificación humana con responsabilidad',
    novel4Note: '— certificar solo después de articular',
    novel5: 'El modelo produce habilidad, el humano aprueba',
    novel5Note: '— división clara de labor',
    novel6: 'Economía de amortización',
    novel6Note: '— modelo de costos explícito',
    exampleTitle: 'Ejemplo: Restauración de Audio Forense',
    exampleDesc: 'Una deliberación real de Skill Forge recuperando voces de una grabación en gimnasio. Explore cómo modelos heterogéneos revelan restricciones que un solo modelo pasaría por alto.',
    examplePlaceholder: 'Ver ejemplo completo en documento de especificación.',
    skipToMain: 'Saltar al contenido principal',
    selectView: 'Seleccionar una vista',
    processSteps: 'Pasos del proceso',
    costModelParams: 'Parámetros del Modelo de Costo',
    costCurveTitle: 'Gráfico de Comparación de Costos',
    costCurveDesc: 'Gráfico de líneas comparando costos.',
    linkOpensNewTab: 'se abre en nueva pestaña',
    footerTitle: 'Visualización del Patrón Skill Forge',
    footerVersion: 'Versión 2.2.0 | WCAG 2.1 AA | APA 7ª Ed.',
    canary: 'SKILLFORGE-V3.0.0-2026-01-08',
  },
  
  zh: {
    title: '技能锻造模式',
    subtitle: '审议 → 人类资格认证 → 可复用技能',
    navProcess: '流程',
    navVerification: '验证',
    navExample: '示例',
    navEconomics: '经济性',
    navAccumulation: '积累',
    navReferences: '参考文献',
    introStrong: '技能锻造',
    introText: '是一个审议过程，用于处理过于复杂或重要的决策。基于',
    introIrvingCite: 'Irving等人(2018)的洞见',
    introInsight: '——人类可以评判他们无法生成的辩论——但通过利用',
    introHeterogeneous: '异构先验',
    introHeterogeneousExplain: '而偏离同模型辩论。与寻求共识的方法(',
    introAHMAD: 'A-HMAD',
    introLLMCouncil: 'LLM Council',
    introGoalNot: ')不同，目标不是模型间的一致，而是',
    introQualifiedJudgment: '合格的人类判断',
    introQualifiedExplain: '：人类必须在批准技能之前阐明决策。与以代理为中心的技能积累(',
    introExpeL: 'ExpeL',
    introFinalClause: ')不同，没有证明理解的人类，任何内容都不会进入技能库。',
    processTitle: '单一问题通过锻造的流程',
    processDesc: '这里的模型没有分配角色——它们因真正不同的先验而被选择。',
    processRefImpl: '请查看完整的组合集成审议作为此流程的参考实现。',
    processRefImplLink: '查看参考审议',
    step1Title: '新问题到达',
    step1Desc: '现有技能不适用或已失败',
    step2Title: '模型A提议',
    step2Desc: '人类提示第一个模型',
    step3Title: '模型B验证',
    step3Desc: '复述并标记每个声明',
    step4Title: '理解门',
    step4Desc: '模型A回应所有标记',
    step5Title: '模型B批评',
    step5Desc: '揭示失败模式，提出测试',
    step6Title: '协议门',
    step6Desc: '可执行测试或有条件协议',
    step7Title: '人类阐述门',
    step7Desc: '必须重述决策以证明资格',
    step8Title: '技能编译',
    step8Desc: '模型骨架 + 人类批准 = 授权技能',
    stepOf: '/',
    completed: '已完成',
    currentStep: '当前步骤',
    ugDetailText: '模型A必须回应每个标记。门在A回应后关闭。',
    agDetailText: '三种可能结果：协议门-高，协议门-有条件，或升级。',
    agBlocksOnAssumed: '⚠ 在[假设]时阻塞',
    agBlocksOnAssumedDetail: '当任何参数标记为[假设]时，协议门无法关闭。所有声明必须是[已验证:工件]或[已验证:测试]。',
    hagDetailTitle: '人类阐述门',
    hagDetailText: '人类必须用自己的话重述核心决策。',
    gateOpen: '开启',
    gateClosed: '关闭',
    gateFailed: '失败',
    understandingGate: '理解',
    agreementGate: '协议',
    preconditionTitle: '前提条件：对象验证',
    preconditionDesc: '在审议开始之前，讨论的对象必须被检查——而非假设。',
    preconditionReq1: '工件检查完成',
    preconditionReq1Detail: '对源工件运行工具（ffprobe、stat等）',
    preconditionReq2: '所有参数[已验证:工件]',
    preconditionReq2Detail: '任何参数都不能基于"常识"断言',
    preconditionWhy: '为何重要：',
    preconditionWhyText: '在法医音频案例中，两个模型基于"典型iPhone行为"同意48kHz采样率。实际文件是44.1kHz。检查挽救了项目。',
    postconditionTitle: '后置条件：技能溯源',
    postconditionDesc: '从锻造中编译的技能必须引用其证据。',
    postconditionReq1: '验证技术的回合号',
    postconditionReq2: '运行的命令',
    postconditionReq3: '产生的输出工件',
    swissCheeseTitle: '瑞士奶酪模型：异构模型覆盖彼此的盲点',
    swissCheeseDesc: '图示显示两片奶酪代表Claude和GPT模型。',
    swissCheeseCoverage: '覆盖',
    swissCheeseSection: '瑞士奶酪覆盖',
    swissCheeseExplain: 'James Reason(2000)的事故因果模型。',
    swissCheeseApplied: '将此应用于AI安全护栏。我们将其应用于',
    swissCheeseEpistemic: '认知覆盖',
    swissCheeseEpistemicExplain: '——不同的训练语料创造不同的盲点。',
    verificationTitle: '为何复述？对抗验证',
    coreInsight: '核心洞见',
    coreInsightText: '表明人类可以评判他们无法生成的辩论。我们的机制是',
    coreInsightMechanism: '跨不同先验的主动对抗验证',
    coreInsightFinal: '：每个模型必须将另一个的输出视为可疑。',
    economicsTitle: '技能锻造何时值得？',
    economicsDesc: '技能锻造明确权衡：审议昂贵，但当问题类别重复时会摊销。',
    paramDeliberation: '审议成本',
    paramSkill: '技能调用成本',
    paramFailure: '技能失败率',
    paramProblems: '问题数量',
    formulaTitle: '公式',
    formulaWithout: '无锻造',
    formulaWith: '有锻造',
    formulaBreakeven: '盈亏平衡',
    costForge: '锻',
    costWithout: '无',
    probFail: '失',
    totalWithout: '无锻造总成本',
    totalWith: '有锻造总成本',
    savings: '节省',
    units: '单位',
    problems: '问题',
    accumulationTitle: '随时间积累什么？',
    accumulationDesc: '技能锻造的积累是人类把关的：没有证明理解的人类，任何内容都不会进入技能库。',
    skillLibrary: '技能库',
    skillLibraryDesc: '每个锻造的技能都可用于未来问题。',
    humanExpertise: '人类专业知识',
    humanExpertiseDesc: '人类阐述结果的能力提高。',
    provenanceRecord: '来源记录',
    provenanceDesc: '并非所有决策都具有同等权重。',
    thinSkillTitle: '轻量技能架构',
    thinSkillSubtitle: '锻造的技能如何持久化和累积',
    thinSkillIntro: '锻造的技能编译为',
    thinSkillName: '轻量技能',
    thinSkillIntroEnd: '——存储在知识库中的轻量指令文件，而非与代码捆绑。',
    thinSkillWhatTitle: '什么是轻量技能？',
    thinSkillWhat: '轻量技能是包含执行指令、质量标准和反模式的markdown文件。任何具有MCP访问权限的模型都可以读取和执行它。',
    thinSkillVsNativeTitle: '轻量技能 vs 原生插件',
    thinSkillVsNativeIntro: '平台原生插件将指令与代码捆绑。轻量技能将它们分离：',
    comparisonNative: '原生插件',
    comparisonThin: '轻量技能',
    comparisonStorage: '存储',
    comparisonStorageNative: '与代码捆绑',
    comparisonStorageThin: '知识库',
    comparisonPortability: '可移植性',
    comparisonPortabilityNative: '单一平台',
    comparisonPortabilityThin: '任何MCP客户端',
    comparisonLearning: '学习循环',
    comparisonLearningNative: '无',
    comparisonLearningThin: '反馈 → 更新 → 下次使用受益',
    comparisonGating: '人类把关',
    comparisonGatingNative: '可选',
    comparisonGatingThin: '必需（技能锻造）',
    thinSkillBenefits: '这种架构意味着在Claude中锻造的技能可以被GPT、Gemini或任何具有Basic Memory访问权限的未来模型执行。',
    inventoryTitle: '当前技能清单',
    inventoryIntro: 'Context Sage知识库中当前注册的技能：',
    inventorySkill: '技能',
    inventoryPurpose: '用途',
    inventoryStatus: '状态',
    inventoryLastVerified: '最后验证',
    skillTriage: '会话分诊',
    skillTriagePurpose: '在会话开始时揭示待处理工作',
    skillArtifactBuilder: '工件构建器',
    skillArtifactBuilderPurpose: '生成带清单的React工件',
    skillGovernanceDashboard: '治理仪表板',
    skillGovernanceDashboardPurpose: '可视化KB健康指标',
    skillBasicMemoryDemo: 'Basic Memory演示',
    skillBasicMemoryDemoPurpose: '生成Context Sage演示',
    statusCanonical: '规范',
    statusDraft: '草案',
    inventoryNote: '每个技能包含一个canary字符串，证明它是从KB加载的，而非幻觉。',
    learnMoreThinSkill: '了解更多轻量技能架构',
    referencesTitle: '参考文献',
    referencesDesc: '技能锻造借鉴多条研究线索。',
    whatsNovel: '技能锻造的创新点',
    novel1: '具有真正不同先验的异构模型',
    novel1Note: '——不仅仅是角色专门化',
    novel2: '对抗性复述作为主动验证',
    novel2Note: '——每个模型标记声明状态',
    novel3: '人类阐述作为资格门',
    novel3Note: '——批准前必须重述',
    novel4: '带责任的人类认证',
    novel4Note: '——仅在阐述后认证',
    novel5: '模型产生技能，人类批准',
    novel5Note: '——明确的劳动分工',
    novel6: '摊销经济学',
    novel6Note: '——针对重复问题的显式成本模型',
    exampleTitle: '示例：法医音频恢复',
    exampleDesc: '一个从体育馆录音中恢复人声的真实技能锻造审议。探索异构模型如何揭示单一模型会遗漏的约束。',
    examplePlaceholder: '完整示例见规格文档。',
    skipToMain: '跳至主要内容',
    selectView: '选择视图',
    processSteps: '流程步骤',
    costModelParams: '成本模型参数',
    costCurveTitle: '成本比较图表',
    costCurveDesc: '折线图比较成本。',
    linkOpensNewTab: '在新标签页中打开',
    footerTitle: '技能锻造模式可视化',
    footerVersion: '版本 2.2.0 | WCAG 2.1 AA | APA第7版',
    canary: 'SKILLFORGE-V3.0.0-2026-01-08',
  },
};

const t = (lang: string, key: string): string => i18n[lang]?.[key] || i18n.en[key] || key;

// =============================================================================
// REFERENCES
// =============================================================================

const REFERENCES = {
  irving2018: { id: 'irving2018', authors: 'Irving, G., Christiano, P., & Amodei, D.', year: 2018, title: 'AI safety via debate', source: 'arXiv preprint', url: 'https://arxiv.org/abs/1805.00899', shortCite: 'Irving et al., 2018' },
  reason2000: { id: 'reason2000', authors: 'Reason, J.', year: 2000, title: 'Human error: Models and management', source: 'BMJ, 320(7237), 768–770', url: 'https://doi.org/10.1136/bmj.320.7237.768', shortCite: 'Reason, 2000' },
  shamsujjoha2024: { id: 'shamsujjoha2024', authors: 'Shamsujjoha, M., et al.', year: 2024, title: 'A Swiss cheese model for AI safety', source: 'arXiv preprint', url: 'https://arxiv.org/abs/2408.02205', shortCite: 'Shamsujjoha et al., 2024' },
  zhou2025: { id: 'zhou2025', authors: 'Zhou, Y., & Chen, X.', year: 2025, title: 'A-HMAD: Heterogeneous multi-agent deliberation', source: 'Journal of King Saud University', url: 'https://doi.org/10.1016/j.jksuci.2024.102252', shortCite: 'Zhou & Chen, 2025' },
  karpathy2024: { id: 'karpathy2024', authors: 'Karpathy, A.', year: 2024, title: 'LLM Council', source: 'GitHub repository', url: 'https://github.com/karpathy/llm-council', shortCite: 'Karpathy, 2024' },
  zhao2023: { id: 'zhao2023', authors: 'Zhao, A., et al.', year: 2023, title: 'ExpeL: LLM agents are experiential learners', source: 'arXiv preprint', url: 'https://arxiv.org/abs/2308.10144', shortCite: 'Zhao et al., 2023' },
};

// =============================================================================
// SKILL INVENTORY DATA
// =============================================================================

const SKILL_INVENTORY = [
  { id: 'artifact-builder', nameKey: 'skillArtifactBuilder', purposeKey: 'skillArtifactBuilderPurpose', status: 'canonical', lastVerified: '2025-12-10' },
  { id: 'artifact-integration', nameKey: 'skillArtifactIntegration', purposeKey: 'skillArtifactIntegrationPurpose', status: 'canonical', lastVerified: '2026-01-08' },
  { id: 'skill-forge', nameKey: 'skillSkillForge', purposeKey: 'skillSkillForgePurpose', status: 'canonical', lastVerified: '2026-01-08' },
  { id: 'context-sage-demo', nameKey: 'skillContextSageDemo', purposeKey: 'skillContextSageDemoPurpose', status: 'canonical', lastVerified: '2026-01-08' },
  { id: 'memento-demo', nameKey: 'skillMementoDemo', purposeKey: 'skillMementoDemoPurpose', status: 'canonical', lastVerified: '2026-01-05' },
  { id: 'basic-memory-demo', nameKey: 'skillBasicMemoryDemo', purposeKey: 'skillBasicMemoryDemoPurpose', status: 'draft', lastVerified: '2025-12-17' },
  { id: 'governance-dashboard', nameKey: 'skillGovernanceDashboard', purposeKey: 'skillGovernanceDashboardPurpose', status: 'draft', lastVerified: '2025-12-17' },
  { id: 'chrome-extension-builder', nameKey: 'skillChromeExtension', purposeKey: 'skillChromeExtensionPurpose', status: 'draft', lastVerified: '2025-12-18' },
  { id: 'triage', nameKey: 'skillTriage', purposeKey: 'skillTriagePurpose', status: 'draft', lastVerified: '2025-12-30' },
];

// =============================================================================
// KATEX SINGLETON
// =============================================================================

let katexLoadPromise: Promise<boolean> | null = null;

const loadKaTeX = () => {
  if (katexLoadPromise) return katexLoadPromise;
  if (window.katex) return Promise.resolve(true);
  
  katexLoadPromise = new Promise((resolve) => {
    if (!document.querySelector('link[href*="katex"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
    
    if (!document.querySelector('script[src*="katex"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js';
      script.crossOrigin = 'anonymous';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    } else if (window.katex) {
      resolve(true);
    }
  });
  
  return katexLoadPromise;
};

const useKaTeX = () => {
  const [katexReady, setKatexReady] = useState(!!window.katex);
  const [katexFailed, setKatexFailed] = useState(false);

  useEffect(() => {
    if (window.katex) { setKatexReady(true); return; }
    loadKaTeX().then((success: boolean) => {
      if (success) setKatexReady(true);
      else setKatexFailed(true);
    });
  }, []);

  return { katexReady, katexFailed };
};

const LaTeX = ({ children, display = false }: any) => {
  const { katexReady, katexFailed } = useKaTeX();
  const containerRef = useRef(null);

  useEffect(() => {
    if (katexReady && containerRef.current && window.katex) {
      try {
        window.katex.render(children, containerRef.current, { displayMode: display, throwOnError: false, trust: true });
      } catch (e) { console.warn('KaTeX render error:', e); }
    }
  }, [katexReady, children, display]);

  if (katexFailed || !katexReady) {
    return (
      <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
        {display ? <div style={{ textAlign: 'center', margin: '1em 0' }}>{children}</div> : children}
      </span>
    );
  }

  return <span ref={containerRef} aria-label={`Formula: ${children}`} style={display ? { display: 'block', textAlign: 'center', margin: '1em 0' } : {}} />;
};

// =============================================================================
// CONDITIONAL LINK (props-based navigation)
// =============================================================================

const ConditionalLink = ({ href, children, style = {} }: any) => {
  if (href) {
    return <a href={href} style={{ color: '#a00000', textDecoration: 'underline', ...style }}>{children}</a>;
  }
  return <em style={style}>{children}</em>;
};

// =============================================================================
// SUBCOMPONENTS
// =============================================================================

const CitationLink = ({ reference, children, lang }: any) => {
  const ref = (REFERENCES as Record<string, any>)[reference];
  if (!ref) return <span>{children}</span>;
  return (
    <a href={ref.url} target="_blank" rel="noopener noreferrer" data-testid={`cite-${reference}`}
      className={styles.citationLink}
      aria-label={`${ref.shortCite}, ${ref.title}, ${t(lang, 'linkOpensNewTab')}`}>
      {children || ref.shortCite}
      <ExternalLink className={styles.citationLinkIcon} aria-hidden="true" />
    </a>
  );
};

const SkipLink = ({ lang }: any) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <a href="#main-content" data-testid="skip-link"
      className={focused ? styles.skipLinkFocused : styles.skipLink}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}>
      {t(lang, 'skipToMain')}
    </a>
  );
};

const FlowStep = ({ number, title, description, active, completed, onClick, totalSteps, lang }: any) => (
  <button onClick={onClick} data-testid={`step-${number}`}
    className={`${styles.flowStep} ${active ? styles.flowStepActive : ''} ${completed ? styles.flowStepCompleted : ''}`}
    aria-current={active ? 'step' : undefined}
    aria-label={`${number} ${t(lang, 'stepOf')} ${totalSteps}: ${title}. ${description}.`}>
    <div className={styles.flowStepContent}>
      <span className={`${styles.flowStepBadge} ${active ? styles.flowStepBadgeActive : ''} ${completed ? styles.flowStepBadgeCompleted : ''}`} aria-hidden="true">
        {completed ? <Check className={styles.flowStepBadgeIcon} /> : number}
      </span>
      <div>
        <div className={styles.flowStepTitle}>{title}</div>
        <div className={styles.flowStepDesc}>{description}</div>
      </div>
    </div>
  </button>
);

const Gate = ({ type, status, label, lang }: any) => {
  const statusMap: Record<string, string> = { open: styles.gateOpen, closed: styles.gateClosed, failed: styles.gateFailed };
  const statusClass = statusMap[status];
  const statusText: Record<string, string> = { open: t(lang, 'gateOpen'), closed: t(lang, 'gateClosed'), failed: t(lang, 'gateFailed') };
  return (
    <div data-testid={`gate-${type.toLowerCase()}`} className={`${styles.gate} ${statusClass}`} role="status" aria-label={`${type} Gate: ${statusText[status]} - ${label}`}>
      {status === 'open' && <AlertCircle className={styles.gateIcon} aria-hidden="true" />}
      {status === 'closed' && <Check className={styles.gateIcon} aria-hidden="true" />}
      {status === 'failed' && <X className={styles.gateIcon} aria-hidden="true" />}
      <span className={styles.gateType}>{type}</span>
      <span className={styles.gateLabel}>({label})</span>
    </div>
  );
};

// Precondition Band (LCE) - displays invariant requirements before process flow
const PreconditionBand = ({ lang, type = 'pre' }: any) => {
  const isPre = type === 'pre';
  return (
    <div
      className={`${styles.conditionBand} ${isPre ? styles.conditionBandPre : styles.conditionBandPost}`}
      role="note"
      aria-label={isPre ? t(lang, 'preconditionTitle') : t(lang, 'postconditionTitle')}
      data-testid={`${type}condition-band`}
    >
      <div className={styles.conditionBandHeader}>
        <AlertCircle className={styles.conditionBandIcon} aria-hidden="true" />
        <span className={styles.conditionBandTitle}>
          {isPre ? t(lang, 'preconditionTitle') : t(lang, 'postconditionTitle')}
        </span>
      </div>
      <p className={styles.conditionBandDesc}>
        {isPre ? t(lang, 'preconditionDesc') : t(lang, 'postconditionDesc')}
      </p>
      <ul className={styles.conditionBandList}>
        {isPre ? (
          <>
            <li>
              <Check className={styles.conditionBandCheckIcon} aria-hidden="true" />
              <span>
                <strong>{t(lang, 'preconditionReq1')}</strong>
                <span className={styles.conditionBandDetail}> — {t(lang, 'preconditionReq1Detail')}</span>
              </span>
            </li>
            <li>
              <Check className={styles.conditionBandCheckIcon} aria-hidden="true" />
              <span>
                <strong>{t(lang, 'preconditionReq2')}</strong>
                <span className={styles.conditionBandDetail}> — {t(lang, 'preconditionReq2Detail')}</span>
              </span>
            </li>
          </>
        ) : (
          <>
            <li><Check className={styles.conditionBandCheckIcon} aria-hidden="true" /><span>{t(lang, 'postconditionReq1')}</span></li>
            <li><Check className={styles.conditionBandCheckIcon} aria-hidden="true" /><span>{t(lang, 'postconditionReq2')}</span></li>
            <li><Check className={styles.conditionBandCheckIcon} aria-hidden="true" /><span>{t(lang, 'postconditionReq3')}</span></li>
          </>
        )}
      </ul>
      {isPre && (
        <div className={styles.conditionBandWhy}>
          <strong>{t(lang, 'preconditionWhy')}</strong> {t(lang, 'preconditionWhyText')}
        </div>
      )}
    </div>
  );
};

const SwissCheeseVisualization = ({ lang }: any) => (
  <figure role="img" aria-labelledby="swiss-cheese-caption" className={styles.figure}>
    <svg viewBox="0 0 450 180" className={styles.figureSvg} aria-labelledby="swiss-cheese-title swiss-cheese-desc" data-testid="swiss-cheese-svg">
      <title id="swiss-cheese-title">{t(lang, 'swissCheeseTitle')}</title>
      <desc id="swiss-cheese-desc">{t(lang, 'swissCheeseDesc')}</desc>
      <g><rect x="20" y="20" width="100" height="140" rx="8" fill="#b8860b" stroke="#8b6914" strokeWidth="2" /><circle cx="50" cy="45" r="12" fill="#fffff8" stroke="#ccc" /><circle cx="85" cy="75" r="10" fill="#fffff8" stroke="#ccc" /><circle cx="45" cy="110" r="14" fill="#fffff8" stroke="#ccc" /><circle cx="90" cy="135" r="8" fill="#fffff8" stroke="#ccc" /><text x="70" y="170" textAnchor="middle" fill="#111" fontSize="12" fontFamily="Palatino, Georgia, serif">Claude</text></g>
      <text x="145" y="95" textAnchor="middle" fill="#555" fontSize="24" fontWeight="bold">+</text>
      <g><rect x="170" y="20" width="100" height="140" rx="8" fill="#2d5a3d" stroke="#1e3d29" strokeWidth="2" /><circle cx="220" cy="40" r="11" fill="#fffff8" stroke="#ccc" /><circle cx="190" cy="80" r="13" fill="#fffff8" stroke="#ccc" /><circle cx="240" cy="105" r="9" fill="#fffff8" stroke="#ccc" /><circle cx="205" cy="140" r="12" fill="#fffff8" stroke="#ccc" /><text x="220" y="170" textAnchor="middle" fill="#111" fontSize="12" fontFamily="Palatino, Georgia, serif">GPT</text></g>
      <text x="295" y="95" textAnchor="middle" fill="#555" fontSize="24" fontWeight="bold">=</text>
      <g><rect x="320" y="20" width="100" height="140" rx="8" fill="#f5fff5" stroke="#2d5a3d" strokeWidth="2" /><path d="M355 85 L365 95 L390 70" stroke="#2d5a3d" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /><text x="370" y="120" textAnchor="middle" fill="#2d5a3d" fontSize="12" fontFamily="Palatino, Georgia, serif" fontWeight="500">{t(lang, 'swissCheeseCoverage')}</text></g>
    </svg>
    <figcaption id="swiss-cheese-caption" className={styles.figCaption}>{t(lang, 'swissCheeseTitle')}</figcaption>
  </figure>
);

const Slider = ({ id, label, value, onChange, min, max, step, unit }: any) => (
  <div className={styles.sliderContainer}>
    <div className={styles.sliderHeader}>
      <label htmlFor={id} className={styles.sliderLabel}>{label}</label>
      <span className={styles.sliderValue}>{value}{unit}</span>
    </div>
    <input type="range" id={id} data-testid={`slider-${id}`} min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className={styles.slider} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} aria-valuetext={`${value}${unit}`} />
  </div>
);

const CostCurve = ({ D, S, pFail, maxN, lang }: any) => {
  const width = 400, height = 250;
  const padding = { top: 30, right: 20, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const withoutForge = (n: number) => n * D;
  const withForge = (n: number) => D + (n - 1) * (S + pFail * D);
  const maxCost = withoutForge(maxN);
  const scaleX = (n: number) => padding.left + (n / maxN) * chartWidth;
  const scaleY = (cost: number) => padding.top + chartHeight - (cost / maxCost) * chartHeight;
  const pathWithout = Array.from({ length: maxN + 1 }, (_, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(withoutForge(i))}`).join(' ');
  const pathWith = Array.from({ length: maxN + 1 }, (_, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(withForge(i))}`).join(' ');
  const breakEven = D / (D - S - pFail * D);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className={styles.costCurveSvg} data-testid="cost-curve-svg" aria-labelledby="cost-curve-title cost-curve-desc">
      <title id="cost-curve-title">{t(lang, 'costCurveTitle')}</title>
      <desc id="cost-curve-desc">{t(lang, 'costCurveDesc')}</desc>
      {[0, 0.25, 0.5, 0.75, 1].map((frac) => (<g key={frac}><line x1={padding.left} y1={padding.top + frac * chartHeight} x2={width - padding.right} y2={padding.top + frac * chartHeight} stroke="#ccc" strokeDasharray="2,4" /><text x={padding.left - 8} y={padding.top + frac * chartHeight + 4} textAnchor="end" fontSize="11" fill="#555" fontFamily="Palatino, Georgia, serif">{Math.round(maxCost * (1 - frac))}</text></g>))}
      {[0, Math.round(maxN/4), Math.round(maxN/2), Math.round(3*maxN/4), maxN].map((n) => (<text key={n} x={scaleX(n)} y={height - padding.bottom + 20} textAnchor="middle" fontSize="11" fill="#555" fontFamily="Palatino, Georgia, serif">{n}</text>))}
      <text x={width / 2} y={height - 8} textAnchor="middle" fontSize="12" fill="#111" fontFamily="Palatino, Georgia, serif" fontStyle="italic">N ({t(lang, 'problems')})</text>
      <text x={15} y={height / 2} textAnchor="middle" fontSize="12" fill="#111" fontFamily="Palatino, Georgia, serif" fontStyle="italic" transform={`rotate(-90, 15, ${height / 2})`}>Cost ({t(lang, 'units')})</text>
      <path d={pathWithout} fill="none" stroke="#555" strokeWidth="2" />
      <path d={pathWith} fill="none" stroke="#a00000" strokeWidth="2" />
      {breakEven > 0 && breakEven < maxN && (<g><line x1={scaleX(breakEven)} y1={padding.top} x2={scaleX(breakEven)} y2={height - padding.bottom} stroke="#a00000" strokeDasharray="4,4" strokeOpacity="0.5" /><circle cx={scaleX(breakEven)} cy={scaleY(withoutForge(breakEven))} r="4" fill="#a00000" /></g>)}
      <g transform={`translate(${padding.left + 10}, ${padding.top + 10})`}><line x1="0" y1="0" x2="20" y2="0" stroke="#555" strokeWidth="2" /><text x="28" y="4" fontSize="11" fill="#111" fontFamily="Palatino, Georgia, serif">{t(lang, 'formulaWithout')}</text><line x1="0" y1="18" x2="20" y2="18" stroke="#a00000" strokeWidth="2" /><text x="28" y="22" fontSize="11" fill="#111" fontFamily="Palatino, Georgia, serif">{t(lang, 'formulaWith')}</text></g>
    </svg>
  );
};

const NavTab = ({ id, label, icon: Icon, active, onClick }: any) => (
  <button role="tab" id={`tab-${id}`} data-testid={`nav-${id}`} aria-selected={active} aria-controls={`panel-${id}`} tabIndex={active ? 0 : -1} onClick={onClick}
    className={`${styles.navTab} ${active ? styles.navTabActive : ''}`}>
    <Icon className={styles.navTabIcon} aria-hidden="true" />
    <span className={styles.navTabLabel}>{label}</span>
  </button>
);

const ExpandablePanel = ({ id, icon: Icon, title, expanded, onToggle, children }: any) => (
  <div className={styles.expandablePanel}>
    <button id={`${id}-header`} data-testid={`collapse-${id}`} onClick={onToggle}
      className={styles.expandableHeader}
      aria-expanded={expanded} aria-controls={`${id}-content`}>
      <div className={styles.expandableHeaderContent}>
        <Icon className={styles.expandableIcon} aria-hidden="true" />
        <span className={styles.expandableTitle}>{title}</span>
      </div>
      {expanded ? <ChevronDown className={styles.expandableIcon} aria-hidden="true" /> : <ChevronRight className={styles.expandableIcon} aria-hidden="true" />}
    </button>
    {expanded && (<div id={`${id}-content`} role="region" aria-labelledby={`${id}-header`} className={styles.expandableContent}>{children}</div>)}
  </div>
);

const RewordGate = ({ lang, onApprove, minChars = 50 }: any) => {
  const [text, setText] = React.useState('');
  const [approved, setApproved] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const isUnlocked = text.length >= minChars;

  const handleApprove = () => {
    if (isUnlocked && !approved) {
      setApproved(true);
      onApprove?.(text);
    }
  };

  if (approved) {
    return (
      <div data-testid="reword-gate" className={styles.rewordGateApprovedState}>
        <div className={styles.rewordGateRow} style={{ marginBottom: 12 }}>
          <Check className={styles.rewordGateApprovedIcon} aria-hidden="true" />
          <span className={styles.rewordGateApprovedTitle}>{t(lang, 'rewordGateApproved')}</span>
        </div>
        <p className={styles.rewordGateApprovedText}>{t(lang, 'rewordGateApprovedDetail')}</p>
      </div>
    );
  }

  // Collapsed state - opt-in button
  if (!expanded) {
    return (
      <div data-testid="reword-gate" className={styles.rewordGateCollapsed}>
        <div className={styles.rewordGateRow}>
          <div>
            <h3 className={styles.rewordGateTitleSm}>{t(lang, 'rewordGateTitle')}</h3>
            <p className={styles.rewordGateSubtext}>{t(lang, 'rewordGateOptional')}</p>
          </div>
          <button
            data-testid="expand-articulation"
            onClick={() => setExpanded(true)}
            className={styles.rewordGateExpandBtn}
          >
            {t(lang, 'rewordGateExpand')}
          </button>
        </div>
      </div>
    );
  }

  // Expanded state - full articulation form
  return (
    <div data-testid="reword-gate" className={styles.rewordGateExpanded}>
      <div className={styles.rewordGateRow} style={{ marginBottom: 16, alignItems: 'flex-start' }}>
        <h3 className={styles.rewordGateTitleLg}>{t(lang, 'rewordGateTitle')}</h3>
        <button
          onClick={() => setExpanded(false)}
          className={styles.rewordGateCollapseBtn}
          aria-label="Collapse"
        >
          {t(lang, 'rewordGateCollapse')}
        </button>
      </div>
      <div className={styles.rewordGateTextareaWrapper}>
        <textarea
          data-testid="reword-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t(lang, 'rewordGatePlaceholder')}
          className={styles.rewordGateTextareaFull}
          aria-label={t(lang, 'rewordGatePlaceholder')}
        />
      </div>
      <div className={styles.rewordGateRow}>
        <span className={isUnlocked ? styles.rewordGateCharCountValid : styles.rewordGateCharCount}>
          <strong>{text.length}</strong> / {minChars} {t(lang, 'rewordGateCharCount')} {!isUnlocked && `(${minChars} ${t(lang, 'rewordGateMinChars')})`}
        </span>
        <button
          data-testid="approve-button"
          onClick={handleApprove}
          disabled={!isUnlocked}
          className={`${styles.rewordGateSubmitBtn} ${isUnlocked ? styles.rewordGateSubmitBtnEnabled : styles.rewordGateSubmitBtnDisabled}`}
          aria-disabled={!isUnlocked}
        >
          {isUnlocked ? t(lang, 'rewordGateButtonUnlocked') : t(lang, 'rewordGateButtonLocked')}
        </button>
      </div>
    </div>
  );
};

const SkillInventoryTable = ({ lang, links }: any) => (
  <div className={styles.inventoryWrapper}>
    <table className={styles.inventoryTableFull} data-testid="skill-inventory">
      <thead>
        <tr className={styles.inventoryHeaderRow}>
          <th className={styles.inventoryHeaderCell}>{t(lang, 'inventorySkill')}</th>
          <th className={styles.inventoryHeaderCell}>{t(lang, 'inventoryPurpose')}</th>
          <th className={styles.inventoryHeaderCellCenter}>{t(lang, 'inventoryStatus')}</th>
          <th className={styles.inventoryHeaderCellCenter}>{t(lang, 'inventoryLastVerified')}</th>
        </tr>
      </thead>
      <tbody>
        {SKILL_INVENTORY.map((skill) => (
          <tr key={skill.id} className={styles.inventoryRow}>
            <td className={styles.inventoryCellName}>
              {links?.[skill.id] ? (
                <a href={links[skill.id]} className={styles.citationLink}>{t(lang, skill.nameKey)}</a>
              ) : (
                t(lang, skill.nameKey)
              )}
            </td>
            <td className={styles.inventoryCellDesc}>{t(lang, skill.purposeKey)}</td>
            <td className={styles.inventoryCellCenter}>
              <span className={`${styles.statusBadge} ${skill.status === 'canonical' ? styles.statusBadgeCanonical : styles.statusBadgeDraft}`}>
                {t(lang, skill.status === 'canonical' ? 'statusCanonical' : 'statusDraft')}
              </span>
            </td>
            <td className={styles.inventoryCellMono}>{skill.lastVerified}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// GateProgress - Shows deliberation gate status
const GateProgress = ({ lang, gates = { ug: false, ag: false, ea: false } }: any) => {
  const closedCount = Object.values(gates).filter(Boolean).length;
  const total = Object.keys(gates).length;

  return (
    <div className={styles.gateProgressContainer} role="progressbar" aria-valuenow={closedCount} aria-valuemin={0} aria-valuemax={total} aria-label={`Gate progress: ${closedCount} of ${total} gates closed`}>
      <div className={styles.gateProgressBadges}>
        {[
          { key: 'ug', label: t(lang, 'gateUG'), full: t(lang, 'gateUGFull'), closed: gates.ug },
          { key: 'ag', label: t(lang, 'gateAG'), full: t(lang, 'gateAGFull'), closed: gates.ag },
          { key: 'ea', label: t(lang, 'gateEA'), full: t(lang, 'gateEAFull'), closed: gates.ea },
        ].map(({ key, label, full, closed }) => (
          <span
            key={key}
            title={`${full}: ${closed ? t(lang, 'gateClosed') : t(lang, 'gateOpen')}`}
            className={`${styles.gateProgressBadgeItem} ${closed ? styles.gateProgressBadgeClosed : styles.gateProgressBadgeOpen}`}
          >
            {closed ? <Check className={styles.gateProgressBadgeIcon} aria-hidden="true" /> : <span className={styles.gateProgressDot} />}
            {label}
          </span>
        ))}
      </div>
      <span className={styles.gateProgressCount}>
        {closedCount}/{total} {t(lang, 'gateProgress')}
      </span>
    </div>
  );
};

// FeaturedExample - Hero card for primary example
const FeaturedExample = ({ lang, expanded, onToggle, links }: any) => {
  const isLive = true; // Forensic Audio gates are still open

  return (
    <div
      className={`${styles.featuredExampleCard} ${isLive ? styles.featuredExampleCardLive : styles.featuredExampleCardCompiled}`}
      data-testid="featured-example"
    >
      {/* Header */}
      <div className={styles.featuredExampleCardHeader}>
        <div className={styles.featuredExampleCardHeaderRow}>
          <div className={styles.featuredExampleCardHeaderContent}>
            <div className={styles.featuredExampleCardLabel}>
              {t(lang, 'featuredExampleLabel')}
            </div>
            <h3 className={styles.featuredExampleCardTitle}>
              {t(lang, 'featuredExampleTitle')}
            </h3>
          </div>
          <span
            role="status"
            aria-live="polite"
            aria-label={isLive ? t(lang, 'featuredLiveTooltip') : t(lang, 'featuredCompiledTooltip')}
            title={isLive ? t(lang, 'featuredLiveTooltip') : t(lang, 'featuredCompiledTooltip')}
            className={`${styles.featuredExampleStatusBadge} ${isLive ? styles.featuredExampleStatusLive : styles.featuredExampleStatusCompiled}`}
          >
            {isLive && <span className={styles.gateProgressDot} style={{ animation: 'pulse 2s ease-in-out infinite' }} />}
            {isLive ? t(lang, 'featuredLiveBadge') : t(lang, 'featuredCompiledBadge')}
          </span>
        </div>
        <p className={styles.featuredExampleDesc}>
          {t(lang, 'featuredExampleDesc')}
        </p>
      </div>

      {/* At-a-glance metadata */}
      <div className={styles.featuredExampleMeta}>
        <div className={styles.featuredExampleMetaItem}>
          <div className={styles.featuredExampleMetaLabel}>{t(lang, 'featuredModels')}</div>
          <div className={styles.featuredExampleMetaValue}>Claude + Gemini</div>
        </div>
        <div className={styles.featuredExampleMetaItem}>
          <div className={styles.featuredExampleMetaLabel}>{t(lang, 'featuredModalities')}</div>
          <div className={styles.featuredExampleModalityList}>
            <span title={t(lang, 'modalityAudio')} className={styles.featuredExampleModalityIcon}>🎵</span>
            <span title={t(lang, 'modalityVideo')} className={styles.featuredExampleModalityIcon}>🎬</span>
            <span title={t(lang, 'modalityText')} className={styles.featuredExampleModalityIcon}>📝</span>
          </div>
        </div>
        <div className={styles.featuredExampleMetaItemSm}>
          <div className={styles.featuredExampleMetaLabel}>{t(lang, 'featuredSize')}</div>
          <div className={styles.featuredExampleMetaValue}>~200KB</div>
        </div>
        <div className={styles.featuredExampleMetaItemSm}>
          <div className={styles.featuredExampleMetaLabel}>{t(lang, 'featuredTurns')}</div>
          <div className={styles.featuredExampleMetaValue}>12+</div>
        </div>
      </div>

      {/* Gate Progress */}
      <div className={styles.featuredExampleGateSection}>
        <div className={styles.featuredExampleGateLabel}>{t(lang, 'featuredGateStatus')}</div>
        <GateProgress lang={lang} gates={{ ug: true, ag: false, ea: false }} />
      </div>

      {/* Expandable detail */}
      <button
        onClick={onToggle}
        className={styles.featuredExampleToggle}
        aria-expanded={expanded}
      >
        <span className={styles.featuredExampleToggleLabel}>{t(lang, 'featuredDeliberationFlow')}</span>
        {expanded ? <ChevronDown className={styles.featuredExampleToggleIcon} /> : <ChevronRight className={styles.featuredExampleToggleIcon} />}
      </button>

      {expanded && (
        <div className={styles.featuredExampleExpandedContent}>
          {/* Problem Statement */}
          <div className={styles.featuredExampleProblem}>
            <p className={styles.featuredExampleProblemText}><strong>Problem:</strong> {t(lang, 'featuredProblem')}</p>
            {links?.forensicDialogue && (
              <p className={styles.featuredExampleDialogueLink}>
                <a href={links.forensicDialogue} className={styles.featuredExampleDialogueLinkAnchor}>
                  {t(lang, 'featuredViewDialogue')} →
                </a>
              </p>
            )}
          </div>

          {/* 8-Turn Deliberation */}
          <div className={styles.featuredExampleTurns}>
            {(() => {
              const getRoleBadgeClass = (role: string) => {
                if (role === 'GA') return `${styles.featuredExampleRoleBadge} ${styles.featuredExampleRoleBadgeGA}`;
                if (role === 'IA') return `${styles.featuredExampleRoleBadge} ${styles.featuredExampleRoleBadgeIA}`;
                return `${styles.featuredExampleRoleBadge} ${styles.featuredExampleRoleBadgeHO}`;
              };
              const turns = [
                { num: 1, role: 'GA', key: 'featuredTurn1' },
                { num: 2, role: 'IA', key: 'featuredTurn2' },
                { num: 3, role: 'GA', key: 'featuredTurn3', gate: 'UG' },
                { num: 4, role: 'HO', key: 'featuredTurn4' },
                { num: 5, role: 'IA', key: 'featuredTurn5' },
                { num: 6, role: 'GA', key: 'featuredTurn6' },
                { num: 7, role: 'IA', key: 'featuredTurn7', gate: 'AG' },
                { num: 8, role: 'HO', key: 'featuredTurn8', gate: 'EA' },
              ];
              return (
                <div className={styles.featuredExampleTurnList}>
                  {turns.map(({ num, role, key, gate }) => (
                    <div key={num}>
                      <div className={styles.featuredExampleTurn}>
                        <span className={styles.featuredExampleTurnNum}>{num}</span>
                        <span className={getRoleBadgeClass(role)}>{t(lang, `featured${role}Label`)}</span>
                        <p className={`${styles.featuredExampleTurnText} ${role === 'HO' ? styles.featuredExampleTurnTextHO : ''}`}>
                          {role === 'HO' ? `"${t(lang, key)}"` : t(lang, key)}
                        </p>
                      </div>
                      {gate && (
                        <div className={styles.featuredExampleGateBadge}>
                          <span className={styles.featuredExampleGateClosedBadge}>
                            <Check className={styles.featuredExampleGateClosedIcon} aria-hidden="true" />
                            <span className={styles.featuredExampleGateClosedText}>{t(lang, `featured${gate}Note`)}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Value Demonstrated */}
          <div className={styles.featuredExampleValue}>
            <div className={styles.featuredExampleValueTitle}>{t(lang, 'featuredValueTitle')}</div>
            <div className={styles.featuredExampleValueGrid}>
              {/* Without deliberation */}
              <div className={`${styles.featuredExampleValueCard} ${styles.featuredExampleValueCardWithout}`}>
                <div className={`${styles.featuredExampleValueCardLabel} ${styles.featuredExampleValueCardLabelWithout}`}>{t(lang, 'featuredValueWithout')}</div>
                <p className={`${styles.featuredExampleValueCardText} ${styles.featuredExampleValueCardTextWithout}`}>{t(lang, 'featuredValueWithoutText')}</p>
              </div>
              {/* With deliberation */}
              <div className={`${styles.featuredExampleValueCard} ${styles.featuredExampleValueCardWith}`}>
                <div className={`${styles.featuredExampleValueCardLabel} ${styles.featuredExampleValueCardLabelWith}`}>{t(lang, 'featuredValueWith')}</div>
                <p className={`${styles.featuredExampleValueCardText} ${styles.featuredExampleValueCardTextWith}`}>{t(lang, 'featuredValueWithText')}</p>
              </div>
              {/* Why heterogeneity matters */}
              <div className={`${styles.featuredExampleValueCard} ${styles.featuredExampleValueCardHeterogeneity}`}>
                <div className={`${styles.featuredExampleValueCardLabel} ${styles.featuredExampleValueCardLabelHeterogeneity}`}>{t(lang, 'featuredValueHeterogeneity')}</div>
                <p className={`${styles.featuredExampleValueCardText} ${styles.featuredExampleValueCardTextHeterogeneity}`}>{t(lang, 'featuredValueHeterogeneityText')}</p>
              </div>
              {/* Skill extracted */}
              <div className={`${styles.featuredExampleValueCard} ${styles.featuredExampleValueCardSkill}`}>
                <div className={`${styles.featuredExampleValueCardLabel} ${styles.featuredExampleValueCardLabelSkill}`}>{t(lang, 'featuredValueSkill')}</div>
                <p className={`${styles.featuredExampleValueCardText} ${styles.featuredExampleValueCardTextSkill}`}>{t(lang, 'featuredValueSkillText')}</p>
              </div>
            </div>
            {/* Not automatable callout */}
            <div className={`${styles.featuredExampleValueCard} ${styles.featuredExampleValueCardNotAuto}`}>
              <div className={`${styles.featuredExampleValueCardLabel} ${styles.featuredExampleValueCardLabelNotAuto}`}>{t(lang, 'featuredValueNotAuto')}</div>
              <p className={`${styles.featuredExampleValueCardText} ${styles.featuredExampleValueCardTextNotAuto}`}>{t(lang, 'featuredValueNotAutoText')}</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

// Related Example data
const RELATED_EXAMPLES = [
  { id: 'portfolio', titleKey: 'relatedPortfolio', metaKey: 'relatedPortfolioMeta', status: 'compiled', version: 'v1.0.0' },
  { id: 'nuclear', titleKey: 'relatedNuclearOption', metaKey: 'relatedNuclearOptionMeta', status: 'compiled' },
  { id: 'infrastructure', titleKey: 'relatedInfrastructure', metaKey: 'relatedInfrastructureMeta', status: 'compiled' },
  { id: 'memento', titleKey: 'relatedMemento', metaKey: 'relatedMementoMeta', status: 'pattern' },
];

// RelatedExamples - Collapsible section for secondary examples
const RelatedExamples = ({ lang, expanded, onToggle, links }: any) => (
  <div className={styles.relatedExamplesWrapper} data-testid="related-examples">
    <button
      onClick={onToggle}
      className={`${styles.relatedExamplesToggle} ${expanded ? styles.relatedExamplesToggleExpanded : styles.relatedExamplesToggleCollapsed}`}
      aria-expanded={expanded}
    >
      <span className={styles.relatedExamplesToggleText}>
        {t(lang, 'relatedExamplesTitle')} ({RELATED_EXAMPLES.length})
      </span>
      {expanded ? <ChevronDown className={styles.relatedExamplesToggleIcon} /> : <ChevronRight className={styles.relatedExamplesToggleIcon} />}
    </button>

    {expanded && (
      <div className={styles.relatedExamplesContent}>
        {/* Compiled Skills */}
        <div className={`${styles.relatedExamplesSection} ${styles.relatedExamplesSectionWithBorder}`}>
          <div className={styles.relatedExamplesSectionTitle}>
            {t(lang, 'relatedCompiledSection')}
          </div>
          {RELATED_EXAMPLES.filter(e => e.status === 'compiled').map((example) => (
            <div key={example.id} className={`${styles.relatedExampleItem} ${styles.relatedExampleItemWithBorder}`}>
              <Check className={styles.relatedExampleCheckIcon} aria-hidden="true" />
              <div className={styles.relatedExampleContent}>
                <div className={styles.relatedExampleTitle}>
                  {links?.[example.id] ? (
                    <a href={links[example.id]} className={styles.relatedExampleLink}>{t(lang, example.titleKey)}</a>
                  ) : t(lang, example.titleKey)}
                  {example.version && (
                    <span className={styles.relatedExampleVersion}>
                      {example.version}
                    </span>
                  )}
                </div>
                <div className={styles.relatedExampleMeta}>{t(lang, example.metaKey)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Extracted Patterns */}
        <div className={styles.relatedExamplesSection}>
          <div className={styles.relatedExamplesSectionTitle}>
            {t(lang, 'relatedPatternsSection')}
          </div>
          {RELATED_EXAMPLES.filter(e => e.status === 'pattern').map((example) => (
            <div key={example.id} className={styles.relatedExampleItem}>
              <span className={styles.relatedExampleBullet}>○</span>
              <div className={styles.relatedExampleContent}>
                <div className={styles.relatedExampleTitle}>
                  {links?.[example.id] ? (
                    <a href={links[example.id]} className={styles.relatedExampleLink}>{t(lang, example.titleKey)}</a>
                  ) : t(lang, example.titleKey)}
                </div>
                <div className={styles.relatedExampleMeta}>{t(lang, example.metaKey)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function SkillForgeVisualizer({ lang: initialLang = 'en', links = {} }: any) {
  const [lang, setLang] = useState(['en', 'es', 'zh'].includes(initialLang) ? initialLang : 'en');
  const validLang = lang;

  // Language button uses CSS Module classes

  const [view, setView] = useState('process');
  const [processStep, setProcessStep] = useState(0);
  const [deliberationCost, setDeliberationCost] = useState(100);
  const [skillCost, setSkillCost] = useState(10);
  const [failureRate, setFailureRate] = useState(0.1);
  const [problemCount, setProblemCount] = useState(10);
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [expandedExample, setExpandedExample] = useState(null);
  const [rewordApproved, setRewordApproved] = useState(false);
  const [processLayout, setProcessLayout] = useState('classic'); // 'classic' | 'swimlane'
  const [featuredExpanded, setFeaturedExpanded] = useState(false);
  const [relatedExpanded, setRelatedExpanded] = useState(false);

  // Example deliberation step metadata
  const exampleSteps = [
    { step: 1, speaker: 'context', color: '#f5f5f5', borderColor: '#999' },
    { step: 2, speaker: 'claude', color: '#fffaf0', borderColor: '#b8860b' },
    { step: 3, speaker: 'gpt', color: '#f5fff5', borderColor: '#2d5a3d' },
    { step: 4, speaker: 'claude', color: '#fffaf0', borderColor: '#b8860b' },
    { step: 5, speaker: 'gpt', color: '#f5fff5', borderColor: '#2d5a3d' },
    { step: 6, speaker: 'outcome', color: '#f0f8ff', borderColor: '#0066cc' },
    { step: 7, speaker: 'human', color: '#fff5f5', borderColor: '#a00000' },
    { step: 8, speaker: 'outcome', color: '#f0f8ff', borderColor: '#0066cc' },
  ];

  const views = [
    { id: 'process', label: t(validLang, 'navProcess'), icon: GitBranch },
    { id: 'paraphrase', label: t(validLang, 'navVerification'), icon: Layers },
    { id: 'example', label: t(validLang, 'navExample'), icon: FileText },
    { id: 'economics', label: t(validLang, 'navEconomics'), icon: TrendingUp },
    { id: 'accumulation', label: t(validLang, 'navAccumulation'), icon: Target },
    { id: 'references', label: t(validLang, 'navReferences'), icon: Clock }
  ];

  const handleTabKeyDown = (e: any, currentIndex: number) => {
    let newIndex = currentIndex;
    if (e.key === 'ArrowRight') newIndex = (currentIndex + 1) % views.length;
    else if (e.key === 'ArrowLeft') newIndex = (currentIndex - 1 + views.length) % views.length;
    else if (e.key === 'Home') newIndex = 0;
    else if (e.key === 'End') newIndex = views.length - 1;
    else return;
    e.preventDefault();
    setView(views[newIndex].id);
    document.getElementById(`tab-${views[newIndex].id}`)?.focus();
  };

  const withoutForgeCost = problemCount * deliberationCost;
  const withForgeCost = deliberationCost + (problemCount - 1) * (skillCost + failureRate * deliberationCost);
  const savings = withoutForgeCost - withForgeCost;
  const savingsPercent = ((1 - withForgeCost / withoutForgeCost) * 100).toFixed(0);
  const costSub = t(validLang, 'costForge');
  const costSubWithout = t(validLang, 'costWithout');
  const pFailSub = t(validLang, 'probFail');
  const breakEven = deliberationCost / (deliberationCost - skillCost - failureRate * deliberationCost);

  return (
    <div className={styles.mainContainer} lang={validLang}>
      <SkipLink lang={validLang} />

      <header className={styles.mainHeader}>
        <div className={styles.mainHeaderContent}>
          <div>
            <h1 className={styles.mainTitle}>{t(validLang, 'title')}</h1>
            <p className={styles.mainSubtitle}>{t(validLang, 'subtitle')}</p>
          </div>
          <div className={styles.langGroup} role="group" aria-label="Language selection">
            {['en', 'es', 'zh'].map(l => (
              <button key={l} className={`${styles.langBtn} ${lang === l ? styles.langBtnActive : ''}`} onClick={() => setLang(l)} data-testid={`lang-${l}`} aria-pressed={lang === l}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <nav className={styles.mainNav} aria-label={t(validLang, 'selectView')}>
        <div className={styles.mainNavTabs} role="tablist">
          {views.map((v, index) => (
            <div key={v.id} onKeyDown={(e) => handleTabKeyDown(e, index)}>
              <NavTab id={v.id} label={v.label} icon={v.icon} active={view === v.id} onClick={() => setView(v.id)} />
            </div>
          ))}
        </div>
      </nav>

      <main id="main-content" className={styles.mainContent}>

        {/* Introduction */}
        <section className={styles.introSection} data-section="intro">
          <p className={styles.introParagraph}>
            <strong className={styles.introStrong}>{t(validLang, 'introStrong')}</strong> {t(validLang, 'introText')} <CitationLink reference="irving2018" lang={validLang}>{t(validLang, 'introIrvingCite')}</CitationLink> {t(validLang, 'introInsight')} <em>{t(validLang, 'introHeterogeneous')}</em>{t(validLang, 'introHeterogeneousExplain')}<CitationLink reference="zhou2025" lang={validLang}>{t(validLang, 'introAHMAD')}</CitationLink>, <CitationLink reference="karpathy2024" lang={validLang}>{t(validLang, 'introLLMCouncil')}</CitationLink>{t(validLang, 'introGoalNot')} <em>{t(validLang, 'introQualifiedJudgment')}</em>{t(validLang, 'introQualifiedExplain')}<CitationLink reference="zhao2023" lang={validLang}>{t(validLang, 'introExpeL')}</CitationLink>{t(validLang, 'introFinalClause')}
          </p>
        </section>

        {/* ========== SECTION: Process ========== */}
        {view === 'process' && (
          <section id="panel-process" role="tabpanel" aria-labelledby="tab-process" tabIndex={0} data-section="process">
            <style>{`
              .swimlane-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
              @media (min-width: 900px) { .swimlane-grid { grid-template-columns: repeat(3, 1fr); } }
            `}</style>
            <div className={styles.processSectionHeader}>
              <div>
                <h2 className={styles.processSectionTitle}>{t(validLang, 'processTitle')}</h2>
                <p className={styles.processSectionDesc}>{t(validLang, 'processDesc')}</p>
                {links?.portfolioDialogue && (
                  <p className={styles.processSectionLink}>
                    <a href={links.portfolioDialogue} className={styles.processSectionLinkAnchor}>
                      {t(validLang, 'processRefImplLink')} →
                    </a>
                  </p>
                )}
              </div>
              <button
                onClick={() => setProcessLayout(processLayout === 'swimlane' ? 'classic' : 'swimlane')}
                data-testid="layout-toggle"
                className={styles.layoutToggleBtn}
              >
                {processLayout === 'swimlane' ? t(validLang, 'layoutClassic') : t(validLang, 'layoutSwimlane')}
              </button>
            </div>

            {/* LCE Precondition Band - invariants required before deliberation */}
            <PreconditionBand lang={validLang} type="pre" />

            {/* Swimlane Layout (v3.0.0) */}
            {processLayout === 'swimlane' && (
              <div className="swimlane-grid" data-testid="swimlane-view">
                {/* HO Lane */}
                <div className={`${styles.swimlaneLane} ${styles.swimlaneLaneHO}`} data-testid="swimlane-ho">
                  <div className={`${styles.swimlaneLaneHeader} ${styles.swimlaneLaneHeaderHO}`}>
                    <User className={`${styles.swimlaneLaneIcon} ${styles.swimlaneLaneIconHO}`} aria-hidden="true" />
                    <div>
                      <div className={`${styles.swimlaneLaneTitle} ${styles.swimlaneLaneTitleHO}`}>{t(validLang, 'swimlaneHO')}</div>
                      <div className={styles.swimlaneLaneDesc}>{t(validLang, 'swimlaneHODesc')}</div>
                    </div>
                  </div>
                  <div className={styles.swimlaneLaneSteps}>
                    <FlowStep number={1} title={t(validLang, 'step1Title')} description={t(validLang, 'step1Desc')} active={processStep === 0} completed={processStep > 0} onClick={() => setProcessStep(0)} totalSteps={8} lang={validLang} />
                    <div className={styles.swimlaneGateIndicator}>← UG Gate (Step 4)</div>
                    <div className={styles.swimlaneGateIndicator}>← AG Gate (Step 6)</div>
                    <FlowStep number={7} title={t(validLang, 'step7Title')} description={t(validLang, 'step7Desc')} active={processStep === 6} completed={processStep > 6} onClick={() => setProcessStep(6)} totalSteps={8} lang={validLang} />
                    <FlowStep number={8} title={t(validLang, 'step8Title')} description={t(validLang, 'step8Desc')} active={processStep === 7} completed={processStep > 7} onClick={() => setProcessStep(7)} totalSteps={8} lang={validLang} />
                  </div>
                </div>

                {/* GA Lane */}
                <div className={`${styles.swimlaneLane} ${styles.swimlaneLaneGA}`} data-testid="swimlane-ga">
                  <div className={`${styles.swimlaneLaneHeader} ${styles.swimlaneLaneHeaderGA}`}>
                    <Zap className={`${styles.swimlaneLaneIcon} ${styles.swimlaneLaneIconGA}`} aria-hidden="true" />
                    <div>
                      <div className={`${styles.swimlaneLaneTitle} ${styles.swimlaneLaneTitleGA}`}>{t(validLang, 'swimlaneGA')}</div>
                      <div className={styles.swimlaneLaneDesc}>{t(validLang, 'swimlaneGADesc')}</div>
                    </div>
                  </div>
                  <div className={styles.swimlaneLaneSteps}>
                    <FlowStep number={2} title={t(validLang, 'step2Title')} description={t(validLang, 'step2Desc')} active={processStep === 1} completed={processStep > 1} onClick={() => setProcessStep(1)} totalSteps={8} lang={validLang} />
                    <FlowStep number={4} title={t(validLang, 'step4Title')} description={t(validLang, 'step4Desc')} active={processStep === 3} completed={processStep > 3} onClick={() => setProcessStep(3)} totalSteps={8} lang={validLang} />
                  </div>
                </div>

                {/* IA Lane */}
                <div className={`${styles.swimlaneLane} ${styles.swimlaneLaneIA}`} data-testid="swimlane-ia">
                  <div className={`${styles.swimlaneLaneHeader} ${styles.swimlaneLaneHeaderIA}`}>
                    <AlertCircle className={`${styles.swimlaneLaneIcon} ${styles.swimlaneLaneIconIA}`} aria-hidden="true" />
                    <div>
                      <div className={`${styles.swimlaneLaneTitle} ${styles.swimlaneLaneTitleIA}`}>{t(validLang, 'swimlaneIA')}</div>
                      <div className={styles.swimlaneLaneDesc}>{t(validLang, 'swimlaneIADesc')}</div>
                    </div>
                  </div>
                  <div className={styles.swimlaneLaneSteps}>
                    <FlowStep number={3} title={t(validLang, 'step3Title')} description={t(validLang, 'step3Desc')} active={processStep === 2} completed={processStep > 2} onClick={() => setProcessStep(2)} totalSteps={8} lang={validLang} />
                    <FlowStep number={5} title={t(validLang, 'step5Title')} description={t(validLang, 'step5Desc')} active={processStep === 4} completed={processStep > 4} onClick={() => setProcessStep(4)} totalSteps={8} lang={validLang} />
                    <FlowStep number={6} title={t(validLang, 'step6Title')} description={t(validLang, 'step6Desc')} active={processStep === 5} completed={processStep > 5} onClick={() => setProcessStep(5)} totalSteps={8} lang={validLang} />
                  </div>
                </div>
              </div>
            )}

            {/* Classic Layout */}
            {processLayout === 'classic' && (
              <div className={styles.classicLayoutGrid} data-testid="classic-view">
                <div role="group" aria-label={t(validLang, 'processSteps')}>
                  {[1,2,3,4,5,6,7,8].map((num) => (
                    <FlowStep key={num} number={num} title={t(validLang, `step${num}Title`)} description={t(validLang, `step${num}Desc`)} active={processStep === num - 1} completed={processStep > num - 1} onClick={() => setProcessStep(num - 1)} totalSteps={8} lang={validLang} />
                  ))}
                </div>
                <div className={styles.stepDetailPanel} aria-live="polite" data-testid="step-detail">
                  {processStep === 3 && (<div><Gate type="UG" status="open" label={t(validLang, 'understandingGate')} lang={validLang} /><p className={styles.stepDetailText}>{t(validLang, 'ugDetailText')}</p><div className={styles.stepDetailExample}><p className={styles.stepDetailExampleText}>{t(validLang, 'step4Example')}</p></div></div>)}
                  {processStep === 5 && (<div><Gate type="AG" status="open" label={t(validLang, 'agreementGate')} lang={validLang} /><p className={styles.stepDetailText}>{t(validLang, 'agDetailText')}</p><div className={styles.gateBlockingAnnotation}><AlertCircle className={styles.gateBlockingIcon} aria-hidden="true" /><span><strong>{t(validLang, 'agBlocksOnAssumed')}</strong> — {t(validLang, 'agBlocksOnAssumedDetail')}</span></div><div className={styles.stepDetailExample}><p className={styles.stepDetailExampleText}>{t(validLang, 'step6Example')}</p></div></div>)}
                  {processStep === 6 && (<div><div className={styles.stepDetailHeader}><User className={styles.stepDetailHeaderIcon} aria-hidden="true" /><span className={styles.stepDetailHeaderTitle}>{t(validLang, 'hagDetailTitle')}</span></div><p className={styles.stepDetailText}>{t(validLang, 'hagDetailText')}</p><div className={styles.stepDetailExample}><p className={styles.stepDetailExampleText}>{t(validLang, 'step7Example')}</p></div></div>)}
                  {![3, 5, 6].includes(processStep) && (<div><p className={styles.stepDetailText}>{t(validLang, `step${processStep + 1}Desc`)}</p>{t(validLang, `step${processStep + 1}Example`) !== `step${processStep + 1}Example` && (<div className={styles.stepDetailExample}><p className={styles.stepDetailExampleText}>{t(validLang, `step${processStep + 1}Example`)}</p></div>)}</div>)}
                </div>
              </div>
            )}

            {/* Detail Panel for Swimlane view */}
            {processLayout === 'swimlane' && (
              <div className={`${styles.stepDetailPanel} ${styles.stepDetailPanelFloating}`} aria-live="polite" data-testid="step-detail">
                {processStep === 3 && (<div><Gate type="UG" status="open" label={t(validLang, 'understandingGate')} lang={validLang} /><p className={styles.stepDetailText}>{t(validLang, 'ugDetailText')}</p><div className={styles.stepDetailExample}><p className={styles.stepDetailExampleText}>{t(validLang, 'step4Example')}</p></div></div>)}
                {processStep === 5 && (<div><Gate type="AG" status="open" label={t(validLang, 'agreementGate')} lang={validLang} /><p className={styles.stepDetailText}>{t(validLang, 'agDetailText')}</p><div className={styles.gateBlockingAnnotation}><AlertCircle className={styles.gateBlockingIcon} aria-hidden="true" /><span><strong>{t(validLang, 'agBlocksOnAssumed')}</strong> — {t(validLang, 'agBlocksOnAssumedDetail')}</span></div><div className={styles.stepDetailExample}><p className={styles.stepDetailExampleText}>{t(validLang, 'step6Example')}</p></div></div>)}
                {processStep === 6 && (<div><div className={styles.stepDetailHeader}><User className={styles.stepDetailHeaderIcon} aria-hidden="true" /><span className={styles.stepDetailHeaderTitle}>{t(validLang, 'hagDetailTitle')}</span></div><p className={styles.stepDetailText}>{t(validLang, 'hagDetailText')}</p><div className={styles.stepDetailExample}><p className={styles.stepDetailExampleText}>{t(validLang, 'step7Example')}</p></div></div>)}
                {![3, 5, 6].includes(processStep) && (<div><p className={styles.stepDetailText}>{t(validLang, `step${processStep + 1}Desc`)}</p>{t(validLang, `step${processStep + 1}Example`) !== `step${processStep + 1}Example` && (<div className={styles.stepDetailExample}><p className={styles.stepDetailExampleText}>{t(validLang, `step${processStep + 1}Example`)}</p></div>)}</div>)}
              </div>
            )}
          </section>
        )}

        {/* ========== SECTION: Verification ========== */}
        {view === 'paraphrase' && (
          <section id="panel-paraphrase" role="tabpanel" aria-labelledby="tab-paraphrase" tabIndex={0} data-section="verification">
            <h2 className={styles.sectionTitleLg}>{t(validLang, 'verificationTitle')}</h2>
            {/* Hamlet epigraph - fits verification/paraphrase context */}
            <blockquote className={styles.verificationEpigraph}>
              <p className={styles.verificationEpigraphText}>
                {t(validLang, 'rewordGateEpigraph')}
              </p>
              <cite className={styles.verificationEpigraphCite}>
                {t(validLang, 'rewordGateAttribution')}
              </cite>
            </blockquote>
            <div className={styles.verificationCard}>
              <h3 className={styles.verificationCardTitle}>{t(validLang, 'swissCheeseSection')}</h3>
              <p className={styles.verificationCardText}>
                <CitationLink reference="reason2000" lang={validLang}>{t(validLang, 'swissCheeseExplain')}</CitationLink> <CitationLink reference="shamsujjoha2024" lang={validLang}>Shamsujjoha et al. (2024)</CitationLink> {t(validLang, 'swissCheeseApplied')} <em>{t(validLang, 'swissCheeseEpistemic')}</em>{t(validLang, 'swissCheeseEpistemicExplain')}
              </p>
              <SwissCheeseVisualization lang={validLang} />
            </div>
            <div className={`${styles.verificationCard} ${styles.verificationCardHighlight}`}>
              <h3 className={styles.verificationCardTitle}>{t(validLang, 'coreInsight')}</h3>
              <p className={styles.verificationInsightText}>
                <CitationLink reference="irving2018" lang={validLang}>Irving et al. (2018)</CitationLink> {t(validLang, 'coreInsightText')} <strong>{t(validLang, 'coreInsightMechanism')}</strong>{t(validLang, 'coreInsightFinal')}
              </p>
            </div>
          </section>
        )}

        {/* ========== SECTION: Example ========== */}
        {view === 'example' && (
          <section id="panel-example" role="tabpanel" aria-labelledby="tab-example" tabIndex={0} data-section="example">
            <h2 className={styles.sectionTitleLg}>{t(validLang, 'exampleTitle')}</h2>
            <p className={styles.sectionDesc}>{t(validLang, 'exampleDesc')}</p>

            {/* Featured Example - Forensic Audio (Live) */}
            <FeaturedExample
              lang={validLang}
              expanded={featuredExpanded}
              onToggle={() => setFeaturedExpanded(!featuredExpanded)}
              links={links}
            />

            {/* Related Examples - Collapsed by default */}
            <RelatedExamples
              lang={validLang}
              expanded={relatedExpanded}
              onToggle={() => setRelatedExpanded(!relatedExpanded)}
              links={links}
            />

            {/* Reword Gate - Human Articulation Gate (v3.0.0) */}
            <div className={styles.rewordGateWrapper}>
              <RewordGate
                lang={validLang}
                onApprove={(articulation: string) => {
                  setRewordApproved(true);
                  console.log('Decision articulated:', articulation);
                }}
              />
            </div>
          </section>
        )}

        {/* ========== SECTION: Economics ========== */}
        {view === 'economics' && (
          <section id="panel-economics" role="tabpanel" aria-labelledby="tab-economics" tabIndex={0} data-section="economics">
            <style>{`
              .economics-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
              @media (min-width: 768px) { .economics-grid { grid-template-columns: 1fr 1fr; gap: 32px; } }
            `}</style>
            <h2 className={styles.sectionTitleLg}>{t(validLang, 'economicsTitle')}</h2>
            <p className={styles.sectionDesc}>{t(validLang, 'economicsDesc')}</p>
            <div className="economics-grid">
              <div>
                <fieldset className={styles.economicsFieldset}>
                  <legend className={styles.economicsLegend}>{t(validLang, 'costModelParams')}</legend>
                  <div className={styles.economicsSliders}>
                    <Slider id="deliberation-cost" label={`${t(validLang, 'paramDeliberation')} (D)`} value={deliberationCost} onChange={setDeliberationCost} min={20} max={200} step={10} unit={` ${t(validLang, 'units')}`} />
                    <Slider id="skill-cost" label={`${t(validLang, 'paramSkill')} (S)`} value={skillCost} onChange={setSkillCost} min={1} max={50} step={1} unit={` ${t(validLang, 'units')}`} />
                    <Slider id="failure-rate" label={`${t(validLang, 'paramFailure')} (P)`} value={failureRate} onChange={setFailureRate} min={0} max={0.5} step={0.05} unit="" />
                    <Slider id="problem-count" label={`${t(validLang, 'paramProblems')} (N)`} value={problemCount} onChange={setProblemCount} min={2} max={50} step={1} unit={` ${t(validLang, 'problems')}`} />
                  </div>
                </fieldset>
                <div className={styles.economicsCard}>
                  <h3 className={styles.economicsCardTitle}>{t(validLang, 'formulaTitle')}</h3>
                  <div className={styles.economicsFormulaRow}>
                    <div className={styles.economicsFormulaLabel}>{t(validLang, 'formulaWithout')}:</div>
                    <LaTeX display>{`C_{${costSubWithout}} = N \\times D = ${problemCount} \\times ${deliberationCost} = ${withoutForgeCost}`}</LaTeX>
                  </div>
                  <div className={`${styles.economicsFormulaRow} ${styles.economicsFormulaRowBorder}`}>
                    <div className={styles.economicsFormulaLabel}>{t(validLang, 'formulaWith')}:</div>
                    <LaTeX display>{`C_{${costSub}} = D + (N-1) \\times [S + P_{${pFailSub}} \\times D]`}</LaTeX>
                    <LaTeX display>{`= ${deliberationCost} + ${problemCount - 1} \\times [${skillCost} + ${failureRate} \\times ${deliberationCost}] = ${withForgeCost.toFixed(0)}`}</LaTeX>
                  </div>
                  <div className={styles.economicsFormulaRowBorder}>
                    <div className={styles.economicsFormulaLabel}>{t(validLang, 'formulaBreakeven')} N:</div>
                    <LaTeX display>{`N^* = \\frac{D}{D - S - P_{${pFailSub}} \\times D} = ${breakEven.toFixed(1)}`}</LaTeX>
                  </div>
                </div>
              </div>
              <div>
                <div className={`${styles.economicsCard} ${styles.economicsFieldset}`}>
                  <CostCurve D={deliberationCost} S={skillCost} pFail={failureRate} maxN={problemCount} lang={validLang} />
                </div>
                <div className={styles.economicsResultsGrid}>
                  <div className={`${styles.economicsResultCard} ${styles.economicsResultCardNeutral}`}><div className={styles.economicsResultLabel}>{t(validLang, 'totalWithout')}</div><div className={styles.economicsResultValue}>{withoutForgeCost}</div></div>
                  <div className={`${styles.economicsResultCard} ${styles.economicsResultCardSuccess}`}><div className={styles.economicsResultLabel}>{t(validLang, 'totalWith')}</div><div className={`${styles.economicsResultValue} ${styles.economicsResultValueSuccess}`}>{withForgeCost.toFixed(0)}</div></div>
                </div>
                <div className={`${styles.economicsResultCard} ${styles.economicsResultCardAccent}`}><div className={styles.economicsResultLabel}>{t(validLang, 'savings')}</div><div className={`${styles.economicsResultValue} ${styles.economicsResultValueAccent}`}>{savings.toFixed(0)} {t(validLang, 'units')} ({savingsPercent}%)</div></div>
              </div>
            </div>
          </section>
        )}

        {/* ========== SECTION: Accumulation (EXPANDED) ========== */}
        {view === 'accumulation' && (
          <section id="panel-accumulation" role="tabpanel" aria-labelledby="tab-accumulation" tabIndex={0} data-section="accumulation">
            <h2 className={styles.sectionTitleLg}>{t(validLang, 'accumulationTitle')}</h2>
            <p className={styles.sectionDesc}>{t(validLang, 'accumulationDesc')}</p>

            <div className={styles.accumulationPanels}>
              <ExpandablePanel id="skills" icon={FileText} title={`${t(validLang, 'skillLibrary')} (${SKILL_INVENTORY.length} ${t(validLang, 'skillLibraryCount')})`} expanded={expandedPhase === 'skills'} onToggle={() => setExpandedPhase(expandedPhase === 'skills' ? null : 'skills')}>
                <p className={styles.accumulationPanelText}>{t(validLang, 'skillLibraryDesc')}</p>
                <SkillInventoryTable lang={validLang} links={links} />
              </ExpandablePanel>
              <ExpandablePanel id="human" icon={User} title={t(validLang, 'humanExpertise')} expanded={expandedPhase === 'human'} onToggle={() => setExpandedPhase(expandedPhase === 'human' ? null : 'human')}>
                <p className={styles.accumulationPanelTextNm}>{t(validLang, 'humanExpertiseDesc')}</p>
              </ExpandablePanel>
              <ExpandablePanel id="provenance" icon={Clock} title={t(validLang, 'provenanceRecord')} expanded={expandedPhase === 'provenance'} onToggle={() => setExpandedPhase(expandedPhase === 'provenance' ? null : 'provenance')}>
                <p className={styles.accumulationPanelTextNm}>{t(validLang, 'provenanceDesc')}</p>
              </ExpandablePanel>
            </div>

            {/* Thin Skill Architecture Section */}
            <div className={styles.thinSkillCard}>
              <div className={styles.thinSkillHeader}>
                <Database className={styles.thinSkillIcon} aria-hidden="true" />
                <h3 className={styles.thinSkillTitle}>{t(validLang, 'thinSkillTitle')}</h3>
              </div>
              <p className={styles.thinSkillSubtitle}>{t(validLang, 'thinSkillSubtitle')}</p>
              
              <p className={styles.thinSkillText}>
                {t(validLang, 'thinSkillIntro')} <strong><ConditionalLink href={links.thinSkillArchitecture}>{t(validLang, 'thinSkillName')}</ConditionalLink></strong>{t(validLang, 'thinSkillIntroEnd')}
              </p>

              <h4 className={styles.thinSkillH4}>{t(validLang, 'thinSkillWhatTitle')}</h4>
              <p className={styles.thinSkillParagraph}>{t(validLang, 'thinSkillWhat')}</p>

              <h4 className={styles.thinSkillH4}>{t(validLang, 'thinSkillVsNativeTitle')}</h4>
              <p className={styles.thinSkillParagraphSm}>{t(validLang, 'thinSkillVsNativeIntro')}</p>

              <div className={styles.thinSkillComparisonGrid}>
                <div className={`${styles.thinSkillComparisonCard} ${styles.thinSkillComparisonCardNative}`}>
                  <div className={`${styles.thinSkillComparisonHeader} ${styles.thinSkillComparisonHeaderNative}`}>
                    <Zap className={`${styles.thinSkillComparisonIcon} ${styles.thinSkillComparisonIconNative}`} aria-hidden="true" />
                    <span className={styles.thinSkillComparisonTitle}>{t(validLang, 'comparisonNative')}</span>
                  </div>
                  <div className={`${styles.thinSkillComparisonBody} ${styles.thinSkillComparisonBodyNative}`}>
                    <div className={styles.thinSkillComparisonRow}><strong>{t(validLang, 'comparisonStorage')}:</strong> {t(validLang, 'comparisonStorageNative')}</div>
                    <div className={styles.thinSkillComparisonRow}><strong>{t(validLang, 'comparisonPortability')}:</strong> {t(validLang, 'comparisonPortabilityNative')}</div>
                    <div className={styles.thinSkillComparisonRow}><strong>{t(validLang, 'comparisonLearning')}:</strong> {t(validLang, 'comparisonLearningNative')}</div>
                    <div className={styles.thinSkillComparisonRowLast}><strong>{t(validLang, 'comparisonGating')}:</strong> {t(validLang, 'comparisonGatingNative')}</div>
                  </div>
                </div>
                <div className={`${styles.thinSkillComparisonCard} ${styles.thinSkillComparisonCardThin}`}>
                  <div className={`${styles.thinSkillComparisonHeader} ${styles.thinSkillComparisonHeaderThin}`}>
                    <Database className={`${styles.thinSkillComparisonIcon} ${styles.thinSkillComparisonIconThin}`} aria-hidden="true" />
                    <span className={`${styles.thinSkillComparisonTitle} ${styles.thinSkillComparisonTitleThin}`}>{t(validLang, 'comparisonThin')}</span>
                  </div>
                  <div className={`${styles.thinSkillComparisonBody} ${styles.thinSkillComparisonBodyThin}`}>
                    <div className={styles.thinSkillComparisonRow}><strong>{t(validLang, 'comparisonStorage')}:</strong> {t(validLang, 'comparisonStorageThin')}</div>
                    <div className={styles.thinSkillComparisonRow}><strong>{t(validLang, 'comparisonPortability')}:</strong> {t(validLang, 'comparisonPortabilityThin')}</div>
                    <div className={styles.thinSkillComparisonRow}><strong>{t(validLang, 'comparisonLearning')}:</strong> {t(validLang, 'comparisonLearningThin')}</div>
                    <div className={styles.thinSkillComparisonRowLast}><strong>{t(validLang, 'comparisonGating')}:</strong> {t(validLang, 'comparisonGatingThin')}</div>
                  </div>
                </div>
              </div>

              <p className={styles.thinSkillParagraph}>{t(validLang, 'thinSkillBenefits')}</p>
            </div>

            {/* Skill Inventory */}
            <div className={styles.skillInventorySection}>
              <h3 className={styles.skillInventorySectionTitle}>{t(validLang, 'inventoryTitle')}</h3>
              <p className={styles.skillInventorySectionIntro}>{t(validLang, 'inventoryIntro')}</p>

              <SkillInventoryTable lang={validLang} links={links} />

              <p className={styles.skillInventoryNote}>{t(validLang, 'inventoryNote')}</p>

              {links.thinSkillArchitecture && (
                <p className={styles.skillInventoryLink}>
                  <a href={links.thinSkillArchitecture} className={styles.skillInventoryLinkAnchor}>
                    {t(validLang, 'learnMoreThinSkill')} →
                  </a>
                </p>
              )}
            </div>
          </section>
        )}

        {/* ========== SECTION: References ========== */}
        {view === 'references' && (
          <section id="panel-references" role="tabpanel" aria-labelledby="tab-references" tabIndex={0} data-section="references">
            <h2 className={styles.sectionTitleLg}>{t(validLang, 'referencesTitle')}</h2>
            <p className={styles.sectionDesc}>{t(validLang, 'referencesDesc')}</p>
            <div className={styles.referencesList}>
              {Object.values(REFERENCES).map((ref) => (
                <article key={ref.id} className={styles.referenceArticle}>
                  <p className={styles.referenceText}>
                    {ref.authors} ({ref.year}). <em>{ref.title}</em>. {ref.source}. <a href={ref.url} className={styles.referenceLink} target="_blank" rel="noopener noreferrer" aria-label={`${ref.title}, ${t(validLang, 'linkOpensNewTab')}`}>{ref.url}</a>
                  </p>
                </article>
              ))}
            </div>
            <div className={styles.novelCard}>
              <h3 className={styles.novelCardTitle}>{t(validLang, 'whatsNovel')}</h3>
              <ol className={styles.novelList}>
                <li><strong>{t(validLang, 'novel1')}</strong> {t(validLang, 'novel1Note')}</li>
                <li><strong>{t(validLang, 'novel2')}</strong> {t(validLang, 'novel2Note')}</li>
                <li><strong>{t(validLang, 'novel3')}</strong> {t(validLang, 'novel3Note')}</li>
                <li><strong>{t(validLang, 'novel4')}</strong> {t(validLang, 'novel4Note')}</li>
                <li><strong>{t(validLang, 'novel5')}</strong> {t(validLang, 'novel5Note')}</li>
                <li><strong>{t(validLang, 'novel6')}</strong> {t(validLang, 'novel6Note')}</li>
              </ol>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
