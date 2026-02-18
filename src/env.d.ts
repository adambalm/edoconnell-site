/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

interface ImportMetaEnv {
  readonly PUBLIC_SANITY_PROJECT_ID: string
  readonly PUBLIC_SANITY_DATASET: string
  readonly PUBLIC_SANITY_VISUAL_EDITING_ENABLED?: string
  readonly SANITY_API_READ_TOKEN?: string
  readonly SANITY_API_WRITE_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
