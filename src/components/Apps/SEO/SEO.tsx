import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { SEOScore } from './SEOScore';
import { SEOSuggestion } from './SEOSuggestion';
import { analyzePage, extractPageContent, SEOAnalysis } from '../../../utils/seoAnalyzer';
import { aiPrompt } from '../../../utils/aiPrompt';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function SEO() {
	const [analysis, setAnalysis] = useState('');
	console.log('🚀 ~ SEO ~ analysis:', analysis);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAnalysis = async () => {
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
							setAnalysis(chunk);
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

		fetchAnalysis();
	}, []);

	if (loading && !analysis) {
		return (
			<div className="w-[400px] h-[600px] flex items-center justify-center">
				<Activity className="w-8 h-8 text-blue-500 animate-spin" />
			</div>
		);
	}

	if (!analysis) {
		return (
			<div className="w-[400px] h-[600px] p-4">
				<p className="text-red-500">Failed to analyze page</p>
			</div>
		);
	}

	return (
		<div className="w-[400px] h-[600px] bg-gray-50 p-4 overflow-y-auto">
			<h1 className="text-2xl font-bold text-gray-800 mb-4">SEO Analysis</h1>

			<ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis}</ReactMarkdown>

			{/* <div className="grid grid-cols-2 gap-4 mb-6">
				<SEOScore
					score={analysis.scores.overall}
					label="Overall Score"
					description="Your page's overall SEO health"
				/>
				<SEOScore
					score={analysis.scores.content}
					label="Content"
					description="Quality and optimization of your content"
				/>
				<SEOScore
					score={analysis.scores.technical}
					label="Technical"
					description="Technical aspects of your page"
				/>
				<SEOScore
					score={analysis.scores.performance}
					label="Performance"
					description="Page loading and performance metrics"
				/>
			</div>

			<h2 className="text-xl font-semibold text-gray-800 mb-4">Suggestions</h2>
			<div className="space-y-4">
				{analysis.suggestions.map((suggestion, index) => (
					<SEOSuggestion
						key={index}
						title={suggestion.title}
						suggestion={suggestion.suggestion}
						priority={suggestion.priority}
					/>
				))}
			</div> */}
		</div>
	);
}
