import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      initialValue: "Ed O'Connell",
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'noindex',
      title: 'Prevent Indexing',
      type: 'boolean',
      description: 'When true, all pages carry noindex. Disable only when ready to go live.',
      initialValue: true,
    }),
    defineField({
      name: 'seo',
      title: 'Default SEO',
      type: 'seo',
      description: 'Fallback SEO values when individual pages do not specify their own.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
