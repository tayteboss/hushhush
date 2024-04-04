import styled from 'styled-components';
import pxToRem from '../../../utils/pxToRem';
import {
	CroppedSlideType,
	FullBleedSlideType
} from '../../../shared/types/types';
import { PortableText } from '@portabletext/react';
import { AnimatePresence, motion } from 'framer-motion';

type Props = {
	title: string;
	galleryBlocks: (FullBleedSlideType | CroppedSlideType)[];
	activeSlideIndex: number;
};

const ProjectContentLayoutWrapper = styled.div`
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
	}
`;

const RichTextWrapper = styled.div`
	* {
		color: var(--fg-colour);
	}
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
	const { title, galleryBlocks, activeSlideIndex } = props;

	console.log('galleryBlocks', galleryBlocks);

	const hasGalleryBlocks = galleryBlocks?.length > 0;

	if (!hasGalleryBlocks || !galleryBlocks) return null;

	const isFullBleedSlide =
		galleryBlocks[activeSlideIndex].galleryComponent === 'fullBleedSlide';
	let slideType = isFullBleedSlide ? 'fullBleedSlide' : 'croppedSlide';

	const galleryCount = `(${activeSlideIndex + 1}/${galleryBlocks.length})`;

	return (
		<ProjectContentLayoutWrapper>
			<Title>
				{galleryBlocks[activeSlideIndex][slideType].slideTitle || title}{' '}
				- {galleryCount}
			</Title>
			<AnimatePresence>
				{galleryBlocks[activeSlideIndex][slideType].content && (
					<Inner
						variants={wrapperVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
					>
						<RichTextWrapper>
							<PortableText
								value={
									galleryBlocks[activeSlideIndex][slideType]
										.content
								}
							/>
						</RichTextWrapper>
					</Inner>
				)}
			</AnimatePresence>
		</ProjectContentLayoutWrapper>
	);
};

export default ProjectContentLayout;
