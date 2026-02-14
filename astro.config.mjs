import { defineConfig } from 'astro/config'
import sanity from '@sanity/astro'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'

// Fallback allows build to succeed before Sanity project exists.
// Replace with real project ID in .env.local after `sanity init`.
const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || 'placeholder'
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  integrations: [
    react(),
    sanity({
      projectId,
      dataset,
      useCdn: false,
      apiVersion: '2025-01-01',
      studioBasePath: '/admin',
    }),
  ],
})
