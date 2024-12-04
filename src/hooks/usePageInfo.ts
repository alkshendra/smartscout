import { useState, useEffect } from 'react';
import { convertHtmlToMarkdown } from '../utils/htmlMarkdown';

interface PageInfo {
	title: string;
	url: string;
	content: string;
	htmlContent: string;
	markdownContent: string;
}

export function usePageInfo() {
	const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

	useEffect(() => {
		function handleMessage(event: MessageEvent) {
			if (event.data.action === 'pageInfo') {
				const { title, url, content, htmlContent, mainContent } = event.data.data;
				const markdownContent = convertHtmlToMarkdown(mainContent || '');
				console.log(mainContent, markdownContent);

				setPageInfo({
					title,
					url,
					content,
					htmlContent,
					markdownContent,
				});
			}
		}

		window.addEventListener('message', handleMessage);

		// Request page info from the content script
		window.parent.postMessage({ action: 'getPageInfo' }, '*');

		return () => window.removeEventListener('message', handleMessage);
	}, []);

	return pageInfo;
}
