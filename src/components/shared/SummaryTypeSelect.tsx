import React from "react";
import { type SummaryType } from "../../hooks/useSummarizer";

interface SummaryTypeOption {
	value: SummaryType;
	label: string;
	description: string;
}

const summaryTypes: SummaryTypeOption[] = [
	{
		value: "key-points",
		label: "Key Points",
		description: "Extract main points in a bullet-point format",
	},
	{
		value: "tldr",
		label: "TL;DR",
		description: "Brief summary of the main content",
	},
	{
		value: "teaser",
		label: "Teaser",
		description: "Short preview to grab attention",
	},
	{
		value: "headline",
		label: "Headline",
		description: "Single-line summary of the content",
	},
];

interface SummaryTypeSelectProps {
	value: SummaryType;
	onChange: (value: SummaryType) => void;
}

export function SummaryTypeSelect({ value, onChange }: SummaryTypeSelectProps) {
	return (
		<div className="space-y-2">
			<label className="block text-sm font-medium">Summary Type</label>
			<div className="grid grid-cols-2 gap-2">
				{summaryTypes.map((type) => (
					<button
						key={type.value}
						onClick={() => onChange(type.value)}
						className={`p-3 text-left rounded-lg border transition-colors ${
							value === type.value
								? "border-primary bg-primary/5"
								: "border-surface-variant hover:border-primary/50"
						}`}
					>
						<div className="font-medium text-sm">{type.label}</div>
						<div className="text-xs text-gray-600">
							{type.description}
						</div>
					</button>
				))}
			</div>
		</div>
	);
}
