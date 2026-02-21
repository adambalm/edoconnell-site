import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * article — long-form authored content with epistemic governance.
 *
 * A general-purpose document type for briefs, essays, case studies,
 * and other substantive writing. The `kind` field distinguishes form;
 * the structure is shared. Body and appendix are both Portable Text.
 */
export const article = defineType({
  name: 'article',
  title: 'Article',
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
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: {
        list: [
          { title: 'Brief', value: 'brief' },
          { title: 'Essay', value: 'essay' },
          { title: 'Case Study', value: 'case-study' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
      description: 'The form of this article. Briefs are professional deliverables; essays are reflective; case studies are retrospective.',
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
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [defineArrayMember({ type: 'block' }), defineArrayMember({ type: 'code' })],
    }),
    defineField({
      name: 'appendix',
      title: 'Appendix',
      type: 'array',
      of: [defineArrayMember({ type: 'block' }), defineArrayMember({ type: 'code' })],
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
      to: [{ type: 'article' }],
      description: 'The article that replaces this one.',
      hidden: ({ document }) => document?.epistemicStatus !== 'superseded',
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
      kind: 'kind',
    },
    prepare({ title, kind }) {
      return {
        title,
        subtitle: kind ? kind.charAt(0).toUpperCase() + kind.slice(1) : undefined,
      }
    },
  },
})
