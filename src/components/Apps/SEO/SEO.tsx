import { Activity } from 'lucide-react';
import { SEOScore } from './SEOScore';
import { SEOSuggestion } from './SEOSuggestion';
import { useSEO } from '../../../hooks/useSEO';
import { Loader } from '../../Loader';

export function SEO() {
	const { loading, analysis } = useSEO();

	if (loading && !analysis) {
		return (
			<div className="w-[400px] h-[600px] flex flex-col items-center justify-center">
				{/* <Activity className="w-8 h-8 text-blue-500 animate-spin" /> */}
				<Loader />
				<p className="text-md mt-4">Analyzing Page Content</p>
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
		<>
			<div className="grid grid-cols-2 gap-4 mb-6">
				<SEOScore
					score={analysis?.scores?.overall}
					label="Overall Score"
					description="Your page's overall SEO health"
				/>
				<SEOScore
					score={analysis?.scores?.content}
					label="Content"
					description="Quality and optimization of your content"
				/>
				<SEOScore
					score={analysis?.scores?.technical}
					label="Technical"
					description="Technical aspects of your page"
				/>
				<SEOScore
					score={analysis?.scores?.performance}
					label="Performance"
					description="Page loading and performance metrics"
				/>
			</div>

			<h2 className="text-xl font-semibold text-gray-800 mb-4">Suggestions</h2>
			<div className="space-y-4">
				{analysis?.suggestions?.map((suggestion, index) => (
					<SEOSuggestion
						key={index}
						title={suggestion.title}
						suggestion={suggestion.suggestion}
						priority={suggestion.priority}
					/>
				))}
			</div>
		</>
	);
}
