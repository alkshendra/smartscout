import React from "react";

interface ContentInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export function ContentInput({
	value,
	onChange,
	placeholder,
}: ContentInputProps) {
	return (
		<div className="space-y-2">
			<label className="block text-sm font-medium">Content</label>
			<textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="w-full rounded-lg border border-surface-variant bg-white p-3 text-sm focus:border-primary focus:outline-none"
				rows={6}
			/>
		</div>
	);
}
