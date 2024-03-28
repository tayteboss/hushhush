import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {CaseIcon} from '@sanity/icons'
import {
  selectMediaTypeObject,
  imageObject,
  mobileImageObject,
  videoObject,
  mobileVideoObject,
  galleryBlocks,
} from '../objects'

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
    {
      title: 'Year',
      name: 'year',
      type: 'string',
      description: 'e.g. 2024',
    },
    {
      title: 'Hero Media',
      name: 'heroMedia',
      type: 'object',
      description:
        'HINT: Please use portrait orientated image or video. Make sure images are optimised for performance.',
      fields: [
        selectMediaTypeObject,
        {
          ...imageObject,
          hidden: ({parent}: any) => parent?.mediaType !== 'image',
        },
        {
          ...mobileImageObject,
          hidden: ({parent}: any) => parent?.mediaType !== 'image',
        },
        {
          ...videoObject,
          hidden: ({parent}: any) => parent?.mediaType !== 'video',
        },
        {
          ...mobileVideoObject,
          hidden: ({parent}: any) => parent?.mediaType !== 'video',
        },
      ],
    },
    galleryBlocks,
  ],
}
