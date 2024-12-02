import React from "react";
import { FileText, ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";
import { apps } from "../../data/apps";

interface AppGridProps {
	onAppClick: (appId: string, options?: Record<string, any>) => void;
}

export function AppGrid({ onAppClick }: AppGridProps) {
	return (
		<div>
			<div className="p-4 mb-8 bg-surface-variant rounded-xl">
				<p className="text-sm font-medium">Page Insights</p>
				<div className="flex align-center justify-between">
					<span>Reading Time</span>
					<span>2 min</span>
				</div>
				<div className="flex align-center justify-between">
					<span>Sentiment</span>
					<span>Bohat hard</span>
				</div>
				<div className="flex align-center justify-between">
					<span>Content Language</span>
					<span>English</span>
				</div>
			</div>
			<button
				key="summarizer"
				onClick={() =>
					onAppClick("summarizer", { initialTab: "summarize" })
				}
				className="flex flex-row items-center rounded-full w-full p-1 mb-8 bg-white transition-transform hover:scale-[1.01]"
				title="Summarize"
			>
				<div
					className={cn(
						"h-10 w-10 mr-2 flex items-center justify-center p-2 rounded-full bg-primary text-white"
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
								"h-16 w-16 mb-2 flex items-center justify-center p-2 rounded-3xl",
								index % 2
									? "bg-surface-variant text-primary"
									: "bg-primary text-white"
							)}
						>
							{React.createElement(app.icon, {
								size: 24,
							})}
						</div>
						<span className="text-sm font-medium text-center">
							{app.name}
						</span>
					</button>
				))}
			</div>
		</div>
	);
}
