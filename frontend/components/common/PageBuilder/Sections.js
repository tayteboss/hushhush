import ContentSection from '../../sections/ContentSection';
import Image from '../../sections/Image';

/**
 * List of available sections
 */
const availableSections = {
	ContentSection,
	Image
};

const Sections = ({ sections }) => {
	return (
		<>
			{sections && sections.map((section) => {
				if(!availableSections[section.name])
				{
					return <div key={Math.random() * 10000}>No section found for {section.name}</div>
				}
				else
				{
					const Component = availableSections[section.name];
					return <Component key={section.id} {...section} />
				}
			})}
		</>
	);
};

export default Sections;