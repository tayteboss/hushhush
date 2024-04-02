import styled from 'styled-components';
import { NextSeo } from 'next-seo';
import {
	RepresentationPageType,
	RepresentationType,
	TransitionsType
} from '../../shared/types/types';
import { motion } from 'framer-motion';
import client from '../../client';
import {
	representationPageQueryString,
	representationsQueryString
} from '../../lib/sanityQueries';
import MediaLayout from '../../components/layout/MediaLayout';
import ContentLayout from '../../components/layout/ContentLayout';
import { useState } from 'react';

const PageWrapper = styled(motion.div)`
	height: 100dvh;
`;

type Props = {
	data: RepresentationPageType;
	representations: RepresentationType[];
	pageTransitionVariants: TransitionsType;
};

const Page = (props: Props) => {
	const { data, representations, pageTransitionVariants } = props;

	const [activeSlideIndex, setActiveSlideIndex] = useState(0);
	const [activeMediaSlideIndex, setActiveMediaSlideIndex] = useState(0);

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
			<MediaLayout
				activeSlideIndex={activeMediaSlideIndex}
				data={representations}
				type="representations"
			/>
			<ContentLayout
				title="Representation"
				scrollList={representations}
				type="representations"
				activeSlideIndex={activeSlideIndex}
				setActiveSlideIndex={setActiveSlideIndex}
				setActiveMediaSlideIndex={setActiveMediaSlideIndex}
			/>
		</PageWrapper>
	);
};

export async function getStaticProps() {
	const data = await client.fetch(representationPageQueryString);
	let representations = await client.fetch(representationsQueryString);

	while (representations.length < 10) {
		representations = [...representations, ...representations];
	}

	return {
		props: {
			data,
			representations
		}
	};
}

export default Page;
