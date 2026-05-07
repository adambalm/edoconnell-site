import { test, expect } from '@playwright/test'
import { stegaClean } from '@sanity/client/stega'

/**
 * /case-studies/sca-headless-cms — interview-support case study site.
 *
 * Three pages — index (overview), /build (architecture), /process (workflow).
 * Tests run against http://localhost:4321 via the project-default webServer
 * in playwright.config.ts.
 */

const ROUTES = {
  index: '/case-studies/sca-headless-cms/',
  build: '/case-studies/sca-headless-cms/build',
  process: '/case-studies/sca-headless-cms/process',
}

const REQUIRED_HEADINGS_INDEX = [
  'Why structured content',
  "What's here",
  'The proof',
  'What I am still refining',
]

const REQUIRED_HEADINGS_BUILD = [
  'The stack',
  'The schema and the page builder',
  'A state machine for student projects',
  'GROQ in practice',
  'The Webflow migration',
  'The reference pages',
]

const REQUIRED_HEADINGS_PROCESS = [
  'The verification stack',
  'Provenance metadata',
  'The agent-toolkit gap',
  'The decision trail',
  'Thirty ADRs',
]

const FORBIDDEN_STRINGS = [
  'Black Flag',
  'LCE',
  'Skill Forge',
  'Lanesborough',
  'wesg5rw8',
  'manage.sanity.io',
]

const FORBIDDEN_LINK_PATHS = ['/admin/scao-briefing', '/admin/ai-workshop']

async function assertCommonContract(page: import('@playwright/test').Page, route: string) {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => {
    errors.push(err.message)
  })

  const response = await page.goto(route)
  expect(response?.status(), `${route} status`).toBe(200)

  // Single h1
  expect(await page.locator('h1').count(), `${route} h1 count`).toBe(1)

  // noindex
  const robots = await page.locator('meta[name="robots"]').getAttribute('content')
  expect(robots ?? '', `${route} robots`).toContain('noindex')

  // JSON-LD with valid Article-family @type
  const ld = await page.locator('script[type="application/ld+json"]').first().textContent()
  expect(ld, `${route} JSON-LD present`).toBeTruthy()
  const parsed = JSON.parse(ld ?? '{}')
  expect(['Article', 'TechArticle']).toContain(parsed['@type'])
  expect(parsed['@context']).toBe('https://schema.org')

  // Forbidden strings absent
  const cleaned = stegaClean(await page.content()).toLowerCase()
  for (const term of FORBIDDEN_STRINGS) {
    expect(cleaned, `${route} forbidden "${term}"`).not.toContain(term.toLowerCase())
  }

  // Forbidden link paths absent
  const hrefs = await page.locator('a[href]').evaluateAll((els) =>
    els.map((el) => (el as HTMLAnchorElement).href)
  )
  for (const path of FORBIDDEN_LINK_PATHS) {
    const matched = hrefs.filter((h) => h.includes(path))
    expect(matched, `${route} no links to ${path}`).toHaveLength(0)
  }

  // Image alt
  const imgs = await page.locator('img').all()
  for (const img of imgs) {
    const alt = await img.getAttribute('alt')
    expect((alt ?? '').trim().length, `${route} img alt`).toBeGreaterThan(0)
  }

  await page.waitForLoadState('networkidle')
  expect(errors, `${route} console errors: ${errors.join(' | ')}`).toHaveLength(0)
}

async function assertHeadingsPresent(
  page: import('@playwright/test').Page,
  route: string,
  required: string[]
) {
  const raw = await page.locator('h2').allTextContents()
  const cleaned = raw.map((h) => stegaClean(h).trim())
  for (const heading of required) {
    const found = cleaned.some((h) => h.includes(heading))
    expect(found, `${route} expected h2 containing "${heading}" (got ${cleaned.join(' | ')})`).toBe(true)
  }
}

test.describe('case study site: SCA Headless CMS', () => {
  test('index: contract', async ({ page }) => {
    await assertCommonContract(page, ROUTES.index)
  })

  test('index: required headings present', async ({ page }) => {
    await page.goto(ROUTES.index)
    await assertHeadingsPresent(page, ROUTES.index, REQUIRED_HEADINGS_INDEX)
  })

  test('index: evidence grid has at least 4 cards', async ({ page }) => {
    await page.goto(ROUTES.index)
    const grid = page.locator('[data-testid="evidence-grid"]')
    await expect(grid).toBeVisible()
    const cards = grid.locator('a[href]')
    expect(await cards.count()).toBeGreaterThanOrEqual(4)
  })

  test('index: pillar nav links to build and process pages', async ({ page }) => {
    await page.goto(ROUTES.index)
    const buildLink = page.locator('a[href*="/case-studies/sca-headless-cms/build"]')
    const processLink = page.locator('a[href*="/case-studies/sca-headless-cms/process"]')
    expect(await buildLink.count()).toBeGreaterThanOrEqual(1)
    expect(await processLink.count()).toBeGreaterThanOrEqual(1)
  })

  test('build: contract', async ({ page }) => {
    await assertCommonContract(page, ROUTES.build)
  })

  test('build: required headings present', async ({ page }) => {
    await page.goto(ROUTES.build)
    await assertHeadingsPresent(page, ROUTES.build, REQUIRED_HEADINGS_BUILD)
  })

  test('build: links back to overview', async ({ page }) => {
    await page.goto(ROUTES.build)
    const back = page.locator('a[href="/case-studies/sca-headless-cms"]')
    expect(await back.count()).toBeGreaterThanOrEqual(1)
  })

  test('process: contract', async ({ page }) => {
    await assertCommonContract(page, ROUTES.process)
  })

  test('process: required headings present', async ({ page }) => {
    await page.goto(ROUTES.process)
    await assertHeadingsPresent(page, ROUTES.process, REQUIRED_HEADINGS_PROCESS)
  })

  test('process: links back to overview', async ({ page }) => {
    await page.goto(ROUTES.process)
    const back = page.locator('a[href="/case-studies/sca-headless-cms"]')
    expect(await back.count()).toBeGreaterThanOrEqual(1)
  })
})
