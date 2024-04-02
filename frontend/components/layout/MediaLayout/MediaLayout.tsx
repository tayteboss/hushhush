import styled from 'styled-components';
import { ClientType, RepresentationType } from '../../../shared/types/types';
import MediaStack from '../../common/MediaStack';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

type Props = {
	activeSlideIndex: number;
	data: (ClientType | RepresentationType)[];
	type: 'clients' | 'representations';
};

const MediaLayoutWrapper = styled(motion.section)`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	z-index: 50;
`;

const MediaWrapper = styled.div`
	height: 100%;
	width: 100%;

	* {
		height: 100%;
		width: 100%;
	}
`;

const MediaWrapperLink = styled.a`
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

const MediaLayout = (props: Props) => {
	const { activeSlideIndex, data, type } = props;

	let cursorDataTitle = '';

	if (type === 'representations') {
		cursorDataTitle = 'See representative';
	}

	return (
		<AnimatePresence>
			{data && (
				<MediaLayoutWrapper
					className={`media-layout ${
						type !== 'clients' && 'cursor-text'
					}`}
					variants={wrapperVariants}
					initial="hidden"
					animate="visible"
					exit="hidden"
					key={data[activeSlideIndex]?.title}
					data-title={cursorDataTitle}
				>
					{type === 'clients' && (
						<MediaWrapper>
							{data[activeSlideIndex]?.media && (
								<MediaStack
									data={data[activeSlideIndex].media}
								/>
							)}
						</MediaWrapper>
					)}
					{type === 'representations' && (
						<Link
							href={
								(data[activeSlideIndex] as RepresentationType)
									?.slug?.current
							}
							passHref
							legacyBehavior
						>
							<MediaWrapperLink>
								{data[activeSlideIndex]?.media && (
									<MediaStack
										data={data[activeSlideIndex].media}
									/>
								)}
							</MediaWrapperLink>
						</Link>
					)}
				</MediaLayoutWrapper>
			)}
		</AnimatePresence>
	);
};

export default MediaLayout;
