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

export type StatementType = { statement: string };

export type SiteSettingsType = {
	password: string;
	introStatements: StatementType[];
};

export type ClientType = {
	title: string;
	media: MediaType;
};
