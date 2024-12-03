import { useState, useEffect } from 'react';
import { LinkMetadata } from '../types';
import { usePageInfo } from './usePageInfo';
import { extractLinks, categorizeLink, extractMetadata } from '../utils/linkExtractor';

export const useLinkExtractor = () => {
	const pageInfo = usePageInfo();
	const [links, setLinks] = useState<LinkMetadata[]>([]);
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

			setLinks(processedLinks);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to scan page');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (pageInfo?.htmlContent) {
			scanPage();
		}
	}, [pageInfo?.htmlContent]);

	return { links, loading, error, rescan: scanPage };
};
