import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const useActiveLink = (): string => {
	const [activeLink, setActiveLink] = useState<string>('Home');
	const router = useRouter();

	useEffect(() => {
		if (router.pathname === '/') {
			setActiveLink('home');
		} else if (router.pathname.includes('/representation')) {
			setActiveLink('representation');
		} else if (router.pathname.includes('/case-studies')) {
			setActiveLink('case-study');
		} else if (router.pathname === '/about') {
			setActiveLink('about');
		} else {
			setActiveLink('');
		}
	}, [router]);

	return activeLink;
};

export default useActiveLink;
