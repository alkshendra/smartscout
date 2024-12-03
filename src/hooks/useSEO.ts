import { useEffect, useState } from 'react';
import { extractPageContent, SEOAnalysis } from '../utils/seoAnalyzer';
import { aiPrompt } from '../utils/aiPrompt';
import { parseJSONFromMarkdown } from '../utils/parseJSONFromMarkdown';

export const useSEO = () => {
	const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAnalysis = async () => {
			try {
				const systemPrompt = `You are a SEO expert. You are analyzing the following page content:`;
				const content = await extractPageContent();
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
                ${content}
            `;

				await aiPrompt({
					prompt,
					content,
					systemPrompt,
					stream: false,
					callbacks: {
						onChunk: chunk => {
							try {
								const parsedJSON = parseJSONFromMarkdown(chunk);
								console.log('parsedJSON', parsedJSON);
								setAnalysis(parsedJSON);
							} catch (error) {
								console.error(error.message);
							}
						},
						onError: error => {
							console.error('Chat error:', error);
						},
					},
				});
			} catch (error) {
				console.error('SEO analysis failed:', error);
				throw error;
			} finally {
				setLoading(false);
			}
		};

		fetchAnalysis();
	}, []);

	return { loading, analysis };
};
