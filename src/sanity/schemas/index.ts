import { seo } from './objects/seo'
import { provenance } from './objects/provenance'
import { demoItem } from './demoItem'
import { writingSample } from './writingSample'
import { page } from './page'
import { siteSettings } from './siteSettings'

export const schemaTypes = [
  // Object types (shared across documents)
  seo,
  provenance,

  // Document types
  demoItem,
  writingSample,
  page,
  siteSettings,
]
