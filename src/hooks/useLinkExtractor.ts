import { useState, useEffect } from 'react';
import { LinkMetadata } from '../types';
import { extractLinks, categorizeLink, extractMetadata } from '../utils/linkExtractor';
// import { getCurrentPageHTML } from '../utils/pageScanner';
import { usePageInfo } from './usePageInfo';
import { aiPrompt } from '../utils/aiPrompt';

export const useLinkExtractor = () => {
	const pageInfo = usePageInfo();
	const [links, setLinks] = useState<LinkMetadata[]>([]);
	// const [processedAILinks, setProcessedAILinks] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const scanPage = async () => {
		try {
			if (!self.ai || !self.ai.languageModel) {
				setError(
					`Your browser doesn't support the Prompt API. If you're on Chrome, join the <a href="https://developer.chrome.com/docs/ai/built-in#get_an_early_preview">Early Preview Program</a> to enable it.`,
				);
				return;
			}

			if (!pageInfo?.htmlContent) {
				setError('No page content found');
				return;
			}
			setLoading(true);
			// const html = await getCurrentPageHTML();
			const html = pageInfo?.htmlContent || '';
			const extractedLinks = extractLinks(html);

			const processedLinks = await Promise.all(
				extractedLinks.map(async url => {
					const metadata = await extractMetadata(url);
					return {
						url,
						...metadata,
						category: categorizeLink(url),
					};
				}),
			);

			// await aiPrompt(
			// 	'Go through the following array of JSON object thoroughly extract all the url and their title or description, then categorize them and return',
			// 	'```json\n' + JSON.stringify(processedLinks) + '\n```',
			// 	{
			// 		onChunk: chunk => {
			// 			console.log('🚀 ~ handleExtract ~ chunk:', chunk);
			// 			// setLinks(prev => prev + chunk);
			// 			// setLinks(prev => [...prev, chunk]);
			// 			setProcessedAILinks(prev => prev + chunk);
			// 		},
			// 		onError: error => {
			// 			console.error('Failed to extract links:', error);
			// 			// setLinks('Failed to extract links. Please try again.');
			// 			// setError(error.message);
			// 		},
			// 	},
			// );

			setLinks(processedLinks);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to scan page');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		scanPage();
	}, [pageInfo?.htmlContent]);

	return { links, loading, error, rescan: scanPage };
};
