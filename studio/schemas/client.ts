import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {CaseIcon} from '@sanity/icons'

export default {
  title: 'Client',
  name: 'client',
  type: 'document',
  icon: CaseIcon,
  orderings: [orderRankOrdering],
  preview: {
    select: {
      title: 'title',
    },
  },
  fields: [
    orderRankField({type: 'client'}),
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
