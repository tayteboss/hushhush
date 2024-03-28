const isDev = process.env.ENVIRONMENT !== 'production';

module.exports = {
	styledComponents: {
		fileName: isDev,
		displayName: isDev
	}
}