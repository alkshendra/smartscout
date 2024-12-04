export interface StreamCallbacks {
	onChunk?: (chunk: string) => void;
	onComplete?: (fullText: string) => void;
	onError?: (error: Error) => void;
}

interface PromptParams {
	systemPrompt?: string;
	prompt: string;
	content?: string | object | boolean;
	callbacks?: StreamCallbacks;
	stream?: boolean;
}

export async function aiPrompt({
	prompt,
	callbacks,
	content = '',
	stream = true,
	systemPrompt: _systemPrompt,
}: PromptParams): Promise<string> {
	const systemPrompt =
		_systemPrompt ||
		`Always reply in English. Don't try to output any other language. 
Take the following page content into consideration and output in markdown format. 
${content ? `Here's the page Content: ${content}` : ''}`;

	try {
		if (!self.ai || !self.ai.languageModel) {
			throw new Error(
				`Your browser doesn't support the Prompt API. If you're on Chrome, join the <a href="https://developer.chrome.com/docs/ai/built-in#get_an_early_preview">Early Preview Program</a> to enable it.`,
			);
		}
		const session = await (window as any).ai.languageModel.create({ systemPrompt });

		let fullText = '';

		if (stream) {
			const promptStream = await session.promptStreaming(prompt);
			for await (const chunk of promptStream) {
				fullText += chunk;

				if (callbacks?.onChunk) {
					console.log(chunk);
					callbacks.onChunk(chunk);
				}
			}
		} else {
			const content = await session.prompt(prompt);
			if (callbacks?.onChunk) {
				callbacks.onChunk(content);
				fullText = content;
			}
		}

		if (callbacks?.onComplete) {
			callbacks.onComplete(fullText);
		}

		return fullText;
	} catch (error) {
		const err = error instanceof Error ? error : new Error('Unknown error occurred');
		if (callbacks?.onError) {
			callbacks.onError(err);
		}
		throw err;
	}
}
