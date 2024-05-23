import styled from 'styled-components';
import { StatementType } from '../../../shared/types/types';
import pxToRem from '../../../utils/pxToRem';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

type WordProps = {
	data: StatementType;
	setStatementIndex: (index: number) => void;
	statementIndex: number;
	index: number;
	isFinal: boolean;
	setFinishSequence: (finishSequence: boolean) => void;
};

type Props = {
	data: StatementType[];
	setFinishSequence: (finishSequence: boolean) => void;
};

const LandingTyperWrapper = styled.div`
	position: relative;
	display: inline-block;
	min-width: 40px;
	min-height: 34px;

	&::before {
		content: '';
		background: #d9d9d9;
		opacity: 0.1;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 5px;
		z-index: 1;
	}
`;

const MotionWrapper = styled(motion.div)`
	padding: ${pxToRem(8)} ${pxToRem(10)} ${pxToRem(5)};

	@media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
		line-height: ${pxToRem(10)};
	}
`;

const Word = styled.span`
	display: inline-block;
	white-space: pre;
	overflow: hidden;
`;

const Letter = styled(motion.span)<{ $inlineBlock: boolean }>`
	display: ${(props) => props.$inlineBlock && 'inline-block'};
`;

const wrapperVariants = {
	hidden: {
		opacity: 0,
		height: 0,
		transition: {
			duration: 0.4,
			staggerChildren: 0.03,
			when: 'afterChildren'
		}
	},
	visible: {
		opacity: 1,
		height: 'auto',
		transition: {
			duration: 0.1,
			staggerChildren: 0.03,
			when: 'beforeChildren'
		}
	},
	exit: {
		opacity: 0,
		height: 0,
		transition: {
			duration: 0.4,
			staggerChildren: 0.03,
			when: 'beforeChildren'
		}
	}
};

const childVariants = {
	hidden: {
		opacity: 0,
		width: 0,
		transition: {
			opacity: { duration: 0.08, ease: 'easeInOut' },
			width: { duration: 0.2, ease: 'easeInOut' }
		}
	},
	visible: {
		opacity: 1,
		width: 'auto',
		transition: {
			opacity: { duration: 0.1, ease: 'easeInOut' },
			width: { duration: 0.1, ease: 'easeInOut' }
		}
	}
};

const Statement = (props: WordProps) => {
	const {
		data,
		setStatementIndex,
		statementIndex,
		index,
		isFinal,
		setFinishSequence
	} = props;

	const [animationState, setAnimationState] = useState<
		'hidden' | 'visible' | 'exit'
	>('visible');

	const words = data?.statement.split(' ').map((word) => [...word, ' ']);

	const onAnimationComplete = () => {
		const timer = setTimeout(() => {
			if (isFinal) {
				const finalTimer = setTimeout(() => {
					setFinishSequence(true);
					clearTimeout(finalTimer);
				}, 100);
			} else {
				setAnimationState('exit');
			}
			const nextTimer = setTimeout(() => {
				setStatementIndex(statementIndex + 1);
				setAnimationState('visible');
				clearTimeout(nextTimer);
			}, 300);
			clearTimeout(timer);
		}, 1000);
		return () => clearTimeout(timer);
	};

	return (
		<MotionWrapper
			variants={wrapperVariants}
			initial="hidden"
			animate={animationState}
			exit="exit"
			key={`statement-${index}`}
			onAnimationComplete={onAnimationComplete}
			layout
		>
			{words.map((word, i) => (
				<Word key={i}>
					{word.map((letter, j) => (
						<Letter
							key={j}
							variants={childVariants}
							$inlineBlock={letter !== ' '}
						>
							{letter}
						</Letter>
					))}
				</Word>
			))}
		</MotionWrapper>
	);
};

const LandingTyper = (props: Props) => {
	const { data, setFinishSequence } = props;

	const [statementIndex, setStatementIndex] = useState(0);

	const hasData = data?.length > 0;
	const dataLength = data?.length;

	return (
		<AnimatePresence mode="wait">
			{hasData && (
				<LandingTyperWrapper>
					{data[statementIndex] && (
						<Statement
							data={data[statementIndex]}
							setStatementIndex={setStatementIndex}
							statementIndex={statementIndex}
							index={statementIndex}
							isFinal={statementIndex === dataLength - 1}
							setFinishSequence={setFinishSequence}
						/>
					)}
				</LandingTyperWrapper>
			)}
		</AnimatePresence>
	);
};

export default LandingTyper;
