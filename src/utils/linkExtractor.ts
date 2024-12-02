export const extractLinks = (html: string): string[] => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');
	const links = Array.from(doc.getElementsByTagName('a'));
	const filterMethod = (href: string, index: number, linksArr: Array<string>) =>
		href &&
		!href.startsWith('javascript:') &&
		!href.startsWith('chrome-extension://') &&
		linksArr.indexOf(href) === index;
	return links.map(link => link.href).filter(filterMethod);
};

export const categorizeLink = (url: string): string => {
	if (url.includes('github.com')) return 'Development';
	if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return 'Images';
	if (url.match(/\.(mp4|webm|mov)$/i)) return 'Videos';
	if (url.match(/\.(pdf|doc|docx|txt)$/i)) return 'Documents';
	if (url.includes('linkedin.com')) return 'Social';
	return 'Other';
};

export const extractMetadata = async (
	url: string,
): Promise<{
	title: string;
	description?: string;
	thumbnail?: string;
}> => {
	try {
		const response = await fetch(url);
		const html = await response.text();
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');

		const title =
			doc.querySelector('title')?.textContent ||
			doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
			new URL(url).hostname;

		const description =
			doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
			doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
			'';

		const thumbnail =
			doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
			doc.querySelector('link[rel="icon"]')?.getAttribute('href');

		return {
			title,
			description,
			thumbnail: thumbnail ? new URL(thumbnail, url).href : undefined,
		};
	} catch (error) {
		console.log('error', error);
		return {
			title: new URL(url).hostname,
		};
	}
};
