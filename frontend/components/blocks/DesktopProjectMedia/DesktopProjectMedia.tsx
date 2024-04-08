import styled from 'styled-components';
import randomIntFromInterval from '../../../utils/randomIntFromInterval';
import { motion } from 'framer-motion';
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

const ProjectCursorLayoutWrapper = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	height: 100dvh;
	width: 100%;
	z-index: 50;
	display: flex;
	flex-direction: column;

	@media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
		display: none;
	}
`;

const ProjectCursorTop = styled.div`
	display: flex;
	justify-content: space-between;
	height: 70vh;
`;

const ProjectCursorBottom = styled.div`
	height: 30vh;
`;

const HalfCursorTrigger = styled.div`
	width: 50%;
	height: 100%;
`;

const FullCursorTrigger = styled.div`
	width: 100%;
	height: 100%;
`;

const DesktopProjectMedia = (props: Props) => {
	const {
		data,
		type,
		nextProjectSlug,
		prevProjectSlug,
		setActiveSlideIndex,
		activeSlideIndex,
		cursorRefresh
	} = props;

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
		<DesktopProjectMediaWrapper ref={rootNodeRef}>
			<Embla className="embla" ref={emblaRef}>
				<EmblaContainer className="embla__container">
					{hasData &&
						data.map((item, i) => (
							<EmblaSlide key={i} className="embla__slide">
								{(item as FullBleedSlideType | CroppedSlideType)
									?.galleryComponent === 'croppedSlide' && (
									<CroppedProjectWrapper
										$usePortrait={
											item?.croppedSlide
												?.orientationType === 'portrait'
										}
									>
										{item?.croppedSlide.media && (
											<MediaStack
												data={item.croppedSlide.media}
												isPriority
												isFullScreen={false}
											/>
										)}
									</CroppedProjectWrapper>
								)}
								{(item as FullBleedSlideType | CroppedSlideType)
									?.galleryComponent === 'fullBleedSlide' && (
									<FullProjectWrapper>
										{item?.fullBleedSlide?.media && (
											<MediaStack
												data={
													item?.fullBleedSlide?.media
												}
												isPriority
											/>
										)}
									</FullProjectWrapper>
								)}
							</EmblaSlide>
						))}
				</EmblaContainer>
				<ProjectCursorLayoutWrapper className="project-cursor-layout">
					<ProjectCursorTop>
						<HalfCursorTrigger
							className="cursor-text"
							data-text={
								type === 'representation-project'
									? 'Prev talent <'
									: 'Prev study <'
							}
							onClick={() => {
								handlePreviousProject();
							}}
						/>
						<HalfCursorTrigger
							className="cursor-text"
							data-text={
								type === 'representation-project'
									? 'Next talent >'
									: 'Next study >'
							}
							onClick={() => {
								handleNextProject();
							}}
						/>
					</ProjectCursorTop>
					<ProjectCursorBottom>
						<FullCursorTrigger
							className="cursor-text"
							data-text={
								activeSlideIndex === data.length - 1
									? type === 'representation-project'
										? 'Next talent >'
										: 'Next study >'
									: 'Next slide'
							}
							data-type={
								activeSlideIndex === data.length - 1
									? ''
									: 'prev'
							}
							onClick={() => handleNextSlide()}
						/>
					</ProjectCursorBottom>
				</ProjectCursorLayoutWrapper>
			</Embla>
		</DesktopProjectMediaWrapper>
	);
};

export default DesktopProjectMedia;
