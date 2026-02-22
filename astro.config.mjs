import { defineConfig } from 'astro/config'
import sanity from '@sanity/astro'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || 'zu6l9t4j'
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  vite: {
    optimizeDeps: {
      include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    },
  },
  integrations: [
    react(),
    sanity({
      projectId,
      dataset,
      useCdn: false,
      apiVersion: '2025-01-01',
      studioBasePath: '/admin',
      stega: {
        studioUrl: '/admin',
      },
    }),
  ],
})
