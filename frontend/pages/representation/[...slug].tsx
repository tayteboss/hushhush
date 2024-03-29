import styled from 'styled-components';
import client from '../../client';
import { RepresentationType, TransitionsType } from '../../shared/types/types';
import { motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import { mediaString } from '../../lib/sanityQueries';

type Props = {
	data: RepresentationType;
	pageTransitionVariants: TransitionsType;
};

const PageWrapper = styled(motion.div)``;

const Page = (props: Props) => {
	const { data, pageTransitionVariants } = props;

	return (
		<PageWrapper
			variants={pageTransitionVariants}
			initial="hidden"
			animate="visible"
			exit="hidden"
		>
			<NextSeo
				title={data?.title || ''}
				description={data?.excerpt || ''}
			/>
		</PageWrapper>
	);
};

export async function getStaticPaths() {
	const query = `
		*[_type == 'representation'] [0...100] {
			slug
		}
	`;

	const allPages = await client.fetch(query);

	return {
		paths: allPages.map((item: any) => {
			return `/representation/${item?.slug?.current}`;
		}),
		fallback: true
	};
}

export async function getStaticProps({ params }: any) {
	const query = `
		*[_type == 'representation' && slug.current == "${params.slug[0]}"][0] {
			...,
			excerpt,
			galleryBlocks[] {
				...,
				fullBleedSlide {
					...,
					media {
						${mediaString}
					}
				},
				croppedSlide {
					...,
					media {
						${mediaString}
					}
				}
			},
			heroMedia {
				${mediaString}
			},
			slug,
			title
		}
	`;

	const data = await client.fetch(query);

	return {
		props: {
			data
		}
	};
}

export default Page;
