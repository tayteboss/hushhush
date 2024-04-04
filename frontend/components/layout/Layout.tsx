import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
	setGreenTheme,
	setGreyTheme,
	setProjectTheme,
	setWhiteTheme
} from '../../utils/setTheme';

const Main = styled.main`
	height: 100dvh;
`;

type Props = {
	children: ReactNode;
};

const Layout = (props: Props) => {
	const { children } = props;

	const router = useRouter();

	const checkRoute = () => {
		if (router.pathname === '/') {
			setWhiteTheme();
		} else if (router.pathname === '/representation') {
			setGreyTheme();
		} else if (router.pathname === '/representation/[...slug]') {
			setProjectTheme();
		} else if (router.pathname.includes('/case-studies')) {
			setWhiteTheme();
		} else if (router.pathname === '/about') {
			setGreenTheme();
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
