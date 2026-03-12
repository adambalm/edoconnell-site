/**
 * create-page-contact.mjs — Create the page-contact document with a deterministic ID.
 *
 * Usage:
 *   node scripts/create-page-contact.mjs
 *
 * Idempotent: uses createOrReplace so running twice updates rather than duplicates.
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '..', '.env.local') });

const TOKEN = process.env.SANITY_API_WRITE_TOKEN;
if (!TOKEN) {
  console.error('Missing SANITY_API_WRITE_TOKEN in .env.local');
  process.exit(1);
}

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || 'zu6l9t4j',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  token: TOKEN,
  useCdn: false,
});

const doc = {
  _id: 'page-contact',
  _type: 'page',
  title: 'Contact',
  slug: { _type: 'slug', current: 'contact' },
  body: [
    {
      _type: 'block',
      _key: 'intro1',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: 'intro1s1',
          text: "If you want to talk about structured content systems, AI integration patterns, or the kind of work shown on this site, I'd like to hear from you.",
          marks: [],
        },
      ],
    },
  ],
  seo: {
    _type: 'seo',
    metaTitle: 'Contact',
    metaDescription:
      "Get in touch with Ed O'Connell about structured content, AI integration, or collaboration opportunities.",
  },
};

async function main() {
  const result = await client.createOrReplace(doc);
  console.log(`Created page-contact: ${result._id} (rev ${result._rev})`);
}

main().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
