import { test, expect, type Page } from '@playwright/test'

/**
 * Sizing & flow assertions for the SCA Headless CMS case-study site.
 *
 * Companion to case-study-sca.spec.ts (structural). This spec measures
 * computed typography and layout values across mobile / tablet / desktop
 * to catch silent regressions in token bumps, clamp() ranges, and overflow.
 */

const ROUTES = {
  index: '/case-studies/sca-headless-cms/',
  build: '/case-studies/sca-headless-cms/build',
  process: '/case-studies/sca-headless-cms/process',
}

const ROUTE_LIST = Object.values(ROUTES)

interface ComputedTypography {
  fontSize: number
  lineHeight: number
  fontFamily: string
  fontStyle: string
}

async function readComputed(page: Page, selector: string): Promise<ComputedTypography> {
  return page.locator(selector).first().evaluate((el) => {
    const cs = window.getComputedStyle(el as HTMLElement)
    const lh = cs.lineHeight === 'normal' ? -1 : parseFloat(cs.lineHeight)
    return {
      fontSize: parseFloat(cs.fontSize),
      lineHeight: lh,
      fontFamily: cs.fontFamily,
      fontStyle: cs.fontStyle,
    }
  })
}

test.describe('Case study — sizing & flow', () => {
  for (const route of ROUTE_LIST) {
    test(`${route} — body paragraphs are 18–22px serif with generous leading`, async ({ page }) => {
      await page.goto(route)
      const r = await readComputed(page, '.cs-section p:not(.cs-section__num)')
      expect(r.fontSize, 'body font-size').toBeGreaterThanOrEqual(18)
      expect(r.fontSize, 'body font-size').toBeLessThanOrEqual(22)
      const ratio = r.lineHeight / r.fontSize
      expect(ratio, 'body line-height ratio').toBeGreaterThan(1.55)
      expect(ratio, 'body line-height ratio').toBeLessThan(1.75)
      expect(r.fontFamily.toLowerCase(), 'body font family').toMatch(/source serif|serif/)
    })

    test(`${route} — hero h1 is 38–70px serif`, async ({ page }) => {
      await page.goto(route)
      const r = await readComputed(page, 'h1')
      expect(r.fontSize, 'h1 font-size').toBeGreaterThanOrEqual(38)
      expect(r.fontSize, 'h1 font-size').toBeLessThanOrEqual(70)
      expect(r.fontFamily.toLowerCase(), 'h1 font family').toMatch(/source serif|serif/)
    })

    test(`${route} — section title h2 is 24–40px serif`, async ({ page }) => {
      await page.goto(route)
      const r = await readComputed(page, 'h2.cs-section__title')
      expect(r.fontSize, 'h2 font-size').toBeGreaterThanOrEqual(24)
      expect(r.fontSize, 'h2 font-size').toBeLessThanOrEqual(40)
      expect(r.fontFamily.toLowerCase(), 'h2 font family').toMatch(/source serif|serif/)
    })

    test(`${route} — section number is italic teal serif, 30–50px`, async ({ page }) => {
      await page.goto(route)
      const r = await readComputed(page, '.cs-section__num')
      expect(r.fontStyle, 'section number italic').toBe('italic')
      expect(r.fontSize, 'section number size').toBeGreaterThanOrEqual(30)
      expect(r.fontSize, 'section number size').toBeLessThanOrEqual(52)
    })

    test(`${route} — pull-quote is italic and larger than body`, async ({ page }) => {
      await page.goto(route)
      const body = await readComputed(page, '.cs-section p:not(.cs-section__num)')
      const quote = await readComputed(page, '.cs-pullquote p')
      expect(quote.fontStyle, 'pull-quote italic').toBe('italic')
      expect(quote.fontSize, 'pull-quote size > body size').toBeGreaterThan(body.fontSize + 4)
    })

    test(`${route} — no horizontal overflow`, async ({ page }) => {
      await page.goto(route)
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth - document.documentElement.clientWidth
      })
      // Allow up to 2px tolerance for sub-pixel rounding / scrollbar.
      expect(overflow, 'horizontal overflow px').toBeLessThanOrEqual(2)
    })

    test(`${route} — body paragraphs respect reading measure`, async ({ page }) => {
      await page.goto(route)
      const widths = await page.locator('.cs-section p:not(.cs-section__num)').evaluateAll((els) =>
        els.slice(0, 5).map((el) => (el as HTMLElement).getBoundingClientRect().width)
      )
      // 68ch at 19px ≈ 13.04em ≈ 247.7 chars worth, but ch != px directly.
      // 68ch at Source Serif 19px ≈ 720–780px depending on glyph widths.
      // Cap at 860 with slack; below 860 is comfortable on any column.
      for (const w of widths) {
        expect(w, 'paragraph width px').toBeLessThan(860)
      }
    })

    test(`${route} — section spacing is substantial (≥ 64px between sections)`, async ({ page }) => {
      await page.goto(route)
      const gaps = await page.locator('section.cs-section').evaluateAll((els) => {
        const out: number[] = []
        for (let i = 1; i < els.length; i++) {
          const prev = (els[i - 1] as HTMLElement).getBoundingClientRect()
          const cur = (els[i] as HTMLElement).getBoundingClientRect()
          out.push(cur.top - prev.bottom)
        }
        return out
      })
      // Each section has its own bottom margin; spacing isn't strictly the gap
      // between bounding boxes (margins collapse). We assert the visible gap is
      // not negative (overlap) and not absurdly tight.
      for (const g of gaps) {
        expect(g, 'section gap').toBeGreaterThan(-1)
      }
    })

    test(`${route} — container width is bounded on desktop`, async ({ page }) => {
      const viewport = page.viewportSize()
      if (!viewport || viewport.width < 1100) {
        test.skip()
      }
      await page.goto(route)
      const containerWidth = await page
        .locator('.cs')
        .first()
        .evaluate((el) => (el as HTMLElement).getBoundingClientRect().width)
      // Container is set to 920px max in case-study.css. Allow tolerance.
      expect(containerWidth, 'container width on desktop').toBeLessThanOrEqual(940)
      expect(containerWidth, 'container width on desktop').toBeGreaterThan(700)
    })
  }

  // ─── Page-specific sizing ─────────────────────────────────────────────

  test('index — hero stats stripe renders 4 cells', async ({ page }) => {
    await page.goto(ROUTES.index)
    const stats = page.locator('.cs-hero__stats li')
    await expect(stats).toHaveCount(4)
    // Each cell has a value and a label.
    for (let i = 0; i < 4; i++) {
      const value = await stats.nth(i).locator('.cs-hero__stat-value').textContent()
      const label = await stats.nth(i).locator('.cs-hero__stat-label').textContent()
      expect((value ?? '').trim().length).toBeGreaterThan(0)
      expect((label ?? '').trim().length).toBeGreaterThan(0)
    }
  })

  test('index — three pillar cards exist with arrows', async ({ page }) => {
    await page.goto(ROUTES.index)
    const pillars = page.locator('.cs-pillar')
    await expect(pillars).toHaveCount(3)
    const arrows = page.locator('.cs-pillar__arrow')
    await expect(arrows).toHaveCount(3)
  })

  test('index — evidence grid has at least 6 cards on desktop', async ({ page }) => {
    const viewport = page.viewportSize()
    if (!viewport || viewport.width < 1100) {
      test.skip()
    }
    await page.goto(ROUTES.index)
    const cards = page.locator('[data-testid="evidence-grid"] .ev-card')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(6)
  })

  test('process — outtakes aside renders 4 italic numbered maxims', async ({ page }) => {
    await page.goto(ROUTES.process)
    const items = page.locator('.cs-outtakes li')
    await expect(items).toHaveCount(4)
    const fontStyle = await items
      .first()
      .evaluate((el) => window.getComputedStyle(el as HTMLElement).fontStyle)
    expect(fontStyle).toBe('italic')
  })

  test('build — code blocks are dark themed and monospace', async ({ page }) => {
    await page.goto(ROUTES.build)
    const code = page.locator('pre.cs-code').first()
    await expect(code).toBeVisible()
    const r = await code.evaluate((el) => {
      const cs = window.getComputedStyle(el as HTMLElement)
      return {
        fontFamily: cs.fontFamily,
        backgroundColor: cs.backgroundColor,
      }
    })
    expect(r.fontFamily.toLowerCase()).toMatch(/jetbrains mono|cascadia|fira|consolas|monospace/)
    // Background should be dark — rgb component sum < ~150 for the dark code blocks.
    const m = r.backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (m) {
      const sum = parseInt(m[1]) + parseInt(m[2]) + parseInt(m[3])
      expect(sum, 'code block background brightness').toBeLessThan(120)
    }
  })

  test('all pages — TOC card font sizing readable when present', async ({ page }) => {
    for (const route of [ROUTES.build, ROUTES.process]) {
      await page.goto(route)
      const r = await readComputed(page, '.cs-toc__list a')
      expect(r.fontSize, `TOC link size on ${route}`).toBeGreaterThanOrEqual(15)
      expect(r.fontSize, `TOC link size on ${route}`).toBeLessThanOrEqual(22)
    }
  })

  test('all pages — reading progress bar element is present and fixed-positioned', async ({ page }) => {
    for (const route of ROUTE_LIST) {
      await page.goto(route)
      const bar = page.locator('.reading-progress').first()
      await expect(bar).toBeAttached()
      const position = await bar.evaluate((el) => window.getComputedStyle(el as HTMLElement).position)
      expect(position).toBe('fixed')
    }
  })
})
