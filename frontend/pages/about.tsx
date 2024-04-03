import styled from 'styled-components';
import { NextSeo } from 'next-seo';
import { AboutPageType, TransitionsType } from '../shared/types/types';
import { motion } from 'framer-motion';
import client from '../client';
import { aboutPagePageQueryString } from '../lib/sanityQueries';
import AboutContentLayout from '../components/layout/AboutContentLayout';

const PageWrapper = styled(motion.div)``;

type Props = {
	data: AboutPageType;
	pageTransitionVariants: TransitionsType;
};

const Page = (props: Props) => {
	const { data, pageTransitionVariants } = props;

	const {
		aboutDescription,
		enquiriesCTA,
		googleMapsLink,
		jobsCTA,
		office,
		phoneNumber
	} = data;

	console.log('data', data);

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
			<AboutContentLayout
				aboutDescription={aboutDescription}
				enquiriesCTA={enquiriesCTA}
				googleMapsLink={googleMapsLink}
				jobsCTA={jobsCTA}
				office={office}
				phoneNumber={phoneNumber}
			/>
		</PageWrapper>
	);
};

export async function getStaticProps() {
	const data = await client.fetch(aboutPagePageQueryString);

	return {
		props: {
			data
		}
	};
}

export default Page;
