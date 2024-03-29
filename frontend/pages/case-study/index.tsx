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

const PageWrapper = styled(motion.div)``;

type Props = {
	data: CaseStudyPageType;
	caseStudies: CaseStudyType[];
	pageTransitionVariants: TransitionsType;
};

const Page = (props: Props) => {
	const { data, caseStudies, pageTransitionVariants } = props;

	console.log('data', data);
	console.log('caseStudies', caseStudies);

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
			Case Study Index
		</PageWrapper>
	);
};

export async function getStaticProps() {
	const data = await client.fetch(caseStudyPageQueryString);
	const caseStudies = await client.fetch(caseStudiesQueryString);

	return {
		props: {
			data,
			caseStudies
		}
	};
}

export default Page;
