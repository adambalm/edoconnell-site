import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * writingSample — long-form prose with epistemic governance.
 *
 * Used for the SA brief, case studies, and other writing that
 * demonstrates structured thinking. Body and appendix are both
 * Portable Text — the structure is the content.
 */
export const writingSample = defineType({
  name: 'writingSample',
  title: 'Writing Sample',
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
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'abstract',
      title: 'Abstract',
      type: 'text',
      rows: 4,
      description: 'Brief summary for listing pages and meta.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'appendix',
      title: 'Appendix',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
      description: 'Supplementary material — methodology notes, data sources, revision history.',
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
        ],
      },
      initialValue: 'draft',
    }),
    defineField({
      name: 'audienceContext',
      title: 'Audience Context',
      type: 'text',
      rows: 2,
      description: 'Who is this writing for? What should a reader already know?',
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
      subtitle: 'subtitle',
    },
  },
})
