import styled from 'styled-components';
import { NextSeo } from 'next-seo';
import {
	ClientPageType,
	ClientType,
	SiteSettingsType,
	TransitionsType
} from '../shared/types/types';
import { motion } from 'framer-motion';
import client from '../client';
import {
	clientsPageQueryString,
	clientsQueryString,
	siteSettingsQueryString
} from '../lib/sanityQueries';
import LandingSequence from '../components/blocks/LandingSequence';
import ContentLayout from '../components/layout/ContentLayout';
import { useState } from 'react';
import MediaLayout from '../components/layout/MediaLayout';

const PageWrapper = styled(motion.div)`
	height: 100vh;
	overflow: hidden;
`;

type Props = {
	data: ClientPageType;
	siteSettings: SiteSettingsType;
	clients: ClientType[];
	pageTransitionVariants: TransitionsType;
	cursorRefresh: () => void;
};

const Page = (props: Props) => {
	const {
		data,
		siteSettings,
		clients,
		pageTransitionVariants,
		cursorRefresh
	} = props;

	const [activeMediaSlideIndex, setActiveMediaSlideIndex] = useState(0);

	return (
		<PageWrapper
			variants={pageTransitionVariants}
			initial="hidden"
			animate="visible"
			exit="hidden"
		>
			<NextSeo
				title={data?.seoTitle || ''}
				description={data?.seoDescription || ''}
			/>
			<LandingSequence
				data={siteSettings?.introMedia}
				mobileData={siteSettings?.mobileIntroMedia}
				introStatements={siteSettings?.introStatements}
				cursorRefresh={cursorRefresh}
			/>
			<MediaLayout
				activeSlideIndex={activeMediaSlideIndex}
				data={clients}
				type="clients"
			/>
			<ContentLayout
				title="Selected Clients"
				scrollList={clients}
				type="clients"
				setActiveMediaSlideIndex={setActiveMediaSlideIndex}
			/>
		</PageWrapper>
	);
};

export async function getStaticProps() {
	const siteSettings = await client.fetch(siteSettingsQueryString);
	const data = await client.fetch(clientsPageQueryString);
	let clients = await client.fetch(clientsQueryString);

	while (clients.length < 13) {
		clients = [...clients, ...clients];
	}

	return {
		props: {
			data,
			siteSettings,
			clients
		}
	};
}

export default Page;
