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
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
	setGreyProjectTheme,
	setWhiteProjectTheme
} from '../../../utils/setTheme';

type Props = {
	data: (
		| ClientType
		| RepresentationType
		| CaseStudyType
		| FullBleedSlideType
		| CroppedSlideType
	)[];
	wrapperVariants: any;
	activeSlideIndex: number;
};

const DesktopProjectMediaWrapper = styled.div``;

const ProjectMediaWrapper = styled(motion.div)`
	width: 100%;
	height: 100vh;
	z-index: 40;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;

	@media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
		display: none;
	}
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

const DesktopProjectMedia = (props: Props) => {
	const { data, wrapperVariants, activeSlideIndex } = props;

	const router = useRouter();

	useEffect(() => {
		if (
			(data[activeSlideIndex] as FullBleedSlideType | CroppedSlideType)
				.galleryComponent === 'croppedSlide'
		) {
			setGreyProjectTheme();
		} else {
			setWhiteProjectTheme();
		}
	}, [activeSlideIndex, router]);

	return (
		<DesktopProjectMediaWrapper>
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
								data={data[activeSlideIndex].croppedSlide.media}
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
		</DesktopProjectMediaWrapper>
	);
};

export default DesktopProjectMedia;
