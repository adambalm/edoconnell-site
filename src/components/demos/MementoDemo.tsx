/*
MANIFEST
=========
Artifact: Memento Demo
Version: 1.0.0
Generated: 2026-01-05T14:30:00Z
Generator: Claude (Opus 4.5) via Claude Desktop
Migrated: 2026-02-14 to edoconnell-site (Astro 5 + React island)

SECTIONS:
- Overview (lines ~180-210)
- LiveSession (lines ~212-310)
- Architecture (lines ~312-390)
- Schema (lines ~392-450)
- OpenQuestions (lines ~452-500)
- Roadmap (lines ~502-550)

SUBCOMPONENTS:
- CategoryBar — visual bar chart for category distribution
- DeepDiveCard — card displaying deep dive analysis result

DEPENDENCIES:
- react (useState)
- No external icon library (using Unicode/CSS)

CANARY: MEMENTO-DEMO-2026-01-05-VITE-READY
*/

import { useState } from 'react';
import styles from './MementoDemo.module.css';

/* ========== DATA: Trilingual Content ========== */
const content: Record<string, any> = {
  en: {
    nav: {
      overview: 'Overview',
      liveSession: 'Live Session',
      architecture: 'Architecture',
      schema: 'Schema',
      openQuestions: 'Open Questions',
      roadmap: 'Roadmap'
    },
    overview: {
      title: 'Memento',
      subtitle: 'Browser Session Capture & Classification',
      lead: 'What were you working on? The tabs you have open tell a story, but that story evaporates the moment you close them. Memento captures browser sessions, classifies tabs using local or cloud LLMs, and persists structured artifacts for longitudinal analysis.',
      partOf: 'Part of Context Sage',
      partOfDesc: 'Memento is the capture layer of a larger system for governed multi-agent collaboration. It feeds behavioral data\u2014what you actually browse\u2014into a knowledge base that AI agents can query, challenge, and reason about.',
      statusLabel: 'Status',
      status: 'MVP functional. Local inference via Ollama, cloud inference via Anthropic API. MCP server enables Claude Desktop integration.',
      coreInsight: 'The art of distilling intent from browser sessions is new territory. A tab titled "2504.19413" tells you nothing until you know it\'s an arXiv paper. Classification requires context, and context requires collaboration.'
    },
    liveSession: {
      title: 'A Real Session',
      subtitle: 'Captured December 31, 2025 at 7:57 AM',
      intro: 'This is not a mock-up. The data below was captured by Memento and classified by Claude 3.5 Haiku via the Anthropic API. 27 tabs across 11 categories, with 4 flagged for deep analysis.',
      narrativeLabel: 'Session Narrative',
      narrative: 'The user is exploring various technical domains, with a focus on AI development, content management, and educational projects.',
      categoriesLabel: 'Categories Detected',
      deepDiveLabel: 'Deep Dive Results',
      deepDiveIntro: 'Four tabs were flagged for deeper content extraction:',
      reasoningLabel: 'Classification Reasoning',
      metaLabel: 'Session Metadata'
    },
    architecture: {
      title: 'Architecture',
      subtitle: 'How the pipeline works',
      flowTitle: 'Data Flow',
      flowSteps: [
        { num: '1', label: 'Capture', desc: 'Chrome extension captures all open tabs' },
        { num: '2', label: 'POST', desc: 'Tab data sent to Node.js backend' },
        { num: '3', label: 'Classify', desc: 'Model dispatch to Ollama or Anthropic' },
        { num: '4', label: 'Persist', desc: 'JSON written to memory/sessions/' },
        { num: '5', label: 'Query', desc: 'MCP server exposes to Claude Desktop' }
      ],
      twoPassTitle: 'Two-Pass Classification',
      twoPassDesc: 'Pass 1 classifies all tabs and triages. Pass 2 extracts structured data from flagged tabs only.',
      infrastructureTitle: 'Infrastructure'
    },
    schema: {
      title: 'Session Schema',
      subtitle: 'What gets persisted',
      intro: 'Each session is a self-contained JSON artifact with full provenance.',
      schemaVersion: '1.1.0',
      fieldsTitle: 'Key Fields',
      fields: [
        { name: 'timestamp', desc: 'ISO 8601 capture time' },
        { name: 'narrative', desc: 'LLM-generated summary' },
        { name: 'groups', desc: 'Tabs by category' },
        { name: 'reasoning.perTab', desc: 'Classification rationale' },
        { name: 'meta.engine', desc: 'Which LLM processed' }
      ]
    },
    openQuestions: {
      title: 'Open Questions',
      subtitle: 'This is research, not a finished product',
      intro: 'We don\'t have canonical answers. These are questions we\'re actively exploring:',
      questions: [
        { q: 'What taxonomy should categories follow?', detail: 'Generic vs opinionated (Deep Work, Admin, Distraction)' },
        { q: 'How do we handle low-confidence classifications?', detail: 'Ask? Flag? Default to Other?' },
        { q: 'What constitutes a "session"?', detail: 'All tabs? Since last capture? Active in last N minutes?' },
        { q: 'How should sessions aggregate over time?', detail: 'Pattern detection across 100 sessions' },
        { q: 'What\'s the capability floor for local models?', detail: 'qwen3 works. Does llama3.2?' }
      ]
    },
    roadmap: {
      title: 'Roadmap',
      phases: [
        { phase: '1', name: 'MVP: Capture \u2192 Classify \u2192 Log', status: 'complete' },
        { phase: '2', name: 'Two-pass Deep Dive', status: 'complete' },
        { phase: '3', name: 'Engine picker', status: 'complete' },
        { phase: '4', name: 'MCP Server', status: 'complete' },
        { phase: '5', name: 'Launchpad Mode', status: 'in-progress' },
        { phase: '6', name: 'Learning Loop', status: 'planned' },
        { phase: '7', name: 'Longitudinal Analysis', status: 'future' }
      ]
    },
  },
  zh: {
    nav: { overview: '\u6982\u8ff0', liveSession: '\u5b9e\u65f6\u4f1a\u8bdd', architecture: '\u67b6\u6784', schema: '\u6a21\u5f0f', openQuestions: '\u5f00\u653e\u95ee\u9898', roadmap: '\u8def\u7ebf\u56fe' },
    overview: {
      title: 'Memento',
      subtitle: '\u6d4f\u89c8\u5668\u4f1a\u8bdd\u6355\u83b7\u4e0e\u5206\u7c7b',
      lead: '\u4f60\u5728\u505a\u4ec0\u4e48\uff1f\u6253\u5f00\u7684\u6807\u7b7e\u9875\u8bb2\u8ff0\u6545\u4e8b\uff0c\u4f46\u5173\u95ed\u65f6\u5c31\u6d88\u5931\u4e86\u3002Memento \u6355\u83b7\u4f1a\u8bdd\u5e76\u4f7f\u7528 LLM \u5206\u7c7b\u3002',
      partOf: 'Context Sage \u7684\u4e00\u90e8\u5206',
      partOfDesc: 'Memento \u662f\u591a\u4ee3\u7406\u534f\u4f5c\u6cbb\u7406\u7cfb\u7edf\u7684\u6355\u83b7\u5c42\u3002',
      statusLabel: '\u72b6\u6001',
      status: 'MVP \u529f\u80fd\u5b8c\u6210\u3002\u652f\u6301 Ollama \u672c\u5730\u63a8\u7406\u548c Anthropic API\u3002',
      coreInsight: '\u4ece\u6d4f\u89c8\u5668\u4f1a\u8bdd\u4e2d\u63d0\u70bc\u610f\u56fe\u662f\u65b0\u9886\u57df\u3002\u5206\u7c7b\u9700\u8981\u4e0a\u4e0b\u6587\uff0c\u4e0a\u4e0b\u6587\u9700\u8981\u534f\u4f5c\u3002'
    },
    liveSession: { title: '\u771f\u5b9e\u4f1a\u8bdd', subtitle: '2025\u5e7412\u670831\u65e5\u6355\u83b7', intro: '\u771f\u5b9e\u6570\u636e\uff0c27\u4e2a\u6807\u7b7e\u9875\uff0c11\u4e2a\u7c7b\u522b\u3002', narrativeLabel: '\u4f1a\u8bdd\u53d9\u8ff0', narrative: '\u7528\u6237\u6b63\u5728\u63a2\u7d22\u6280\u672f\u9886\u57df\u3002', categoriesLabel: '\u68c0\u6d4b\u5230\u7684\u7c7b\u522b', deepDiveLabel: '\u6df1\u5ea6\u5206\u6790', deepDiveIntro: '\u56db\u4e2a\u6807\u7b7e\u9875\u88ab\u6807\u8bb0\uff1a', reasoningLabel: '\u5206\u7c7b\u63a8\u7406', metaLabel: '\u5143\u6570\u636e' },
    architecture: { title: '\u67b6\u6784', subtitle: '\u6d41\u6c34\u7ebf', flowTitle: '\u6570\u636e\u6d41', flowSteps: [{ num: '1', label: '\u6355\u83b7', desc: '\u6269\u5c55\u6355\u83b7\u6807\u7b7e\u9875' }, { num: '2', label: 'POST', desc: '\u53d1\u9001\u5230\u540e\u7aef' }, { num: '3', label: '\u5206\u7c7b', desc: '\u8def\u7531\u5230\u6a21\u578b' }, { num: '4', label: '\u6301\u4e45\u5316', desc: '\u5199\u5165 JSON' }, { num: '5', label: '\u67e5\u8be2', desc: 'MCP \u66b4\u9732' }], twoPassTitle: '\u4e24\u9636\u6bb5\u5206\u7c7b', twoPassDesc: '\u7b2c\u4e00\u9636\u6bb5\u5206\u7c7b\uff0c\u7b2c\u4e8c\u9636\u6bb5\u6df1\u5ea6\u5206\u6790\u3002', infrastructureTitle: '\u57fa\u7840\u8bbe\u65bd' },
    schema: { title: '\u4f1a\u8bdd\u6a21\u5f0f', subtitle: '\u6301\u4e45\u5316\u5185\u5bb9', intro: '\u6bcf\u4e2a\u4f1a\u8bdd\u662f\u72ec\u7acb JSON\u3002', schemaVersion: '1.1.0', fieldsTitle: '\u5b57\u6bb5', fields: [{ name: 'timestamp', desc: '\u6355\u83b7\u65f6\u95f4' }, { name: 'narrative', desc: '\u6458\u8981' }, { name: 'groups', desc: '\u5206\u7c7b' }, { name: 'reasoning.perTab', desc: '\u63a8\u7406' }, { name: 'meta.engine', desc: '\u5f15\u64ce' }] },
    openQuestions: { title: '\u5f00\u653e\u95ee\u9898', subtitle: '\u7814\u7a76\u4e2d', intro: '\u6211\u4eec\u6b63\u5728\u63a2\u7d22\uff1a', questions: [{ q: '\u5206\u7c7b\u6cd5\uff1f', detail: '\u901a\u7528 vs \u6709\u89c2\u70b9' }, { q: '\u4f4e\u7f6e\u4fe1\u5ea6\uff1f', detail: '\u8be2\u95ee\uff1f\u6807\u8bb0\uff1f' }, { q: '\u4f1a\u8bdd\u5b9a\u4e49\uff1f', detail: '\u6240\u6709\u6807\u7b7e\uff1f\u6700\u8fd1\uff1f' }, { q: '\u65f6\u95f4\u805a\u5408\uff1f', detail: '\u6a21\u5f0f\u68c0\u6d4b' }, { q: '\u6a21\u578b\u4e0b\u9650\uff1f', detail: 'qwen3 \u53ef\u4ee5' }] },
    roadmap: { title: '\u8def\u7ebf\u56fe', phases: [{ phase: '1', name: 'MVP', status: 'complete' }, { phase: '2', name: '\u4e24\u9636\u6bb5', status: 'complete' }, { phase: '3', name: '\u5f15\u64ce\u9009\u62e9', status: 'complete' }, { phase: '4', name: 'MCP', status: 'complete' }, { phase: '5', name: '\u542f\u52a8\u677f', status: 'in-progress' }, { phase: '6', name: '\u5b66\u4e60\u5faa\u73af', status: 'planned' }, { phase: '7', name: '\u7eb5\u5411\u5206\u6790', status: 'future' }] },
  },
  es: {
    nav: { overview: 'Resumen', liveSession: 'Sesi\u00f3n Real', architecture: 'Arquitectura', schema: 'Esquema', openQuestions: 'Preguntas', roadmap: 'Hoja de Ruta' },
    overview: {
      title: 'Memento',
      subtitle: 'Captura y Clasificaci\u00f3n de Sesiones',
      lead: '\u00bfEn qu\u00e9 trabajabas? Las pesta\u00f1as cuentan una historia que desaparece al cerrarlas. Memento captura y clasifica.',
      partOf: 'Parte de Context Sage',
      partOfDesc: 'Memento es la capa de captura del sistema multi-agente.',
      statusLabel: 'Estado',
      status: 'MVP funcional. Ollama local y Anthropic API.',
      coreInsight: 'Destilar intenci\u00f3n de sesiones es territorio nuevo. La clasificaci\u00f3n requiere contexto y colaboraci\u00f3n.'
    },
    liveSession: { title: 'Sesi\u00f3n Real', subtitle: '31 diciembre 2025', intro: 'Datos reales: 27 pesta\u00f1as, 11 categor\u00edas.', narrativeLabel: 'Narrativa', narrative: 'Usuario explorando dominios t\u00e9cnicos.', categoriesLabel: 'Categor\u00edas', deepDiveLabel: 'An\u00e1lisis Profundo', deepDiveIntro: 'Cuatro pesta\u00f1as marcadas:', reasoningLabel: 'Razonamiento', metaLabel: 'Metadatos' },
    architecture: { title: 'Arquitectura', subtitle: 'Pipeline', flowTitle: 'Flujo', flowSteps: [{ num: '1', label: 'Captura', desc: 'Extensi\u00f3n captura' }, { num: '2', label: 'POST', desc: 'Env\u00eda al backend' }, { num: '3', label: 'Clasificar', desc: 'Despacha a modelo' }, { num: '4', label: 'Persistir', desc: 'Escribe JSON' }, { num: '5', label: 'Consultar', desc: 'MCP expone' }], twoPassTitle: 'Dos Pasadas', twoPassDesc: 'Pasada 1 clasifica, Pasada 2 analiza.', infrastructureTitle: 'Infraestructura' },
    schema: { title: 'Esquema', subtitle: 'Persistencia', intro: 'Cada sesi\u00f3n es JSON autocontenido.', schemaVersion: '1.1.0', fieldsTitle: 'Campos', fields: [{ name: 'timestamp', desc: 'Tiempo' }, { name: 'narrative', desc: 'Resumen' }, { name: 'groups', desc: 'Categor\u00edas' }, { name: 'reasoning.perTab', desc: 'Razones' }, { name: 'meta.engine', desc: 'Motor' }] },
    openQuestions: { title: 'Preguntas', subtitle: 'Investigaci\u00f3n', intro: 'Explorando:', questions: [{ q: '\u00bfTaxonom\u00eda?', detail: 'Gen\u00e9rica vs con opini\u00f3n' }, { q: '\u00bfBaja confianza?', detail: '\u00bfPreguntar? \u00bfMarcar?' }, { q: '\u00bfDefinici\u00f3n de sesi\u00f3n?', detail: '\u00bfTodas? \u00bfRecientes?' }, { q: '\u00bfAgregaci\u00f3n temporal?', detail: 'Patrones' }, { q: '\u00bfPiso de modelo?', detail: 'qwen3 funciona' }] },
    roadmap: { title: 'Hoja de Ruta', phases: [{ phase: '1', name: 'MVP', status: 'complete' }, { phase: '2', name: 'Dos pasadas', status: 'complete' }, { phase: '3', name: 'Selector', status: 'complete' }, { phase: '4', name: 'MCP', status: 'complete' }, { phase: '5', name: 'Launchpad', status: 'in-progress' }, { phase: '6', name: 'Aprendizaje', status: 'planned' }, { phase: '7', name: 'Longitudinal', status: 'future' }] },
  }
};

/* ========== DATA: Real Session (December 31, 2025) ========== */
const sessionData = {
  timestamp: '2025-12-31T07:57:12.197Z',
  totalTabs: 27,
  categories: {
    'Research': 7,
    'Development: Memento': 3,
    'Development': 5,
    'Productivity': 2,
    'Creative Writing': 2,
    'Social Media': 1,
    'Education': 3,
    'Other': 3,
    'News': 1
  } as Record<string, number>,
  deepDiveResults: [
    { title: 'MedGemma Integration', summary: 'DICOM and FHIR support for clinical workflows', entities: ['MedGemma', 'FHIR'] },
    { title: 'Multi-Agent Debate', summary: 'MAD strategies with judge mechanism', entities: ['Gemini-Pro', 'PaLM 2'] },
    { title: 'Prompt Patterns', summary: '13 patterns for software design', entities: ['ChatGPT', 'Vanderbilt'] },
    { title: 'Healthcare API', summary: 'MCP Toolbox integration', entities: ['Google Cloud', 'ADK'] }
  ],
  sampleReasoning: [
    { tab: 'Pierre Menard - Wikipedia', category: 'Creative Writing', signals: ['Borges', 'authorship'], confidence: 'high' },
    { tab: 'Emily Dickinson | Poetry Foundation', category: 'Creative Writing', signals: ['Emily Dickinson'], confidence: 'high' },
    { tab: 'Multi-Agent Debate Strategies', category: 'Research', signals: ['AI research'], confidence: 'high' },
    { tab: 'Untitled document - Google Docs', category: 'Productivity', signals: ['untitled'], confidence: 'low' }
  ],
  meta: { engine: 'anthropic', model: 'claude-3-5-haiku', passes: 3, time: '42.5s', cost: '$0.007' }
};

/* ========== SUBCOMPONENT: CategoryBar ========== */
const CategoryBar = ({ name, count, max }: { name: string; count: number; max: number }) => (
  <div className={styles.categoryBar}>
    <div className={styles.categoryBarFill} style={{ width: `${(count / max) * 100}%` }} />
    <span className={styles.categoryBarName}>{name}</span>
    <span className={styles.categoryBarCount}>({count})</span>
  </div>
);

/* ========== SUBCOMPONENT: DeepDiveCard ========== */
const DeepDiveCard = ({ title, summary, entities }: { title: string; summary: string; entities: string[] }) => (
  <div className={styles.deepDiveCard}>
    <div className={styles.deepDiveTitle}>{title}</div>
    <p className={styles.deepDiveSummary}>{summary}</p>
    <div className={styles.deepDiveEntities}>
      {entities.map((e, j) => (
        <span key={j} className={styles.entityTag}>{e}</span>
      ))}
    </div>
  </div>
);

/* ========== MAIN COMPONENT ========== */
export default function MementoDemo() {
  const [lang, setLang] = useState('en');
  const [section, setSection] = useState('overview');
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  const t = content[lang];
  const maxCat = Math.max(...Object.values(sessionData.categories));

  const getStatusDotClass = (status: string) => {
    if (status === 'complete') return styles.statusDotComplete;
    if (status === 'in-progress') return styles.statusDotInProgress;
    return styles.statusDotPlanned;
  };

  /* ========== SECTION: Overview ========== */
  const renderOverview = () => (
    <section data-section="overview">
      <p className={styles.lead}>{t.overview.lead}</p>
      <div className={styles.contentBlock}>
        <div className={styles.label}>{t.overview.partOf}</div>
        <p>{t.overview.partOfDesc}</p>
      </div>
      <div className={styles.contentBlock}>
        <div className={styles.label}>{t.overview.statusLabel}</div>
        <p><span className={styles.statusBadge}>MVP</span> {t.overview.status}</p>
      </div>
      <div className={styles.pullQuote}>{t.overview.coreInsight}</div>
    </section>
  );

  /* ========== SECTION: LiveSession ========== */
  const renderLiveSession = () => (
    <section data-section="liveSession">
      <p className={styles.lead}>{t.liveSession.intro}</p>
      <div className={styles.contentBlock}>
        <div className={styles.label}>{t.liveSession.narrativeLabel}</div>
        <p className={styles.narrative}>{t.liveSession.narrative}</p>
      </div>
      <div className={styles.contentBlock}>
        <div className={styles.label}>{t.liveSession.categoriesLabel}</div>
        {Object.entries(sessionData.categories).map(([cat, count]) => (
          <CategoryBar key={cat} name={cat} count={count} max={maxCat} />
        ))}
      </div>
      <div className={styles.contentBlock}>
        <div className={styles.label}>{t.liveSession.deepDiveLabel}</div>
        <p className={styles.introText}>{t.liveSession.deepDiveIntro}</p>
        {sessionData.deepDiveResults.map((r, i) => (
          <DeepDiveCard key={i} {...r} />
        ))}
      </div>
      <div className={styles.contentBlock}>
        <div className={styles.label}>{t.liveSession.reasoningLabel}</div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead><tr><th className={styles.th}>Tab</th><th className={styles.th}>Category</th><th className={styles.th}>Signals</th><th className={styles.th}>Confidence</th></tr></thead>
            <tbody>
              {sessionData.sampleReasoning.map((item, i) => (
                <tr key={i}><td className={styles.td}>{item.tab}</td><td className={styles.td}>{item.category}</td><td className={styles.td}>{item.signals.join(', ')}</td><td className={styles.td}>{item.confidence}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <div className={styles.label}>{t.liveSession.metaLabel}</div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}><tbody>
            <tr><td className={styles.td}>Engine</td><td className={styles.td}><span className={styles.code}>{sessionData.meta.engine}</span></td></tr>
            <tr><td className={styles.td}>Model</td><td className={styles.td}><span className={styles.code}>{sessionData.meta.model}</span></td></tr>
            <tr><td className={styles.td}>Passes</td><td className={styles.td}>{sessionData.meta.passes}</td></tr>
            <tr><td className={styles.td}>Time</td><td className={styles.td}>{sessionData.meta.time}</td></tr>
            <tr><td className={styles.td}>Cost</td><td className={styles.td}>{sessionData.meta.cost}</td></tr>
          </tbody></table>
        </div>
      </div>
    </section>
  );

  /* ========== SECTION: Architecture ========== */
  const renderArchitecture = () => (
    <section data-section="architecture">
      <h3 className={styles.sectionTitle}>{t.architecture.flowTitle}</h3>
      {t.architecture.flowSteps.map((step: any, i: number) => (
        <div key={i} className={styles.flowStep}>
          <div className={styles.flowNum}>{step.num}</div>
          <div className={styles.flowContent}><strong>{step.label}</strong><div className={styles.flowDesc}>{step.desc}</div></div>
        </div>
      ))}
      <h3 className={styles.sectionTitle}>{t.architecture.twoPassTitle}</h3>
      <p>{t.architecture.twoPassDesc}</p>
      <h3 className={styles.sectionTitle}>{t.architecture.infrastructureTitle}</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead><tr><th className={styles.th}>Machine</th><th className={styles.th}>OS</th><th className={styles.th}>Role</th></tr></thead>
          <tbody>
            <tr><td className={styles.td}><span className={styles.code}>SupHouse</span></td><td className={styles.td}>Windows 11</td><td className={styles.td}>Extension + Backend</td></tr>
            <tr><td className={styles.td}><span className={styles.code}>adambalm</span></td><td className={styles.td}>Ubuntu 24.04</td><td className={styles.td}>LLM Inference (Ollama)</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  );

  /* ========== SECTION: Schema ========== */
  const renderSchema = () => (
    <section data-section="schema">
      <p className={styles.lead}>{t.schema.intro}</p>
      <div className={styles.schemaVersion}>
        <div className={styles.label}>Schema Version</div>
        <span className={styles.code}>{t.schema.schemaVersion}</span>
      </div>
      <h3 className={styles.sectionTitle}>{t.schema.fieldsTitle}</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead><tr><th className={styles.th}>Field</th><th className={styles.th}>Description</th></tr></thead>
          <tbody>
            {t.schema.fields.map((f: any, i: number) => (
              <tr key={i}><td className={styles.td}><span className={styles.code}>{f.name}</span></td><td className={styles.td}>{f.desc}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  /* ========== SECTION: OpenQuestions ========== */
  const renderOpenQuestions = () => (
    <section data-section="openQuestions">
      <p className={styles.lead}>{t.openQuestions.intro}</p>
      {t.openQuestions.questions.map((q: any, i: number) => (
        <div key={i} className={styles.qBox} data-testid={`question-${i}`}>
          <div className={styles.qHeader} onClick={() => setExpandedQ(expandedQ === i ? null : i)} data-testid={`question-toggle-${i}`}>
            <span>{q.q}</span><span>{expandedQ === i ? '\u2212' : '+'}</span>
          </div>
          {expandedQ === i && <div className={styles.qDetail}>{q.detail}</div>}
        </div>
      ))}
    </section>
  );

  /* ========== SECTION: Roadmap ========== */
  const renderRoadmap = () => (
    <section data-section="roadmap">
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead><tr><th className={styles.th}>Phase</th><th className={styles.th}>Name</th><th className={styles.th}>Status</th></tr></thead>
          <tbody>
            {t.roadmap.phases.map((p: any, i: number) => (
              <tr key={i} className={p.status === 'future' ? styles.rowFaded : undefined}>
                <td className={styles.td}>{p.phase}</td>
                <td className={styles.td}>{p.name}</td>
                <td className={styles.td}><span className={`${styles.statusDot} ${getStatusDotClass(p.status)}`} />{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderSection = () => {
    switch (section) {
      case 'overview': return renderOverview();
      case 'liveSession': return renderLiveSession();
      case 'architecture': return renderArchitecture();
      case 'schema': return renderSchema();
      case 'openQuestions': return renderOpenQuestions();
      case 'roadmap': return renderRoadmap();
      default: return renderOverview();
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.langGroup}>
          {(['en', 'zh', 'es'] as const).map(l => (
            <button
              key={l}
              className={`${styles.langBtn} ${lang === l ? styles.langBtnActive : ''}`}
              onClick={() => setLang(l)}
              data-testid={`lang-${l}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <h1 className={styles.title}>{t.overview.title}</h1>
        <p className={styles.subtitle}>{t.overview.subtitle}</p>
      </header>

      <nav className={styles.nav}>
        {Object.entries(t.nav).map(([key, label]) => (
          <button
            key={key}
            className={`${styles.navBtn} ${section === key ? styles.navBtnActive : ''}`}
            onClick={() => setSection(key)}
            data-testid={`nav-${key}`}
          >
            {label as string}
          </button>
        ))}
      </nav>

      <main>
        <h2 className={styles.sectionTitle}>{t.nav[section]}</h2>
        {renderSection()}
      </main>
    </div>
  );
}
