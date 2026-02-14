import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID || 'zu6l9t4j',
    dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  },
})
