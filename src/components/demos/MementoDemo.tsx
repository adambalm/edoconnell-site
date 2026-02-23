/*
MANIFEST
=========
Artifact: Memento Demo
Version: 2.0.0
Generated: 2026-02-22
Generator: Claude (Opus 4.6) via Claude.ai
Migrated: 2026-02-22 to edoconnell-site (Astro 5 + React island)

SECTIONS:
- Premise (lines ~15-43)
- Pipeline (lines ~45-118)
- Findings (lines ~120-162)
- Failures (lines ~164-217)
- FeedbackLoop (lines ~219-258)
- CommitmentDevice (lines ~260-292)
- OpenQuestions (lines ~294-339)
- TechnicalProfile (lines ~341-440)

SUBCOMPONENTS: None (section functions only)

DEPENDENCIES:
- react (useState)
- Site design tokens from global.css (--font-prose, --font-mono, --color-*)

CANARY: MEMENTO-DEMO-2026-02-22-V2-SITE-INTEGRATED
*/

import { useState } from 'react';

const SECTIONS = [
  { id: "premise", label: "Premise" },
  { id: "pipeline", label: "Pipeline" },
  { id: "findings", label: "Findings" },
  { id: "failures", label: "What Didn't Work" },
  { id: "feedback", label: "Feedback Loop" },
  { id: "commitment", label: "Commitment Device" },
  { id: "open", label: "Open Questions" },
  { id: "profile", label: "Technical Profile" },
];

function Premise() {
  return (
    <section>
      <p>
        For twenty years, corporations have run classification pipelines, longitudinal pattern
        detection, and intent inference on your browsing data. They cluster your visits, detect
        your purchase intent, build attention profiles across sessions, and sell the output. The
        analytical techniques are well-understood. The constraint was always access to the data
        and the cost of running inference.
      </p>
      <p>
        Local LLMs remove the cost constraint. Browser extensions provide the data access. Memento
        tests whether these corporate analytical techniques, applied to data you collect about
        yourself, produce intelligence you can actually use.
      </p>
      <p>
        The test domain is browser sessions. A Chrome extension captures your open tabs. A
        four-pass LLM pipeline classifies them, maps cross-category connections, and generates
        a structured session artifact. A longitudinal layer tracks patterns across sessions.
        A correction system feeds your disagreements back into future classification.
      </p>
      <p>
        Whether these techniques transfer to other self-collected behavioral data — git commit
        patterns, communication logs, reading history — is an open question that motivated the
        architecture. The pipeline is designed to be domain-agnostic. Browser tabs are the first
        test case, not the point.
      </p>
    </section>
  );
}

function Pipeline() {
  return (
    <section>
      <p>
        When Memento sends 31 browser tabs to an LLM for classification, the LLM classifies 8
        and stops. This was the first finding of the project: LLMs are trained to synthesize and
        compress, not to enumerate exhaustively. Claude Haiku, Qwen 2.5, Llama 3.2 — every model
        exhibited the same behavior. Coverage ranged from 0% to 26% on sessions with more than
        10 tabs.
      </p>
      <p>
        The fix required working against the model's summarization instinct. The output schema was
        simplified from nested JSON objects to a flat index-to-category map. The prompt was
        rewritten to demand explicit enumeration: "The assignments object MUST have EXACTLY N
        entries. DO NOT skip any tabs. DO NOT summarize." Token limits were raised from 2,000 to
        8,000. A parser-level recovery step detects missing tab indices and assigns them to an
        Unclassified category. After these changes, coverage reached 95%+.
      </p>
      <p>
        The current pipeline runs four passes:
      </p>
      <div className="pass-grid">
        <div className="pass-card">
          <span className="pass-num">Pass 1</span>
          <span className="pass-name">Classification + Triage</span>
          <p>
            Each tab gets assigned to a category with explicit evidence ("signals") and a confidence
            level. Tabs flagged for deeper analysis go to Pass 2. The session gets a narrative
            summary and an intent hypothesis. Ambiguous classifications are listed as uncertainties
            for human review.
          </p>
        </div>
        <div className="pass-card">
          <span className="pass-num">Pass 2</span>
          <span className="pass-name">Deep Dive</span>
          <p>
            Tabs flagged in Pass 1 (typically technical documents, research papers, API docs) get
            individual analysis: summary, key entities, and a relevance assessment. This pass is
            conditional. Sessions with no flagged tabs skip it.
          </p>
        </div>
        <div className="pass-card">
          <span className="pass-num">Pass 3</span>
          <span className="pass-name">Visualization</span>
          <p>
            Generates a Mermaid diagram representing the session's structure. Categories become
            subgraphs. Cross-category connections surface as dotted edges. The diagram is rendered
            directly in the results page.
          </p>
        </div>
        <div className="pass-card">
          <span className="pass-num">Pass 4</span>
          <span className="pass-name">Thematic Analysis</span>
          <p>
            Conditional on active projects existing in context.json. Maps tabs to declared projects,
            identifies cross-category connections that keyword matching would miss (a "Research" tab
            about authorship theory supporting a "Creative Writing" project), and proposes concrete
            30-minute tasks. Generates an alternative narrative reframing the session through a
            thematic rather than categorical lens.
          </p>
        </div>
      </div>
      <p>
        Every pass captures a full trace: the prompt sent to the LLM, the raw response, parsing
        decisions, and timing data. These traces persist in the session artifact and can be
        inspected, edited, and re-run through a workbench interface. A developer can modify
        a classification prompt and see new output without re-running the full pipeline.
      </p>
      <p>
        Cost per session with Claude Haiku: approximately $0.006. With local Ollama models: zero,
        but 3-4x slower.
      </p>
    </section>
  );
}

function Findings() {
  return (
    <section>
      <p>
        Single sessions are mildly interesting. You see your tabs organized and narrated, which
        is useful in the moment but not much more than a tidy bookmark list. The value that
        surprised was in cross-session patterns.
      </p>
      <h3>Ghost Tabs</h3>
      <p>
        Tabs that appear in multiple sessions but never receive a disposition (never marked
        complete, never deliberately closed). After 188 captured sessions, Memento identified
        tabs that appeared in 40+ sessions across months. The Google Cloud blog post on agent
        evaluation frameworks appeared in 43 sessions, always co-occurring with Memento
        development tabs. The system inferred the candidate intention: "learn agent evaluation
        by applying it to Memento." The user confirmed this was accurate — and had not
        articulated it to himself before.
      </p>
      <h3>Project Health Decay</h3>
      <p>
        By tracking which project-associated tabs appear across sessions and when they stop
        appearing, the system detects project neglect. A project with tabs appearing in 12
        sessions over two weeks, then zero sessions for 30 days, gets flagged as abandoned.
        The signal is absence, not activity.
      </p>
      <h3>Distraction Signatures</h3>
      <p>
        Time-of-day and day-of-week patterns in non-work browsing. The system can surface
        patterns like repeated YouTube sessions at 4am on Wednesdays. These patterns are
        invisible in any single session and only emerge from longitudinal aggregation.
      </p>
      <h3>Protected Category Semantics</h3>
      <p>
        An early classification error: chase.com was always categorized as "Financial." But
        reading a credit card rewards article on chase.com is Research. Managing your account
        balance on chase.com is a Transaction that should be protected from accidental closure.
        The system now distinguishes by URL path patterns and content keywords. The category
        "Transaction (Protected)" means "you have an active session with state you could lose,"
        not "this website involves money."
      </p>
    </section>
  );
}

function Failures() {
  return (
    <section>
      <p>
        Three significant approaches were tried and either abandoned or remain partially solved.
        Each produced findings worth preserving.
      </p>

      <h3>Tab-Level Intent Detection</h3>
      <p>
        The first attempt at intent detection worked per-tab: "you opened this URL, therefore
        you intend X." Users (tested via 3-agent proxy deliberation) rejected per-tab proposals
        as too shallow. Opening a Wikipedia article about Pierre Menard doesn't mean you intend
        to learn about Pierre Menard. It means you're working on something that Pierre Menard is
        one data point within. The intent lives at the thread level, not the tab level. This led
        to theme detection as a replacement approach.
      </p>

      <h3>Keyword-Based Theme Clustering</h3>
      <p>
        Theme detection groups tabs that recur together across sessions. The current implementation
        uses keyword co-occurrence: tabs that share terms get clustered. This works for
        surface-level groupings (all your React docs cluster together) but fails on the cases
        that matter most.
      </p>
      <p>
        A concrete failure: tabs open during one session included a Wikipedia article on Pierre
        Menard, a Poetry Foundation page on Emily Dickinson, an essay on the death of the author
        from varnelis.net, and a Nature paper on psychometric evaluation of LLMs. These share zero
        keywords. They are the same intellectual thread. Keyword clustering cannot find it.
        Semantic embedding or user-declared thread seeds might, but neither is implemented.
      </p>
      <p>
        A second problem: when 5 of 10 detected themes all match "Agent Engineering" as their
        top Basic Memory connection, the matching is too loose to be informative. Everything
        matching is the same as nothing matching.
      </p>

      <h3>Detection Without Resolution</h3>
      <p>
        The UX testing produced a diagnosis that applies beyond Memento: detection without a
        resolution mechanism is just another dashboard to look at. The initial theme detection UI
        offered Confirm / Correct / Dismiss actions. These train the system but produce nothing
        for the user. The 3-agent test concluded that every action should either produce an
        artifact (save as a note), enable resumption (reopen the tabs), or close the loop
        (archive the thread). Training the classifier is a side effect, not a primary action.
      </p>
      <p>
        This remains unresolved. The resolution actions (Save to Basic Memory, Open All Tabs,
        Archive, Keep Watching) have been specified but not built.
      </p>
    </section>
  );
}

function FeedbackLoop() {
  return (
    <section>
      <p>
        When the classifier assigns a tab to the wrong category, you can correct it. The
        correction is stored. The correction analyzer examines accumulated corrections for
        patterns: if you've corrected "stackoverflow.com/questions about Python" from Research
        to Development three times, the system extracts a rule and injects it into future
        classification prompts.
      </p>
      <p>
        The pipeline: user correction → pattern detection → rule suggestion → learned rule file
        (JSON) → prompt injection on subsequent classifications. The rules accumulate in{" "}
        <code>backend/prompts/learned-rules.json</code> and are loaded into the classification
        prompt at Pass 1.
      </p>
      <p>
        The architecture is the interesting part. Each correction is a human label on a machine
        prediction. Confirm = true positive. Correct = false positive with ground truth provided.
        Dismiss = false positive. Over time, this dataset enables measuring whether classification
        accuracy improves. Precision and recall can be computed from the correction log without
        a separate evaluation harness.
      </p>
      <p>
        Honest status: the pipeline exists and functions. It has not accumulated enough corrections
        to evaluate whether classification actually improves over time. The 188 captured sessions
        have produced a small number of corrections, concentrated in domain-ambiguity cases
        (stackoverflow as Development vs. Research, YouTube as Entertainment vs. Learning). Whether
        the learned rules generalize or overfit to specific URL patterns is unknown.
      </p>
      <p>
        The intent detection spec extends this pattern. If the system proposes an intention
        ("you keep opening this tab because you want to learn agent evaluation") and the user
        confirms, corrects, or dismisses the proposal, that's the same feedback structure applied
        at a higher level of abstraction. Confirm/correct/dismiss on intents rather than
        categories.
      </p>
    </section>
  );
}

function CommitmentDevice() {
  return (
    <section>
      <p>
        Launchpad mode locks new session captures until you resolve every tab in the current
        session. Each tab requires a disposition: complete, trash, defer, promote, regroup.
        Financial and transactional tabs cannot be trashed. A 10-second undo window follows
        each action. The session unlock happens only when every item has a disposition.
      </p>
      <p>
        The design draws from Ariely and Wertenbroch's work on commitment devices: voluntary
        constraints that create immediate consequences for present-biased behavior. You choose
        to enter Launchpad mode. Once in, the lock creates a cost for not resolving your session.
        The hypothesis: forced confrontation with your open tabs produces better attention hygiene
        than voluntary review.
      </p>
      <p>
        The data does not support the hypothesis yet. Across 188 captured sessions, the
        disposition count is zero. Launchpad mode has been used for testing but not adopted as
        a regular workflow. Several interpretations are possible: the friction is too high for
        a single developer using the tool (no external accountability). The all-or-nothing lock
        is too coarse — a Review Mode was added later (view and resolve without locking, progress
        saves) but usage data on it is thin. The per-tab resolution granularity may be wrong;
        resolving 30 individual tabs is tedious in a way that resolving 5 themes would not be.
      </p>
      <p>
        The commitment device concept may be sound while the UX is wrong. Or the concept may not
        transfer from its origin contexts (savings accounts, gym memberships) to browser session
        management. The experiment hasn't run long enough to distinguish these possibilities.
      </p>
    </section>
  );
}

function OpenQuestions() {
  return (
    <section>
      <p>
        These are unresolved and would benefit from outside input.
      </p>
      <h3>Session-Level vs. Intention-Level Organization</h3>
      <p>
        The current UI organizes around captured sessions: each capture is a timestamped artifact
        containing classified tabs. The intent detection spec proposes reorganizing around
        inferred intentions: recurring unresolved items, sorted by signal strength, with the
        session history demoted to a data layer underneath. These are different products. The
        session view is an archive. The intention view is a to-do list generated from behavioral
        patterns. Which one the project should be is unclear.
      </p>
      <h3>Keyword Clustering vs. Semantic Thread Detection</h3>
      <p>
        The Pierre Menard / Dickinson / LLM psychometrics problem. Tabs that form a coherent
        intellectual thread but share no surface-level terms. Possible approaches: embedding-based
        similarity (expensive to run locally), user-declared thread seeds that anchor future
        clustering, or Basic Memory connections as a bridge (tabs linking to the same KB note
        are likely related regardless of keywords). None are implemented.
      </p>
      <h3>Discoverability of the Codebase Itself</h3>
      <p>
        At 20,600 lines across 57 files, the project contains capabilities its builder has
        forgotten exist. The prompt workbench — full trace capture, inline inspection, re-run
        from the browser — was documented only after its existence came into question during a
        session. The dev intent panel, designed to let AI and human negotiate UI purpose through
        the interface itself, has no documentation outside a session transcript. Whether a
        project built through iterative AI collaboration can maintain self-knowledge without
        conventional engineering discipline (ADRs, sprint reviews, changelogs) is an open
        question this project is inadvertently testing.
      </p>
      <h3>Generalization Beyond Browsing</h3>
      <p>
        The four-pass classification pipeline, the correction-to-learning loop, and the
        longitudinal pattern detection are not browser-specific in their architecture. They
        operate on timestamped collections of items with metadata. Git commits, email threads,
        file system snapshots, and reading logs all fit the same shape. Whether the specific
        prompt engineering and schema design transfer, or whether each new domain requires
        equivalent iteration, determines whether Memento is a tool or a case study.
      </p>
    </section>
  );
}

function TechnicalProfile() {
  return (
    <section>
      <div className="stats-grid">
        <div className="stat">
          <span className="stat-value">20,600</span>
          <span className="stat-label">Lines of code</span>
        </div>
        <div className="stat">
          <span className="stat-value">43</span>
          <span className="stat-label">Backend files</span>
        </div>
        <div className="stat">
          <span className="stat-value">14</span>
          <span className="stat-label">Renderer files</span>
        </div>
        <div className="stat">
          <span className="stat-value">18</span>
          <span className="stat-label">MCP tools</span>
        </div>
        <div className="stat">
          <span className="stat-value">v1.3.0</span>
          <span className="stat-label">Schema version</span>
        </div>
        <div className="stat">
          <span className="stat-value">188</span>
          <span className="stat-label">Captured sessions</span>
        </div>
        <div className="stat">
          <span className="stat-value">~$0.006</span>
          <span className="stat-label">Cost/session (Haiku)</span>
        </div>
        <div className="stat">
          <span className="stat-value">$0.00</span>
          <span className="stat-label">Cost/session (Ollama)</span>
        </div>
      </div>

      <h3>Stack</h3>
      <table>
        <tbody>
          <tr><td>Runtime</td><td>Node.js</td></tr>
          <tr><td>Extension</td><td>Chrome Manifest V3</td></tr>
          <tr><td>LLM (cloud)</td><td>Anthropic Claude 3.5 Haiku</td></tr>
          <tr><td>LLM (local)</td><td>Ollama — Qwen 2.5 Coder, Llama 3.2, others</td></tr>
          <tr><td>Hardware</td><td>RTX 5060 Ti 16GB (Ollama host)</td></tr>
          <tr><td>Network</td><td>Tailscale (cross-machine inference)</td></tr>
          <tr><td>AI integration</td><td>MCP server (Claude Desktop, Claude.ai)</td></tr>
          <tr><td>Knowledge base</td><td>Basic Memory (Obsidian-backed, MCP-queryable)</td></tr>
          <tr><td>Storage</td><td>JSON session artifacts on disk</td></tr>
        </tbody>
      </table>

      <h3>MCP Tools</h3>
      <p>
        The MCP server exposes 18 tools to Claude Desktop and Claude.ai, organized in five groups:
      </p>
      <table>
        <thead>
          <tr><th>Group</th><th>Tools</th><th>Purpose</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Session</td>
            <td>list, read, get_latest, search</td>
            <td>Query captured session artifacts</td>
          </tr>
          <tr>
            <td>Context</td>
            <td>get/set active projects, reclassify</td>
            <td>Manage classification context, re-run with updated projects</td>
          </tr>
          <tr>
            <td>Lock</td>
            <td>get_lock_status, clear_lock</td>
            <td>Inspect and manage Launchpad session locks</td>
          </tr>
          <tr>
            <td>Longitudinal</td>
            <td>stats, recurring_unfinished, project_health, distraction_signature, sync_attention</td>
            <td>Cross-session pattern analysis and Basic Memory export</td>
          </tr>
          <tr>
            <td>Corrections</td>
            <td>correction_stats, correction_suggestions, add/get extractors</td>
            <td>Feedback loop inspection and domain rule management</td>
          </tr>
        </tbody>
      </table>

      <h3>Source</h3>
      <p>
        <a href="https://github.com/adambalm/memento-public" target="_blank" rel="noopener">
          github.com/adambalm/memento-public
        </a>
      </p>
    </section>
  );
}

const SECTION_COMPONENTS: Record<string, React.FC> = {
  premise: Premise,
  pipeline: Pipeline,
  findings: Findings,
  failures: Failures,
  feedback: FeedbackLoop,
  commitment: CommitmentDevice,
  open: OpenQuestions,
  profile: TechnicalProfile,
};

const cssText = `
  .memento-content section {
    font-family: var(--font-prose);
    font-size: 17px;
    line-height: 1.7;
    color: var(--color-text);
  }
  .memento-content p {
    margin: 0 0 1.1em 0;
    max-width: 38em;
  }
  .memento-content h3 {
    font-family: var(--font-prose);
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text);
    margin: 1.8em 0 0.6em 0;
    letter-spacing: 0.01em;
  }
  .memento-content code {
    font-family: var(--font-mono);
    font-size: 14px;
    background: var(--color-bg-subtle);
    padding: 2px 5px;
    border-radius: 2px;
  }
  .memento-content table {
    border-collapse: collapse;
    margin: 1em 0 1.4em 0;
    font-size: 15px;
    max-width: 42em;
  }
  .memento-content th,
  .memento-content td {
    text-align: left;
    padding: 6px 14px 6px 0;
    border-bottom: 1px solid var(--color-border);
    font-family: var(--font-prose);
    vertical-align: top;
  }
  .memento-content th {
    font-weight: 600;
    color: var(--color-text-muted);
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: var(--font-mono);
  }
  .memento-content a {
    color: var(--color-accent);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .pass-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin: 1em 0 1.4em 0;
    max-width: 42em;
  }
  .pass-card {
    background: var(--color-bg-subtle);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    padding: 14px 16px;
  }
  .pass-card p {
    font-size: 15px;
    line-height: 1.55;
    margin: 0.5em 0 0 0;
    color: var(--color-text-muted);
  }
  .pass-num {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 500;
    color: var(--color-accent);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .pass-name {
    display: block;
    font-family: var(--font-prose);
    font-size: 16px;
    font-weight: 600;
    margin-top: 2px;
    color: var(--color-text);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin: 0 0 1.6em 0;
    max-width: 42em;
  }
  .stat {
    background: var(--color-bg-subtle);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
  }
  .stat-value {
    font-family: var(--font-mono);
    font-size: 22px;
    font-weight: 500;
    color: var(--color-text);
    line-height: 1.2;
  }
  .stat-label {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--color-text-tertiary);
    margin-top: 4px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  @media (max-width: 600px) {
    .pass-grid { grid-template-columns: 1fr; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

const inlineStyles = {
  root: {
    background: "var(--color-bg)",
    minHeight: "100vh",
    padding: "40px 32px",
    fontFamily: "var(--font-prose)",
  } as React.CSSProperties,
  header: {
    maxWidth: "38em",
    marginBottom: "32px",
    borderBottom: "1px solid var(--color-border)",
    paddingBottom: "24px",
  } as React.CSSProperties,
  title: {
    fontFamily: "var(--font-prose)",
    fontSize: "36px",
    fontWeight: 300,
    color: "var(--color-text)",
    margin: "0 0 8px 0",
    letterSpacing: "-0.01em",
  } as React.CSSProperties,
  subtitle: {
    fontSize: "16px",
    color: "var(--color-text-muted)",
    margin: "0 0 6px 0",
    lineHeight: 1.5,
    maxWidth: "34em",
  } as React.CSSProperties,
  date: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    color: "var(--color-text-tertiary)",
    margin: 0,
    letterSpacing: "0.02em",
  } as React.CSSProperties,
  nav: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "4px",
    marginBottom: "32px",
    maxWidth: "42em",
  } as React.CSSProperties,
  navButton: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    letterSpacing: "0.03em",
    background: "none",
    border: "1px solid transparent",
    padding: "6px 12px",
    cursor: "pointer",
    color: "var(--color-text-tertiary)",
    borderRadius: "3px",
    transition: "all 0.15s",
  } as React.CSSProperties,
  navButtonActive: {
    color: "var(--color-text)",
    background: "var(--color-bg-subtle)",
    border: "1px solid var(--color-border)",
  } as React.CSSProperties,
  main: {
    maxWidth: "42em",
    minHeight: "60vh",
  } as React.CSSProperties,
  footer: {
    maxWidth: "38em",
    marginTop: "48px",
    paddingTop: "20px",
    borderTop: "1px solid var(--color-border)",
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    color: "var(--color-text-tertiary)",
    lineHeight: 1.6,
  } as React.CSSProperties,
};

export default function MementoDemo() {
  const [activeSection, setActiveSection] = useState("premise");

  const ActiveComponent = SECTION_COMPONENTS[activeSection];

  return (
    <div style={inlineStyles.root}>
      <style>{cssText}</style>
      <header style={inlineStyles.header}>
        <h1 style={inlineStyles.title}>Memento</h1>
        <p style={inlineStyles.subtitle}>
          Local attention analysis using LLM classification pipelines on self-collected
          browsing data. An open-source experiment.
        </p>
        <p style={inlineStyles.date}>February 2026 — v2.0.0</p>
      </header>

      <nav style={inlineStyles.nav}>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={{
              ...inlineStyles.navButton,
              ...(activeSection === s.id ? inlineStyles.navButtonActive : {}),
            }}
          >
            {s.label}
          </button>
        ))}
      </nav>

      <main style={inlineStyles.main} className="memento-content">
        <ActiveComponent />
      </main>

      <footer style={inlineStyles.footer}>
        <p>
          Built by Ed O'Connell. Developed iteratively with Claude (Anthropic) across
          100+ collaboration sessions. Previous demo version: v1.0.0, 2026-01-05.
        </p>
      </footer>
    </div>
  );
}
