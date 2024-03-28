import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {muxInput} from 'sanity-plugin-mux-input'
import {vercelDeployTool} from 'sanity-plugin-vercel-deploy'
// import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {EarthGlobeIcon, DocumentIcon, CaseIcon} from '@sanity/icons'

export default defineConfig({
  name: 'default',
  title: 'Hush Hush',

  projectId: 'zbqu53f7',
  dataset: 'production',

  plugins: [
    deskTool({
      structure: (S, context) => {
        return S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .icon(EarthGlobeIcon)
              .child(S.editor().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.listItem()
              .title('Clients Page')
              .icon(DocumentIcon)
              .child(S.editor().schemaType('clientsPage').documentId('clientsPage')),
            S.listItem()
              .title('Representation Page')
              .icon(DocumentIcon)
              .child(S.editor().schemaType('representationPage').documentId('representationPage')),
            S.listItem()
              .title('Case Study Page')
              .icon(DocumentIcon)
              .child(S.editor().schemaType('caseStudyPage').documentId('caseStudyPage')),
            S.listItem()
              .title('About Page')
              .icon(DocumentIcon)
              .child(S.editor().schemaType('aboutPage').documentId('aboutPage')),
            S.divider(),
            S.listItem()
              .title('Clients')
              .icon(CaseIcon)
              .child(
                S.documentList().title('Clients').schemaType('client').filter('_type == "client"'),
              ),
            S.listItem()
              .title('Representations')
              .icon(CaseIcon)
              .child(
                S.documentList()
                  .title('Representations')
                  .schemaType('representation')
                  .filter('_type == "representation"'),
              ),
            S.listItem()
              .title('Case Studies')
              .icon(CaseIcon)
              .child(
                S.documentList()
                  .title('Case Studies')
                  .schemaType('caseStudy')
                  .filter('_type == "caseStudy"'),
              ),
            // S.divider(),
            // orderableDocumentListDeskItem({type: 'client', S, context}),
            // orderableDocumentListDeskItem({type: 'representation', S, context}),
            // orderableDocumentListDeskItem({type: 'caseStudy', S, context}),
          ])
      },
    }),
    visionTool(),
    muxInput({mp4_support: 'standard'}),
    vercelDeployTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  parts: [
    {
      name: 'part:@sanity/base/theme/variables-style',
      path: './customEditorStyles.css',
    },
  ],
})
