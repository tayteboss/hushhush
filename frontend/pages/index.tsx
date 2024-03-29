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

const PageWrapper = styled(motion.div)``;

type Props = {
	data: ClientPageType;
	siteSettings: SiteSettingsType;
	clients: ClientType[];
	pageTransitionVariants: TransitionsType;
};

const Page = (props: Props) => {
	const { data, siteSettings, clients, pageTransitionVariants } = props;

	console.log('data', data);
	console.log('siteSettings', siteSettings);
	console.log('clients', clients);

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
			Representation
		</PageWrapper>
	);
};

export async function getStaticProps() {
	const siteSettings = await client.fetch(siteSettingsQueryString);
	const data = await client.fetch(clientsPageQueryString);
	const clients = await client.fetch(clientsQueryString);

	return {
		props: {
			data,
			siteSettings,
			clients
		}
	};
}

export default Page;
