import styled from 'styled-components';
import client from '../../client';
import { RepresentationType, TransitionsType } from '../../shared/types/types';
import { motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import { mediaString } from '../../lib/sanityQueries';
import ProjectContentLayout from '../../components/layout/ProjectContentLayout';
import { useEffect, useState } from 'react';
import MediaLayout from '../../components/layout/MediaLayout';
import useViewportWidth from '../../hooks/useViewportWidth';
import MobileProjectMedia from '../../components/blocks/MobileProjectMedia';
import { setGreyTheme, setWhiteTheme } from '../../utils/setTheme';
import { useRouter } from 'next/router';
import DesktopProjectMedia from '../../components/blocks/DesktopProjectMedia';

type Props = {
	currentProject: RepresentationType;
	nextProjectSlug: string;
	prevProjectSlug: string;
	pageTransitionVariants: TransitionsType;
	cursorRefresh: () => void;
};

const PageWrapper = styled(motion.div)`
	background: var(--colour-white);
	height: 100dvh;
	overflow: hidden;
`;

const Page = (props: Props) => {
	const {
		currentProject,
		nextProjectSlug,
		prevProjectSlug,
		pageTransitionVariants,
		cursorRefresh
	} = props;

	const [activeSlideIndex, setActiveSlideIndex] = useState(0);

	return (
		<PageWrapper
			variants={pageTransitionVariants}
			initial="hidden"
			animate="visible"
			exit="hidden"
		>
			<NextSeo
				title={currentProject?.title || ''}
				description={currentProject?.excerpt || ''}
			/>
			<MediaLayout
				data={currentProject?.galleryBlocks}
				activeSlideIndex={activeSlideIndex}
				type="representation-project"
			/>
			<DesktopProjectMedia
				data={currentProject?.galleryBlocks}
				nextProjectSlug={nextProjectSlug}
				prevProjectSlug={prevProjectSlug}
				activeSlideIndex={activeSlideIndex}
				setActiveSlideIndex={setActiveSlideIndex}
				cursorRefresh={cursorRefresh}
				type="representation-project"
			/>
			<MobileProjectMedia
				data={currentProject?.galleryBlocks}
				setActiveSlideIndex={setActiveSlideIndex}
			/>
			<ProjectContentLayout
				title={currentProject?.title}
				galleryBlocks={currentProject?.galleryBlocks}
				activeSlideIndex={activeSlideIndex}
				nextProjectSlug={nextProjectSlug}
				prevProjectSlug={prevProjectSlug}
				type="representation"
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
	const currentProjectQuery = `
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

	const currentProject = await client.fetch(currentProjectQuery);

	const projectsQuery = `
	        *[_type == 'representation'] | order(title asc) {
				title,
	            "slug": slug.current
	        }
	    `;
	const projects = await client.fetch(projectsQuery);

	// Find the index of the current project
	const currentIndex = projects.findIndex(
		(project: any) => project.slug === params.slug[0]
	);

	// Calculate next and previous indices with wrapping
	const totalProjects = projects.length;
	const nextIndex = (currentIndex + 1) % totalProjects;
	const prevIndex = (currentIndex - 1 + totalProjects) % totalProjects;

	// Extract next and previous project slugs
	const nextProjectSlug = projects[nextIndex].slug;
	const prevProjectSlug = projects[prevIndex].slug;

	return {
		props: {
			currentProject,
			nextProjectSlug,
			prevProjectSlug
		}
	};
}

export default Page;
