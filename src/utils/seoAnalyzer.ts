export interface SEOAnalysis {
	scores: {
		overall: number;
		content: number;
		technical: number;
		performance: number;
	};
	suggestions: Array<{
		title: string | 'Tip';
		suggestion: string;
		priority: 'high' | 'medium' | 'low';
	}>;
}

export const extractPageContent = async (): Promise<string> => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	if (!tab.id) {
		throw new Error('No active tab found');
	}

	const [{ result }] = await chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: () => {
			const title = document.title;
			const metaDescription =
				document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
			const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(
				h => h.textContent,
			);
			const images = Array.from(document.querySelectorAll('img')).map(img => ({
				alt: img.alt,
				src: img.src,
			}));
			const textContent = document.body.textContent;

			return {
				title,
				metaDescription,
				headings,
				images,
				textContent: textContent?.slice(0, 1500), // Limit text content
			};
		},
	});

	return result as string;
};
