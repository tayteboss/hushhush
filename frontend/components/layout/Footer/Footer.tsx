import styled from 'styled-components';
import LogoIconSvg from '../../svgs/LogoIconSvg';
import pxToRem from '../../../utils/pxToRem';
import Link from 'next/link';

const FooterWrapper = styled.footer`
	position: fixed;
	bottom: ${pxToRem(34)};
	left: ${pxToRem(25)};
	padding-left: ${pxToRem(9)};
	z-index: 100;

	@media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
		left: ${pxToRem(9)};
		bottom: ${pxToRem(24)};
	}
`;

const LinkTag = styled.a``;

const Footer = () => {
	return (
		<FooterWrapper>
			<Link href="/" passHref legacyBehavior>
				<LinkTag>
					<LogoIconSvg colour="var(--fg-colour)" />
				</LinkTag>
			</Link>
		</FooterWrapper>
	);
};

export default Footer;
