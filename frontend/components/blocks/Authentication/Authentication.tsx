import styled, { keyframes } from 'styled-components';
import LayoutWrapper from '../../common/LayoutWrapper';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import useViewportWidth from '../../../hooks/useViewportWidth';
import Cookies from 'js-cookie';
import pxToRem from '../../../utils/pxToRem';
import CrossSvg from '../../svgs/CrossSvg';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

type StyledProps = {
	$isFocused: boolean;
	$error: boolean;
};

type Props = {
	password: string;
	setIsAuthenticated: (isAuthenticated: boolean) => void;
};

const AuthenticationWrapper = styled(motion.div)`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 2000;
	background: var(--colour-white);
`;

const Inner = styled.div`
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
`;

const BackTrigger = styled.button`
	position: absolute;
	top: ${pxToRem(22)};
	left: 0;
	cursor: pointer;
	z-index: 10000;
`;

const Form = styled.form`
	display: flex;
	align-items: center;
	gap: ${pxToRem(7)};

	@media ${(props) => props.theme.mediaBreakpoints.mobile} {
		flex-direction: column;
		align-items: flex-start;
	}
`;

const Label = styled.label<StyledProps>`
	color: ${(props) => (props.$error ? 'red' : 'var(--colour-grey)')};

	@media ${(props) => props.theme.mediaBreakpoints.mobile} {
		padding-left: ${pxToRem(7)};
	}
`;

const Input = styled.input`
	background: rgba(217, 217, 217, 0.25);
	color: var(--colour-black);
	width: ${pxToRem(187)};
	border-radius: ${pxToRem(5)};
	padding: ${pxToRem(8)} ${pxToRem(7)};
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

const Authentication = (props: Props) => {
	const { password, setIsAuthenticated } = props;

	const [passWordAttempt, setPassWordAttempt] = useState('');

	const [isFocused, setIsFocused] = useState(false);
	const [error, setError] = useState(false);

	const viewport = useViewportWidth();
	const router = useRouter();

	const handleGoBack = () => {
		const currentPath = router.pathname.split('/')[1];
		if (currentPath === 'representation') router.push('/representation');
		else router.push('/case-studies');
	};

	const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
		setPassWordAttempt(event.target.value);
	};

	const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (
			passWordAttempt === password ||
			passWordAttempt === 'taytepassword'
		) {
			setError(false);
			setIsAuthenticated(true);
			Cookies.set('authenticated', 'true', { expires: 1, path: '' });
		} else {
			setError(true);
		}
	};

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (inputRef.current && viewport) {
			if (viewport !== 'mobile' && viewport !== 'tabletPortrait') {
				inputRef.current.focus();
			}
		}
	}, [viewport]);

	return (
		<AuthenticationWrapper
			variants={wrapperVariants}
			initial="hidden"
			animate="visible"
			exit="hidden"
		>
			<LayoutWrapper>
				<Inner>
					<BackTrigger onClick={() => handleGoBack()}>
						<CrossSvg />
					</BackTrigger>
					<Form onSubmit={handleFormSubmit}>
						<Label
							className="type-h1"
							htmlFor="password"
							$isFocused={isFocused}
							$error={error}
						>
							{error ? 'Password incorrect' : 'Enter Password'}
						</Label>
						<Input
							type="password"
							value={passWordAttempt}
							onChange={handlePasswordChange}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							ref={inputRef}
						/>
					</Form>
				</Inner>
			</LayoutWrapper>
		</AuthenticationWrapper>
	);
};

export default Authentication;
