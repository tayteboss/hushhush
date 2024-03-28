import aboutPage from '../schemas/aboutPage'
import caseStudy from '../schemas/caseStudy'
import caseStudyPage from '../schemas/caseStudyPage'
import client from '../schemas/client'
import clientsPage from '../schemas/clientsPage'
import representation from '../schemas/representation'
import representationPage from '../schemas/representationPage'
import siteSettings from '../schemas/siteSettings'

export const schemaTypes = [
  // Site Settings
  siteSettings,

  // Pages
  clientsPage,
  aboutPage,
  caseStudyPage,
  representationPage,

  // Documents
  caseStudy,
  client,
  representation,
]
