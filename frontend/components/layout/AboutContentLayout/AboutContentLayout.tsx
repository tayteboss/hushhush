import styled from 'styled-components';
import pxToRem from '../../../utils/pxToRem';
import { ButtonType } from '../../../shared/types/types';
import { useEffect, useRef, useState } from 'react';

type Props = {
	aboutDescription: string;
	enquiriesCTA: ButtonType;
	googleMapsLink: string;
	jobsCTA: ButtonType;
	office: string;
	phoneNumber: string;
};

const AboutContentLayoutWrapper = styled.div`
	position: fixed;
	bottom: ${pxToRem(80)};
	left: ${pxToRem(25)};
	z-index: 100;
	display: flex;
	flex-direction: column;
	gap: ${pxToRem(10)};

	@media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
		left: ${pxToRem(16)};
		bottom: ${pxToRem(69)};
	}

	@media ${(props) => props.theme.mediaBreakpoints.mobile} {
		width: calc(100% - 32px);
	}
`;

const Title = styled.h1`
	padding-left: ${pxToRem(9)};
	color: var(--fg-colour);
`;

const Inner = styled.div`
	padding: ${pxToRem(7)} ${pxToRem(9)};
	background: var(--blurred-bg-colour);
	backdrop-filter: blur(30px);
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	border-radius: ${pxToRem(5)};
	width: ${pxToRem(341)};

	@media ${(props) => props.theme.mediaBreakpoints.mobile} {
		width: 100%;
	}
`;

const Text = styled.p`
	color: var(--fg-colour);
`;

const Divider = styled.p`
	color: var(--fg-colour);

	@media ${(props) => props.theme.mediaBreakpoints.mobile} {
		display: none;
	}
`;

const MobileDivider = styled.p`
	color: var(--fg-colour);
	display: none;

	@media ${(props) => props.theme.mediaBreakpoints.mobile} {
		display: block;
	}
`;

const SubTitle = styled.h3`
	color: var(--fg-colour);
`;

const Link = styled.a`
	text-decoration: none;
	color: var(--fg-colour);

	&:hover {
		text-decoration: underline;
	}
`;

const FormattedText = styled.div``;

const AboutContentLayout = (props: Props) => {
	const {
		aboutDescription,
		enquiriesCTA,
		googleMapsLink,
		jobsCTA,
		office,
		phoneNumber
	} = props || {};

	const [mobileDividerContent, setMobileDividerContent] = useState('---');

	const dividerContent = '------------------------------------------------';

	const formattedOffice: string = `<p>${office.replace(/\n/g, '<br />')}</p>`;

	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleResize = () => {
			const width = ref.current?.offsetWidth || 0;
			const dashes = '-'.repeat(Math.floor(width / 7.1));
			setMobileDividerContent(dashes);
		};

		handleResize();

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [ref]);

	console.log('mobileDividerContent', mobileDividerContent);

	return (
		<AboutContentLayoutWrapper>
			<Title>About</Title>
			<Inner ref={ref}>
				{aboutDescription && <Text>{aboutDescription}</Text>}
				<Divider className="type-p">{dividerContent}</Divider>
				<MobileDivider>{mobileDividerContent}</MobileDivider>
				<SubTitle>Inquiries</SubTitle>
				{enquiriesCTA?.title && enquiriesCTA?.url && (
					<Link href={enquiriesCTA?.url} target="_blank">
						{enquiriesCTA.title}
					</Link>
				)}
				{phoneNumber && (
					<Link href={`tel:${phoneNumber}`} target="_blank">
						{phoneNumber}
					</Link>
				)}
				{googleMapsLink && office && (
					<>
						<Divider className="type-p">{dividerContent}</Divider>
						<MobileDivider>{mobileDividerContent}</MobileDivider>
						<SubTitle>Office</SubTitle>
						<Link href={googleMapsLink} target="_blank">
							<FormattedText
								dangerouslySetInnerHTML={{
									__html: formattedOffice
								}}
							/>
						</Link>
					</>
				)}
				<Divider className="type-p">{dividerContent}</Divider>
				<MobileDivider>{mobileDividerContent}</MobileDivider>
				{jobsCTA?.title && jobsCTA?.url && (
					<>
						<SubTitle>Jobs</SubTitle>
						<Link href={jobsCTA?.url} target="_blank">
							{jobsCTA.title}
						</Link>
					</>
				)}
			</Inner>
		</AboutContentLayoutWrapper>
	);
};

export default AboutContentLayout;
