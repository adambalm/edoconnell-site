import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readdirSync, statSync } from 'fs'
import { join } from 'path'

/**
 * Accessibility tests — axe-core WCAG 2.1 AA against every testable page.
 *
 * Page discovery is hybrid:
 *   - Prerendered (static) pages: discovered from dist/client/ index.html files
 *   - SSR pages: discovered by crawling internal links from index pages
 *
 * Each page is tested at every viewport (mobile, tablet, desktop) via
 * Playwright projects in playwright.config.ts.
 */

const DIST_DIR = join(process.cwd(), 'dist', 'client')
const BASE_URL = 'http://localhost:4321'

/** Walk dist/client/ for index.html files and return their URL paths. */
function discoverPrerenderedPages(dir: string, base = ''): string[] {
  const pages: string[] = []
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return pages
  }

  for (const entry of entries) {
    if (entry === 'admin') continue

    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      pages.push(...discoverPrerenderedPages(full, `${base}/${entry}`))
    } else if (entry === 'index.html') {
      pages.push(base === '' ? '/' : `${base}/`)
    }
  }
  return pages
}

/**
 * Discover SSR pages by fetching index pages and extracting internal links.
 * Runs before tests via a global setup fetch.
 */
async function discoverSSRPages(): Promise<string[]> {
  const ssrPages: string[] = []
  const indexPaths = ['/articles/', '/demos/']

  for (const indexPath of indexPaths) {
    try {
      const res = await fetch(`${BASE_URL}${indexPath}`)
      if (!res.ok) continue
      const html = await res.text()
      const prefix = indexPath.replace(/\/$/, '')
      const linkPattern = new RegExp(`href="(${prefix}/[^"]+)"`, 'g')
      let match
      while ((match = linkPattern.exec(html)) !== null) {
        const href = match[1]
        if (href !== indexPath && !ssrPages.includes(href)) {
          ssrPages.push(href)
        }
      }
    } catch {
      // Index page not reachable — skip
    }
  }

  return ssrPages
}

const isDemoDetail = (path: string) =>
  path.startsWith('/demos/') && path !== '/demos/'

// Discover all pages once, then generate tests dynamically.
// Playwright requires top-level test registration, so we use a two-phase
// approach: prerendered pages are known at parse time, SSR pages are tested
// via a single parameterized test that discovers them at runtime.
const prerenderedPages = discoverPrerenderedPages(DIST_DIR)

// --- Tests for prerendered pages (known at parse time) ---

test.describe('WCAG 2.1 AA compliance', () => {
  for (const path of prerenderedPages) {
    test(`${path} has no accessibility violations`, async ({ page }) => {
      await page.goto(path)

      let builder = new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])

      if (isDemoDetail(path)) {
        builder = builder.exclude('.demo-container')
      }

      const results = await builder.analyze()

      const violations = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.length,
      }))

      expect(violations, `Violations on ${path}`).toEqual([])
    })
  }

  // SSR pages discovered at runtime
  test('SSR pages have no accessibility violations', async ({ page }) => {
    const ssrPages = await discoverSSRPages()
    for (const path of ssrPages) {
      await page.goto(path)

      let builder = new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])

      if (isDemoDetail(path)) {
        builder = builder.exclude('.demo-container')
      }

      const results = await builder.analyze()

      const violations = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.length,
      }))

      expect(violations, `Violations on ${path}`).toEqual([])
    }
  })
})

test.describe('Structural checks', () => {
  for (const path of prerenderedPages) {
    test(`${path} has valid heading hierarchy`, async ({ page }) => {
      if (isDemoDetail(path)) {
        test.skip()
        return
      }

      await page.goto(path)

      const headings = await page.evaluate(() => {
        const els = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
        return Array.from(els).map((el) => ({
          level: parseInt(el.tagName[1]),
          text: el.textContent?.trim().slice(0, 60),
        }))
      })

      const h1s = headings.filter((h) => h.level === 1)
      expect(h1s.length, `Expected exactly one h1 on ${path}`).toBe(1)

      for (let i = 1; i < headings.length; i++) {
        const jump = headings[i].level - headings[i - 1].level
        expect(
          jump,
          `Heading level jumps from h${headings[i - 1].level} to h${headings[i].level} on ${path}`
        ).toBeLessThanOrEqual(1)
      }
    })

    test(`${path} has required landmarks`, async ({ page }) => {
      await page.goto(path)

      const landmarks = await page.evaluate(() => ({
        banner: !!document.querySelector('header[role="banner"], header'),
        main: !!document.querySelector('main'),
        contentinfo: !!document.querySelector('footer[role="contentinfo"], footer'),
        nav: !!document.querySelector('nav'),
      }))

      expect(landmarks.banner, `Missing banner landmark on ${path}`).toBe(true)
      expect(landmarks.main, `Missing main landmark on ${path}`).toBe(true)
      expect(landmarks.contentinfo, `Missing contentinfo landmark on ${path}`).toBe(true)
      expect(landmarks.nav, `Missing nav landmark on ${path}`).toBe(true)
    })

    test(`${path} skip link works`, async ({ page }) => {
      await page.goto(path)

      const skipLink = page.locator('.skip-link')
      await expect(skipLink).toBeAttached()

      const href = await skipLink.getAttribute('href')
      expect(href).toBe('#main')
    })
  }

  // SSR pages — structural checks at runtime
  test('SSR pages have valid structure', async ({ page }) => {
    const ssrPages = await discoverSSRPages()
    for (const path of ssrPages) {
      if (isDemoDetail(path)) continue

      await page.goto(path)

      // Heading hierarchy
      const headings = await page.evaluate(() => {
        const els = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
        return Array.from(els).map((el) => ({
          level: parseInt(el.tagName[1]),
          text: el.textContent?.trim().slice(0, 60),
        }))
      })

      const h1s = headings.filter((h) => h.level === 1)
      expect(h1s.length, `Expected exactly one h1 on ${path}`).toBe(1)

      for (let i = 1; i < headings.length; i++) {
        const jump = headings[i].level - headings[i - 1].level
        expect(
          jump,
          `Heading level jumps from h${headings[i - 1].level} to h${headings[i].level} on ${path}`
        ).toBeLessThanOrEqual(1)
      }

      // Landmarks
      const landmarks = await page.evaluate(() => ({
        banner: !!document.querySelector('header[role="banner"], header'),
        main: !!document.querySelector('main'),
        contentinfo: !!document.querySelector('footer[role="contentinfo"], footer'),
        nav: !!document.querySelector('nav'),
      }))

      expect(landmarks.banner, `Missing banner on ${path}`).toBe(true)
      expect(landmarks.main, `Missing main on ${path}`).toBe(true)
      expect(landmarks.contentinfo, `Missing contentinfo on ${path}`).toBe(true)
      expect(landmarks.nav, `Missing nav on ${path}`).toBe(true)

      // Skip link
      const skipLink = page.locator('.skip-link')
      await expect(skipLink).toBeAttached()
      const href = await skipLink.getAttribute('href')
      expect(href).toBe('#main')
    }
  })
})
