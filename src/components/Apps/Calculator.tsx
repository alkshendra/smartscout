import React, { useState } from "react";
import { Calculator as CalculatorIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { aiPrompt } from "../../utils/aiPrompt";

export function Calculator() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState<string>("");
	const [loading, setLoading] = useState(false);
	// const abortController = useRef<AbortController | null>(null);

	const handleCalculate = async () => {
		setLoading(true);
		setOutput("");

		try {
			await aiPrompt(
				input,
				// dummyContent,
				"",
				{
					onChunk: (chunk) => {
						// setOutput((prev) => prev + chunk);
						setOutput(chunk);
					},
					onError: (error) => {
						console.error("Failed to calculate:", error);
						setOutput(
							"Failed to generate summary. Please try again."
						);
					},
				},
				"You are a calculator that takes the input in natural language and returns the result in the form of a number or a unit conversion. You should always reply in English. Do not try to output any other language. Calculate the following and respond with ONLY the numerical result or unit conversion result. No explanations or additional text."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			<textarea
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="Type your calculation in natural language..."
				className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
				rows={4}
			/>
			<button
				onClick={handleCalculate}
				disabled={loading}
				className="w-full rounded-lg bg-primary py-2 text-white hover:opacity-90 disabled:opacity-50"
			>
				{loading ? "Calculating..." : "Calculate"}
			</button>

			{output && (
				<div className="rounded-lg bg-surface-variant p-4">
					<div className="prose prose-sm max-w-none dark:prose-invert">
						<ReactMarkdown>{output}</ReactMarkdown>
					</div>
				</div>
			)}
		</div>
	);
}
