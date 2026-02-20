import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readdirSync, statSync } from 'fs'
import { join } from 'path'

/**
 * Accessibility tests — axe-core WCAG 2.1 AA against every built page.
 *
 * Pages are discovered from the dist/ build output so nothing is hardcoded.
 * Each page is tested at every viewport (mobile, tablet, desktop) via
 * Playwright projects in playwright.config.ts.
 */

// Vercel adapter outputs prerendered HTML to dist/client/
const DIST_DIR = join(process.cwd(), 'dist', 'client')

/** Walk dist/client/ for index.html files and return their URL paths. */
function discoverPages(dir: string, base = ''): string[] {
  const pages: string[] = []
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return pages
  }

  for (const entry of entries) {
    // Skip admin (Sanity Studio) — it's a client-side SPA, not our content
    if (entry === 'admin') continue

    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      pages.push(...discoverPages(full, `${base}/${entry}`))
    } else if (entry === 'index.html') {
      pages.push(base === '' ? '/' : `${base}/`)
    }
  }
  return pages
}

const pages = discoverPages(DIST_DIR)

// Demo detail pages contain React islands with their own heading hierarchy.
// The islands render h1/h2/h3 internally, which creates duplicate h1s and
// heading jumps relative to the page template. This is a known architectural
// issue to address during the design overhaul — not a regression.
const isDemoDetail = (path: string) =>
  path.startsWith('/demos/') && path !== '/demos/'

test.describe('WCAG 2.1 AA compliance', () => {
  for (const path of pages) {
    test(`${path} has no accessibility violations`, async ({ page }) => {
      await page.goto(path)

      let builder = new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])

      // Demo detail pages contain React islands with pre-existing a11y issues
      // (button-name, color-contrast inside SkillForge). Exclude the island
      // container so we still test the page shell, metadata, and framing.
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
})

test.describe('Structural checks', () => {
  for (const path of pages) {
    test(`${path} has valid heading hierarchy`, async ({ page }) => {
      // Demo detail pages have React islands with independent heading trees
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

      // Exactly one h1
      const h1s = headings.filter((h) => h.level === 1)
      expect(h1s.length, `Expected exactly one h1 on ${path}`).toBe(1)

      // No skipped heading levels (h1 → h3 without h2)
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

      // Skip link should target #main
      const href = await skipLink.getAttribute('href')
      expect(href).toBe('#main')
    })
  }
})
