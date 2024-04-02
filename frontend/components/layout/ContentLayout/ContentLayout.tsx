import styled from 'styled-components';
import { ClientType, RepresentationType } from '../../../shared/types/types';
import pxToRem from '../../../utils/pxToRem';
import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

type Props = {
	title: string;
	scrollList: (ClientType | RepresentationType)[];
	type: 'clients' | 'representations';
};

const ContentLayoutWrapper = styled.div`
	position: fixed;
	bottom: ${pxToRem(80)};
	left: ${pxToRem(25)};
	z-index: 100;
	display: flex;
	flex-direction: column;
	gap: ${pxToRem(10)};
`;

const Title = styled.h1`
	padding-left: ${pxToRem(9)};
`;

const Inner = styled.div`
	padding: 0 ${pxToRem(9)};
	background: rgba(217, 217, 217, 0.1);
	backdrop-filter: blur(10px);
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
`;

const WHEEL_ITEM_SIZE = 16;

const ContentLayout = (props: Props) => {
	const { title, scrollList, type } = props;

	const moreScrollList = scrollList.concat(
		scrollList,
		scrollList,
		scrollList
	);

	const [activeSlideIndex, setActiveSlideIndex] = useState(0);

	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			loop: true,
			axis: 'y',
			dragFree: true,
			watchSlides: false,
			watchDrag: true,
			align: 'start'
		},
		[WheelGesturesPlugin()]
	);

	const rootNodeRef = useRef<HTMLDivElement>(null);

	const updateActiveSlide = useCallback(() => {
		if (!emblaApi || !rootNodeRef.current) return;
		let closestIndex = null;
		let closestDistance = Infinity;
		emblaApi.scrollSnapList().forEach((snap, index) => {
			const slideElement = emblaApi.slideNodes()[index];
			const slideTop =
				slideElement.getBoundingClientRect().top -
				rootNodeRef.current.getBoundingClientRect().top;
			const distance = Math.abs(slideTop); // Distance from the top of the container

			// Check if the distance is between 10px and 30px
			if (distance >= 0 && distance <= 24) {
				// Select the slide closest to 10px from the top, but not further than 30px
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
			console.log('activeSlideIndex', activeSlideIndex);
		});

		emblaApi.on('scroll', updateActiveSlide);

		emblaApi?.on('pointerUp', (emblaApi) => {
			const { scrollTo, target, location } = emblaApi.internalEngine();
			const diffToTarget = target.get() - location.get();
			const factor =
				Math.abs(diffToTarget) < WHEEL_ITEM_SIZE / 2.5 ? 10 : 0.1;
			const distance = diffToTarget * factor;
			scrollTo.distance(distance, true);

			console.log('factor', factor);
			console.log('distance', distance);
		});

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
						{moreScrollList.map((item, index) => {
							return (
								<EmblaSlide
									key={index}
									className="embla__slide"
									$isActive={activeSlideIndex === index}
								>
									{type === 'clients' && <>{item.title}</>}
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
