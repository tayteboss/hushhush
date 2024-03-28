import styled from 'styled-components';
import Sections from './Sections';

const PageBuilderWrapper = styled.div``;

const PageBuilder = ({ modules, sections = [] }) => {

	return (
		<PageBuilderWrapper>
			{sections && <Sections sections={sections} /> }
		</PageBuilderWrapper>
	)
}

export default PageBuilder;