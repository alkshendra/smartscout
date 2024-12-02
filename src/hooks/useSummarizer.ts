import { useState, useCallback } from "react";

export type SummaryType = "key-points" | "tldr" | "teaser" | "headline";

interface SummarizerOptions {
	type?: SummaryType;
	onProgress?: (text: string) => void;
	onError?: (error: Error) => void;
}

export function useSummarizer() {
	const [isSummarizing, setIsSummarizing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createSummarizer = useCallback(async (type: SummaryType = "tldr") => {
		if (!("ai" in window) || !("summarizer" in (window as any).ai)) {
			throw new Error("AI Summarizer API not supported in this browser");
		}

		return await (window as any).ai.summarizer.create({
			format: "markdown",
			type: type,
		});
	}, []);

	const summarize = async (content: string, options?: SummarizerOptions) => {
		if (!content.trim() || isSummarizing) return;

		setIsSummarizing(true);
		setError(null);

		try {
			const summarizer = await createSummarizer(options?.type);
			const stream = await summarizer.summarizeStreaming(content.trim());
			let fullResponse = "";

			for await (const chunk of stream) {
				fullResponse = chunk.trim();
				if (options?.onProgress) {
					options.onProgress(fullResponse);
				}
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Summarization failed. Please try again.";
			setError(errorMessage);
			if (options?.onError) {
				options.onError(
					error instanceof Error ? error : new Error(errorMessage)
				);
			}
		} finally {
			setIsSummarizing(false);
		}
	};

	return {
		summarize,
		isSummarizing,
		error,
	};
}
