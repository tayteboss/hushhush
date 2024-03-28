import styled from 'styled-components';
import { NextSeo } from 'next-seo';
import { TransitionsType } from '../shared/types/types';
import { motion } from 'framer-motion';
import client from '../client';
import { homePageQueryString, siteSettingsQueryString } from '../lib/sanityQueries';

const PageWrapper = styled(motion.div)``;

type Props = {
	data: {};
	pageTransitionVariants: TransitionsType;
};

const Page = (props: Props) => {
	const {
		data,
		pageTransitionVariants
	} = props;

	return (
		<PageWrapper
			variants={pageTransitionVariants}
			initial='hidden'
			animate='visible'
			exit='hidden'
		>
			<NextSeo
				title="Boiler"
				description="Boiler Plate"
			/>
			Home
		</PageWrapper>
	);
};

export async function getStaticProps() {
	// const siteSettings = await client.fetch(siteSettingsQueryString);
	// const data = await client.fetch(homePageQueryString);
	const data = false;

	return {
		props: {
			data,
		},
	};
}

export default Page;
