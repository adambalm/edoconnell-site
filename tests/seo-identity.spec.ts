import { test, expect } from '@playwright/test'

/**
 * SEO identity layer — schema.org Person/WebSite @graph + /llms.txt.
 *
 * SeoJsonLd.astro emits a single ld+json @graph (NOT an Article-typed object),
 * so these assertions target the @graph shape, distinct from the article/
 * case-study pages whose tests assert a top-level Article @type.
 *
 * Pages under test are exactly the ones SeoJsonLd is wired into (pages that do
 * NOT emit their own JSON-LD): home, contact, and the articles listing.
 */

const GRAPH_PAGES = ['/', '/contact', '/articles/']

test.describe('SEO identity: Person + WebSite @graph', () => {
  for (const route of GRAPH_PAGES) {
    test(`${route} emits a Person + WebSite @graph`, async ({ page }) => {
      const res = await page.goto(route)
      expect(res?.status(), `${route} status`).toBe(200)

      const ld = await page.locator('script[type="application/ld+json"]').first().textContent()
      expect(ld, `${route} JSON-LD present`).toBeTruthy()

      const parsed = JSON.parse(ld ?? '{}')
      expect(parsed['@context'], `${route} @context`).toBe('https://schema.org')

      const graph = parsed['@graph']
      expect(Array.isArray(graph), `${route} has @graph array`).toBe(true)

      const person = graph.find((n: Record<string, unknown>) => n['@type'] === 'Person')
      const website = graph.find((n: Record<string, unknown>) => n['@type'] === 'WebSite')

      expect(person, `${route} Person node`).toBeTruthy()
      expect(person['@id']).toBe('https://edoconnell.org/#ed')
      expect(person.name).toBe("Ed O'Connell")
      expect(person.jobTitle, `${route} Person.jobTitle present`).toBeTruthy()

      expect(website, `${route} WebSite node`).toBeTruthy()
      expect(website.publisher?.['@id']).toBe('https://edoconnell.org/#ed')

      // Honesty guard: GitHub must NOT be advertised (HO decision 2026-06-26).
      const sameAs: string[] = person.sameAs ?? []
      expect(sameAs.some((u) => u.includes('github.com')), `${route} no GitHub in sameAs`).toBe(false)
    })
  }

  test('/llms.txt serves a plaintext site map', async ({ request }) => {
    const res = await request.get('/llms.txt')
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('text/plain')

    const body = await res.text()
    expect(body).toContain("# Ed O'Connell")
    expect(body).toContain('## Sections')
  })
})
