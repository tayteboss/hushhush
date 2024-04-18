import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
	FullBleedSlideType,
	CroppedSlideType,
	CaseStudyType,
	ClientType,
	RepresentationType
} from '../../../shared/types/types';
import MediaStack from '../../common/MediaStack';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
	setGreyProjectTheme,
	setWhiteProjectTheme
} from '../../../utils/setTheme';
import ActiveDesktopProjectMediaLayout from '../../layout/ActiveDesktopProjectMediaLayout';

type Props = {
	setActiveSlideIndex?: (index: number) => void;
	data: (
		| ClientType
		| RepresentationType
		| CaseStudyType
		| FullBleedSlideType
		| CroppedSlideType
	)[];
	nextProjectGalleryBlocks: (any | any)[];
	activeSlideIndex: number;
	nextProjectSlug: string;
	type: 'case-studies' | 'representation';
};

const DesktopProjectMediaWrapper = styled.div`
	width: 100%;
	scroll-snap-type: y mandatory;
	max-height: 100vh;
	overflow-x: hidden;
	overflow-y: auto;

	@media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
		display: none;
	}
`;

const ProjectMediaWrapper = styled(motion.div)`
	width: 100%;
	height: 100dvh;
	z-index: 40;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	scroll-snap-align: start;
`;

const CroppedProjectWrapper = styled.div<{ $usePortrait: boolean }>`
	width: ${(props) => (props.$usePortrait ? '33.333vw' : '42vw')};
	position: relative;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;

	& > div {
		width: 100%;
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
	const {
		data,
		nextProjectGalleryBlocks,
		setActiveSlideIndex,
		activeSlideIndex,
		nextProjectSlug,
		type
	} = props;

	const hasData = data && data?.length > 0;

	if (!hasData) return <></>;

	const slides = [...(data ?? []), ...(nextProjectGalleryBlocks ?? [])];

	const router = useRouter();

	useEffect(() => {
		const lastSlideIndex = slides.length - 1;

		if (activeSlideIndex === lastSlideIndex) {
			const timer = setTimeout(() => {
				router.push(`/${type}/${nextProjectSlug}`);
			}, 200);

			return () => {
				clearTimeout(timer);
			};
		}
	}, [activeSlideIndex]);

	useEffect(() => {
		if (
			(data[activeSlideIndex] as FullBleedSlideType | CroppedSlideType)
				?.galleryComponent === 'croppedSlide'
		) {
			setGreyProjectTheme();
		} else {
			setWhiteProjectTheme();
		}
	}, [activeSlideIndex, router]);

	return (
		<DesktopProjectMediaWrapper>
			{data &&
				slides.map((item, index) => (
					<ActiveDesktopProjectMediaLayout
						index={index}
						key={index}
						setActiveSlideIndex={setActiveSlideIndex}
					>
						<ProjectMediaWrapper
							variants={wrapperVariants}
							initial="hidden"
							animate="visible"
						>
							{item.galleryComponent === 'croppedSlide' && (
								<CroppedProjectWrapper
									$usePortrait={
										item.croppedSlide?.orientationType ===
										'portrait'
									}
								>
									{item.croppedSlide?.media && (
										<MediaStack
											data={item.croppedSlide.media}
											isPriority
											isFullScreen={false}
										/>
									)}
								</CroppedProjectWrapper>
							)}
							{item.galleryComponent === 'fullBleedSlide' && (
								<FullProjectWrapper>
									{item.fullBleedSlide?.media && (
										<MediaStack
											data={item.fullBleedSlide.media}
											isPriority
										/>
									)}
								</FullProjectWrapper>
							)}
						</ProjectMediaWrapper>
					</ActiveDesktopProjectMediaLayout>
				))}
		</DesktopProjectMediaWrapper>
	);
};

export default DesktopProjectMedia;
