import { defineType, defineField } from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Overrides the page title in search results and browser tabs.',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Displayed in search engine results. Keep under 160 characters.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      description: 'Image used when shared on social media (1200x630 recommended).',
    }),
  ],
})
