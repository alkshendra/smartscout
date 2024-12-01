export interface StreamCallbacks {
	onChunk?: (chunk: string) => void;
	onComplete?: (fullText: string) => void;
	onError?: (error: Error) => void;
}

export async function aiPrompt(
	prompt: string,
	content: string,
	callbacks?: StreamCallbacks,
	prePrompt?: string
): Promise<string> {
	const systemPrompt =
		prePrompt ||
		`Always reply in English. Don't try to output any other language. 
Take the following page content into consideration and output in markdown format. 
Here's the page Content: ${content}`;

	try {
		const session = await ai.languageModel.create({ systemPrompt });
		const stream = await session.promptStreaming(prompt);

		let fullText = "";

		for await (const chunk of stream) {
			fullText += chunk;

			if (callbacks?.onChunk) {
				console.log(chunk);
				callbacks.onChunk(chunk);
			}
		}

		if (callbacks?.onComplete) {
			callbacks.onComplete(fullText);
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
