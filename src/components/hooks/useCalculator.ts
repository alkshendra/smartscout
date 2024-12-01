import { useState, useEffect } from "react";

declare global {
	interface Window {
		ai?: {
			languageModel: {
				capabilities(): Promise<{
					available: "readily" | "after-setup" | "not-available";
				}>;
				create(options?: { systemPrompt?: string }): Promise<{
					prompt(text: string): Promise<string>;
					promptStreaming(
						text: string
					): Promise<AsyncIterable<string>>;
				}>;
			};
		};
	}
}

export function useAICalculator(input: string) {
	const [result, setResult] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		let cancelled = false;

		async function calculate() {
			if (!input.trim()) {
				setResult(null);
				setError(null);
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				if (!window.ai) {
					throw new Error(
						"Chrome AI features are not supported in this browser"
					);
				}

				const capabilities =
					await window.ai.languageModel.capabilities();
				if (capabilities.available !== "readily") {
					throw new Error("Chrome AI features are not available");
				}

				const session = await window.ai.languageModel.create({
					// systemPrompt:
					// 	"Act as a calculator. Calculate the following and respond with ONLY the numerical result or unit conversion result. No explanations or additional text. And make sure to always reply in English",
				});

				let fullResponse = "";
				const stream = await session.promptStreaming(input);

				for await (const chunk of stream) {
					if (!cancelled) {
						fullResponse += chunk;
						setResult(fullResponse.trim());
					}
				}

				if (!cancelled) {
					setError(null);
				}
			} catch (err) {
				if (!cancelled) {
					setError(
						err instanceof Error ? err.message : "An error occurred"
					);
					setResult(null);
				}
			} finally {
				if (!cancelled) {
					setIsLoading(false);
				}
			}
		}

		calculate();

		return () => {
			cancelled = true;
		};
	}, [input]);

	return { result, error, isLoading };
}
