import { NextSeo } from 'next-seo';
import styled from 'styled-components';
import LayoutWrapper from '../components/common/LayoutWrapper';

const PageWrapper = styled.div``;

const Inner = styled.div`
	height: 100vh;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Title = styled.h2`
	color: var(--colour-white);
`;

const Page = () => {
	return (
		<PageWrapper>
			<NextSeo title="404 | Sorry we couldn't find that page" />
			<LayoutWrapper>
				<Inner>
					<Title>Sorry, we couldn't find that page</Title>
				</Inner>
			</LayoutWrapper>
		</PageWrapper>
	);
};

export default Page;
