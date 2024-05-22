import styled from 'styled-components';
import pxToRem from '../../../utils/pxToRem';
import {
	CroppedSlideType,
	FullBleedSlideType
} from '../../../shared/types/types';
import { PortableText } from '@portabletext/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';

type Props = {
	title: string;
	galleryBlocks: (FullBleedSlideType | CroppedSlideType)[];
	activeSlideIndex: number;
	prevProjectSlug: string;
	nextProjectSlug: string;
	type: 'representation' | 'case-study';
	nextProjectGalleryBlocks: (any | any)[];
};

const ProjectContentLayoutWrapper = styled.div`
	position: fixed;
	bottom: ${pxToRem(30)};
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
		width: calc(100% - 30px);
		bottom: ${pxToRem(24)};
	}
`;

const TitleWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 ${pxToRem(9)};
`;

const Title = styled.h1`
	color: var(--fg-colour);
	padding-right: ${pxToRem(10)};
`;

const Hint = styled.p<{ $isActive: boolean }>`
	display: ${(props) => (props.$isActive ? 'block' : 'none')};
	color: var(--fg-colour);
	opacity: ${(props) => (props.$isActive ? 1 : 0)};
	padding-top: ${pxToRem(16)};

	transition: all var(--transition-speed-default) var(--transition-ease);
`;

const Inner = styled(motion.div)`
	padding: ${pxToRem(7)} ${pxToRem(9)};
	background: var(--blurred-bg-colour);
	backdrop-filter: blur(30px);
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	border-radius: ${pxToRem(5)};
	width: ${pxToRem(340)};

	@media ${(props) => props.theme.mediaBreakpoints.mobile} {
		width: 100%;
		overflow: auto;
	}
`;

const RichTextWrapper = styled.div`
	* {
		color: var(--fg-colour);
	}
`;

const PaginationWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: ${pxToRem(10)};
`;

const PrevProjectLink = styled.button`
	padding-left: ${pxToRem(9)};
	color: var(--fg-colour);
`;

const NextProjectLink = styled.button`
	padding-right: ${pxToRem(9)};
	color: var(--fg-colour);
`;

const wrapperVariants = {
	hidden: {
		opacity: 1,
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

const ProjectContentLayout = (props: Props) => {
	const {
		title,
		galleryBlocks,
		activeSlideIndex,
		prevProjectSlug,
		nextProjectSlug,
		nextProjectGalleryBlocks,
		type
	} = props;

	const slides = [
		...(galleryBlocks ?? []),
		nextProjectGalleryBlocks && nextProjectGalleryBlocks.length > 0
			? nextProjectGalleryBlocks[0]
			: []
	];

	const router = useRouter();

	const isRepresentation = type === 'representation';

	const hasGalleryBlocks = slides?.length > 0;

	if (!hasGalleryBlocks || !slides) return null;

	const isFullBleedSlide =
		slides[activeSlideIndex].galleryComponent === 'fullBleedSlide';
	let slideType = isFullBleedSlide ? 'fullBleedSlide' : 'croppedSlide';

	const galleryCount = `(${activeSlideIndex + 1}/${slides.length - 1})`;

	const handleNextProject = () => {
		if (type === 'representation') {
			router.push(`/representation/${nextProjectSlug}`);
		}

		if (type === 'case-study') {
			router.push(`/case-studies/${nextProjectSlug}`);
		}
	};

	const handlePreviousProject = () => {
		if (type === 'representation') {
			router.push(`/representation/${prevProjectSlug}`);
		}

		if (type === 'case-study') {
			router.push(`/case-studies/${prevProjectSlug}`);
		}
	};

	return (
		<ProjectContentLayoutWrapper>
			{activeSlideIndex < slides.length - 1 && (
				<TitleWrapper>
					<Title>
						{slides[activeSlideIndex][slideType].slideTitle ||
							title}{' '}
						- {galleryCount}
					</Title>
				</TitleWrapper>
			)}
			<AnimatePresence>
				{activeSlideIndex < slides.length - 1 &&
					slides[activeSlideIndex][slideType].content && (
						<Inner
							variants={wrapperVariants}
							initial="hidden"
							animate="visible"
							exit="hidden"
						>
							<RichTextWrapper>
								<PortableText
									value={
										slides[activeSlideIndex][slideType]
											.content
									}
								/>
								<Hint $isActive={activeSlideIndex === 0}>
									Scroll down to continue reading
								</Hint>
							</RichTextWrapper>
						</Inner>
					)}
			</AnimatePresence>
			{activeSlideIndex < slides.length - 1 && (
				<PaginationWrapper>
					<PrevProjectLink
						className="type-h1"
						onClick={() => handlePreviousProject()}
					>
						{`←`} Prev {isRepresentation ? 'Artist' : 'Case'}
					</PrevProjectLink>
					<NextProjectLink
						className="type-h1"
						onClick={() => handleNextProject()}
					>
						Next {isRepresentation ? 'Artist' : 'Case'} {`→`}
					</NextProjectLink>
				</PaginationWrapper>
			)}
		</ProjectContentLayoutWrapper>
	);
};

export default ProjectContentLayout;
