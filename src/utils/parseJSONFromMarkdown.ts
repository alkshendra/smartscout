/**
 * Extracts and parses JSON object from Markdown text.
 *
 * @param {string} markdown - The Markdown content.
 * @returns {Object|null} - The parsed JSON object, or null if no JSON block is found.
 */
export function parseJSONFromMarkdown(markdown) {
	const jsonRegex = /```json([\s\S]*?)```/;
	const match = jsonRegex.exec(markdown);

	if (match) {
		try {
			const jsonString = match[1].trim();
			return JSON.parse(jsonString);
		} catch (error) {
			console.error(`Error parsing JSON block: ${error.message}`);
			throw new Error('Invalid JSON in Markdown');
		}
	}

	return null; // Return null if no JSON block is found
}
