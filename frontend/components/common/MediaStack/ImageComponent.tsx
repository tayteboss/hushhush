import Image from 'next/image';
import styled from 'styled-components';
import { MediaType } from '../../../shared/types/types';
import useViewportWidth from '../../../hooks/useViewportWidth';

const ImageComponentWrapper = styled.div`
	position: relative;
	background-color: rgba(0, 0, 0, 0.1);
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

type Props = {
	data: MediaType;
	isPriority: boolean;
	inView: boolean;
};

const ImageComponent = (props: Props) => {
	const { data, isPriority, inView } = props;

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
				{imageUrl && (
					<Image
						src={imageUrl}
						alt={data?.image?.alt || ''}
						fill
						priority={isPriority}
						// blurDataURL={blurDataURL}
					/>
				)}
			</Inner>
		</ImageComponentWrapper>
	);
};

export default ImageComponent;
