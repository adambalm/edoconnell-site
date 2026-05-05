import { defineCollection, z } from 'astro:content'

/**
 * `handwritten` — transcribed Supernote notebook pages.
 *
 * Source of truth: pipeline-emitted markdown produced by
 * ghost-writer-v3/pipeline/supernote_pipeline.py. The schema mirrors the
 * frontmatter that pipeline writes; fields it sometimes adds (characters,
 * story_title, continues_from_previous) are accepted as optional. Unknown
 * extra keys pass through without failing the build, so pipeline frontmatter
 * additions don't immediately break content publication — schema can be
 * tightened later if any field becomes load-bearing.
 *
 * File ID convention: `<slug>/<page>` where slug is the notebook directory
 * and page is the per-page filename (e.g. `go-on-now/p1`). The dynamic route
 * `src/pages/experiments/handwritten/[slug]/[page].astro` derives URL params
 * by splitting the entry id on `/`.
 */
const handwritten = defineCollection({
  type: 'content',
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date().optional(),
      source: z.string().optional(),
      page: z.number().optional(),
      type: z.string().optional(),
      language: z.string().default('en'),
      entry_channel: z.string().default('supernote'),
      tags: z.array(z.string()).default([]),
      topics: z.array(z.string()).default([]),
      permalink: z.string().optional(),
      description: z.string().optional(),
      characters: z.array(z.string()).optional(),
      story_title: z.string().optional(),
      continues_from_previous: z.boolean().optional(),
    })
    .passthrough(),
})

export const collections = { handwritten }
