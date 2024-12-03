import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface SEOScoreProps {
	score: number;
	label: string;
	description: string;
}

export const SEOScore: React.FC<SEOScoreProps> = ({ score, label, description }) => {
	const getScoreColor = () => {
		if (score >= 80) return 'text-green-500';
		if (score >= 60) return 'text-yellow-500';
		return 'text-red-500';
	};

	const getIcon = () => {
		if (score >= 80) return <CheckCircle className="w-5 h-5" />;
		if (score >= 60) return <AlertTriangle className="w-5 h-5" />;
		return <XCircle className="w-5 h-5" />;
	};

	return (
		<div className="bg-white rounded-lg p-4 shadow-md">
			<div className="flex items-center justify-between mb-2">
				<span className="font-medium text-gray-700">{label}</span>
				<div className={`flex items-center ${getScoreColor()}`}>
					{getIcon()}
					<span className="ml-2 font-bold">{score}%</span>
				</div>
			</div>
			<p className="text-sm text-gray-600">{description}</p>
		</div>
	);
};
