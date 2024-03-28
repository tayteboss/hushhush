const pageReferencesList = [
  {type: 'clientsPage'},
  {type: 'aboutPage'},
  {type: 'representationPage'},
  {type: 'caseStudyPage'},
]

const pageReferences = {
  title: 'Page Reference',
  name: 'pageReference',
  type: 'reference',
  to: pageReferencesList,
  description: 'Please use either a page reference or an external URL.',
}

const slideTitleBlock = {
  title: 'Slide Title',
  name: 'slideTitle',
  type: 'string',
  description: 'HINT: Optional. This title will override the representation/case study title',
}

const contentBlock = {
  name: 'content',
  type: 'array',
  title: 'Content',
  of: [
    {
      type: 'block',
      styles: [{title: 'Normal', value: 'normal'}],
      lists: [{title: 'Bullet', value: 'bullet'}],
      marks: {
        decorators: [],
        annotations: [],
      },
    },
  ],
}

const orientationSelection = {
  title: 'Select Orientation',
  name: 'orientationType',
  type: 'string',
  options: {
    list: [
      {title: 'Portrait', value: 'portrait'},
      {title: 'Landscape', value: 'landscape'},
    ],
    layout: 'dropdown',
  },
}

export const linkObject = [
  {
    title: 'Title',
    name: 'title',
    type: 'string',
    validation: (Rule: any) => Rule.required(),
  },
  {
    title: 'External URL',
    name: 'url',
    type: 'url',
    validation: (Rule: any) => Rule.uri({allowRelative: true}),
    description: 'Please use either a page reference or an external URL.',
  },
  pageReferences,
]

export const selectMediaTypeObject = {
  title: 'Select Media Type',
  name: 'mediaType',
  type: 'string',
  options: {
    list: [
      {title: 'Image', value: 'image'},
      {title: 'Video', value: 'video'},
    ],
    layout: 'dropdown',
  },
}

export const imageObject = {
  title: 'Image',
  name: 'image',
  type: 'image',
  description: 'HINT: Make sure images are optimised for performance.',
  fields: [
    {
      name: 'alt',
      type: 'string',
      title: 'Alt Text',
    },
  ],
}

export const mobileImageObject = {
  title: 'Mobile Image',
  name: 'mobileImage',
  type: 'image',
  description: 'HINT: Optional. Make sure images are optimised for performance.',
  fields: [
    {
      name: 'alt',
      type: 'string',
      title: 'Alt Text',
    },
  ],
}

export const videoObject = {
  title: 'Video',
  name: 'video',
  type: 'mux.video',
}

export const mobileVideoObject = {
  title: 'Mobile Video',
  name: 'mobileVideo',
  type: 'mux.video',
  description: 'Optional',
}

const slideList = [
  {title: 'Full Bleed Slide', value: 'fullBleedSlide'},
  {title: 'Cropped Slide', value: 'croppedSlide'},
]

export const galleryBlocks = {
  title: 'Gallery Blocks',
  name: 'galleryBlocks',
  type: 'array',
  of: [
    {
      type: 'object',
      preview: {
        select: {
          galleryComponent: 'galleryComponent',
        },
        prepare: ({galleryComponent}: any) => {
          let componentName = ''

          if (galleryComponent === 'fullBleedSlide') {
            componentName = 'Full Bleed Slide'
          } else if (galleryComponent === 'croppedSlide') {
            componentName = 'Cropped Slide'
          } else {
            componentName = 'Unknown'
          }

          return {
            title: componentName,
          }
        },
      },
      fields: [
        {
          title: 'Select Slide Type',
          name: 'galleryComponent',
          type: 'string',
          options: {
            list: slideList,
            layout: 'dropdown',
          },
        },
        {
          name: 'fullBleedSlide',
          title: 'Full Bleed Slide',
          type: 'object',
          fields: [
            slideTitleBlock,
            contentBlock,
            {
              title: 'Media',
              name: 'media',
              type: 'object',
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
          hidden: ({parent}: {parent: any}) => parent?.galleryComponent !== 'fullBleedSlide',
        },
        {
          name: 'croppedSlide',
          title: 'Cropped Slide',
          type: 'object',
          fields: [
            slideTitleBlock,
            contentBlock,
            orientationSelection,
            {
              title: 'Media',
              name: 'media',
              type: 'object',
              fields: [
                selectMediaTypeObject,
                {
                  ...imageObject,
                  hidden: ({document}: any) => document?.media !== 'image',
                },
                {
                  ...mobileImageObject,
                  hidden: ({document}: any) => document?.media !== 'image',
                },
                {
                  ...videoObject,
                  hidden: ({document}: any) => document?.media !== 'video',
                },
                {
                  ...mobileVideoObject,
                  hidden: ({document}: any) => document?.media !== 'video',
                },
              ],
            },
          ],
          hidden: ({parent}: {parent: any}) => parent?.galleryComponent !== 'croppedSlide',
        },
      ],
    },
  ],
}
