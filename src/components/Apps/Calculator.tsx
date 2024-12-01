import React, { useState } from "react";
import { Calculator as CalculatorIcon } from "lucide-react";
// import { useAICalculator } from "../hooks/useCalculator";

// export function Calculator() {
// 	const [input, setInput] = useState("");
// 	// const [result, setResult] = useState<string | null>(null);
// 	// const [error, setError] = useState<string | null>(null);
// 	const [calculate, setCalculate] = useState(false);

// 	const { result, error, isLoading } = useAICalculator(input);
// 	console.log({ result, error, isLoading });

// 	const handleCalculate = () => {
// 		// Placeholder for the actual calculate() function
// 		setCalculate(input);
// 	};

// 	return (
// 		<div className="p-4">
// 			<div className="mb-6 flex items-center gap-2">
// 				<CalculatorIcon size={24} />
// 				<h2 className="text-xl font-semibold">Natural Calculator</h2>
// 			</div>
// 			<div className="space-y-4">
// 				<textarea
// 					value={input}
// 					onChange={(e) => setInput(e.target.value)}
// 					placeholder="Type your calculation in natural language..."
// 					className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
// 					rows={4}
// 				/>
// 				<button
// 					onClick={handleCalculate}
// 					className="w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600"
// 				>
// 					Calculate
// 				</button>
// 				{result && (
// 					<div className="mt-4 rounded-lg bg-gray-50 p-4">
// 						<p className="text-lg font-medium">{result}</p>
// 					</div>
// 				)}
// 			</div>
// 		</div>
// 	);
// }

// import React, { useState, useRef } from "react";
// import { FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
// import { usePageInfo } from "../../hooks/usePageInfo";
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
		<div className="p-4">
			<div className="mb-6 flex items-center gap-2">
				<CalculatorIcon size={24} className="text-primary" />
				<h2 className="text-xl font-semibold">Calculator</h2>
			</div>

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
		</div>
	);
}
