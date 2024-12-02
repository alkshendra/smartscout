import React from "react";
import { cn } from "../../utils/cn";

interface Tab {
	id: string;
	label: string;
}

interface TabViewProps {
	tabs: Tab[];
	activeTab: string;
	onTabChange: (tabId: string) => void;
}

export function TabView({ tabs, activeTab, onTabChange }: TabViewProps) {
	return (
		<div className="flex space-x-2 mb-4 bg-surface-variant rounded-lg p-1">
			{tabs.map((tab) => (
				<button
					key={tab.id}
					onClick={() => onTabChange(tab.id)}
					className={cn(
						"flex-1 p-2 rounded-lg text-sm font-medium transition-colors",
						activeTab === tab.id
							? "bg-primary text-white"
							: "text-primary hover:bg-surface/50"
					)}
				>
					{tab.label}
				</button>
			))}
		</div>
	);
}
