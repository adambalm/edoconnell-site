/*
 * Single source of truth for Ed's machine-readable identity.
 *
 * Consumed by SeoJsonLd.astro (schema.org Person/WebSite) and llms.txt.ts.
 * Chosen over a Sanity schema field deliberately (2026-06-24): this data
 * changes ~yearly and is developer-owned, so a code constant beats a CMS
 * field + Studio rebuild + manual entry. Graduate to siteSettings only if
 * self-serve editing is ever wanted.
 *
 * HONESTY RULE: every value here must be true and current. Nothing invented.
 *   - `jobTitle` is Ed's real title with NO institution named (stays within the
 *     site's no-employer-identifying-info rule). HO-confirmed 2026-06-26.
 *   - GitHub is deliberately EXCLUDED from `sameAs` (HO decision 2026-06-26):
 *     the public github.com/adambalm profile lists `sca-website-sample`, which
 *     names the employer and carries a personal email — linking it would
 *     de-anonymize Ed -> the school to hostile readers. See the `sameAs` note.
 */

export interface Identity {
  /** Stable @id so an agent resolves one Ed across every page that emits it. */
  id: string
  name: string
  url: string
  jobTitle?: string
  description: string
  /** Topics evidenced by the site's own pages — not aspirational. */
  knowsAbout: string[]
  /** Canonical profiles elsewhere. Only links you've chosen to make public. */
  sameAs: string[]
}

export const IDENTITY: Identity = {
  id: 'https://edoconnell.org/#ed',
  name: "Ed O'Connell",
  url: 'https://edoconnell.org',
  jobTitle: 'Director of Digital Strategy and AI Enablement',
  description:
    'Structured content systems and essays on language, institutions, and digital infrastructure.',
  knowsAbout: [
    'Structured content systems',
    'Headless CMS architecture',
    'Sanity',
    'Astro',
    'Multi-agent AI governance',
    'Technical writing',
  ],
  sameAs: [
    'https://www.linkedin.com/in/ed-o-connell-4b38483',
    // GitHub intentionally NOT linked (HO decision 2026-06-26): the public
    // github.com/adambalm profile lists sca-website-sample (names the employer +
    // carries a personal email). Linking would de-anonymize Ed -> the school.
  ],
}
