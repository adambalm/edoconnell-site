/**
 * seed.mjs — Create siteSettings, page, and demoItem documents in Sanity.
 *
 * Usage:
 *   node scripts/seed.mjs --dry-run    # Preview what would be created
 *   node scripts/seed.mjs              # Create documents
 *
 * Prerequisites:
 *   1. Create a write token at https://manage.sanity.io → Project → API → Tokens
 *      - Name: "seed-script" or similar
 *      - Permissions: Editor
 *   2. Add to .env.local:
 *      SANITY_API_WRITE_TOKEN=sk...
 *
 * Idempotency:
 *   Uses deterministic _id values. Running twice will update existing
 *   documents via createOrReplace, not duplicate.
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '..', '.env.local') });

const PROJECT_ID = process.env.PUBLIC_SANITY_PROJECT_ID || 'zu6l9t4j';
const DATASET = process.env.PUBLIC_SANITY_DATASET || 'production';
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;
const DRY_RUN = process.argv.includes('--dry-run');

if (!TOKEN && !DRY_RUN) {
  console.error('❌ Missing SANITY_API_WRITE_TOKEN in .env.local');
  console.error('   Create a write token at: https://manage.sanity.io');
  console.error('   Or run with --dry-run to preview');
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2025-01-01',
  token: TOKEN,
  useCdn: false,
});

/* ========== SITE SETTINGS ========== */

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  siteTitle: "Ed O'Connell",
  siteDescription: "Ed O'Connell — structured content, working systems.",
  noindex: true,
};

/* ========== PAGE DOCUMENTS ========== */

const pages = [
  {
    _id: 'page-home',
    _type: 'page',
    title: "Ed O'Connell",
    subtitle: "Cognition in context.",
    slug: { _type: 'slug', current: 'home' },
  },
  {
    _id: 'page-demos',
    _type: 'page',
    title: "Demos",
    subtitle: "Working systems, not slide decks.",
    slug: { _type: 'slug', current: 'demos' },
    seo: {
      _type: 'seo',
      metaDescription: "Interactive demonstrations of structured content, AI systems, and working software.",
    },
  },
];

/* ========== DEMO DOCUMENTS ========== */

const demos = [
  {
    _id: 'demo-memento',
    _type: 'demoItem',
    title: 'Memento Demo',
    slug: { _type: 'slug', current: 'memento' },
    summary: 'Browser session capture and classification demo with real session data from December 31, 2025.',
    renderMode: 'ISLAND',
    componentName: 'Memento',
    tags: ['browser-session', 'classification', 'ai-pipeline', 'real-data', 'interactive'],
    displayOrder: 3,
    epistemicStatus: 'working',
    audienceContext: 'Technical professionals interested in browser session intelligence and AI classification pipelines. No prerequisites beyond general software literacy.',
    publicationReadiness: 'preview',
    provenance: {
      _type: 'provenance',
      author: 'Ed O\'Connell',
      generatedBy: 'Claude (Opus 4.5)',
      reviewedBy: 'Ed O\'Connell',
      context: 'Memento MVP browser session capture and classification demonstration',
      date: '2026-01-05',
    },
    seo: {
      _type: 'seo',
      metaTitle: 'Memento Demo — Ed O\'Connell',
      metaDescription: 'Browser session capture and classification demo showing real session data with two-pass AI classification, schema documentation, and product roadmap.',
    },
  },
  {
    _id: 'demo-context-sage',
    _type: 'demoItem',
    title: 'Context Sage Demo',
    slug: { _type: 'slug', current: 'context-sage' },
    summary: 'Tufte-inspired content site explaining the Knowledge System architecture and governance protocols.',
    renderMode: 'ISLAND',
    componentName: 'ContextSage',
    tags: ['knowledge-system', 'governance', 'institutional-memory', 'tufte', 'interactive'],
    displayOrder: 2,
    epistemicStatus: 'working',
    audienceContext: 'Technical professionals and knowledge workers interested in multi-agent knowledge systems. Assumes familiarity with AI tools but not with institutional knowledge problems.',
    publicationReadiness: 'preview',
    provenance: {
      _type: 'provenance',
      author: 'Ed O\'Connell',
      generatedBy: 'Claude (Opus 4.5)',
      reviewedBy: 'Ed O\'Connell',
      context: 'Context Sage architecture documentation — governed multi-agent knowledge system',
      date: '2026-01-05',
    },
    seo: {
      _type: 'seo',
      metaTitle: 'Context Sage Demo — Ed O\'Connell',
      metaDescription: 'Tufte-inspired documentation of Context Sage, a governed multi-agent knowledge system with institutional memory, evidence cases, and provenance tracking.',
    },
  },
  {
    _id: 'demo-skill-forge',
    _type: 'demoItem',
    title: 'Skill Forge Visualizer',
    slug: { _type: 'slug', current: 'skill-forge' },
    summary: 'Interactive educational component explaining the Skill Forge pattern for heterogeneous AI deliberation.',
    renderMode: 'ISLAND',
    componentName: 'SkillForge',
    tags: ['deliberation', 'multi-agent', 'governance', 'interactive', 'react'],
    displayOrder: 1,
    epistemicStatus: 'working',
    audienceContext: 'Technical professionals interested in AI governance patterns. Assumes familiarity with LLM capabilities but not with deliberative architectures.',
    publicationReadiness: 'preview',
    provenance: {
      _type: 'provenance',
      author: 'Ed O\'Connell',
      generatedBy: 'Claude (Opus 4.5)',
      reviewedBy: 'Ed O\'Connell',
      context: 'Skill Forge pattern educational visualization — Lanesborough Protocol deliberation',
      date: '2026-01-05',
    },
    seo: {
      _type: 'seo',
      metaTitle: 'Skill Forge Visualizer — Ed O\'Connell',
      metaDescription: 'Interactive visualization of the Skill Forge pattern for heterogeneous AI deliberation, featuring process flow, verification model, economics, and real case studies.',
    },
  },
];

/* ========== EXECUTE ========== */

const allDocuments = [
  { label: 'Site Settings', doc: siteSettings },
  ...pages.map(doc => ({ label: `Page: ${doc.title}`, doc })),
  ...demos.map(doc => ({ label: `Demo: ${doc.title}`, doc })),
];

async function seed() {
  console.log(`\n🌱 Seed Script`);
  console.log(`   Project: ${PROJECT_ID} / ${DATASET}`);
  console.log(`   Mode: ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE'}`);
  console.log(`   Documents: ${allDocuments.length}\n`);

  for (const { label, doc } of allDocuments) {
    console.log(`📄 ${label}`);
    console.log(`   _id: ${doc._id}`);
    console.log(`   _type: ${doc._type}`);
    if (doc.slug) console.log(`   slug: ${doc.slug.current}`);

    if (!DRY_RUN) {
      try {
        const result = await client.createOrReplace(doc);
        console.log(`   ✅ Created/updated: ${result._id}\n`);
      } catch (err) {
        console.error(`   ❌ Failed: ${err.message}\n`);
      }
    } else {
      console.log(`   ⏭️  Skipped (dry run)\n`);
    }
  }

  if (DRY_RUN) {
    console.log('🔍 Dry run complete. Run without --dry-run to create documents.');
  } else {
    console.log('🎉 Done! Run `npm run build` to regenerate pages from Sanity content.');
  }
}

seed().catch(err => {
  console.error('💥 Seed failed:', err.message);
  process.exit(1);
});
