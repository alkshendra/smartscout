let sidebarFrame = null;

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "toggle_sidebar") {
		toggleSidebar();
	}
});

// Listen for messages from the iframe
window.addEventListener("message", (event) => {
	if (event.data.action === "getPageInfo") {
		const pageInfo = {
			title: document.title,
			url: window.location.href,
			content: document.body.innerText,
			htmlContent: document.body.innerHTML,
		};
		event.source.postMessage({ action: "pageInfo", data: pageInfo }, "*");
	} else if (event.data.action === "toggle_sidebar") {
		toggleSidebar();
	}
});

function toggleSidebar() {
	if (!sidebarFrame) {
		// Create and inject the iframe
		sidebarFrame = document.createElement("iframe");
		sidebarFrame.id = "handy-sidebar-iframe";
		sidebarFrame.src = chrome.runtime.getURL("index.html");
		document.body.appendChild(sidebarFrame);
	} else {
		// Toggle the visibility
		sidebarFrame.classList.toggle("hidden");
	}
}
