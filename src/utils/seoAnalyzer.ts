import { aiPrompt } from './aiPrompt';

export interface SEOAnalysis {
	scores: {
		overall: number;
		content: number;
		technical: number;
		performance: number;
	};
	suggestions: Array<{
		title: string;
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

// export const extractPageContent = async (): Promise<string> => {
// 	return new Promise(resolve => {
// 		chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
// 			const activeTab = tabs[0];
// 			if (activeTab.id) {
// 				chrome.scripting.executeScript(
// 					{
// 						target: { tabId: activeTab.id },
// 						func: () => {
// 							const title = document.title;
// 							const metaDescription =
// 								document
// 									.querySelector('meta[name="description"]')
// 									?.getAttribute('content') || '';
// 							const headings = Array.from(
// 								document.querySelectorAll('h1, h2, h3, h4, h5, h6'),
// 							).map(h => h.textContent);
// 							const images = Array.from(document.querySelectorAll('img')).map(
// 								img => ({
// 									alt: img.alt,
// 									src: img.src,
// 								}),
// 							);
// 							const textContent = document.body.textContent;

// 							return {
// 								title,
// 								metaDescription,
// 								headings,
// 								images,
// 								textContent: textContent?.slice(0, 1500), // Limit text content
// 							};
// 						},
// 					},
// 					results => {
// 						if (results && results[0]) {
// 							resolve(JSON.stringify(results[0].result));
// 						}
// 					},
// 				);
// 			}
// 		});
// 	});
// };

export const analyzePage = async ({ setAnalysis, setLoading }): Promise<SEOAnalysis> => {
	try {
		const prePrompt = `You are a SEO expert. You are analyzing the following page content:`;
		const pageContent = await extractPageContent();
		const prompt = `
            Analyze the following webpage content for SEO optimization. Provide scores and suggestions.
            Focus on these aspects:
            1. Title and meta description optimization
            2. Header structure and content hierarchy
            3. Image optimization and alt tags
            4. Content quality and keyword usage
            5. Technical SEO elements

            Respond in the following JSON format:
            {
            "scores": {
                "overall": number (0-100),
                "content": number (0-100),
                "technical": number (0-100),
                "performance": number (0-100)
            },
            "suggestions": [
                {
                "title": "string",
                "suggestion": "string",
                "priority": "high" | "medium" | "low"
                }
            ]
            }

            Page content:
            ${pageContent}
        `;

		await aiPrompt(
			prompt,
			pageContent,
			{
				onChunk: chunk => {
					console.log(chunk);
					setAnalysis(prev => prev + chunk);
				},
				onError: error => {
					console.error('Chat error:', error);
				},
			},
			prePrompt,
		);
	} catch (error) {
		console.error('SEO analysis failed:', error);
		throw error;
	} finally {
		setLoading(false);
	}
};
