import React, { useState } from "react";
import { Languages } from "lucide-react";

export function Translator() {
	const [input, setInput] = useState("");
	const [targetLang, setTargetLang] = useState("es");
	const [translation, setTranslation] = useState<string | null>(null);

	const handleTranslate = () => {
		// Placeholder for the actual translate() function
		const mockTranslate = (text: string, lang: string) => {
			return `Translation of "${text}" to ${lang}`;
		};
		setTranslation(mockTranslate(input, targetLang));
	};

	return (
		<div className="p-4">
			<div className="mb-6 flex items-center gap-2">
				<Languages size={24} />
				<h2 className="text-xl font-semibold">Translator</h2>
			</div>
			<div className="space-y-4">
				<textarea
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Enter text to translate..."
					className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
					rows={4}
				/>
				<select
					value={targetLang}
					onChange={(e) => setTargetLang(e.target.value)}
					className="w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
				>
					<option value="es">Spanish</option>
					<option value="fr">French</option>
					<option value="de">German</option>
					<option value="it">Italian</option>
					<option value="pt">Portuguese</option>
				</select>
				<button
					onClick={handleTranslate}
					className="w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600"
				>
					Translate
				</button>
				{translation && (
					<div className="mt-4 rounded-lg bg-gray-50 p-4">
						<p className="text-lg font-medium">{translation}</p>
					</div>
				)}
			</div>
		</div>
	);
}
