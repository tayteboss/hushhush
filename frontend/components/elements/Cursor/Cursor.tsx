import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import { useMousePosition } from '../../../hooks/useMousePosition';
import pxToRem from '../../../utils/pxToRem';

type Props = {
	cursorRefresh: () => void;
};

type StyledProps = {
	$isHoveringLink?: boolean;
	$isOnDevice?: boolean;
	$isHoveringTextLink?: boolean;
};

const CursorWrapper = styled.div<StyledProps>`
	height: 27px;
	width: 27px;
	z-index: 1000;
	position: fixed;
	display: ${(props) => (props.$isOnDevice ? 'none' : 'block')};
	mix-blend-mode: normal;

	transition: opacity ${(props) => props.theme.transitionSpeed.default} ease;
	transition-delay: 500ms;

	@media ${(props) => props.theme.mediaBreakpoints.mobile} {
		display: none;
	}
`;

const CursorRing = styled(motion.div)<StyledProps>`
	position: fixed;
	display: flex;
	flex-flow: row;
	align-content: center;
	justify-content: center;
	top: 0;
	left: 0;
	pointer-events: none;
	text-align: center;
	z-index: 2;
	display: flex;
	justify-content: center;
	align-items: center;

	transition: height 300ms ease, width 300ms ease, background 200ms ease,
		top 300ms ease, left 300ms ease, border-radius 300ms ease;
`;

const Text = styled(motion.div)`
	line-height: 1;
	color: var(--fg-colour);
	position: absolute;
	text-align: right;
	top: -14px;
	right: 15px;
	white-space: nowrap;
`;

const Chevron = styled(motion.div)`
	line-height: 1;
	color: var(--fg-colour);
	position: absolute;
	text-align: right;
	top: -14px;
	right: 5px;
	white-space: nowrap;
	transform: rotate(90deg);
`;

const Cursor = ({ cursorRefresh }: Props) => {
	const [isHoveringLink, setIsHoveringLink] = useState(false);
	const [isHoveringTextLink, setIsHoveringTextLink] = useState<
		boolean | string
	>(false);
	const [isOnDevice, setIsOnDevice] = useState(false);
	const [isHoveringPrevLink, setIsHoveringPrevLink] = useState(false);

	const position = useMousePosition();
	const router = useRouter();

	let mouseXPosition = position.x;
	let mouseYPosition = position.y;

	const variantsWrapper = {
		visible: {
			x: mouseXPosition,
			y: mouseYPosition,
			transition: {
				type: 'spring',
				mass: 0.01,
				stiffness: 800,
				damping: 20,
				ease: 'linear'
			}
		}
	};

	const textVariants = {
		hidden: {
			opacity: 0,
			transition: {
				duration: 0.2,
				ease: 'easeInOut'
			}
		},
		visible: {
			opacity: 1,
			transition: {
				duration: 0.2,
				ease: 'easeInOut'
			}
		}
	};

	const clearCursor = () => {
		setIsHoveringLink(false);
		setIsHoveringTextLink(false);
		setIsOnDevice(false);
	};

	useEffect(() => {
		const aTags = document.querySelectorAll('a');
		const buttonTags = document.querySelectorAll('button');
		const cursorLinks = document.querySelectorAll('.cursor-link');
		const textLinks = document.querySelectorAll('.cursor-text');

		aTags.forEach((link) => {
			link.addEventListener('mouseenter', () => {
				setIsHoveringLink(true);
			});
			link.addEventListener('mouseleave', () => {
				setIsHoveringLink(false);
			});
		});

		buttonTags.forEach((link) => {
			link.addEventListener('mouseenter', () => {
				setIsHoveringLink(true);
			});
			link.addEventListener('mouseleave', () => {
				setIsHoveringLink(false);
			});
		});

		cursorLinks.forEach((link) => {
			link.addEventListener('mouseenter', () => {
				setIsHoveringLink(true);
			});
			link.addEventListener('mouseleave', () => {
				setIsHoveringLink(false);
			});
		});

		textLinks.forEach((link) => {
			link.addEventListener('mouseenter', (e) => {
				if (!e || !e.target) return;
				const title = (e.target as HTMLElement).getAttribute(
					'data-text'
				);
				const type = (e.target as HTMLElement).getAttribute(
					'data-type'
				);
				setIsHoveringTextLink(title);

				if (type === 'prev') {
					setIsHoveringPrevLink(true);
				} else {
					setIsHoveringPrevLink(false);
				}
			});
			link.addEventListener('mouseleave', () => {
				setIsHoveringTextLink(false);
				setIsHoveringPrevLink(false);
			});
			link.addEventListener('click', () => {
				setIsHoveringTextLink(false);
				setIsHoveringPrevLink(false);
			});
		});

		// checking if on a device
		const ua = navigator.userAgent;
		if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
			setIsOnDevice(true);
		} else if (
			/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
				ua
			)
		) {
			setIsOnDevice(true);
		}

		return function cleanUp() {
			setIsHoveringLink(false);
			setIsOnDevice(false);
		};
	}, [cursorRefresh]);

	useEffect(() => {
		clearCursor();
	}, [router.pathname, router.asPath, router.query.slug, cursorRefresh]);

	return (
		<>
			<CursorWrapper $isOnDevice={isOnDevice} className="cursor-wrapper">
				<CursorRing
					$isHoveringLink={isHoveringLink}
					$isHoveringTextLink={!!isHoveringTextLink}
					variants={variantsWrapper}
					animate="visible"
					layout
				>
					<AnimatePresence>
						{isHoveringTextLink && (
							<Text
								key={1}
								variants={textVariants}
								initial="hidden"
								animate="visible"
								exit="hidden"
							>
								{isHoveringTextLink}
							</Text>
						)}
						{isHoveringPrevLink && (
							<Chevron
								key={2}
								variants={textVariants}
								initial="hidden"
								animate="visible"
								exit="hidden"
							>
								{`>`}
							</Chevron>
						)}
					</AnimatePresence>
				</CursorRing>
			</CursorWrapper>
		</>
	);
};

export default Cursor;
