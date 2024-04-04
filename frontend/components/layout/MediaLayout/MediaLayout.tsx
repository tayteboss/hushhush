import styled from 'styled-components';
import {
	CaseStudyType,
	ClientType,
	CroppedSlideType,
	FullBleedSlideType,
	RepresentationType
} from '../../../shared/types/types';
import MediaStack from '../../common/MediaStack';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import randomIntFromInterval from '../../../utils/randomIntFromInterval';
import { useEffect } from 'react';
import {
	setGreyProjectTheme,
	setGreyTheme,
	setWhiteProjectTheme,
	setWhiteTheme
} from '../../../utils/setTheme';
import { useRouter } from 'next/router';

type Props = {
	activeSlideIndex: number;
	data: (
		| ClientType
		| RepresentationType
		| CaseStudyType
		| FullBleedSlideType
		| CroppedSlideType
	)[];
	type:
		| 'clients'
		| 'representations'
		| 'case-study'
		| 'representation-project'
		| 'case-study-project';
	setActiveSlideIndex?: (index: number) => void;
	nextProjectSlug?: string;
	prevProjectSlug?: string;
};

const MediaLayoutWrapper = styled(motion.section)`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	z-index: 50;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const ClientMediaWrapper = styled.div`
	height: 100%;
	width: 100%;

	* {
		height: 100%;
		width: 100%;
	}
`;

const ProjectMediaWrapper = styled(motion.div)`
	width: 100%;
	height: 100vh;
	z-index: 40;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const RepresentationMediaWrapper = styled.a`
	width: 33.333vw;
	position: relative;

	@media ${(props) => props.theme.mediaBreakpoints.mobile} {
		width: 50vw;
		top: -5%;
	}

	.image-component-wrapper,
	.video-component-wrapper {
		padding-top: 133.8%;
	}
`;

const CaseStudyMediaWrapper = styled.a`
	height: 100%;
	width: 100%;

	* {
		height: 100%;
		width: 100%;
	}
`;

const CroppedProjectWrapper = styled.div<{ $usePortrait: boolean }>`
	width: 33.333vw;
	position: relative;

	@media ${(props) => props.theme.mediaBreakpoints.mobile} {
		width: 50vw;
		top: -5%;
	}

	.image-component-wrapper,
	.video-component-wrapper {
		padding-top: ${(props) => (props.$usePortrait ? '133.8%' : '80%')};
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

const ProjectCursorLayout = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	height: 100vh;
	width: 100%;
	z-index: 50;
	display: flex;
	flex-direction: column;
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

const wrapperVariants = {
	hidden: {
		opacity: 0,
		transition: {
			duration: 0.3,
			ease: 'easeInOut'
		}
	},
	visible: {
		opacity: 1,
		transition: {
			duration: 0.3,
			ease: 'easeInOut'
		}
	}
};

const MediaLayout = (props: Props) => {
	const {
		activeSlideIndex,
		setActiveSlideIndex,
		data,
		type,
		nextProjectSlug,
		prevProjectSlug
	} = props;

	if (!data) return null;

	const router = useRouter();

	const handleNextProject = () => {
		if (type === 'representation-project') {
			router.push(`/representation/${nextProjectSlug}`);
		}

		if (type === 'case-study-project') {
			router.push(`/case-study/${nextProjectSlug}`);
		}
	};

	const handlePreviousProject = () => {
		if (type === 'representation-project') {
			router.push(`/representation/${prevProjectSlug}`);
		}

		if (type === 'case-study-project') {
			router.push(`/case-study/${prevProjectSlug}`);
		}
	};

	useEffect(() => {
		if (
			type === 'representation-project' ||
			type === 'case-study-project'
		) {
			console.log('hello');

			if (
				(
					data[activeSlideIndex] as
						| FullBleedSlideType
						| CroppedSlideType
				).galleryComponent === 'croppedSlide'
			) {
				setGreyProjectTheme();
			} else {
				setWhiteProjectTheme();
			}
		} else {
			return;
		}
	}, [data[activeSlideIndex], router]);

	return (
		<AnimatePresence>
			{data && (
				<MediaLayoutWrapper
					className={`media-layout`}
					variants={wrapperVariants}
					initial="hidden"
					animate="visible"
					exit="hidden"
					key={randomIntFromInterval(0, 10000)}
				>
					{type === 'clients' && (
						<ClientMediaWrapper>
							{data[activeSlideIndex]?.media && (
								<MediaStack
									data={data[activeSlideIndex].media}
									isPriority
								/>
							)}
						</ClientMediaWrapper>
					)}
					{type === 'representations' && (
						<Link
							href={`/representation/${
								(data[activeSlideIndex] as RepresentationType)
									?.slug?.current
							}`}
							passHref
							legacyBehavior
						>
							<RepresentationMediaWrapper>
								{(data[activeSlideIndex] as RepresentationType)
									?.media && (
									<MediaStack
										data={
											(
												data[
													activeSlideIndex
												] as RepresentationType
											).media
										}
										isPriority
									/>
								)}
							</RepresentationMediaWrapper>
						</Link>
					)}
					{type === 'case-study' && (
						<Link
							href={`/case-study/${
								(data[activeSlideIndex] as CaseStudyType)?.slug
									?.current
							}`}
							passHref
							legacyBehavior
						>
							<CaseStudyMediaWrapper>
								{(data[activeSlideIndex] as CaseStudyType)
									?.media && (
									<MediaStack
										data={
											(
												data[
													activeSlideIndex
												] as RepresentationType
											).media
										}
										isPriority
									/>
								)}
							</CaseStudyMediaWrapper>
						</Link>
					)}
					{(type === 'representation-project' ||
						type === 'case-study-project') && (
						<>
							<ProjectMediaWrapper
								onClick={() =>
									setActiveSlideIndex &&
									setActiveSlideIndex(
										activeSlideIndex + 1 === data.length
											? 0
											: activeSlideIndex + 1
									)
								}
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
										{data[activeSlideIndex]?.croppedSlide
											.media && (
											<MediaStack
												data={
													data[activeSlideIndex]
														.croppedSlide.media
												}
												isPriority
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
										{data[activeSlideIndex]?.fullBleedSlide
											?.media && (
											<MediaStack
												data={
													data[activeSlideIndex]
														?.fullBleedSlide?.media
												}
												isPriority
											/>
										)}
									</FullProjectWrapper>
								)}
							</ProjectMediaWrapper>
							<ProjectCursorLayout>
								<ProjectCursorTop>
									<HalfCursorTrigger
										className="cursor-text"
										data-text={
											type === 'representations'
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
											type === 'representations'
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
										data-text="Next slide"
										data-type="prev"
										onClick={() =>
											setActiveSlideIndex &&
											setActiveSlideIndex(
												activeSlideIndex + 1 ===
													data.length
													? 0
													: activeSlideIndex + 1
											)
										}
									/>
								</ProjectCursorBottom>
							</ProjectCursorLayout>
						</>
					)}
				</MediaLayoutWrapper>
			)}
		</AnimatePresence>
	);
};

export default MediaLayout;
