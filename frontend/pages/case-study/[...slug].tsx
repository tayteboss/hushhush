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
	height: 100vh;
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

	useEffect(() => {
		const hasCookies = Cookies.get('authenticated');

		if (hasCookies) {
			setIsAuthenticated(true);
		} else {
			setIsAuthenticated(false);
		}
	}, []);

	useEffect(() => {
		cursorRefresh();
	}, [activeSlideIndex, isAuthenticated]);

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
					<ProjectContentLayout
						title={currentProject?.title}
						galleryBlocks={currentProject?.galleryBlocks}
						activeSlideIndex={activeSlideIndex}
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
			return `/case-study/${item?.slug?.current}`;
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
