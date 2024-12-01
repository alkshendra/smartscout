import { useState, useEffect } from "react";

interface PageInfo {
	title: string;
	url: string;
	content: string;
}

export function usePageInfo() {
	const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

	useEffect(() => {
		function handleMessage(event: MessageEvent) {
			console.log(event.data.action);
			if (event.data.action === "pageInfo") {
				setPageInfo(event.data.data);
			}
		}

		window.addEventListener("message", handleMessage);

		// Request page info from the content script
		window.parent.postMessage({ action: "getPageInfo" }, "*");

		return () => window.removeEventListener("message", handleMessage);
	}, []);

	return pageInfo;
}
