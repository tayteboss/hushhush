import styled from 'styled-components';
import {
	CaseStudyType,
	ClientType,
	RepresentationType
} from '../../../shared/types/types';
import MediaStack from '../../common/MediaStack';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

type Props = {
	activeSlideIndex: number;
	data: (ClientType | RepresentationType | CaseStudyType)[];
	type: 'clients' | 'representations' | 'case-study';
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

const CaseStudyMediaWrapper = styled.a`
	height: 100%;
	width: 100%;

	* {
		height: 100%;
		width: 100%;
	}
`;

const CursorPanel = styled.div`
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 60;
	height: 100%;
	width: 100%;
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

	return (
		<AnimatePresence>
			{data && (
				<MediaLayoutWrapper
					className={`media-layout`}
					variants={wrapperVariants}
					initial="hidden"
					animate="visible"
					exit="hidden"
					key={data[activeSlideIndex]?.title}
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
							href={`/representations/${
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
									/>
								)}
							</CaseStudyMediaWrapper>
						</Link>
					)}
				</MediaLayoutWrapper>
			)}
		</AnimatePresence>
	);
};

export default MediaLayout;
