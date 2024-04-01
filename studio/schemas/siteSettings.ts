import {videoObject, mobileVideoObject} from '../objects'

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
      title: 'Desktop Intro Media',
      name: 'introMedia',
      type: 'mux.video',
    },
    {
      title: 'Mobile Intro Media',
      name: 'mobileIntroMedia',
      type: 'mux.video',
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
