import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { theme } from '../../styles/theme';

const Main = styled.main`
	height: 100dvh;
`;

type Props = {
	children: ReactNode;
};

const Layout = (props: Props) => {
	const { children } = props;

	const router = useRouter();

	const setWhiteTheme = () => {
		document.documentElement.style.setProperty(
			'--fg-colour',
			theme.colours.white
		);
		document.documentElement.style.setProperty(
			'--bg-colour',
			theme.colours.green
		);
		document.documentElement.style.setProperty(
			'--blurred-bg-colour',
			'rgba(217, 217, 217, 0.1)'
		);
	};

	const setGreyTheme = () => {
		document.documentElement.style.setProperty(
			'--fg-colour',
			theme.colours.grey
		);
		document.documentElement.style.setProperty(
			'--bg-colour',
			theme.colours.white
		);
		document.documentElement.style.setProperty(
			'--blurred-bg-colour',
			'rgba(217, 217, 217, 0.25)'
		);
	};

	const checkRoute = () => {
		if (router.pathname === '/') {
			setWhiteTheme();
		} else if (router.pathname === '/representation') {
			setGreyTheme();
		} else if (router.pathname.includes('/case-studies')) {
			setWhiteTheme();
		} else if (router.pathname === '/about') {
			setGreyTheme();
		} else {
			setWhiteTheme();
		}
	};

	useEffect(() => {
		checkRoute();
	}, [router]);

	return (
		<>
			<Header />
			<Main className="main">{children}</Main>
			<Footer />
		</>
	);
};

export default Layout;
