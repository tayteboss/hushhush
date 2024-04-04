import styled from 'styled-components';
import LogoIconSvg from '../../svgs/LogoIconSvg';
import pxToRem from '../../../utils/pxToRem';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const FooterWrapper = styled.footer<{ $isActive: boolean }>`
	position: fixed;
	bottom: ${pxToRem(34)};
	left: ${pxToRem(25)};
	padding-left: ${pxToRem(9)};
	z-index: 100;

	@media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
		left: ${pxToRem(9)};
		bottom: ${pxToRem(24)};
	}

	@media ${(props) => props.theme.mediaBreakpoints.mobile} {
		display: ${(props) => (props.$isActive ? 'flex' : 'none')};
	}
`;

const LinkTag = styled.a``;

const Footer = () => {
	const router = useRouter();

	const [isActive, setIsActive] = useState(true);

	useEffect(() => {
		if (router.pathname === '/representation/[...slug]') {
			setIsActive(false);
		} else {
			setIsActive(true);
		}
	}, [router]);

	return (
		<FooterWrapper $isActive={isActive}>
			<Link href="/" passHref legacyBehavior>
				<LinkTag>
					<LogoIconSvg colour="var(--fg-colour)" />
				</LinkTag>
			</Link>
		</FooterWrapper>
	);
};

export default Footer;
