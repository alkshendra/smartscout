import React from 'react';
import { Lightbulb } from 'lucide-react';

interface SEOSuggestionProps {
	title: string;
	suggestion: string;
	priority: 'high' | 'medium' | 'low';
}

export const SEOSuggestion: React.FC<SEOSuggestionProps> = ({ title, suggestion, priority }) => {
	const getPriorityColor = () => {
		switch (priority) {
			case 'high':
				return 'bg-red-100 text-red-800';
			case 'medium':
				return 'bg-yellow-100 text-yellow-800';
			case 'low':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="bg-white rounded-lg p-4 shadow-md mb-4">
			<div className="flex items-start">
				<Lightbulb className="w-5 h-5 text-blue-500 mt-1 mr-3 shrink-0" />
				<div>
					<div className="flex items-center gap-2">
						<h3 className="font-semibold text-gray-800">{title || 'Tip'}</h3>
						<span
							className={`text-xs px-2 py-1 rounded-full shrink-0 ${getPriorityColor()}`}
						>
							{priority} priority
						</span>
					</div>
					<p className="mt-2 text-gray-600">{suggestion}</p>
				</div>
			</div>
		</div>
	);
};
