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
import pxToRem from '../../utils/pxToRem';

const PageWrapper = styled(motion.div)`
	height: 100dvh;
	overflow: hidden;

	.content-layout {
		.embla__container {
			height: ${pxToRem(124)};

			@media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
				height: ${pxToRem(76)} !important;
			}
		}
	}
`;

type Props = {
	data: RepresentationPageType;
	representations: RepresentationType[];
	pageTransitionVariants: TransitionsType;
};

const Page = (props: Props) => {
	const { data, representations, pageTransitionVariants } = props;
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
			<MediaLayout
				activeSlideIndex={activeMediaSlideIndex}
				data={representations}
				type="representations"
			/>
			<ContentLayout
				title="Representation"
				scrollList={representations}
				type="representations"
				setActiveMediaSlideIndex={setActiveMediaSlideIndex}
			/>
		</PageWrapper>
	);
};

export async function getStaticProps() {
	const data = await client.fetch(representationPageQueryString);
	let representations = await client.fetch(representationsQueryString);

	return {
		props: {
			data,
			representations
		}
	};
}

export default Page;
