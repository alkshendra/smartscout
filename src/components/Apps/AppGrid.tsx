import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { apps } from '../../data/apps';

interface AppGridProps {
	onAppClick: (appId: string, options?: Record<string, any>) => void;
	insights: Record<string, string | number | null>;
}

export function AppGrid({ onAppClick, insights }: AppGridProps) {
	return (
		<div>
			{Object.keys(insights || {})?.length > 0 && (
				<div className="p-4 mb-8 bg-surface-variant rounded-xl">
					{insights?.readTime && (
						<p className="py-2">
							<span className="text-primary font-bold">Read Time:</span>{' '}
							{insights.readTime}
						</p>
					)}
					{insights?.sentiment && (
						<p className="py-2">
							<span className="text-primary font-bold">Sentiment:</span>{' '}
							{insights.sentiment}
						</p>
					)}
					{insights?.language && (
						<p className="py-2">
							<span className="text-primary font-bold">Language:</span>{' '}
							{insights.language}
						</p>
					)}
				</div>
			)}
			<button
				key="summarizer"
				onClick={() => onAppClick('summarizer', { initialTab: 'summarize' })}
				className="flex flex-row items-center rounded-full w-full p-1 mb-8 bg-white transition-transform hover:scale-[1.01]"
				title="Summarize"
			>
				<div
					className={cn(
						'h-10 w-10 mr-2 flex items-center justify-center p-2 rounded-full bg-primary text-white',
					)}
				>
					<FileText size={20} />
				</div>
				<span className="text-md">Summarize this page</span>
				<ArrowRight size={20} className="ml-auto mr-2 text-primary" />
			</button>
			<div className="grid grid-cols-3 gap-4">
				{apps.map((app, index) => (
					<button
						key={app.id}
						onClick={() => onAppClick(app.id)}
						className="flex flex-col items-center rounded-lg py-2 transition-transform hover:scale-105"
						title={app.description}
					>
						<div
							className={cn(
								'h-16 w-16 mb-2 flex items-center justify-center p-2 rounded-3xl',
								index % 2
									? 'bg-surface-variant text-primary'
									: 'bg-primary text-white',
							)}
						>
							{React.createElement(app.icon, {
								size: 24,
							})}
						</div>
						<span className="text-sm font-medium text-center">{app.name}</span>
					</button>
				))}
			</div>
		</div>
	);
}
