import React, { useState } from "react";
import { Link } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { usePageInfo } from "../../hooks/usePageInfo";
import { aiPrompt } from "../../utils/aiPrompt";

export function LinkExtractor() {
	const pageInfo = usePageInfo();
	const [links, setLinks] = useState<string>("");
	const [loading, setLoading] = useState(false);

	const handleExtract = async () => {
		if (!pageInfo?.content || loading) return;

		setLoading(true);
		setLinks("");

		try {
			await aiPrompt(
				"Go through the page content thoroughly extract all the links along with their titles, then categorize and list it down as markdown",
				pageInfo.content,
				{
					onChunk: (chunk) => {
						setLinks((prev) => prev + chunk);
					},
					onError: (error) => {
						console.error("Failed to extract links:", error);
						setLinks("Failed to extract links. Please try again.");
					},
				}
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-4">
			<div className="mb-6 flex items-center gap-2">
				<Link size={24} className="text-primary" />
				<h2 className="text-xl font-semibold">Link Extractor</h2>
			</div>

			<div className="space-y-4">
				<button
					onClick={handleExtract}
					disabled={loading || !pageInfo}
					className="w-full rounded-lg bg-primary py-2 text-white hover:opacity-90 disabled:opacity-50"
				>
					{loading ? "Extracting..." : "Extract Links"}
				</button>

				{links && (
					<div className="rounded-lg bg-surface-variant p-4">
						<div className="prose prose-sm max-w-none dark:prose-invert">
							<ReactMarkdown>{links}</ReactMarkdown>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
