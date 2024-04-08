import styled from 'styled-components';
import randomIntFromInterval from '../../../utils/randomIntFromInterval';
import { AnimatePresence, motion } from 'framer-motion';
import {
	FullBleedSlideType,
	CroppedSlideType,
	CaseStudyType,
	ClientType,
	RepresentationType
} from '../../../shared/types/types';
import MediaStack from '../../common/MediaStack';
import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { setGreyTheme, setWhiteTheme } from '../../../utils/setTheme';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import throttle from 'lodash.throttle';

type Props = {
	data: (
		| ClientType
		| RepresentationType
		| CaseStudyType
		| FullBleedSlideType
		| CroppedSlideType
	)[];
	activeSlideIndex: number;
	type: 'representation-project' | 'case-study-project';
	nextProjectSlug?: string;
	prevProjectSlug?: string;
	setActiveSlideIndex?: (index: number) => void;
	cursorRefresh: () => void;
};

const DesktopProjectMediaWrapper = styled.div`
	width: 100%;
	/* height: 100vh; */

	@media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
		display: none;
	}
`;

const Embla = styled.div`
	height: 100%;
	width: 100%;
`;

const EmblaContainer = styled.div`
	width: 100%;
	height: 100dvh;
	display: flex;
	flex-direction: column;
	touch-action: pan-x;
`;

const EmblaSlide = styled.div`
	height: 100dvh;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const CroppedProjectWrapper = styled.div<{ $usePortrait: boolean }>`
	width: ${(props) => (props.$usePortrait ? '33.333vw' : '42vw')};
	position: relative;

	@media ${(props) => props.theme.mediaBreakpoints.mobile} {
		width: 50vw;
		top: -8%;
	}

	.image-component-wrapper,
	.video-component-wrapper {
		padding-top: ${(props) => (props.$usePortrait ? '125%' : '80%')};
	}
`;

const FullProjectWrapper = styled.div`
	height: 100%;
	width: 100%;

	* {
		height: 100%;
		width: 100%;
	}
`;

const wrapperVariants = {
	hidden: {
		opacity: 0,
		transition: {
			duration: 0.2,
			ease: 'easeInOut'
		}
	},
	visible: {
		opacity: 1,
		transition: {
			duration: 0.2,
			ease: 'easeInOut'
		}
	}
};

const DesktopProjectMedia = (props: Props) => {
	const { data, activeSlideIndex } = props;

	const hasData = data && data?.length > 0;

	if (!hasData) return <></>;

	const router = useRouter();
	const rootNodeRef = useRef<HTMLDivElement>(null);

	const hasData = data?.length > 0;

	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			loop: false,
			axis: 'y',
			dragFree: false,
			align: 'start',
			containScroll: 'trimSnaps',
			watchDrag: true
		},
		[WheelGesturesPlugin()]
	);

	const handleNextSlide = () => {
		if (emblaApi) {
			if (activeSlideIndex === data.length - 1) {
				handleNextProject();
				return;
			}

			emblaApi.scrollNext();
			cursorRefresh();
		}
	};

	const handleNextProject = () => {
		if (type === 'representation-project') {
			router.push(`/representation/${nextProjectSlug}`);
		}

		if (type === 'case-study-project') {
			router.push(`/case-studies/${nextProjectSlug}`);
		}
	};

	const handlePreviousProject = () => {
		if (type === 'representation-project') {
			router.push(`/representation/${prevProjectSlug}`);
		}

		if (type === 'case-study-project') {
			router.push(`/case-studies/${prevProjectSlug}`);
		}
	};

	useEffect(() => {
		if (data[activeSlideIndex].galleryComponent === 'croppedSlide') {
			setGreyTheme();
		} else {
			setWhiteTheme();
		}

		cursorRefresh();
	}, [activeSlideIndex, router]);

	const updateActiveSlide = useCallback(
		throttle(() => {
			if (!emblaApi || !rootNodeRef.current) return;
			let mostInViewIndex = null;
			let mostInViewPercentage = 0;
			emblaApi.scrollSnapList().forEach((snap, index) => {
				const slideElement = emblaApi.slideNodes()[index];
				const slideTop =
					slideElement.getBoundingClientRect().top -
					rootNodeRef.current.getBoundingClientRect().top;
				const slideBottom = slideTop + slideElement.offsetHeight;
				const viewportTop = 0;
				const viewportBottom = rootNodeRef.current.offsetHeight;
				const inViewPercentage =
					Math.max(
						0,
						Math.min(slideBottom, viewportBottom) -
							Math.max(slideTop, viewportTop)
					) / slideElement.offsetHeight;
				if (inViewPercentage > mostInViewPercentage) {
					mostInViewIndex = index;
					mostInViewPercentage = inViewPercentage;
				}
			});

			setActiveSlideIndex && setActiveSlideIndex(mostInViewIndex || 0);
		}, 100),
		[emblaApi]
	);

	useEffect(() => {
		if (!emblaApi) return;

		emblaApi.on('scroll', updateActiveSlide);

		return () => {
			emblaApi.off('scroll', updateActiveSlide);
		};
	}, [emblaApi]);

	return (
		<DesktopProjectMediaWrapper>
			{data && (
				<ProjectMediaWrapper
					variants={wrapperVariants}
					key={randomIntFromInterval(0, 10000)}
				>
					{(
						data[activeSlideIndex] as
							| FullBleedSlideType
							| CroppedSlideType
					)?.galleryComponent === 'croppedSlide' && (
						<CroppedProjectWrapper
							$usePortrait={
								data[activeSlideIndex]?.croppedSlide
									?.orientationType === 'portrait'
							}
						>
							{data[activeSlideIndex]?.croppedSlide.media && (
								<MediaStack
									data={
										data[activeSlideIndex].croppedSlide
											.media
									}
									isPriority
									isFullScreen={false}
								/>
							)}
						</CroppedProjectWrapper>
					)}
					{(
						data[activeSlideIndex] as
							| FullBleedSlideType
							| CroppedSlideType
					)?.galleryComponent === 'fullBleedSlide' && (
						<FullProjectWrapper>
							{data[activeSlideIndex]?.fullBleedSlide?.media && (
								<MediaStack
									data={
										data[activeSlideIndex]?.fullBleedSlide
											?.media
									}
									isPriority
								/>
							)}
						</FullProjectWrapper>
					)}
				</ProjectMediaWrapper>
			)}
		</DesktopProjectMediaWrapper>
	);
};

export default DesktopProjectMedia;
