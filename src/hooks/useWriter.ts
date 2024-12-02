import { useState, useCallback } from "react";

interface WriterOptions {
	context?: string;
	tone?: string;
	length?: string;
	format?: string;
	onProgress?: (text: string) => void;
	onError?: (error: Error) => void;
}

export function useWriter() {
	const [isWriting, setIsWriting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createWriter = useCallback(async (options: WriterOptions) => {
		if (!("ai" in window) || !("writer" in (window as any).ai)) {
			throw new Error("AI Writer API not supported in this browser");
		}

		return await (window as any).ai.writer.create({
			tone: options.tone || "as-is",
			length: options.length || "as-is",
			format: options.format || "as-is",
			sharedContext: options.context?.trim() || "",
		});
	}, []);

	const createRewriter = useCallback(async (options: WriterOptions) => {
		if (!("ai" in window) || !("rewriter" in (window as any).ai)) {
			throw new Error("AI Rewriter API not supported in this browser");
		}

		return await (window as any).ai.rewriter.create({
			tone: options.tone || "as-is",
			length: options.length || "as-is",
			format: options.format || "as-is",
			sharedContext: options.context?.trim() || "",
		});
	}, []);

	const write = async (content: string, options: WriterOptions) => {
		if (!content.trim() || isWriting) return;

		setIsWriting(true);
		setError(null);

		try {
			const writer = await createWriter(options);
			const stream = await writer.writeStreaming(content.trim());
			let fullResponse = "";

			for await (const chunk of stream) {
				fullResponse = chunk.trim();
				if (options.onProgress) {
					options.onProgress(fullResponse);
				}
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Writing failed. Please try again.";
			setError(errorMessage);
			if (options.onError) {
				options.onError(
					error instanceof Error ? error : new Error(errorMessage)
				);
			}
		} finally {
			setIsWriting(false);
		}
	};

	const rewrite = async (content: string, options: WriterOptions) => {
		if (!content.trim() || isWriting) return;

		setIsWriting(true);
		setError(null);

		try {
			const rewriter = await createRewriter(options);
			const stream = await rewriter.rewriteStreaming(content.trim());
			let fullResponse = "";

			for await (const chunk of stream) {
				fullResponse = chunk.trim();
				if (options.onProgress) {
					options.onProgress(fullResponse);
				}
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Rewriting failed. Please try again.";
			setError(errorMessage);
			if (options.onError) {
				options.onError(
					error instanceof Error ? error : new Error(errorMessage)
				);
			}
		} finally {
			setIsWriting(false);
		}
	};

	return {
		write,
		rewrite,
		isWriting,
		error,
	};
}
