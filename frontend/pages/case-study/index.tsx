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

const PageWrapper = styled(motion.div)`
	height: 100vh;
	overflow: hidden;
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

	while (caseStudies.length < 10) {
		caseStudies = [...caseStudies, ...caseStudies];
	}

	return {
		props: {
			data,
			caseStudies
		}
	};
}

export default Page;
