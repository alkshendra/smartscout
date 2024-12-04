let sidebarFrame = null;

function toggleSidebar() {
	if (!sidebarFrame) {
		// Create and inject the iframe
		sidebarFrame = document.createElement('iframe');
		sidebarFrame.id = 'handy-sidebar-iframe';
		sidebarFrame.src = chrome.runtime.getURL('index.html');
		document.body.appendChild(sidebarFrame);
	} else {
		// Toggle the visibility
		sidebarFrame.classList.toggle('hidden');
	}
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'toggle_sidebar') {
		toggleSidebar();
	}
});

// Listen for messages from the iframe
window.addEventListener('message', event => {
	if (event.data.action === 'getPageInfo') {
		const mainElement = document.querySelector('main');
		console.log({ mainElement });

		const pageInfo = {
			title: document.title,
			url: window.location.href,
			content: document.body.innerText,
			htmlContent: document.body.innerHTML,
			mainContent: mainElement?.innerHTML || document.body.innerHTML,
		};
		event.source.postMessage({ action: 'pageInfo', data: pageInfo }, '*');
	} else if (event.data.action === 'toggle_sidebar') {
		toggleSidebar();
	} else if (event.data.action === 'redirect') {
		console.log('redirecting', event.data.url);
		window.location.href = event.data.url;
	}
});
