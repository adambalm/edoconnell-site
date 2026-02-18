import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes } from './src/sanity/schemas'

const env = (typeof import.meta !== 'undefined' ? import.meta.env ?? {} : {}) as Record<string, string | undefined>
const projectId = env.PUBLIC_SANITY_PROJECT_ID || 'zu6l9t4j'
const dataset = env.PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'edoconnell-site',
  title: "Ed O'Connell",
  projectId,
  dataset,
  plugins: [
    structureTool(),
    visionTool(),
    presentationTool({
      previewUrl: '/',
      resolve: {
        locations: {
          siteSettings: {
            locations: [{ title: 'Home', href: '/' }],
          },
          page: {
            select: { title: 'title', slug: 'slug.current', id: '_id' },
            resolve: (doc) => {
              const id = (doc?.id ?? '').replace('drafts.', '')
              if (id === 'page-home') {
                return { locations: [{ title: doc?.title ?? 'Home', href: '/' }] }
              }
              if (id === 'page-demos') {
                return { locations: [{ title: doc?.title ?? 'Demos', href: '/demos/' }] }
              }
              return doc?.slug
                ? { locations: [{ title: doc?.title ?? 'Page', href: `/${doc.slug}` }] }
                : { locations: [] }
            },
          },
          demoItem: {
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                ...(doc?.slug ? [{ title: doc?.title ?? 'Demo', href: `/demos/${doc.slug}` }] : []),
                { title: 'All Demos', href: '/demos/' },
              ],
            }),
          },
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
  },
})
