import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * demoItem — a working interactive demonstration.
 *
 * Schema v2 final (AG-attested):
 * - framing: Portable Text that provides editorial context above/beside the demo
 * - renderMode: ISLAND (React hydration), STATIC (pre-rendered), EXTERNAL (link out)
 * - Epistemic governance fields: epistemicStatus, audienceContext, publicationReadiness
 * - Provenance: who made this and in what context
 */
export const demoItem = defineType({
  name: 'demoItem',
  title: 'Demo',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'Brief description for listing pages and meta.',
    }),
    defineField({
      name: 'framing',
      title: 'Framing',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
      description: 'Editorial context — the why and what of this demo. Rendered above or beside the interactive component.',
    }),
    defineField({
      name: 'renderMode',
      title: 'Render Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Island (React hydration)', value: 'ISLAND' },
          { title: 'Static (pre-rendered)', value: 'STATIC' },
          { title: 'External (link out)', value: 'EXTERNAL' },
        ],
        layout: 'radio',
      },
      initialValue: 'ISLAND',
    }),
    defineField({
      name: 'componentName',
      title: 'Component Name',
      type: 'string',
      description: 'React component to hydrate (e.g. "SkillForge"). Only for ISLAND mode.',
      hidden: ({ document }) => document?.renderMode !== 'ISLAND',
      validation: (rule) =>
        rule.custom((value, context) => {
          const doc = context.document as { renderMode?: string } | undefined
          if (doc?.renderMode === 'ISLAND' && !value) return 'Component name is required for ISLAND mode'
          return true
        }),
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      description: 'Link to external demo. Only for EXTERNAL mode.',
      hidden: ({ document }) => document?.renderMode !== 'EXTERNAL',
      validation: (rule) =>
        rule.custom((value, context) => {
          const doc = context.document as { renderMode?: string } | undefined
          if (doc?.renderMode === 'EXTERNAL' && !value) return 'URL is required for EXTERNAL mode'
          return true
        }),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Sort order on the /demos listing. Lower numbers appear first.',
    }),
    defineField({
      name: 'epistemicStatus',
      title: 'Epistemic Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Working', value: 'working' },
          { title: 'Reviewed', value: 'reviewed' },
          { title: 'Canonical', value: 'canonical' },
          { title: 'Superseded', value: 'superseded' },
          { title: 'Deprecated', value: 'deprecated' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      initialValue: 'draft',
    }),
    defineField({
      name: 'supersededBy',
      title: 'Superseded By',
      type: 'reference',
      to: [{ type: 'demoItem' }],
      description: 'The demo that replaces this one.',
      hidden: ({ document }) => document?.epistemicStatus !== 'superseded',
    }),
    defineField({
      name: 'audienceContext',
      title: 'Audience Context',
      type: 'text',
      rows: 2,
      description: 'Who is this demo for? What should a reader already know?',
    }),
    defineField({
      name: 'publicationReadiness',
      title: 'Publication Readiness',
      type: 'string',
      options: {
        list: [
          { title: 'Internal', value: 'internal' },
          { title: 'Preview', value: 'preview' },
          { title: 'Publishable', value: 'publishable' },
          { title: 'Published', value: 'published' },
        ],
      },
      initialValue: 'internal',
    }),
    defineField({
      name: 'provenance',
      title: 'Provenance',
      type: 'provenance',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'summary',
      renderMode: 'renderMode',
    },
    prepare({ title, subtitle, renderMode }) {
      return {
        title,
        subtitle: renderMode ? `${renderMode} — ${subtitle || ''}` : subtitle,
      }
    },
  },
})
