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
	padding-top: ${pxToRem(66)};
	height: 100%;
	width: 100%;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
`;

const LogoWrapper = styled.div`
	margin-bottom: ${pxToRem(10)};
	padding-left: ${pxToRem(10)};
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
	const { data, mobileData, introStatements } = props;

	const hasData = data?.asset?.playbackId;

	if (!hasData) {
		return null;
	}

	const [hasVisited, setHasVisited] = useState<boolean>(false);
	const [showVideo, setShowVideo] = useState<boolean>(false);
	const [showTextBanners, setShowTextBanners] = useState<boolean>(false);
	const [finishSequence, setFinishSequence] = useState(false);

	useEffect(() => {
		const hasCookies = Cookies.get('visited');

		if (hasCookies) {
			setHasVisited(true);
			setFinishSequence(true);
		} else {
			setShowVideo(true);
		}
	}, []);

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
							onClick={() => setFinishSequence(true)}
							variants={wrapperVariants}
							initial="hidden"
							animate="visible"
							exit="hidden"
							key="content-wrapper"
						>
							<LayoutWrapper>
								<LogoWrapper>
									<LogoWordmarkSvg colour="#FFFFFF" />
								</LogoWrapper>
								<LandingTyper
									data={introStatements}
									setFinishSequence={setFinishSequence}
								/>
							</LayoutWrapper>
						</ContentWrapper>
					)}
				</LandingSequenceWrapper>
			)}
		</AnimatePresence>
	);
};

export default LandingSequence;
