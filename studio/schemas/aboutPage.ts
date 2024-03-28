import {HomeIcon} from '@sanity/icons'
import {linkObject} from '../objects'

export default {
  title: 'About Page',
  name: 'aboutPage',
  type: 'document',
  icon: HomeIcon,
  fields: [
    {
      title: 'Reference Title',
      name: 'referenceTitle',
      type: 'string',
      description: 'This is an internal reference title.',
    },
    {
      title: 'SEO Title',
      name: 'seoTitle',
      type: 'string',
      description: 'This is the SEO title that appears in search engines.',
    },
    {
      title: 'SEO Description',
      name: 'seoDescription',
      type: 'string',
      description: 'This is the SEO description that appears in search engines.',
    },
    {
      title: 'About description',
      name: 'aboutDescription',
      type: 'text',
    },
    {
      title: 'Enquiries CTA',
      name: 'enquiriesCTA',
      type: 'object',
      fields: linkObject,
    },
    {
      title: 'Phone number',
      name: 'phoneNumber',
      type: 'string',
    },
    {
      title: 'Office',
      name: 'office',
      type: 'text',
    },
    {
      title: 'Google Maps Link',
      name: 'googleMapsLink',
      type: 'url',
    },
    {
      title: 'Jobs CTA',
      name: 'jobsCTA',
      type: 'object',
      fields: linkObject,
    },
  ],
}
