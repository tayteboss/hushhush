import { theme } from '../styles/theme';

export const setWhiteTheme = () => {
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

export const setGreyTheme = () => {
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

export const setGreenTheme = () => {
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

export const setWhiteProjectTheme = () => {
	document.documentElement.style.setProperty(
		'--fg-colour',
		theme.colours.white
	);
	document.documentElement.style.setProperty(
		'--blurred-bg-colour',
		'rgba(217, 217, 217, 0.1)'
	);
};

export const setGreyProjectTheme = () => {
	document.documentElement.style.setProperty(
		'--fg-colour',
		theme.colours.grey
	);
	document.documentElement.style.setProperty(
		'--blurred-bg-colour',
		'rgba(217, 217, 217, 0.25)'
	);
};

export const setProjectTheme = () => {
	document.documentElement.style.setProperty(
		'--bg-colour',
		theme.colours.white
	);
};
