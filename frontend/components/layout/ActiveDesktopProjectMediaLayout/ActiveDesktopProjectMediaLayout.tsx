import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

type Props = {
	children: React.ReactNode;
	index: number;
	setActiveSlideIndex: (index: number) => void;
};

const ActiveDesktopProjectMediaLayoutWrapper = styled.div``;

const ActiveDesktopProjectMediaLayout = (props: Props) => {
	const { children, index, setActiveSlideIndex } = props;

	const { ref, inView } = useInView({
		triggerOnce: false,
		threshold: 0.2,
		rootMargin: '-50px'
	});

	useEffect(() => {
		if (inView) {
			setActiveSlideIndex(index);
		}
	}, [inView]);

	return (
		<ActiveDesktopProjectMediaLayoutWrapper ref={ref}>
			{children}
		</ActiveDesktopProjectMediaLayoutWrapper>
	);
};

export default ActiveDesktopProjectMediaLayout;
