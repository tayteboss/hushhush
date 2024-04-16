import styled from 'styled-components';
import { NextSeo } from 'next-seo';
import {
	CaseStudyPageType,
	CaseStudyType,
	TransitionsType
} from '../../shared/types/types';
import { motion } from 'framer-motion';
import client from '../../client';
import {
	caseStudiesQueryString,
	caseStudyPageQueryString
} from '../../lib/sanityQueries';
import MediaLayout from '../../components/layout/MediaLayout';
import { useState } from 'react';
import ContentLayout from '../../components/layout/ContentLayout';
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
	data: CaseStudyPageType;
	caseStudies: CaseStudyType[];
	pageTransitionVariants: TransitionsType;
};

const Page = (props: Props) => {
	const { data, caseStudies, pageTransitionVariants } = props;

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
				data={caseStudies}
				type="case-study"
			/>
			<ContentLayout
				title="Case Studies"
				scrollList={caseStudies}
				type="case-study"
				setActiveMediaSlideIndex={setActiveMediaSlideIndex}
			/>
		</PageWrapper>
	);
};

export async function getStaticProps() {
	const data = await client.fetch(caseStudyPageQueryString);
	let caseStudies = await client.fetch(caseStudiesQueryString);

	return {
		props: {
			data,
			caseStudies
		}
	};
}

export default Page;
