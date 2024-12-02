export const getCurrentPageHTML = async (): Promise<string> => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	if (!tab.id) {
		throw new Error('No active tab found');
	}

	const [{ result }] = await chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: () => document.documentElement.outerHTML,
	});

	return result as string;
};
