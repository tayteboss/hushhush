import styled from 'styled-components';
import client from '../../client';
import {
	RepresentationType,
	SiteSettingsType,
	TransitionsType
} from '../../shared/types/types';
import { AnimatePresence, motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import { mediaString, siteSettingsQueryString } from '../../lib/sanityQueries';
import ProjectContentLayout from '../../components/layout/ProjectContentLayout';
import { useEffect, useState } from 'react';
import useViewportWidth from '../../hooks/useViewportWidth';
import MobileProjectMedia from '../../components/blocks/MobileProjectMedia';
import { setGreyTheme, setWhiteTheme } from '../../utils/setTheme';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Authentication from '../../components/blocks/Authentication';
import DesktopProjectMedia from '../../components/blocks/DesktopProjectMedia';

type Props = {
	currentProject: RepresentationType;
	nextProjectSlug: string;
	prevProjectSlug: string;
	pageTransitionVariants: TransitionsType;
	siteSettings: SiteSettingsType;
	nextProjectGalleryBlocks: (any | any)[];
	cursorRefresh: () => void;
};

const PageWrapper = styled(motion.div)`
	background: var(--colour-white);

	@media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
		height: 100dvh;
		overflow: hidden;
	}
`;

const Page = (props: Props) => {
	const {
		currentProject,
		nextProjectSlug,
		prevProjectSlug,
		pageTransitionVariants,
		siteSettings,
		nextProjectGalleryBlocks
	} = props;

	const [activeSlideIndex, setActiveSlideIndex] = useState(0);
	const [isAuthenticated, setIsAuthenticated] = useState(true);

	const router = useRouter();

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
		if (
			[...currentProject.galleryBlocks, ...nextProjectGalleryBlocks][
				activeSlideIndex
			].galleryComponent === 'croppedSlide'
		) {
			setGreyTheme();
		} else {
			setWhiteTheme();
		}
	}, [activeSlideIndex, router, isOnDevice]);

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
			<DesktopProjectMedia
				data={currentProject?.galleryBlocks}
				setActiveSlideIndex={setActiveSlideIndex}
				nextProjectGalleryBlocks={nextProjectGalleryBlocks}
				nextProjectSlug={nextProjectSlug}
				activeSlideIndex={activeSlideIndex}
				type="representation"
			/>
			<MobileProjectMedia
				data={currentProject?.galleryBlocks}
				setActiveSlideIndex={setActiveSlideIndex}
				nextProjectGalleryBlocks={nextProjectGalleryBlocks}
				nextProjectSlug={nextProjectSlug}
				activeSlideIndex={activeSlideIndex}
				type="representation"
			/>
			<ProjectContentLayout
				title={currentProject?.title}
				galleryBlocks={currentProject?.galleryBlocks}
				nextProjectGalleryBlocks={nextProjectGalleryBlocks}
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
	        *[_type == 'representation'] | order(orderRank) {
				title,
	            "slug": slug.current,
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
	const nextProjectGalleryBlocks = projects[nextIndex].galleryBlocks;

	const siteSettings = await client.fetch(siteSettingsQueryString);

	return {
		props: {
			currentProject,
			nextProjectSlug,
			prevProjectSlug,
			siteSettings,
			nextProjectGalleryBlocks
		}
	};
}

export default Page;
