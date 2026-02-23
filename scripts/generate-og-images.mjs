/**
 * generate-og-images.mjs — Generate crisp OG images and upload to Sanity.
 *
 * Uses Satori (HTML/CSS → SVG vector) + @resvg/resvg-js (SVG → PNG raster)
 * for sharp text rendering at any size. Embeds Inter font directly.
 *
 * Usage: node scripts/generate-og-images.mjs
 * Requires: SANITY_API_WRITE_TOKEN in .env.local
 */

import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
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

// Load embedded fonts
const interRegular = readFileSync(join(__dirname, 'fonts', 'Inter-Regular.ttf'))
const interSemiBold = readFileSync(join(__dirname, 'fonts', 'Inter-SemiBold.ttf'))

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
    accent: '#B45309',
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

/**
 * Build a Satori-compatible JSX-like virtual DOM object.
 * Satori requires React-element-shaped objects, not HTML strings.
 */
function ogMarkup(title, subtitle, accent) {
  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#18181b',
        padding: '80px',
        fontFamily: 'Inter',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              width: '60px',
              height: '4px',
              backgroundColor: accent,
              borderRadius: '2px',
              marginBottom: '40px',
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              color: '#e4e4e7',
              fontSize: '56px',
              fontWeight: 600,
              lineHeight: 1.2,
              textAlign: 'center',
              marginBottom: '20px',
              maxWidth: '960px',
            },
            children: title,
          },
        },
        {
          type: 'div',
          props: {
            style: {
              color: '#a1a1aa',
              fontSize: '26px',
              fontWeight: 400,
              lineHeight: 1.4,
              textAlign: 'center',
              maxWidth: '860px',
            },
            children: subtitle,
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              bottom: '40px',
              color: '#52525b',
              fontSize: '18px',
              fontWeight: 400,
              letterSpacing: '0.05em',
            },
            children: 'edoconnell.org',
          },
        },
      ],
    },
  }
}

async function main() {
  for (const page of pages) {
    console.log(`Generating: ${page.title}`)

    const svg = await satori(ogMarkup(page.title, page.subtitle, page.accent), {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
        { name: 'Inter', data: interSemiBold, weight: 600, style: 'normal' },
      ],
    })

    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: 1200 },
    })
    const png = resvg.render().asPng()

    console.log(`  Uploading (${(png.length / 1024).toFixed(0)} KB)...`)
    const asset = await client.assets.upload('image', Buffer.from(png), {
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

  console.log('\nAll OG images generated and uploaded.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
