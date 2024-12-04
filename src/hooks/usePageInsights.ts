import { useState, useEffect } from 'react';
import { usePageInfo } from './usePageInfo';
import { aiPrompt } from '../utils/aiPrompt';
import { parseJSONFromMarkdown } from '../utils/parseJSONFromMarkdown';

export function usePageInsights() {
	const { content } = usePageInfo() || {};
	const [insights, setInsights] = useState<string | null>(null);
	const [isFetchingInsights, setIsFetchingInsights] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const getPageInsights = async (content: string) => {
		if (isFetchingInsights) {
			return;
		}

		setIsFetchingInsights(true);
		setError(null);

		aiPrompt({
			systemPrompt: `Use the following content to respond to the prompt: ${content}`,
			prompt: `Get me "only the following information" and output in the JSON format:  
			1. (readTime key)
			2. (sentiment key)
			3. (language key)
			Do not output any other information or text.`,
			// content,
			callbacks: {
				onChunk: chunk => {
					const parsedJSON = parseJSONFromMarkdown(chunk);
					setInsights(parsedJSON);
				},
				onError: error => {
					console.error('Failed to summarize:', error);
					setInsights('Failed to generate summary. Please try again.');
				},
				onComplete: () => {
					setIsFetchingInsights(false);
				},
			},
			stream: false,
		});
	};

	useEffect(() => {
		if (content) {
			getPageInsights(content);
		}
	}, [content]);

	return {
		insights,
		isFetchingInsights,
		error,
	};
}
