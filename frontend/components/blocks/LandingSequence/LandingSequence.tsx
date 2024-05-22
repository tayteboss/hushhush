import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import MuxPlayer from '@mux/mux-player-react/lazy';
import { StatementType, VideoType } from '../../../shared/types/types';
import useViewportWidth from '../../../hooks/useViewportWidth';
import { AnimatePresence, motion } from 'framer-motion';
import LayoutWrapper from '../../common/LayoutWrapper';
import LogoWordmarkSvg from '../../svgs/LogoWordmarkSvg';
import LandingTyper from '../../elements/LandingTyper';
import pxToRem from '../../../utils/pxToRem';

type Props = {
	data: VideoType;
	mobileData: VideoType;
	introStatements: StatementType[];
	cursorRefresh: () => void;
};

const LandingSequenceWrapper = styled(motion.section)`
	height: 100dvh;
	width: 100%;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1000;
	background: var(--colour-green);
`;

const MediaWrapper = styled(motion.div)`
	height: 100%;
	width: 100%;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;

	mux-player {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

const ContentWrapper = styled(motion.div)`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 1;

	@media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
		padding-top: ${pxToRem(66)};
		top: 0;
		left: 0;
		transform: translate(0, 0);
	}
`;

const ContentInner = styled.div`
	display: flex;
	align-items: center;
	gap: ${pxToRem(16)};

	@media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
		flex-direction: column;
		align-items: flex-start;
		gap: ${pxToRem(10)};
	}
`;

const LogoWrapper = styled.div`
	@media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
		padding-left: ${pxToRem(10)};

		svg {
			width: ${pxToRem(105)};
			height: auto;
		}
	}
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

const LandingSequence = (props: Props) => {
	const { data, mobileData, introStatements, cursorRefresh } = props;

	const hasData = data?.asset?.playbackId;

	const [hasVisited, setHasVisited] = useState<boolean>(false);
	const [showVideo, setShowVideo] = useState<boolean>(!!hasData);
	const [showTextBanners, setShowTextBanners] = useState<boolean>(!hasData);
	const [finishSequence, setFinishSequence] = useState(false);

	useEffect(() => {
		cursorRefresh();
	}, [showTextBanners]);

	useEffect(() => {
		const hasCookies = Cookies.get('visited');

		if (hasCookies) {
			setHasVisited(true);
			setFinishSequence(true);
		} else {
			if (hasData) {
				setShowVideo(true);
			}
			cursorRefresh();
		}
	}, [hasData]);

	const viewport = useViewportWidth();
	const isMobile = viewport === 'mobile';

	const playbackId = isMobile
		? mobileData.asset.playbackId
		: data?.asset?.playbackId;
	const posterUrl = isMobile
		? `https://image.mux.com/${mobileData.asset.playbackId}/thumbnail.png?width=214&height=121&time=1`
		: `https://image.mux.com/${data?.asset?.playbackId}/thumbnail.png?width=214&height=121&time=1`;

	return (
		<AnimatePresence initial={true} mode="wait">
			{!hasVisited && !finishSequence && (
				<LandingSequenceWrapper
					variants={wrapperVariants}
					initial="hidden"
					animate="visible"
					exit="hidden"
					key="landing-sequence-wrapper"
					onClick={() => {
						if (showTextBanners) {
							setShowVideo(false);
							setShowTextBanners(false);
							setFinishSequence(true);
						}
					}}
				>
					{showVideo && (
						<MediaWrapper
							variants={wrapperVariants}
							initial="hidden"
							animate="visible"
							exit="hidden"
							key="media-wrapper"
							onClick={() => {
								setShowVideo(false);
								setShowTextBanners(true);
							}}
							className="cursor-text"
							data-text="Click to continue"
						>
							<MuxPlayer
								streamType="on-demand"
								playbackId={playbackId}
								autoPlay="muted"
								loop={false}
								thumbnailTime={1}
								loading="page"
								preload="auto"
								muted
								playsInline={true}
								poster={posterUrl}
								onEnded={() => {
									setShowVideo(false);
									setShowTextBanners(true);
								}}
							/>
						</MediaWrapper>
					)}
					{showTextBanners && (
						<ContentWrapper
							variants={wrapperVariants}
							initial="hidden"
							animate="visible"
							exit="hidden"
							key="content-wrapper"
						>
							<LayoutWrapper>
								<ContentInner>
									<LogoWrapper>
										<LogoWordmarkSvg colour="#FFFFFF" />
									</LogoWrapper>
									<LandingTyper
										data={introStatements}
										setFinishSequence={setFinishSequence}
									/>
								</ContentInner>
							</LayoutWrapper>
						</ContentWrapper>
					)}
				</LandingSequenceWrapper>
			)}
		</AnimatePresence>
	);
};

export default LandingSequence;
