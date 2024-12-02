import React from "react";

interface Language {
	code: string;
	name: string;
}

const languages: Language[] = [
	{ code: "es", name: "Spanish" },
	{ code: "ja", name: "Japanese" },
];

interface LanguageSelectProps {
	value: string;
	onChange: (value: string) => void;
}

export function LanguageSelect({ value, onChange }: LanguageSelectProps) {
	return (
		<div className="space-y-2">
			<label className="block text-sm font-medium">Target Language</label>
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full rounded-lg border border-surface-variant bg-white p-3 text-sm focus:border-primary focus:outline-none"
			>
				{languages.map((lang) => (
					<option key={lang.code} value={lang.code}>
						{lang.name}
					</option>
				))}
			</select>
		</div>
	);
}
