import styled from 'styled-components';
import { NextSeo } from 'next-seo';
import {
	AboutPageType,
	SiteSettingsType,
	TransitionsType
} from '../shared/types/types';
import { motion } from 'framer-motion';
import client from '../client';
import {
	aboutPagePageQueryString,
	siteSettingsQueryString
} from '../lib/sanityQueries';

const PageWrapper = styled(motion.div)``;

type Props = {
	data: AboutPageType;
	siteSettings: SiteSettingsType;
	pageTransitionVariants: TransitionsType;
};

const Page = (props: Props) => {
	const { data, siteSettings, pageTransitionVariants } = props;

	console.log('data', data);
	console.log('siteSettings', siteSettings);

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
			About
		</PageWrapper>
	);
};

export async function getStaticProps() {
	const siteSettings = await client.fetch(siteSettingsQueryString);
	const data = await client.fetch(aboutPagePageQueryString);

	return {
		props: {
			data,
			siteSettings
		}
	};
}

export default Page;
