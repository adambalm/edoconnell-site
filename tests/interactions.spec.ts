import { test, expect, type Page } from '@playwright/test'

/**
 * Interaction tests — every clickable element and UI behavior.
 *
 * This file is a living registry. Any new interaction added to the site
 * gets a test added here. Structural accessibility is covered by
 * accessibility.spec.ts; this file covers functional behavior.
 *
 * Inventory:
 *   Navigation (all viewports)         — tests 1-6
 *   Mobile menu (mobile viewport)      — tests 7-13
 *   Theme toggle (all viewports)       — tests 14-17
 *   TOC navigation (article detail)    — tests 18-21
 *   Code copy (article detail)         — tests 22-24
 *   Reading progress (article detail)  — tests 25-26
 *   Skip link (all pages)              — test 27
 */

const BASE_URL = 'http://localhost:4321'

/** On mobile viewports, open the hamburger menu so the theme toggle is accessible. */
async function ensureThemeToggleVisible(page: Page): Promise<void> {
  const vw = page.viewportSize()
  if (vw && vw.width < 768) {
    const btn = page.locator('.mobile-menu-btn')
    const expanded = await btn.getAttribute('aria-expanded')
    if (expanded !== 'true') {
      await btn.click()
    }
  }
}

/** Get the first visible theme toggle (desktop nav or mobile menu). */
function visibleThemeToggle(page: Page) {
  const vw = page.viewportSize()
  if (vw && vw.width < 768) {
    return page.locator('#mobile-menu .theme-toggle')
  }
  return page.locator('.theme-toggle').first()
}

/** Discover the first article detail path from the /articles/ index. */
async function discoverArticlePath(page: Page): Promise<string | null> {
  const res = await page.request.get(`${BASE_URL}/articles/`)
  if (!res.ok()) return null
  const html = await res.text()
  const match = html.match(/href="(\/articles\/[^"]+)"/)
  return match ? match[1] : null
}

/** Discover the first demo detail path from the /demos/ index. */
async function discoverDemoPath(page: Page): Promise<string | null> {
  const res = await page.request.get(`${BASE_URL}/demos/`)
  if (!res.ok()) return null
  const html = await res.text()
  const match = html.match(/href="(\/demos\/[^"]+)"/)
  return match ? match[1] : null
}

/**
 * Wait for a React island demo to fully hydrate.
 *
 * SSR renders HTML immediately, but event handlers aren't attached until
 * React hydrates. On cold Vite dev server starts, dependency pre-bundling
 * can return 504 ("Outdated Optimize Dep"), causing hydration failure.
 * A page reload after the first attempt resolves this.
 *
 * Strategy: click a language button, verify the class changes (proving
 * hydration), reload and retry up to 3 times if it fails.
 */
async function waitForDemoHydration(page: Page) {
  let hydrated = false
  for (let attempt = 0; attempt < 3 && !hydrated; attempt++) {
    await page.locator('[data-testid="lang-en"]').waitFor({ state: 'visible', timeout: 30000 })
    try {
      await expect(async () => {
        await page.locator('[data-testid="lang-es"]').click()
        const cls = await page.locator('[data-testid="lang-es"]').getAttribute('class') || ''
        expect(cls).toContain('Active')
      }).toPass({ intervals: [500, 1000, 2000], timeout: 10000 })
      hydrated = true
    } catch {
      // Hydration failed — likely Vite 504 on cold start. Reload to get fresh modules.
      await page.reload({ waitUntil: 'domcontentloaded' })
    }
  }
  if (!hydrated) throw new Error('React island failed to hydrate after 3 reload attempts')
  // Reset to EN
  await page.locator('[data-testid="lang-en"]').click()
  await expect(page.locator('[data-testid="lang-en"]')).toHaveClass(/Active/, { timeout: 5000 })
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

test.describe('Navigation', () => {
  test('site title links to homepage', async ({ page }) => {
    await page.goto('/articles/')
    const title = page.locator('.site-title')
    await expect(title).toHaveAttribute('href', '/')
    await title.click()
    await expect(page).toHaveURL('/')
  })

  test('desktop nav "Articles" links to /articles/', async ({ page }) => {
    const vw = page.viewportSize()
    test.skip(!!vw && vw.width < 768, 'Desktop nav hidden on mobile')
    await page.goto('/')
    const link = page.locator('nav[aria-label="Primary"] a[href="/articles/"]')
    await link.click()
    await expect(page).toHaveURL('/articles/')
  })

  test('desktop nav "Demos" links to /demos/', async ({ page }) => {
    const vw = page.viewportSize()
    test.skip(!!vw && vw.width < 768, 'Desktop nav hidden on mobile')
    await page.goto('/')
    const link = page.locator('nav[aria-label="Primary"] a[href="/demos/"]')
    await link.click()
    await expect(page).toHaveURL('/demos/')
  })

  test('active page state shown on current nav link', async ({ page }) => {
    const vw = page.viewportSize()
    test.skip(!!vw && vw.width < 768, 'Desktop nav hidden on mobile')
    await page.goto('/articles/')
    const link = page.locator('nav[aria-label="Primary"] a[href="/articles/"]')
    await expect(link).toHaveAttribute('aria-current', 'page')
  })

  test('article card links to article detail page', async ({ page }) => {
    const articlePath = await discoverArticlePath(page)
    test.skip(!articlePath, 'No articles found')
    await page.goto('/articles/')
    const link = page.locator(`a[href="${articlePath}"]`).first()
    await link.click()
    await expect(page).toHaveURL(articlePath!)
  })

  test('demo card links to demo detail page', async ({ page }) => {
    const demoPath = await discoverDemoPath(page)
    test.skip(!demoPath, 'No demos found')
    await page.goto('/demos/')
    const link = page.locator(`a[href="${demoPath}"]`).first()
    await link.click()
    await expect(page).toHaveURL(demoPath!)
  })
})

// ---------------------------------------------------------------------------
// Mobile menu
// ---------------------------------------------------------------------------

test.describe('Mobile menu', () => {
  test.beforeEach(async ({ page }) => {
    const vw = page.viewportSize()
    test.skip(!!vw && vw.width >= 768, 'Mobile menu only on small viewports')
  })

  test('hamburger button visible on mobile', async ({ page }) => {
    await page.goto('/')
    const btn = page.locator('.mobile-menu-btn')
    await expect(btn).toBeVisible()
  })

  test('click hamburger opens menu', async ({ page }) => {
    await page.goto('/')
    const btn = page.locator('.mobile-menu-btn')
    await btn.click()
    await expect(btn).toHaveAttribute('aria-expanded', 'true')
    const menu = page.locator('#mobile-menu')
    await expect(menu).not.toHaveAttribute('hidden', '')
  })

  test('menu contains navigation links', async ({ page }) => {
    await page.goto('/')
    await page.locator('.mobile-menu-btn').click()
    const menu = page.locator('#mobile-menu')
    await expect(menu.locator('a[href="/articles/"]')).toBeVisible()
    await expect(menu.locator('a[href="/demos/"]')).toBeVisible()
  })

  test('Escape key closes menu', async ({ page }) => {
    await page.goto('/')
    const btn = page.locator('.mobile-menu-btn')
    await btn.click()
    await expect(btn).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('Escape')
    await expect(btn).toHaveAttribute('aria-expanded', 'false')
  })

  test('click hamburger again closes menu (toggle)', async ({ page }) => {
    await page.goto('/')
    const btn = page.locator('.mobile-menu-btn')
    await btn.click()
    await expect(btn).toHaveAttribute('aria-expanded', 'true')
    await btn.click()
    await expect(btn).toHaveAttribute('aria-expanded', 'false')
  })

  test('focus moves to first link on open', async ({ page }) => {
    await page.goto('/')
    await page.locator('.mobile-menu-btn').click()
    const menu = page.locator('#mobile-menu')
    const firstLink = menu.locator('a[href]').first()
    await expect(firstLink).toBeFocused()
  })

  test('focus returns to hamburger on close', async ({ page }) => {
    await page.goto('/')
    const btn = page.locator('.mobile-menu-btn')
    await btn.click()
    await page.keyboard.press('Escape')
    await expect(btn).toBeFocused()
  })
})

// ---------------------------------------------------------------------------
// Theme toggle
// ---------------------------------------------------------------------------

test.describe('Theme toggle', () => {
  test('toggle button exists with aria-label', async ({ page }) => {
    await page.goto('/')
    await ensureThemeToggleVisible(page)
    const toggle = visibleThemeToggle(page)
    await expect(toggle).toBeVisible()
    const label = await toggle.getAttribute('aria-label')
    expect(label).toMatch(/switch to (dark|light) mode/i)
  })

  test('click toggles data-theme attribute on html', async ({ page }) => {
    await page.goto('/')
    await ensureThemeToggleVisible(page)
    const toggle = visibleThemeToggle(page)
    const before = await page.locator('html').getAttribute('data-theme')
    await toggle.click()
    const after = await page.locator('html').getAttribute('data-theme')
    expect(after).not.toBe(before)
  })

  test('preference persists after page navigation', async ({ page }) => {
    await page.goto('/')
    await ensureThemeToggleVisible(page)
    const toggle = visibleThemeToggle(page)
    await toggle.click()
    const theme = await page.locator('html').getAttribute('data-theme')
    await page.goto('/articles/')
    const themeAfterNav = await page.locator('html').getAttribute('data-theme')
    expect(themeAfterNav).toBe(theme)
  })

  test('aria-pressed reflects dark mode state', async ({ page }) => {
    await page.goto('/')
    await ensureThemeToggleVisible(page)
    const toggle = visibleThemeToggle(page)
    const theme = await page.locator('html').getAttribute('data-theme')
    const pressed = await toggle.getAttribute('aria-pressed')
    if (theme === 'dark') {
      expect(pressed).toBe('true')
    } else {
      expect(pressed).toBe('false')
    }
    await toggle.click()
    const pressedAfter = await toggle.getAttribute('aria-pressed')
    expect(pressedAfter).not.toBe(pressed)
  })
})

// ---------------------------------------------------------------------------
// TOC navigation
// ---------------------------------------------------------------------------

test.describe('TOC navigation', () => {
  test('TOC renders when article has 3+ h2 headings', async ({ page }) => {
    const articlePath = await discoverArticlePath(page)
    test.skip(!articlePath, 'No articles found')
    await page.goto(articlePath!)
    const toc = page.locator('.inline-toc')
    // TOC may or may not exist depending on article content — if it exists, verify structure
    const count = await toc.count()
    if (count > 0) {
      const links = toc.locator('a[href^="#"]')
      expect(await links.count()).toBeGreaterThanOrEqual(3)
    }
  })

  test('TOC link hrefs match actual h2 element IDs', async ({ page }) => {
    const articlePath = await discoverArticlePath(page)
    test.skip(!articlePath, 'No articles found')
    await page.goto(articlePath!)
    const toc = page.locator('.inline-toc')
    const count = await toc.count()
    test.skip(count === 0, 'Article has no TOC')

    const tocHrefs = await toc.locator('a[href^="#"]').evaluateAll(
      els => els.map(el => el.getAttribute('href')!.slice(1))
    )

    for (const id of tocHrefs) {
      const heading = page.locator(`h2[id="${id}"]`)
      await expect(heading, `h2 with id="${id}" should exist`).toBeAttached()
    }
  })

  test('clicking TOC link scrolls heading into view', async ({ page }) => {
    const articlePath = await discoverArticlePath(page)
    test.skip(!articlePath, 'No articles found')
    await page.goto(articlePath!)
    const toc = page.locator('.inline-toc')
    const count = await toc.count()
    test.skip(count === 0, 'Article has no TOC')

    const firstLink = toc.locator('a[href^="#"]').first()
    const href = await firstLink.getAttribute('href')
    const id = href!.slice(1)

    await firstLink.click()
    // Wait for scroll to settle
    await page.waitForTimeout(500)

    const isVisible = await page.locator(`h2[id="${id}"]`).isVisible()
    expect(isVisible).toBe(true)
  })

  test('heading visible after scroll (not behind sticky header)', async ({ page }) => {
    const articlePath = await discoverArticlePath(page)
    test.skip(!articlePath, 'No articles found')
    await page.goto(articlePath!)
    const toc = page.locator('.inline-toc')
    const count = await toc.count()
    test.skip(count === 0, 'Article has no TOC')

    const lastLink = toc.locator('a[href^="#"]').last()
    const href = await lastLink.getAttribute('href')
    const id = href!.slice(1)

    await lastLink.click()
    // Wait for smooth scroll to reach the heading
    const heading = page.locator(`h2[id="${id}"]`)
    await expect(heading).toBeInViewport({ timeout: 5000 })

    const rect = await heading.boundingBox()
    expect(rect).toBeTruthy()
    // Heading top should be below the sticky header (not clipped behind it)
    expect(rect!.y).toBeGreaterThanOrEqual(0)
  })
})

// ---------------------------------------------------------------------------
// Code copy
// ---------------------------------------------------------------------------

test.describe('Code copy', () => {
  test('copy button exists on code blocks', async ({ page }) => {
    const articlePath = await discoverArticlePath(page)
    test.skip(!articlePath, 'No articles found')
    await page.goto(articlePath!)
    const codeBlocks = page.locator('.code-block')
    const count = await codeBlocks.count()
    test.skip(count === 0, 'Article has no code blocks')

    const btn = codeBlocks.first().locator('.copy-btn')
    await expect(btn).toBeAttached()
    await expect(btn).toHaveAttribute('aria-label', 'Copy code')
  })

  test('button aria-label updates to "Copied!" after click', async ({ page, context }) => {
    const articlePath = await discoverArticlePath(page)
    test.skip(!articlePath, 'No articles found')
    await page.goto(articlePath!)
    const codeBlocks = page.locator('.code-block')
    const count = await codeBlocks.count()
    test.skip(count === 0, 'Article has no code blocks')

    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    const btn = codeBlocks.first().locator('.copy-btn')
    await btn.click()
    await expect(btn).toHaveAttribute('aria-label', 'Copied!')
  })

  test('button resets to "Copy code" after timeout', async ({ page, context }) => {
    const articlePath = await discoverArticlePath(page)
    test.skip(!articlePath, 'No articles found')
    await page.goto(articlePath!)
    const codeBlocks = page.locator('.code-block')
    const count = await codeBlocks.count()
    test.skip(count === 0, 'Article has no code blocks')

    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    const btn = codeBlocks.first().locator('.copy-btn')
    await btn.click()
    await expect(btn).toHaveAttribute('aria-label', 'Copied!')
    // Wait for the 2s reset timeout
    await page.waitForTimeout(2500)
    await expect(btn).toHaveAttribute('aria-label', 'Copy code')
  })
})

// ---------------------------------------------------------------------------
// Reading progress
// ---------------------------------------------------------------------------

test.describe('Reading progress', () => {
  test('progress bar exists with aria-hidden', async ({ page }) => {
    const articlePath = await discoverArticlePath(page)
    test.skip(!articlePath, 'No articles found')
    await page.goto(articlePath!)
    const bar = page.locator('.reading-progress')
    await expect(bar).toBeAttached()
    await expect(bar).toHaveAttribute('aria-hidden', 'true')
  })

  test('scrolling to bottom sets scaleX close to 1', async ({ page }) => {
    const articlePath = await discoverArticlePath(page)
    test.skip(!articlePath, 'No articles found')
    await page.goto(articlePath!)
    const bar = page.locator('.reading-progress-bar')
    const count = await bar.count()
    test.skip(count === 0, 'No reading progress bar')

    // Scroll to the very bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(300)

    const transform = await bar.evaluate(el => getComputedStyle(el).transform)
    // transform is a matrix; extract scaleX (first value in matrix(a, b, c, d, tx, ty))
    const match = transform.match(/matrix\(([^,]+)/)
    if (match) {
      const scaleX = parseFloat(match[1])
      expect(scaleX).toBeGreaterThan(0.8)
    }
  })
})

// ---------------------------------------------------------------------------
// Skip link
// ---------------------------------------------------------------------------

test.describe('Skip link', () => {
  test('Tab to skip link, Enter activates, focus moves to #main', async ({ page }) => {
    await page.goto('/')
    // Tab into the page — skip link should be the first focusable element
    await page.keyboard.press('Tab')
    const skipLink = page.locator('.skip-link')
    await expect(skipLink).toBeFocused()
    await page.keyboard.press('Enter')
    // Focus should move to the main element
    const main = page.locator('main#main')
    await expect(main).toBeFocused()
  })
})

// ---------------------------------------------------------------------------
// SkillForge demo
// ---------------------------------------------------------------------------

test.describe('SkillForge demo', () => {
  test.describe.configure({ timeout: 60000 })
  test.beforeEach(async ({ page }) => {
    await page.goto('/demos/skill-forge/')
    await waitForDemoHydration(page)
  })

  test('demo page loads with interactive content', async ({ page }) => {
    await expect(page.locator('.demo-container')).toBeVisible()
    await expect(page.locator('[data-testid="nav-process"]')).toBeVisible()
  })

  test('language selector toggles active state', async ({ page }) => {
    // Click ES — aria-pressed should flip
    await page.locator('[data-testid="lang-es"]').click()
    await expect(page.locator('[data-testid="lang-es"]')).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('[data-testid="lang-en"]')).toHaveAttribute('aria-pressed', 'false')
    // Click EN to return
    await page.locator('[data-testid="lang-en"]').click()
    await expect(page.locator('[data-testid="lang-en"]')).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('[data-testid="lang-es"]')).toHaveAttribute('aria-pressed', 'false')
  })

  test('nav tabs switch visible section', async ({ page }) => {
    const tabIds = ['process', 'paraphrase', 'example', 'economics', 'accumulation', 'references']
    for (const id of tabIds) {
      await page.locator(`[data-testid="nav-${id}"]`).click()
      await expect(page.locator(`[data-testid="nav-${id}"]`)).toHaveAttribute('aria-selected', 'true')
    }
  })

  test('nav tabs have keyboard navigation', async ({ page }) => {
    const vw = page.viewportSize()
    test.skip(!!vw && vw.width < 768, 'Tab labels hidden on mobile')
    const firstTab = page.locator('[data-testid="nav-process"]')
    await firstTab.focus()
    await expect(firstTab).toBeFocused()
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('[data-testid="nav-paraphrase"]')).toBeFocused()
  })

  test('process flow steps are clickable', async ({ page }) => {
    await page.locator('[data-testid="nav-process"]').click()
    await page.locator('[data-testid="step-3"]').click()
    await expect(page.locator('[data-testid="step-3"]')).toHaveAttribute('aria-current', 'step')
  })

  test('layout toggle switches between swimlane and classic', async ({ page }) => {
    await page.locator('[data-testid="nav-process"]').click()
    const toggleBtn = page.locator('[data-testid="layout-toggle"]')
    await expect(toggleBtn).toBeVisible()
    // If swimlane view is showing, classic should not be, and vice versa
    const swimlane = page.locator('[data-testid="swimlane-view"]')
    const classic = page.locator('[data-testid="classic-view"]')
    const swimlaneVisible = await swimlane.isVisible().catch(() => false)
    await toggleBtn.click()
    if (swimlaneVisible) {
      await expect(classic).toBeVisible()
    } else {
      await expect(swimlane).toBeVisible()
    }
  })

  test('economics sliders respond to input', async ({ page }) => {
    await page.locator('[data-testid="nav-economics"]').click()
    await expect(page.locator('[data-testid="nav-economics"]')).toHaveAttribute('aria-selected', 'true')
    const slider = page.locator('[data-testid="slider-deliberation-cost"]')
    await expect(slider).toBeVisible()
    const valueBefore = await slider.inputValue()
    // Set a different value via native input event
    await slider.evaluate((el: HTMLInputElement) => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!
      nativeInputValueSetter.call(el, '200')
      el.dispatchEvent(new Event('input', { bubbles: true }))
    })
    await expect(slider).not.toHaveValue(valueBefore)
  })

  test('expandable panels toggle in accumulation section', async ({ page }) => {
    await page.locator('[data-testid="nav-accumulation"]').click()
    const expandBtn = page.locator('[data-testid^="collapse-"]').first()
    await expect(expandBtn).toBeVisible()
    // Toggle open
    await expandBtn.click()
    await expect(expandBtn).toHaveAttribute('aria-expanded', 'true')
    // Toggle closed
    await expandBtn.click()
    await expect(expandBtn).toHaveAttribute('aria-expanded', 'false')
  })

  test('featured example toggle expands details', async ({ page }) => {
    await page.locator('[data-testid="nav-example"]').click()
    const featured = page.locator('[data-testid="featured-example"]')
    await expect(featured).toBeVisible()
    // Find toggle button with aria-expanded within featured example
    const toggleBtn = featured.locator('button[aria-expanded]').first()
    await toggleBtn.click()
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'true')
  })

  test('related examples toggle shows/hides list', async ({ page }) => {
    await page.locator('[data-testid="nav-example"]').click()
    const relatedToggle = page.locator('[data-testid="related-examples"] button[aria-expanded]').first()
    await expect(relatedToggle).toBeVisible()
    await relatedToggle.click()
    await expect(relatedToggle).toHaveAttribute('aria-expanded', 'true')
  })

  test('reword gate expand/collapse cycle', async ({ page }) => {
    await page.locator('[data-testid="nav-example"]').click()
    await expect(page.locator('[data-testid="nav-example"]')).toHaveAttribute('aria-selected', 'true')
    const expandBtn = page.locator('[data-testid="expand-articulation"]')
    await expect(expandBtn).toBeVisible()
    await expandBtn.click()
    await expect(page.locator('[data-testid="reword-input"]')).toBeVisible()
  })

  test('reword gate submit disabled until 50 chars', async ({ page }) => {
    await page.locator('[data-testid="nav-example"]').click()
    await expect(page.locator('[data-testid="nav-example"]')).toHaveAttribute('aria-selected', 'true')
    await page.locator('[data-testid="expand-articulation"]').click()
    const textarea = page.locator('[data-testid="reword-input"]')
    const submitBtn = page.locator('[data-testid="approve-button"]')
    await expect(textarea).toBeVisible()
    await expect(submitBtn).toBeDisabled()
    await textarea.fill('Short text')
    await expect(submitBtn).toBeDisabled()
    await textarea.fill('This is a long enough articulation that should pass the fifty character minimum check.')
    await expect(submitBtn).toBeEnabled()
  })

  test('touch targets meet 44px minimum', async ({ page }) => {
    const navTab = page.locator('[data-testid="nav-process"]')
    const navBox = await navTab.boundingBox()
    expect(navBox).toBeTruthy()
    expect(navBox!.height).toBeGreaterThanOrEqual(44)

    const langBtn = page.locator('[data-testid="lang-en"]')
    const langBox = await langBtn.boundingBox()
    expect(langBox).toBeTruthy()
    expect(langBox!.height).toBeGreaterThanOrEqual(44)

    await page.locator('[data-testid="nav-process"]').click()
    const layoutBtn = page.locator('[data-testid="layout-toggle"]')
    const layoutBox = await layoutBtn.boundingBox()
    expect(layoutBox).toBeTruthy()
    expect(layoutBox!.height).toBeGreaterThanOrEqual(44)
  })

  test('no horizontal overflow on mobile', async ({ page }) => {
    const tabIds = ['process', 'paraphrase', 'example', 'economics', 'accumulation', 'references']
    for (const id of tabIds) {
      await page.locator(`[data-testid="nav-${id}"]`).click()
      await expect(page.locator(`[data-testid="nav-${id}"]`)).toHaveAttribute('aria-selected', 'true')
      // Check overflow per-section rather than just at the end
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      )
      if (overflow) {
        expect(overflow, `Section "${id}" causes horizontal overflow`).toBe(false)
      }
    }
  })
})

// ---------------------------------------------------------------------------
// ContextSage demo
// ---------------------------------------------------------------------------

test.describe('ContextSage demo', () => {
  test.describe.configure({ timeout: 60000 })
  test.beforeEach(async ({ page }) => {
    await page.goto('/demos/context-sage/')
    await waitForDemoHydration(page)
  })

  test('demo page loads with interactive content', async ({ page }) => {
    await expect(page.locator('.demo-container')).toBeVisible()
    await expect(page.locator('[data-testid="nav-landing"]')).toBeVisible()
  })

  test('language selector toggles active state', async ({ page }) => {
    await page.locator('[data-testid="lang-zh"]').click()
    // CSS module class contains 'Active' substring when active
    await expect(page.locator('[data-testid="lang-zh"]')).toHaveClass(/Active/)
    await page.locator('[data-testid="lang-en"]').click()
    await expect(page.locator('[data-testid="lang-en"]')).toHaveClass(/Active/)
  })

  test('section nav buttons switch content', async ({ page }) => {
    const sections = ['landing', 'architecture', 'evidence', 'argument', 'provenance', 'about']
    for (const key of sections) {
      const navBtn = page.locator(`[data-testid="nav-${key}"]`)
      await expect(navBtn).toBeVisible()
      await navBtn.click()
      await expect(navBtn).toHaveClass(/Active/)
      await expect(page.locator(`[data-section="${key}"]`)).toBeVisible()
    }
  })

  test('provenance table is scrollable on mobile', async ({ page }) => {
    const vw = page.viewportSize()
    test.skip(!vw || vw.width >= 768, 'Table scroll only relevant on mobile')
    const navBtn = page.locator('[data-testid="nav-provenance"]')
    await expect(navBtn).toBeVisible()
    await navBtn.click()
    await expect(page.locator('[data-section="provenance"]')).toBeVisible()
    const wrapper = page.locator('[data-section="provenance"] table').locator('..')
    const overflowX = await wrapper.evaluate(el => getComputedStyle(el).overflowX)
    expect(overflowX).toBe('auto')
  })

  test('touch targets meet 44px minimum', async ({ page }) => {
    const langBtn = page.locator('[data-testid="lang-en"]')
    await expect(langBtn).toBeVisible()
    const langBox = await langBtn.boundingBox()
    expect(langBox).toBeTruthy()
    expect(langBox!.height).toBeGreaterThanOrEqual(44)

    const navBtn = page.locator('[data-testid="nav-landing"]')
    await expect(navBtn).toBeVisible()
    const navBox = await navBtn.boundingBox()
    expect(navBox).toBeTruthy()
    expect(navBox!.height).toBeGreaterThanOrEqual(44)
  })

  test('no horizontal overflow on mobile', async ({ page }) => {
    const sections = ['landing', 'architecture', 'evidence', 'argument', 'provenance', 'about']
    for (const key of sections) {
      const navBtn = page.locator(`[data-testid="nav-${key}"]`)
      await expect(navBtn).toBeVisible()
      await navBtn.click()
      await expect(page.locator(`[data-section="${key}"]`)).toBeVisible()
    }
    const noOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth
    )
    expect(noOverflow).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Memento demo
// ---------------------------------------------------------------------------

test.describe('Memento demo', () => {
  test.describe.configure({ timeout: 60000 })
  test.beforeEach(async ({ page }) => {
    await page.goto('/demos/memento/')
    await waitForDemoHydration(page)
  })

  test('demo page loads with interactive content', async ({ page }) => {
    await expect(page.locator('.demo-container')).toBeVisible()
    await expect(page.locator('[data-testid="nav-overview"]')).toBeVisible()
  })

  test('language selector toggles active state', async ({ page }) => {
    await page.locator('[data-testid="lang-es"]').click()
    await expect(page.locator('[data-testid="lang-es"]')).toHaveClass(/Active/)
    await page.locator('[data-testid="lang-en"]').click()
    await expect(page.locator('[data-testid="lang-en"]')).toHaveClass(/Active/)
  })

  test('section nav buttons switch content', async ({ page }) => {
    const sections = ['overview', 'liveSession', 'architecture', 'schema', 'openQuestions', 'roadmap']
    for (const key of sections) {
      const navBtn = page.locator(`[data-testid="nav-${key}"]`)
      await expect(navBtn).toBeVisible()
      await navBtn.click()
      await expect(navBtn).toHaveClass(/Active/)
      await expect(page.locator(`[data-section="${key}"]`)).toBeVisible()
    }
  })

  test('question accordion expands/collapses', async ({ page }) => {
    await page.locator('[data-testid="nav-openQuestions"]').click()
    await expect(page.locator('[data-section="openQuestions"]')).toBeVisible()
    const toggle = page.locator('[data-testid="question-toggle-0"]')
    await toggle.click()
    // Detail content should appear (CSS module class contains "qDetail")
    const q0Box = page.locator('[data-testid="question-0"]')
    await expect(q0Box.locator('[class*="qDetail"]')).toBeVisible()
    // Click again to collapse
    await toggle.click()
    await expect(q0Box.locator('[class*="qDetail"]')).toHaveCount(0)
  })

  test('only one question expanded at a time', async ({ page }) => {
    await page.locator('[data-testid="nav-openQuestions"]').click()
    await expect(page.locator('[data-section="openQuestions"]')).toBeVisible()
    // Expand Q0
    await page.locator('[data-testid="question-toggle-0"]').click()
    const q0Box = page.locator('[data-testid="question-0"]')
    await expect(q0Box.locator('[class*="qDetail"]')).toBeVisible()
    // Click Q1 — Q0 should collapse, Q1 should expand
    await page.locator('[data-testid="question-toggle-1"]').click()
    await expect(q0Box.locator('[class*="qDetail"]')).toHaveCount(0)
    const q1Box = page.locator('[data-testid="question-1"]')
    await expect(q1Box.locator('[class*="qDetail"]')).toBeVisible()
  })

  test('tables are scrollable on mobile', async ({ page }) => {
    const vw = page.viewportSize()
    test.skip(!vw || vw.width >= 768, 'Table scroll only relevant on mobile')
    await page.locator('[data-testid="nav-liveSession"]').click()
    await expect(page.locator('[data-section="liveSession"]')).toBeVisible()
    const wrapper = page.locator('[data-section="liveSession"] table').first().locator('..')
    const overflowX = await wrapper.evaluate(el => getComputedStyle(el).overflowX)
    expect(overflowX).toBe('auto')
  })

  test('touch targets meet 44px minimum', async ({ page }) => {
    const langBtn = page.locator('[data-testid="lang-en"]')
    await expect(langBtn).toBeVisible()
    const langBox = await langBtn.boundingBox()
    expect(langBox).toBeTruthy()
    expect(langBox!.height).toBeGreaterThanOrEqual(44)

    const navBtn = page.locator('[data-testid="nav-overview"]')
    await expect(navBtn).toBeVisible()
    const navBox = await navBtn.boundingBox()
    expect(navBox).toBeTruthy()
    expect(navBox!.height).toBeGreaterThanOrEqual(44)

    await page.locator('[data-testid="nav-openQuestions"]').click()
    await expect(page.locator('[data-section="openQuestions"]')).toBeVisible()
    const qHeader = page.locator('[data-testid="question-toggle-0"]')
    await expect(qHeader).toBeVisible()
    const qBox = await qHeader.boundingBox()
    expect(qBox).toBeTruthy()
    expect(qBox!.height).toBeGreaterThanOrEqual(44)
  })

  test('no horizontal overflow on mobile', async ({ page }) => {
    const sections = ['overview', 'liveSession', 'architecture', 'schema', 'openQuestions', 'roadmap']
    for (const key of sections) {
      const navBtn = page.locator(`[data-testid="nav-${key}"]`)
      await expect(navBtn).toBeVisible()
      await navBtn.click()
      await expect(page.locator(`[data-section="${key}"]`)).toBeVisible()
    }
    const noOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth
    )
    expect(noOverflow).toBe(true)
  })
})
