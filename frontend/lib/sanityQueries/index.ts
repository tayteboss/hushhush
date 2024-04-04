export const mediaString = `
	...,
	mediaType,
	image {
		asset-> {
			url,
			metadata {
				lqip
			}
		},
		alt
	},
	video {
		asset-> {
			playbackId,
		},
	},
	mobileImage {
		asset-> {
			url,
			metadata {
				lqip
			}
		},
		alt
	},
	mobileVideo {
		asset-> {
			playbackId,
		},
	},
`;

export const siteSettingsQueryString = `
	*[_type == 'siteSettings'][0] {
		...,
		introMedia {
			asset-> {
				playbackId
			}
		},
		mobileIntroMedia {
			asset-> {
				playbackId
			}
		}
	}
`;

export const clientsPageQueryString = `
	*[_type == 'clientsPage'][0] {
		...,
	}
`;

export const representationPageQueryString = `
	*[_type == 'representationPage'][0] {
		...,
	}
`;

export const caseStudyPageQueryString = `
	*[_type == 'caseStudyPage'][0] {
		...,
	}
`;

export const aboutPagePageQueryString = `
	*[_type == 'aboutPage'][0] {
		...,
	}
`;

export const clientsQueryString = `
	*[_type == 'client'] | order(title asc) [0...100] {
		...,
		media {
			${mediaString}
		}
	}
`;

export const representationsQueryString = `
	*[_type == 'representation'] | order(title asc) [0...100] {
		title,
		type,
		slug,
		'media': heroMedia {
			${mediaString}
		}
	}
`;

export const caseStudiesQueryString = `
	*[_type == 'caseStudy'] | order(year desc) [0...100] {
		title,
		year,
		'media': heroMedia {
			${mediaString}
		},
		slug,
		seoDescription
	}
`;
