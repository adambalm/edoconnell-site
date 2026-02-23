/**
 * generate-og-images.mjs — Generate OG images and upload to Sanity.
 *
 * Uses Playwright to screenshot a simple HTML template at 1200x630,
 * then uploads each PNG to Sanity and patches the seo.ogImage field.
 *
 * Usage: node scripts/generate-og-images.mjs
 * Requires: SANITY_API_WRITE_TOKEN in .env.local
 */

import { chromium } from 'playwright'
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load env
const envPath = join(__dirname, '..', '.env.local')
try {
  const envContent = readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
} catch { /* no .env.local */ }

const token = process.env.SANITY_API_WRITE_TOKEN
if (!token) {
  console.error('SANITY_API_WRITE_TOKEN not found in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId: 'zu6l9t4j',
  dataset: 'production',
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
})

const pages = [
  {
    id: 'siteSettings',
    title: 'Ed O\u2019Connell',
    subtitle: 'AI \u00B7 Structured Content \u00B7 Essays',
    accent: '#8B2635',
  },
  {
    id: 'page-home',
    title: 'Ed O\u2019Connell',
    subtitle: 'Cognition in context.',
    accent: '#8B2635',
  },
  {
    id: 'page-demos',
    title: 'Demos',
    subtitle: 'Interactive AI prototypes and experiments',
    accent: '#8B2635',
  },
  {
    id: 'fe19b4c6-f86c-441f-9e4c-5dab523656d3',
    title: 'Solution Architecture Brief',
    subtitle: 'Content Operations + AI Readiness',
    accent: '#2563EB',
  },
  {
    id: '6e5ebcf2-ae18-41bc-8788-ba4dd9a6cf63',
    title: 'The Bike Shop',
    subtitle: 'On wheel truing, Frankenstein, and the poetics of AI',
    accent: '#92400E',
  },
  {
    id: 'demo-memento',
    title: 'Memento',
    subtitle: 'Longitudinal attention analysis for AI conversations',
    accent: '#8B2635',
  },
  {
    id: 'demo-context-sage',
    title: 'Context Sage',
    subtitle: 'Structured context augmentation for LLMs',
    accent: '#8B2635',
  },
  {
    id: 'demo-skill-forge',
    title: 'Skill Forge',
    subtitle: 'Multi-agent deliberation visualizer',
    accent: '#8B2635',
  },
]

function ogHtml(title, subtitle, accent) {
  return `<!DOCTYPE html>
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px;
    height: 630px;
    background: #1a1a1a;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: 'Inter', system-ui, sans-serif;
    text-align: center;
    padding: 80px;
  }
  .accent-bar {
    width: 60px;
    height: 3px;
    background: ${accent};
    margin-bottom: 32px;
    border-radius: 2px;
  }
  .title {
    color: #e4e4e7;
    font-size: 56px;
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 16px;
    max-width: 900px;
  }
  .subtitle {
    color: #a1a1aa;
    font-size: 24px;
    font-weight: 400;
    line-height: 1.4;
    max-width: 800px;
  }
  .footer {
    position: absolute;
    bottom: 40px;
    color: #52525b;
    font-size: 16px;
    font-weight: 400;
  }
</style>
</head>
<body>
  <div class="accent-bar"></div>
  <div class="title">${title}</div>
  <div class="subtitle">${subtitle}</div>
  <div class="footer">edoconnell.org</div>
</body>
</html>`
}

async function main() {
  console.log('Launching browser...')
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  })

  for (const page of pages) {
    console.log(`Generating OG image for: ${page.title}`)
    const tab = await context.newPage()
    await tab.setContent(ogHtml(page.title, page.subtitle, page.accent), {
      waitUntil: 'networkidle',
    })
    const buffer = await tab.screenshot({ type: 'png' })
    await tab.close()

    console.log(`  Uploading to Sanity...`)
    const asset = await client.assets.upload('image', buffer, {
      filename: `og-${page.id}.png`,
      contentType: 'image/png',
    })

    await client
      .patch(page.id)
      .set({
        'seo.ogImage': {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
        },
      })
      .commit()

    console.log(`  Done: ${asset.url}`)
  }

  await browser.close()
  console.log('\nAll OG images generated and uploaded.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
