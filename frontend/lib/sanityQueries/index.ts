export const siteSettingsQueryString = `
	*[_type == 'siteSettings'][0] {
		...,
	}
`;

export const clientsPageQueryString = `
	*[_type == 'clientsPage'][0] {
		...,
	}
`;
