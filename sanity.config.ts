import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import type { StructureBuilder } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { codeInput } from '@sanity/code-input'
import { schemaTypes } from './src/sanity/schemas'

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : (typeof process !== 'undefined' ? process.env : {}) as Record<string, string | undefined>
const projectId = env.PUBLIC_SANITY_PROJECT_ID || 'zu6l9t4j'
const dataset = env.PUBLIC_SANITY_DATASET || 'production'
const previewUrl = env.SANITY_STUDIO_PREVIEW_URL || '/'

// Singleton document IDs — these get dedicated panes instead of list views
const SINGLETONS = new Set(['siteSettings'])

export default defineConfig({
  name: 'edoconnell-site',
  title: "Ed O'Connell",
  projectId,
  dataset,
  plugins: [
    codeInput(),
    structureTool({
      structure: (S: StructureBuilder) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.divider(),
            S.documentTypeListItem('article').title('Articles'),
            S.documentTypeListItem('demoItem').title('Demos'),
            S.documentTypeListItem('page').title('Pages'),
          ]),
    }),
    // Vision Tool: GROQ playground — omitted from production Studio builds
    ...(env.MODE !== 'production' ? [visionTool()] : []),
    presentationTool({
      previewUrl: previewUrl,
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
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.has(schemaType)),
  },
  document: {
    // Prevent actions that don't make sense for singletons
    actions: (input, context) =>
      SINGLETONS.has(context.schemaType)
        ? input.filter(({ action }) => action && !['unpublish', 'delete', 'duplicate'].includes(action))
        : input,
  },
})
