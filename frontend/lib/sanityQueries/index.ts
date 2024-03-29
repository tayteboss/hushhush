const mediaString = `
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
	}
`;

export const clientsPageQueryString = `
	*[_type == 'clientsPage'][0] {
		...,
	}
`;

export const clientsQueryString = `
	*[_type == 'client'] | order(orderRank) [0...100] {
		...,
		media {
			${mediaString}
		}
	}
`;

export const representationsQueryString = `
	*[_type == 'representation'] | order(orderRank) [0...100] {
		...,
	}
`;

export const caseStudysQueryString = `
	*[_type == 'caseStudy'] | order(orderRank) [0...100] {
		...,
	}
`;
