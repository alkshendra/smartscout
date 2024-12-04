import TurndownService from 'turndown';

const turndownService = new TurndownService({
	headingStyle: 'atx',
	codeBlockStyle: 'fenced',
	emDelimiter: '*',
});

// Configure turndown to handle additional HTML elements
turndownService.addRule('iframe', {
	filter: ['iframe'],
	replacement: (content, node) => {
		const iframe = node as HTMLIFrameElement;
		return `[${iframe.title || 'Embedded content'}](${iframe.src})`;
	},
});

export function convertHtmlToMarkdown(html: string): string {
	return turndownService.turndown(html);
}
