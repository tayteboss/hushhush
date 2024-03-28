import {
  selectMediaTypeObject,
  imageObject,
  mobileImageObject,
  videoObject,
  mobileVideoObject,
} from '../objects'

export default {
  title: 'Site Settings',
  name: 'siteSettings',
  type: 'document',
  fields: [
    {
      title: 'Title',
      name: 'referenceTitle',
      type: 'string',
      description: 'This is an internal reference title.',
      initialValue: 'Site Settings',
    },
    {
      title: 'Intro Media',
      name: 'introMedia',
      type: 'object',
      fields: [
        {
          ...videoObject,
          hidden: ({document}: any) => document?.introMedia !== 'video',
        },
        {
          ...mobileVideoObject,
          hidden: ({document}: any) => document?.introMedia !== 'video',
        },
      ],
    },
    {
      title: 'Intro statements',
      name: 'introStatements',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              title: 'Statement',
              name: 'statement',
              type: 'string',
            },
          ],
        },
      ],
    },
    {
      title: 'Password',
      name: 'password',
      type: 'string',
    },
  ],
}
