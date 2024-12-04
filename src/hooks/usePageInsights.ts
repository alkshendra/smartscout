import { useState, useCallback, useEffect } from 'react';
import { usePageInfo } from './usePageInfo';
import { aiPrompt } from '../utils/aiPrompt';

export function usePageInsights() {
	const { content, markdownContent } = usePageInfo() || {};
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
			1. **Read time** (readTime key)
			2. **Sentiment** (sentiment key)
			3. **Language**  (language key)
			Do not output any other information or text.`,
			// content,
			callbacks: {
				onChunk: chunk => {
					setInsights(chunk);
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
