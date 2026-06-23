/**
 * seed.mjs — Create siteSettings and page documents in Sanity.
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
    _id: 'page-governed-fleet',
    _type: 'page',
    title: 'The Fleet',
    subtitle: 'Institutional cognition — a governed AI fleet.',
    slug: { _type: 'slug', current: 'governed-fleet' },
    seo: {
      _type: 'seo',
      metaDescription:
        'A governed fleet of AI agents collaborating over one shared, version-pinned memory, under a protocol that will not let an agent act on a claim it has not verified.',
    },
  },
];

/* ========== EXECUTE ========== */

const allDocuments = [
  { label: 'Site Settings', doc: siteSettings },
  ...pages.map(doc => ({ label: `Page: ${doc.title}`, doc })),
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
