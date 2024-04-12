import {CaseIcon} from '@sanity/icons'
import {
  imageObject,
  mobileImageObject,
  mobileVideoObject,
  selectMediaTypeObject,
  videoObject,
} from '../objects'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

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
    orderRankField({type: 'article'}),
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Media',
      name: 'media',
      type: 'object',
      description:
        'HINT: Darker images will work best for text readability. Make sure images are optimised for performance.',
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
  ],
}
