/**
 * patch-sa-brief.mjs — Apply editorial patches to the Solution Architecture Brief.
 *
 * Patches:
 *   7a: Replace intro (k1-k9) with revised text (XHTML mention, audience framing, etc.)
 *   7c: Insert sitemap clarification after k93 (Page bullet)
 *   7d: Insert TypeScript and GROQ code blocks in appendix
 *
 * Usage:
 *   node scripts/patch-sa-brief.mjs --dry-run   # Preview changes
 *   node scripts/patch-sa-brief.mjs              # Apply patches
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '..', '.env.local') });

const PROJECT_ID = process.env.PUBLIC_SANITY_PROJECT_ID || 'zu6l9t4j';
const DATASET = process.env.PUBLIC_SANITY_DATASET || 'production';
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;
const DRY_RUN = process.argv.includes('--dry-run');
const DOC_ID = 'drafts.fe19b4c6-f86c-441f-9e4c-5dab523656d3';

if (!TOKEN && !DRY_RUN) {
  console.error('Missing SANITY_API_WRITE_TOKEN in .env.local');
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2025-01-01',
  token: TOKEN,
  useCdn: false,
});

function key() {
  return randomUUID().replace(/-/g, '').slice(0, 12);
}

function span(text, marks = []) {
  return { _key: key(), _type: 'span', text, marks };
}

function block(style, children, opts = {}) {
  return {
    _key: key(),
    _type: 'block',
    style,
    children: Array.isArray(children) ? children : [span(children)],
    ...(opts.listItem ? { listItem: opts.listItem, level: opts.level || 1 } : {}),
  };
}

function codeBlock(language, code, filename) {
  return {
    _key: key(),
    _type: 'code',
    language,
    code,
    ...(filename ? { filename } : {}),
  };
}

// --- 7a: Revised intro blocks (replace k1-k9) ---
const revisedIntro = [
  block('h2', 'AI Amplifies Whatever It Finds'),

  block('normal', [
    span('If you were working in web technology fifteen years ago, you heard a version of this argument from the XHTML and semantic web communities: structure your data, and machines can do useful things with it. They were right about the principle and wrong about the timing. What\'s different now is that AI doesn\'t just parse structured data \u2014 it generates new content from it, in your organization\'s \u201cofficial\u201d voice, at a scale no editorial team can match. That changes the stakes. When an AI agent speaks for your organization, the question isn\'t whether your content is well-formatted. It\'s whether the data underneath is trustworthy enough to generate from.'),
  ]),

  block('normal', [
    span('Most organizations pursuing AI readiness have a content problem they haven\'t named. Their knowledge \u2014 programs, policies, people, procedures \u2014 lives in page builders, shared drives, and PDFs. Formatted for human eyes, invisible to machines. AI doesn\'t fix this. AI accelerates it: coherence compounds, but so does confusion, and both at a speed that manual correction cannot match.'),
  ]),

  block('normal', [
    span('This brief is for an '),
    span('executive sponsor', ['strong']),
    span(' who needs a credible path to \u201cAI-ready\u201d and a '),
    span('technical lead', ['strong']),
    span(' who needs to know what gets built, in what order, and what it takes to maintain. Schema is the contract; validation is the guardrail.'),
  ]),

  block('normal', 'Decisions this brief supports:'),

  block('normal', 'What content model to adopt \u2014 typed entities, explicit relationships, required governance metadata', { listItem: 'bullet' }),
  block('normal', 'What editorial and compliance controls to enforce at the schema level', { listItem: 'bullet' }),
  block('normal', 'How to phase implementation so the organization can stop after any stage with a working, improved system', { listItem: 'bullet' }),

  block('normal', [span('What this brief covers:', ['strong'])]),

  block('normal', 'Decision Context', { listItem: 'bullet' }),
  block('normal', 'Discovery and Workshops', { listItem: 'bullet' }),
  block('normal', 'Proposed Solution Pattern', { listItem: 'bullet' }),
  block('normal', 'Phased Implementation', { listItem: 'bullet' }),
  block('normal', 'Proof of Concept Plan', { listItem: 'bullet' }),
  block('normal', 'Risk Controls', { listItem: 'bullet' }),
  block('normal', 'Appendix: Sanity Implementation Examples', { listItem: 'bullet' }),

  block('normal', 'Next: the decision context \u2014 who the stakeholders are, what constraints they operate under, and what each needs from this process.'),
];

// --- 7c: Sitemap clarification block ---
const sitemapBlock = block('normal', 'Navigation and sitemaps are derived views over these entities; they are not the content model.');

// --- 7d: Code blocks ---
const tsSchemaCode = codeBlock('typescript', `import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'person' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'provenance',
      title: 'Provenance',
      type: 'object',
      fields: [
        defineField({
          name: 'source',
          title: 'Source',
          type: 'string',
          options: {
            list: ['manual', 'imported', 'ai-assisted'],
          },
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ],
})`);

const groqQueryCode = codeBlock('groq', `*[_type == "article" && defined(slug.current)]
  | order(publishDate desc) {
    _id,
    title,
    slug,
    publishDate,
    "author": author->{
      name,
      role,
      "department": department->{ name }
    },
    body,
    provenance
  }`);

async function main() {
  // Fetch current document
  const doc = await client.getDocument(DOC_ID);
  if (!doc) {
    console.error(`Document ${DOC_ID} not found`);
    process.exit(1);
  }

  const body = [...doc.body];
  console.log(`Fetched document. Body has ${body.length} blocks.`);

  // --- 7a: Replace intro (k1-k9) ---
  const introKeys = new Set(['k1', 'k3', 'k5', 'k7', 'k9']);
  const firstIntroIdx = body.findIndex(b => b._key === 'k1');
  const lastIntroIdx = body.findIndex(b => b._key === 'k9');

  if (firstIntroIdx === -1 || lastIntroIdx === -1) {
    console.error('Could not find intro blocks k1-k9');
    process.exit(1);
  }

  // Remove k1 through k9 (inclusive) and insert revised intro
  const beforeIntro = body.slice(0, firstIntroIdx);
  const afterIntro = body.slice(lastIntroIdx + 1);
  const newBody = [...beforeIntro, ...revisedIntro, ...afterIntro];

  console.log(`7a: Replaced ${lastIntroIdx - firstIntroIdx + 1} intro blocks with ${revisedIntro.length} revised blocks`);

  // --- 7c: Insert sitemap clarification after k93 ---
  const k93Idx = newBody.findIndex(b => b._key === 'k93');
  if (k93Idx === -1) {
    console.error('Could not find block k93 (Page bullet)');
    process.exit(1);
  }
  newBody.splice(k93Idx + 1, 0, sitemapBlock);
  console.log(`7c: Inserted sitemap clarification after k93 (now at index ${k93Idx + 1})`);

  // --- 7d: Insert code blocks in appendix ---
  // Insert TS code block after k269 (the "Note: Rich text..." paragraph)
  const k269Idx = newBody.findIndex(b => b._key === 'k269');
  if (k269Idx === -1) {
    console.error('Could not find block k269');
    process.exit(1);
  }
  newBody.splice(k269Idx + 1, 0, tsSchemaCode);
  console.log(`7d: Inserted TypeScript code block after k269 (now at index ${k269Idx + 1})`);

  // Insert GROQ code block after k283 (the "Without ->..." paragraph)
  // k283's index shifted by 1 due to the TS code block insertion
  const k283Idx = newBody.findIndex(b => b._key === 'k283');
  if (k283Idx === -1) {
    console.error('Could not find block k283');
    process.exit(1);
  }
  newBody.splice(k283Idx + 1, 0, groqQueryCode);
  console.log(`7d: Inserted GROQ code block after k283 (now at index ${k283Idx + 1})`);

  console.log(`\nFinal body: ${newBody.length} blocks (was ${body.length})`);

  if (DRY_RUN) {
    console.log('\n--- DRY RUN --- No changes applied.');
    console.log('\nFirst 5 blocks:');
    for (const b of newBody.slice(0, 5)) {
      const text = b._type === 'code'
        ? `[code:${b.language}] ${b.code.slice(0, 60)}...`
        : b.children?.map(c => c.text).join('') || '(empty)';
      console.log(`  ${b.style || b._type}: ${text.slice(0, 100)}`);
    }
    console.log('\nSitemap block neighborhood:');
    const sIdx = newBody.indexOf(sitemapBlock);
    for (const b of newBody.slice(sIdx - 1, sIdx + 2)) {
      const text = b._type === 'code'
        ? `[code:${b.language}]`
        : b.children?.map(c => c.text).join('') || '(empty)';
      console.log(`  ${b._key || 'new'} ${b.style || b._type}: ${text.slice(0, 100)}`);
    }
    console.log('\nAppendix code block neighborhood:');
    const tsIdx = newBody.indexOf(tsSchemaCode);
    for (const b of newBody.slice(tsIdx - 1, tsIdx + 2)) {
      const text = b._type === 'code'
        ? `[code:${b.language}] ${b.code.slice(0, 50)}...`
        : b.children?.map(c => c.text).join('') || '(empty)';
      console.log(`  ${b._key || 'new'} ${b.style || b._type}: ${text.slice(0, 100)}`);
    }
    return;
  }

  // Apply patch
  await client
    .patch(DOC_ID)
    .set({ body: newBody })
    .commit();

  console.log('\nPatches applied successfully.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
