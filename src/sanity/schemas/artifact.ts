import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * artifact — a made thing that is not long-form writing.
 *
 * The whole-person node type: platforms, pipelines, rigs, automations,
 * curricula, tools. Long-form writing stays in `article`; an artifact may
 * link to articles about it. Surfaces project these nodes differently
 * (index table, status board, split desks) — the node itself is neutral.
 *
 * Status is the honest-state vocabulary: it renders verbatim on every
 * surface, and an accurate "retired" outranks a flattering silence.
 * `lastChecked` is set only by a real check (a fetch, a test run), never
 * by hand — an unverified stamp is worse than no stamp.
 */
export const artifact = defineType({
  name: 'artifact',
  title: 'Artifact',
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
          { title: 'Work', value: 'work' },
          { title: 'Craft', value: 'craft' },
          { title: 'Thought', value: 'thought' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
      description: 'Work is professional systems; craft is made-for-the-making; thought is essays and positions held.',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Running', value: 'running' },
          { title: 'Working', value: 'working' },
          { title: 'In daily use', value: 'in-use' },
          { title: 'Experiment', value: 'experiment' },
          { title: 'Designed', value: 'designed' },
          { title: 'Concluded', value: 'concluded' },
          { title: 'Published', value: 'published' },
          { title: 'Retired', value: 'retired' },
        ],
      },
      validation: (rule) => rule.required(),
      description: 'Rendered verbatim. Choose the true one, not the flattering one.',
    }),
    defineField({
      name: 'statusDetail',
      title: 'Status detail',
      type: 'string',
      description: 'Optional qualifier rendered after the status, e.g. "Jul 2026" or "after long service".',
    }),
    defineField({
      name: 'lastChecked',
      title: 'Last checked',
      type: 'date',
      description: 'Set ONLY by an actual check (fetch, test run). Blank is honest; a hand-set date is not.',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'string',
      validation: (rule) => rule.required().max(120),
      description: 'One sentence for a cold reader. No internal vocabulary.',
    }),
    defineField({
      name: 'yearStart',
      title: 'Year started',
      type: 'number',
      validation: (rule) => rule.required().integer().min(1990).max(2100),
      description: 'For sorting.',
    }),
    defineField({
      name: 'yearsDisplay',
      title: 'Years (display)',
      type: 'string',
      description: 'As rendered, e.g. "2016–2024" or "2025–". Defaults to yearStart if blank.',
    }),
    defineField({
      name: 'receipts',
      title: 'Receipts',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'receipt',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'url', title: 'URL', type: 'url', validation: (rule) => rule.required() }),
            defineField({ name: 'checked', title: 'Checked', type: 'date' }),
          ],
        }),
      ],
      description: 'Links a visitor can follow to verify a claim. Every checkable claim gets one.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
      description: 'Optional longer description for the node page.',
    }),
    defineField({
      name: 'agentEditable',
      title: 'Agent editable',
      type: 'boolean',
      initialValue: false,
      description: 'When false (the default), the agent write gateway refuses to modify this document. Hand editing in the Studio is never affected.',
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
    select: { title: 'title', kind: 'kind', status: 'status' },
    prepare({ title, kind, status }) {
      return { title, subtitle: `${kind} · ${status}` }
    },
  },
})
