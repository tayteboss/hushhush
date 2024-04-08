import styled from 'styled-components';
import client from '../../client';
import {
	CaseStudyType,
	SiteSettingsType,
	TransitionsType
} from '../../shared/types/types';
import { AnimatePresence, motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import { mediaString, siteSettingsQueryString } from '../../lib/sanityQueries';
import { useState, useEffect } from 'react';
import MediaLayout from '../../components/layout/MediaLayout';
import ProjectContentLayout from '../../components/layout/ProjectContentLayout';
import Cookies from 'js-cookie';
import Authentication from '../../components/blocks/Authentication';
import useViewportWidth from '../../hooks/useViewportWidth';
import router from 'next/router';
import { setGreyTheme, setWhiteTheme } from '../../utils/setTheme';
import MobileProjectMedia from '../../components/blocks/MobileProjectMedia';
import DesktopProjectMedia from '../../components/blocks/DesktopProjectMedia';
import ProjectCursorLayout from '../../components/blocks/ProjectCursorLayout';

type Props = {
	currentProject: CaseStudyType;
	nextProjectSlug: string;
	prevProjectSlug: string;
	pageTransitionVariants: TransitionsType;
	siteSettings: SiteSettingsType;
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
		siteSettings,
		cursorRefresh
	} = props;

	const [activeSlideIndex, setActiveSlideIndex] = useState(0);
	const [isAuthenticated, setIsAuthenticated] = useState(true);

	const viewportWidth = useViewportWidth();
	const isOnDevice =
		viewportWidth === 'mobile' || viewportWidth === 'tabletPortrait';

	useEffect(() => {
		const hasCookies = Cookies.get('authenticated');

		if (!hasCookies) {
			setIsAuthenticated(false);
		}
	}, []);

	useEffect(() => {
		if (isOnDevice) {
			if (
				currentProject.galleryBlocks[activeSlideIndex]
					.galleryComponent === 'croppedSlide'
			) {
				setGreyTheme();
			} else {
				setWhiteTheme();
			}
		} else {
			cursorRefresh();
		}
	}, [activeSlideIndex, router, isOnDevice, isAuthenticated]);

	return (
		<PageWrapper
			variants={pageTransitionVariants}
			initial="hidden"
			animate="visible"
			exit="hidden"
		>
			<NextSeo
				title={currentProject?.title || ''}
				description={currentProject?.seoDescription || ''}
			/>
			{isAuthenticated && (
				<>
					<MediaLayout
						data={currentProject?.galleryBlocks}
						nextProjectSlug={nextProjectSlug}
						prevProjectSlug={prevProjectSlug}
						activeSlideIndex={activeSlideIndex}
						setActiveSlideIndex={setActiveSlideIndex}
						type="case-study-project"
					/>
					<MobileProjectMedia
						data={currentProject?.galleryBlocks}
						setActiveSlideIndex={setActiveSlideIndex}
					/>
					<DesktopProjectMedia
						data={currentProject?.galleryBlocks}
						activeSlideIndex={activeSlideIndex}
					/>
					{/* <ProjectCursorLayout
						nextProjectSlug={nextProjectSlug}
						prevProjectSlug={prevProjectSlug}
						setActiveSlideIndex={setActiveSlideIndex}
						activeSlideIndex={activeSlideIndex}
						type="case-study-project"
						data={currentProject?.galleryBlocks}
					/> */}
					<ProjectContentLayout
						title={currentProject?.title}
						galleryBlocks={currentProject?.galleryBlocks}
						activeSlideIndex={activeSlideIndex}
						nextProjectSlug={nextProjectSlug}
						prevProjectSlug={prevProjectSlug}
						type="case-study"
					/>
				</>
			)}
			<AnimatePresence>
				{!isAuthenticated && (
					<Authentication
						password={siteSettings?.password}
						setIsAuthenticated={setIsAuthenticated}
					/>
				)}
			</AnimatePresence>
		</PageWrapper>
	);
};

export async function getStaticPaths() {
	const query = `
		*[_type == 'caseStudy'] [0...100] {
			slug
		}
	`;

	const allPages = await client.fetch(query);

	return {
		paths: allPages.map((item: any) => {
			return `/case-studies/${item?.slug?.current}`;
		}),
		fallback: true
	};
}

export async function getStaticProps({ params }: any) {
	const currentProjectQuery = `
		*[_type == 'caseStudy' && slug.current == "${params.slug[0]}"][0] {
			...,
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
			title,
			year,
			seoDescription
		}
	`;

	const currentProject = await client.fetch(currentProjectQuery);
	const siteSettings = await client.fetch(siteSettingsQueryString);

	const projectsQuery = `
	        *[_type == 'caseStudy'] | order(year desc) {
				year,
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
			prevProjectSlug,
			siteSettings
		}
	};
}

export default Page;
