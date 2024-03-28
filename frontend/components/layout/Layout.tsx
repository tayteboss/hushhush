import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import { ReactNode } from 'react';
import { ReactLenis, useLenis } from '@studio-freight/react-lenis';

const Main = styled.main``;

type Props = {
	children: ReactNode;
};

const Layout = (props: Props) => {
	const { children } = props;

	const lenis = useLenis(({ scroll }) => {});

	return (
		<>
			<Header />
			<ReactLenis root>
				<Main>{children}</Main>
			</ReactLenis>
			<Footer />
		</>
	);
};

export default Layout;
