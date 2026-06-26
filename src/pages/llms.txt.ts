/*
 * /llms.txt — a curated map of the site for AI agents given the link directly.
 *
 * Build-time generated (prerender) from the EXISTING article content + the
 * identity constant. No Sanity schema change. Falls back to sections-only if
 * the content fetch fails, matching the site's other Sanity-optional pages.
 * Convention: https://llmstxt.org
 */
import { loadQuery } from '../sanity/lib/load-query'
import { IDENTITY } from '../config/identity'
import { stegaClean } from '@sanity/client/stega'

export const prerender = true

interface ArticleRow {
  title?: string
  subtitle?: string
  slug?: string
}

export async function GET() {
  let articles: ArticleRow[] = []
  try {
    const { data } = await loadQuery<ArticleRow[]>({
      query: `*[_type == "article" && defined(slug.current)]{
        title, subtitle, "slug": slug.current
      } | order(coalesce(provenance.date, _createdAt) desc)`,
    })
    articles = data ?? []
  } catch (e) {
    console.warn(
      '[llms.txt] Sanity fetch failed — emitting sections only:',
      e instanceof Error ? e.message : e,
    )
  }

  const base = IDENTITY.url
  const clean = (s?: string) => stegaClean(s ?? '').trim()

  const lines: string[] = [
    `# ${IDENTITY.name}`,
    '',
    `> ${IDENTITY.description}`,
    '',
    'This site is intentionally not indexed by search engines yet. This file is a map for readers and AI agents given the link directly.',
    '',
    '## Sections',
    `- [Articles](${base}/articles/): essays and technical writing`,
    `- [Case study: SCA headless CMS](${base}/case-studies/sca-headless-cms/): a production Astro + Sanity build`,
    `- [The Fleet](${base}/governed-fleet/): a governed multi-agent AI system`,
    `- [Contact](${base}/contact/)`,
    '',
  ]

  const rows = articles
    .map((a) => ({ title: clean(a.title), subtitle: clean(a.subtitle), slug: a.slug }))
    .filter((a) => a.title && a.slug)

  if (rows.length) {
    lines.push('## Articles')
    for (const a of rows) {
      lines.push(`- [${a.title}](${base}/articles/${a.slug})${a.subtitle ? `: ${a.subtitle}` : ''}`)
    }
    lines.push('')
  }

  lines.push('## About', IDENTITY.description)
  if (IDENTITY.knowsAbout.length) lines.push('', `Topics: ${IDENTITY.knowsAbout.join(', ')}.`)
  if (IDENTITY.sameAs.length) lines.push('', `Elsewhere: ${IDENTITY.sameAs.join(' · ')}`)
  lines.push('')

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
