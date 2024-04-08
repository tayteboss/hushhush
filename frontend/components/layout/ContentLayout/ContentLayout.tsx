import styled from 'styled-components';
import {
	CaseStudyType,
	ClientType,
	RepresentationType
} from '../../../shared/types/types';
import pxToRem from '../../../utils/pxToRem';
import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { useRouter } from 'next/router';
import throttle from 'lodash.throttle';

type StyledProps = {
	$containerWidth: number;
	$useFullMobile: boolean;
};

type Props = {
	title: string;
	scrollList: (ClientType | RepresentationType | CaseStudyType)[];
	type: 'clients' | 'representations' | 'case-study';
	setActiveMediaSlideIndex: (index: number) => void;
};

const ContentLayoutWrapper = styled.div`
	position: fixed;
	bottom: ${pxToRem(80)};
	left: ${pxToRem(25)};
	z-index: 100;
	display: flex;
	flex-direction: column;
	gap: ${pxToRem(10)};

	@media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
		left: ${pxToRem(16)};
		bottom: ${pxToRem(69)};
	}

	@media ${(props) => props.theme.mediaBreakpoints.mobile} {
		width: calc(100% - 32px);
	}
`;

const Title = styled.h1`
	padding-left: ${pxToRem(9)};
	color: var(--fg-colour);
`;

const Inner = styled.div<StyledProps>`
	padding: 0 ${pxToRem(9)};
	background: var(--blurred-bg-colour);
	backdrop-filter: blur(30px);
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	border-radius: ${pxToRem(5)};
	width: ${(props) => props.$containerWidth}px;

	@media ${(props) => props.theme.mediaBreakpoints.mobile} {
		width: ${(props) =>
			props.$useFullMobile ? '100%' : `${props.$containerWidth}px`};
	}
`;

const EmblaCarousel = styled.div`
	padding: ${pxToRem(6)} 0;
	width: 100%;
`;

const EmblaContainer = styled.div`
	width: 100%;
	height: ${pxToRem(142)};
`;

const EmblaSlide = styled.div<{ $isActive: boolean }>`
	width: 100%;
	height: ${pxToRem(16)};
	opacity: ${({ $isActive }) => ($isActive ? 1 : 0.4)};
	color: var(--fg-colour);
	cursor: pointer;
	display: flex;
	justify-content: space-between;

	&:hover {
		opacity: ${({ $isActive }) => ($isActive ? 1 : 0.75)};

		@media ${(props) => props.theme.mediaBreakpoints.mobile} {
			opacity: ${({ $isActive }) => ($isActive ? 1 : 0.4)};
		}
	}
`;

const SlideText = styled.p``;

const ContentLayout = (props: Props) => {
	const { title, scrollList, type, setActiveMediaSlideIndex } = props;

	const [scrollTarget, setScrollTarget] = useState<Element | undefined>();
	const [activeSlideIndex, setActiveSlideIndex] = useState(0);

	const router = useRouter();
	const rootNodeRef = useRef<HTMLDivElement>(null);

	let containerWidth = 220;

	if (type === 'case-study' || type === 'representations') {
		containerWidth = 340;
	}

	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			loop: true,
			axis: 'y',
			dragFree: false,
			watchSlides: false,
			watchDrag: true,
			align: 'start',
			duration: 25
		},
		[
			WheelGesturesPlugin({
				target: scrollTarget
			})
		]
	);

	const handleSlideClick = (index: number) => {
		if (!emblaApi) return;

		if (type === 'clients') {
			emblaApi.scrollTo(index);
			setActiveMediaSlideIndex(index);
		}
		if (type === 'representations') {
			const representation = scrollList[index] as RepresentationType;
			if (representation) {
				router.push(`/representation/${representation?.slug?.current}`);
			}
		}
		if (type === 'case-study') {
			const caseStudy = scrollList[index] as CaseStudyType;
			if (caseStudy) {
				router.push(`/case-studies/${caseStudy?.slug?.current}`);
			}
		}
	};

	useEffect(() => {
		const target = document.querySelector('.main');
		setScrollTarget(target);
	}, []);

	const updateActiveSlide = useCallback(
		throttle(() => {
			if (!emblaApi || !rootNodeRef.current) return;
			let closestIndex = null;
			let closestDistance = Infinity;
			emblaApi.scrollSnapList().forEach((snap, index) => {
				const slideElement = emblaApi.slideNodes()[index];
				const slideTop =
					slideElement.getBoundingClientRect().top -
					rootNodeRef.current.getBoundingClientRect().top;
				const distance = Math.abs(slideTop);

				if (distance >= 0 && distance <= 20) {
					if (distance < closestDistance) {
						closestIndex = index;
						closestDistance = distance;
					}
				}
			});

			setActiveSlideIndex(closestIndex ? closestIndex : 0);
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
		<ContentLayoutWrapper className="content-layout">
			<Title className="text-colour">{title || ''}</Title>
			<Inner
				ref={rootNodeRef}
				$containerWidth={containerWidth}
				$useFullMobile={
					type === 'representations' || type === 'case-study'
				}
			>
				<EmblaCarousel className="embla" ref={emblaRef}>
					<EmblaContainer className="embla__container">
						{scrollList.map((item, index) => {
							return (
								<EmblaSlide
									key={index}
									className="embla__slide"
									$isActive={activeSlideIndex === index}
									onClick={() => handleSlideClick(index)}
								>
									{type === 'clients' && <>{item.title}</>}
									{type === 'representations' && (
										<>
											<SlideText className="type-p">
												{item.title}
											</SlideText>
											<SlideText className="type-p">
												{item.type}
											</SlideText>
										</>
									)}
									{type === 'case-study' && (
										<>
											<SlideText className="type-p">
												{item.title}
											</SlideText>
											<SlideText className="type-p">
												{item.year}
											</SlideText>
										</>
									)}
								</EmblaSlide>
							);
						})}
					</EmblaContainer>
				</EmblaCarousel>
			</Inner>
		</ContentLayoutWrapper>
	);
};

export default ContentLayout;
