import {CaseIcon} from '@sanity/icons'
import {
  galleryBlocks,
  imageObject,
  mobileImageObject,
  mobileVideoObject,
  selectMediaTypeObject,
  videoObject,
} from '../objects'

export default {
  title: 'Representation',
  name: 'representation',
  type: 'document',
  icon: CaseIcon,
  preview: {
    select: {
      title: 'title',
    },
  },
  fields: [
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
      title: 'Type',
      name: 'type',
      type: 'string',
      description: 'e.g. Artist, Stylist, Food Collective...',
    },
    {
      title: 'Excerpt',
      name: 'excerpt',
      type: 'text',
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
