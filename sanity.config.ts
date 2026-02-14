import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemas'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'placeholder'
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production'

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
