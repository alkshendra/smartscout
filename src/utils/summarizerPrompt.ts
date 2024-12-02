export interface StreamCallbacks {
	onChunk?: (chunk: string) => void;
	onComplete?: (fullText: string) => void;
	onError?: (error: Error) => void;
}

interface SummarizationParams {
	type: string;
	content: string;
	callbacks?: StreamCallbacks;
	context?: string;
}
export async function summarizerPrompt({
	type,
	content,
	callbacks,
	context: _context,
}: SummarizationParams): Promise<string> {
	const context =
		_context ||
		`Always reply in English. Don't try to output any other language.
	Take the following page content into consideration and output in markdown format.`;

	try {
		const summarizerCapabilities =
			await window.ai.summarizer.capabilities();
		const isSupported = summarizerCapabilities.available === "readily";

		if (!isSupported) {
			throw new Error("AI Summarization is not supported");
		}

		const session = await window.ai.summarizer.create({
			sharedContext: context,
			type, // "tl;dr", "key-points", "teaser", "headline"
			// tone: "formal",
			// length: "medium",
			format: "markdown",
		});

		const stream = await session.summarizeStreaming(content);

		let fullText = "";

		for await (const chunk of stream) {
			fullText += chunk;

			if (callbacks?.onChunk) {
				callbacks.onChunk(chunk);
			}
		}

		if (callbacks?.onComplete) {
			callbacks.onComplete(fullText);

			// Destroy session once done
			session.destroy();
		}

		return fullText;
	} catch (error) {
		const err =
			error instanceof Error
				? error
				: new Error("Unknown error occurred");
		if (callbacks?.onError) {
			callbacks.onError(err);
		}
		throw err;
	}
}
