import Image from 'next/image';
import styled from 'styled-components';
import { MediaType } from '../../../shared/types/types';
import useViewportWidth from '../../../hooks/useViewportWidth';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const ImageComponentWrapper = styled.div`
	position: relative;
	background-color: var(--colour-green);
	overflow: hidden;

	transition: all var(--transition-speed-slow) var(--transition-ease);
	transition-delay: 2000ms;

	mux-player,
	img {
		object-fit: cover;
		transition: all var(--transition-speed-slow) var(--transition-ease);
	}

	&::after {
		content: '';
		position: absolute;
		inset: 0;
		height: 100%;
		width: 100%;
		background: var(--fg-colour);
		z-index: -1;
		opacity: 0.3;
	}
`;

const Inner = styled.div`
	position: absolute;
	inset: 0;
	height: 100%;
	width: 100%;
`;

const PosterImage = styled(motion.div)`
	position: absolute;
	inset: 0;
	height: 100%;
	width: 100%;
	z-index: 3;

	&::before {
		content: '';
		position: absolute;
		inset: 0;
		height: 100%;
		width: 100%;
		background: var(--green);
		z-index: 1;
	}
`;

const FullImage = styled.div`
	position: absolute;
	inset: 0;
	height: 100%;
	width: 100%;
	z-index: 2;
`;

type Props = {
	data: MediaType;
	isPriority: boolean;
	inView: boolean;
	isFullScreen: boolean;
};

const wrapperVariants = {
	hidden: {
		opacity: 0,
		transition: {
			duration: 0.1,
			ease: 'easeInOut'
		}
	},
	visible: {
		opacity: 1,
		transition: {
			duration: 0.1,
			ease: 'easeInOut'
		}
	}
};

const ImageComponent = (props: Props) => {
	const { data, isPriority, inView, isFullScreen } = props;

	const [isComplete, setIsComplete] = useState(false);

	const viewport = useViewportWidth();
	const isMobile = viewport === 'mobile';

	const imageUrl =
		isMobile && data?.mobileImage?.asset?.url
			? data.mobileImage.asset.url
			: data?.image?.asset?.url;
	const blurDataURL =
		isMobile && data?.mobileImage?.asset?.metadata?.lqip
			? data.mobileImage.asset.metadata.lqip
			: data?.image?.asset?.metadata?.lqip;

	return (
		<ImageComponentWrapper className="image-component-wrapper">
			<Inner>
				<AnimatePresence>
					{!isComplete && (
						<PosterImage
							variants={wrapperVariants}
							initial="hidden"
							animate="visible"
							exit="hidden"
						>
							<Image
								src={blurDataURL}
								alt={data?.image?.alt || ''}
								fill
								priority={true}
								blurDataURL={blurDataURL}
								sizes={isFullScreen ? '100vw' : '50vw'}
							/>
						</PosterImage>
					)}
				</AnimatePresence>
				{imageUrl && (
					<FullImage>
						<Image
							src={imageUrl}
							alt={data?.image?.alt || ''}
							fill
							priority={isPriority}
							onLoad={() => setIsComplete(true)}
						/>
					</FullImage>
				)}
			</Inner>
		</ImageComponentWrapper>
	);
};

export default ImageComponent;
