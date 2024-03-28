import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {CaseIcon} from '@sanity/icons'

export default {
  title: 'Case Study',
  name: 'caseStudy',
  type: 'document',
  icon: CaseIcon,
  orderings: [orderRankOrdering],
  preview: {
    select: {
      title: 'title',
    },
  },
  fields: [
    orderRankField({type: 'caseStudy'}),
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 200,
        slugify: (input: string) => input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
      validation: (Rule: any) => Rule.required(),
    },
  ],
}
