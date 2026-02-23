/**
 * check-seo.mjs — Verify all published routable documents have SEO metadata.
 *
 * Queries the public Sanity API (no token required) and fails with exit code 1
 * if any published document of a routable type is missing seo.metaDescription.
 *
 * Usage:
 *   node scripts/check-seo.mjs
 *
 * Routable types checked:
 *   - siteSettings (global default)
 *   - page (index pages)
 *   - article (content pages)
 *   - demoItem (demo pages)
 */

const PROJECT_ID = 'zu6l9t4j';
const DATASET = 'production';
const API_VERSION = '2025-01-01';

const query = `*[
  _type in ["siteSettings", "page", "article", "demoItem"]
  && !(_id in path("drafts.**"))
]{
  _id,
  _type,
  title,
  "slug": slug.current,
  "metaDescription": seo.metaDescription
}`;

const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;

const response = await fetch(url);
if (!response.ok) {
  console.error(`Sanity API error: ${response.status} ${response.statusText}`);
  process.exit(1);
}

const { result } = await response.json();

const missing = result.filter((doc) => !doc.metaDescription);

if (missing.length === 0) {
  console.log(`SEO check passed: all ${result.length} published documents have metaDescription.`);
  process.exit(0);
}

console.error(`SEO check failed: ${missing.length} document(s) missing seo.metaDescription:\n`);
for (const doc of missing) {
  const label = doc.slug || doc._id;
  console.error(`  - [${doc._type}] ${doc.title || '(no title)'} (${label})`);
}
console.error(`\nFix: add seo.metaDescription in Sanity Studio for each document above.`);
process.exit(1);
