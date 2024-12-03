/**
 * Extracts and parses JSON objects from Markdown text.
 *
 * @param {string} markdown - The Markdown content.
 * @returns {Object[]} - An array of parsed JSON objects. Throws an error if JSON parsing fails.
 */
export function parseJSONFromMarkdown(markdown) {
	const jsonBlocks = [];
	const jsonRegex = /```json([\s\S]*?)```/g;
	let match;

	while ((match = jsonRegex.exec(markdown)) !== null) {
		try {
			const jsonString = match[1].trim();
			jsonBlocks.push(JSON.parse(jsonString));
		} catch (error) {
			console.error(`Error parsing JSON block: ${error.message}`);
			throw new Error('Invalid JSON in Markdown');
		}
	}

	return jsonBlocks;
}
