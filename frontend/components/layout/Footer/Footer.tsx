import styled from 'styled-components';
import LogoIconSvg from '../../svgs/LogoIconSvg';
import pxToRem from '../../../utils/pxToRem';

const FooterWrapper = styled.footer`
	position: fixed;
	bottom: ${pxToRem(34)};
	left: ${pxToRem(25)};
	padding-left: ${pxToRem(9)};
	z-index: 100;

	@media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
		left: ${pxToRem(9)};
		bottom: ${pxToRem(57)};
	}
`;

const Footer = () => {
	return (
		<FooterWrapper>
			<LogoIconSvg colour="var(--fg-colour)" />
		</FooterWrapper>
	);
};

export default Footer;
