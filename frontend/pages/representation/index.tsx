import styled from 'styled-components';
import { NextSeo } from 'next-seo';
import {
	RepresentationPageType,
	RepresentationType,
	SiteSettingsType,
	TransitionsType
} from '../../shared/types/types';
import { motion } from 'framer-motion';
import client from '../../client';
import {
	representationPageQueryString,
	representationsQueryString
} from '../../lib/sanityQueries';

const PageWrapper = styled(motion.div)``;

type Props = {
	data: RepresentationPageType;
	representations: RepresentationType[];
	pageTransitionVariants: TransitionsType;
};

const Page = (props: Props) => {
	const { data, representations, pageTransitionVariants } = props;

	console.log('representations', representations);

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
			Representation Index
		</PageWrapper>
	);
};

export async function getStaticProps() {
	const data = await client.fetch(representationPageQueryString);
	const representations = await client.fetch(representationsQueryString);

	return {
		props: {
			data,
			representations
		}
	};
}

export default Page;
