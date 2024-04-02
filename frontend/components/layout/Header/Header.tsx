import styled from 'styled-components';
import LogoWordmarkSvg from '../../svgs/LogoWordmarkSvg';
import Link from 'next/link';
import pxToRem from '../../../utils/pxToRem';
import useActiveLink from '../../../hooks/useActiveLink';

const HeaderWrapper = styled.header`
	position: fixed;
	top: ${pxToRem(34)};
	left: ${pxToRem(25)};
	z-index: 100;
	display: flex;
	flex-direction: column;
	gap: ${pxToRem(10)};

	@media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
		top: ${pxToRem(24)};
		left: ${pxToRem(9)};
	}
`;

const LogoWrapper = styled.div`
	padding-left: ${pxToRem(9)};
`;

const MenuWrapper = styled.div`
	padding: ${pxToRem(7)} ${pxToRem(9)};
	background: var(--blurred-bg-colour);
	backdrop-filter: blur(30px);
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	border-radius: ${pxToRem(5)};
`;

const MenuLink = styled.a<{ $isActive: boolean }>`
	opacity: ${({ $isActive }) => ($isActive ? 1 : 0.4)};
	text-decoration: none;
	color: var(--fg-colour);

	transition: all var(--transition-speed-default) var(--transition-ease);

	&:hover {
		opacity: 1;
	}
`;

const Divider = styled.div`
	color: var(--fg-colour);
	opacity: 0.4;
`;

const Header = () => {
	return (
		<HeaderWrapper className="header">
			<LogoWrapper>
				<LogoWordmarkSvg colour="var(--fg-colour)" />
			</LogoWrapper>
			<MenuWrapper>
				<Link href="/" passHref legacyBehavior>
					<MenuLink
						className="type-p"
						$isActive={useActiveLink() === 'home'}
					>
						selected clients
					</MenuLink>
				</Link>
				<Link href="/representation" passHref legacyBehavior>
					<MenuLink
						className="type-p"
						$isActive={useActiveLink() === 'representation'}
					>
						representation
					</MenuLink>
				</Link>
				<Link href="/case-study" passHref legacyBehavior>
					<MenuLink
						className="type-p"
						$isActive={useActiveLink() === 'case-study'}
					>
						case studies
					</MenuLink>
				</Link>
				<Divider className="type-p">----------------</Divider>
				<Link href="/about" passHref legacyBehavior>
					<MenuLink
						className="type-p"
						$isActive={useActiveLink() === 'about'}
					>
						about
					</MenuLink>
				</Link>
			</MenuWrapper>
		</HeaderWrapper>
	);
};

export default Header;
