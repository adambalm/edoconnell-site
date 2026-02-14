import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemas'

const env = (typeof import.meta !== 'undefined' ? import.meta.env ?? {} : {}) as Record<string, string | undefined>
const projectId = env.PUBLIC_SANITY_PROJECT_ID || 'zu6l9t4j'
const dataset = env.PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'edoconnell-site',
  title: "Ed O'Connell",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
