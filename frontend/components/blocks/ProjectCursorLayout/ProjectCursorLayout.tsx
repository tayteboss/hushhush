import debounce from 'lodash.debounce';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

type Props = {
	nextProjectSlug?: string;
	prevProjectSlug?: string;
	type: 'representation-project' | 'case-study-project';
	data: any;
	activeSlideIndex: number;
	setActiveSlideIndex?: (index: number) => void;
};

const ProjectCursorLayoutWrapper = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	height: 100dvh;
	width: 100%;
	z-index: 50;
	display: flex;
	flex-direction: column;

	@media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
		display: none;
	}
`;

const ProjectCursorTop = styled.div`
	display: flex;
	justify-content: space-between;
	height: 70vh;
`;

const ProjectCursorBottom = styled.div`
	height: 30vh;
`;

const HalfCursorTrigger = styled.div`
	width: 50%;
	height: 100%;
`;

const FullCursorTrigger = styled.div`
	width: 100%;
	height: 100%;
`;

const ProjectCursorLayout = (props: Props) => {
	const {
		nextProjectSlug,
		prevProjectSlug,
		type,
		data,
		activeSlideIndex,
		setActiveSlideIndex
	} = props;

	const hasData = data && data?.length > 0;

	if (!hasData) return <></>;

	const router = useRouter();

	const handleNextProject = () => {
		if (type === 'representation-project') {
			router.push(`/representation/${nextProjectSlug}`);
		}

		if (type === 'case-study-project') {
			router.push(`/case-studies/${nextProjectSlug}`);
		}
	};

	const handlePreviousProject = () => {
		if (type === 'representation-project') {
			router.push(`/representation/${prevProjectSlug}`);
		}

		if (type === 'case-study-project') {
			router.push(`/case-studies/${prevProjectSlug}`);
		}
	};

	const [isScrollingAllowed, setIsScrollingAllowed] = useState(true);

	useEffect(() => {
		const handleWheel = (event: WheelEvent) => {
			if (!isScrollingAllowed) return;

			if (event.deltaY > 0) {
				// Scrolling down
				setActiveSlideIndex((prevIndex) =>
					prevIndex + 1 === data.length ? 0 : prevIndex + 1
				);
			} else if (event.deltaY < 0) {
				// Scrolling up
				setActiveSlideIndex((prevIndex) =>
					prevIndex - 1 < 0 ? data.length - 1 : prevIndex - 1
				);
			}

			setIsScrollingAllowed(false);
			setTimeout(() => setIsScrollingAllowed(true), 1500);
		};

		window.addEventListener('wheel', handleWheel, {
			passive: false
		});

		return () => {
			window.removeEventListener('wheel', handleWheel);
		};
	}, [data?.length, isScrollingAllowed]);

	return (
		<ProjectCursorLayoutWrapper className="project-cursor-layout">
			<ProjectCursorTop>
				<HalfCursorTrigger
					className="cursor-text"
					data-text={
						type === 'representation-project'
							? 'Prev talent <'
							: 'Prev study <'
					}
					onClick={() => {
						handlePreviousProject();
					}}
				/>
				<HalfCursorTrigger
					className="cursor-text"
					data-text={
						type === 'representation-project'
							? 'Next talent >'
							: 'Next study >'
					}
					onClick={() => {
						handleNextProject();
					}}
				/>
			</ProjectCursorTop>
			<ProjectCursorBottom>
				<FullCursorTrigger
					className="cursor-text"
					data-text="Next slide"
					data-type="prev"
					onClick={() =>
						setActiveSlideIndex &&
						setActiveSlideIndex(
							activeSlideIndex + 1 === data.length
								? 0
								: activeSlideIndex + 1
						)
					}
				/>
			</ProjectCursorBottom>
		</ProjectCursorLayoutWrapper>
	);
};

export default ProjectCursorLayout;
