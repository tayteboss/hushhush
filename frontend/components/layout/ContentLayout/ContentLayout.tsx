import styled from 'styled-components';
import { ClientType, RepresentationType } from '../../../shared/types/types';
import pxToRem from '../../../utils/pxToRem';
import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { useRouter } from 'next/router';

type Props = {
	title: string;
	scrollList: (ClientType | RepresentationType)[];
	type: 'clients' | 'representations';
	activeSlideIndex: number;
	setActiveSlideIndex: (index: number) => void;
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
`;

const Title = styled.h1`
	padding-left: ${pxToRem(9)};
	color: var(--fg-colour);
`;

const Inner = styled.div`
	padding: 0 ${pxToRem(9)};
	background: rgba(217, 217, 217, 0.1);
	backdrop-filter: blur(30px);
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	border-radius: ${pxToRem(5)};
	width: ${pxToRem(220)};
`;

const EmblaCarousel = styled.div`
	padding: ${pxToRem(9)} 0;
	width: 100%;
`;

const EmblaContainer = styled.div`
	width: 100%;
`;

const EmblaSlide = styled.div<{ $isActive: boolean }>`
	width: 100%;
	height: ${pxToRem(16)};
	opacity: ${({ $isActive }) => ($isActive ? 1 : 0.4)};
	color: var(--fg-colour);
	cursor: pointer;

	&:hover {
		opacity: ${({ $isActive }) => ($isActive ? 1 : 0.75)};
	}
`;

const ContentLayout = (props: Props) => {
	const {
		title,
		scrollList,
		type,
		activeSlideIndex,
		setActiveSlideIndex,
		setActiveMediaSlideIndex
	} = props;

	const [scrollTarget, setScrollTarget] = useState<Element | undefined>();

	const router = useRouter();
	const rootNodeRef = useRef<HTMLDivElement>(null);

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
				router.push(
					`/representations/${representation?.slug?.current}`
				);
			}
		}
	};

	useEffect(() => {
		const target = document.querySelector('.main');
		setScrollTarget(target);
	}, []);

	const updateActiveSlide = useCallback(() => {
		if (!emblaApi || !rootNodeRef.current) return;
		let closestIndex = null;
		let closestDistance = Infinity;
		emblaApi.scrollSnapList().forEach((snap, index) => {
			const slideElement = emblaApi.slideNodes()[index];
			const slideTop =
				slideElement.getBoundingClientRect().top -
				rootNodeRef.current.getBoundingClientRect().top;
			const distance = Math.abs(slideTop);

			if (distance >= 0 && distance <= 24) {
				if (distance < closestDistance) {
					closestIndex = index;
					closestDistance = distance;
				}
			}
		});
		setActiveSlideIndex(closestIndex + 1);
	}, [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;
		emblaApi?.on('settle', () => {
			const activeSlideIndex = emblaApi.selectedScrollSnap();
			setActiveMediaSlideIndex(activeSlideIndex);
		});

		emblaApi.on('scroll', updateActiveSlide);

		// emblaApi?.on('pointerUp', (emblaApi) => {
		// 	const { scrollTo, target, location } = emblaApi.internalEngine();
		// 	const diffToTarget = target.get() - location.get();
		// 	const factor =
		// 		Math.abs(diffToTarget) < WHEEL_ITEM_SIZE / 2.5 ? 10 : 0.1;
		// 	const distance = diffToTarget * factor;
		// 	scrollTo.distance(distance, true);
		// });

		return () => {
			emblaApi.off('scroll', updateActiveSlide);
		};
	}, [emblaApi]);

	return (
		<ContentLayoutWrapper>
			<Title className="text-colour">{title || ''}</Title>
			<Inner ref={rootNodeRef}>
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
										<>{item.title}</>
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
