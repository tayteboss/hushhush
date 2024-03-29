export type MediaType = {
	mediaType: 'video' | 'image';
	video: { asset: { playbackId: string } };
	image: { asset: { url: string; metadata: { lqip: string } }; alt: string };
	mobileImage?: { asset: { url: string; metadata: { lqip: string } } };
	mobileVideo?: { asset: { playbackId: string } };
};

export type TransitionsType = {
	hidden: {
		opacity: number;
		transition: {
			duration: number;
		};
	};
	visible: {
		opacity: number;
		transition: {
			duration: number;
			delay?: number;
		};
	};
};

export type ButtonType = {
	url: string;
	pageReference: {
		_ref: string;
	};
	title: string;
};

export type SlugType = {
	current: string;
};

export type ClientPageType = {
	seoDescription: string;
	seoTitle: string;
};

export type RepresentationPageType = {
	seoDescription: string;
	seoTitle: string;
};

export type CaseStudyPageType = {
	seoDescription: string;
	seoTitle: string;
};

export type AboutPageType = {
	seoDescription: string;
	seoTitle: string;
	aboutDescription: string;
	enquiriesCTA: ButtonType;
	phoneNumber: string;
	office: string;
	googleMapsLink: string;
	jobsCTA: ButtonType;
};

export type StatementType = { statement: string };

export type SiteSettingsType = {
	password: string;
	introStatements: StatementType[];
};

export type ClientType = {
	title: string;
	media: MediaType;
};

export type FullBleedSlideType = {
	galleryComponent: 'fullBleedSlide';
	media: MediaType;
	content: any[];
	slideTitle: string;
};

export type CroppedSlideType = {
	galleryComponent: 'croppedSlide';
	media: MediaType;
	content: any[];
	slideTitle: string;
	orientationType: 'landscape' | 'portrait';
};

export type RepresentationType = {
	title: string;
	heroMedia: MediaType;
	excerpt: string;
	slug: SlugType;
	type: string;
	galleryBlocks: (FullBleedSlideType | CroppedSlideType)[];
};

export type CaseStudyType = {
	title: string;
	slug: SlugType;
	heroMedia: MediaType;
	year: string;
	galleryBlocks: (FullBleedSlideType | CroppedSlideType)[];
	seoDescription: string;
};
