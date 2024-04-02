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

const RepresentationMediaWrapper = styled.a`
	width: 33.333vw;

	.image-component-wrapper,
	.video-component-wrapper {
		padding-top: 133.8%;
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

	console.log('data', data);

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
						<ClientMediaWrapper>
							{data[activeSlideIndex]?.media && (
								<MediaStack
									data={data[activeSlideIndex].media}
								/>
							)}
						</ClientMediaWrapper>
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
							<RepresentationMediaWrapper>
								{data[activeSlideIndex]?.media && (
									<MediaStack
										data={data[activeSlideIndex].media}
									/>
								)}
							</RepresentationMediaWrapper>
						</Link>
					)}
				</MediaLayoutWrapper>
			)}
		</AnimatePresence>
	);
};

export default MediaLayout;
