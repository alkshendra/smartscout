import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { usePageInfo } from "../../hooks/usePageInfo";
import { useSummarizer, type SummaryType } from "../../hooks/useSummarizer";
import { TabView } from "../shared/TabView";
import { ContentInput } from "../shared/ContentInput";
import { SummaryTypeSelect } from "../shared/SummaryTypeSelect";

const tabs = [
	{ id: "new", label: "New Content" },
	{ id: "summarize", label: "Summarize Page" },
];

interface SummarizerProps {
	initialTab?: string;
}

export function Summarizer({ initialTab = "new" }: SummarizerProps) {
	const pageInfo = usePageInfo();
	const { summarize, isSummarizing, error } = useSummarizer();
	const [activeTab, setActiveTab] = useState(initialTab);
	const [content, setContent] = useState("");
	const [summaryType, setSummaryType] = useState<SummaryType>("tldr");
	const [summary, setSummary] = useState("");

	useEffect(() => {
		if (activeTab === "summarize" && pageInfo?.content && !summary) {
			handleSummarize();
		}
	}, [activeTab, pageInfo?.content]);

	const handleSummarize = async () => {
		const textToSummarize =
			activeTab === "new" ? content : pageInfo?.content;
		if (!textToSummarize) return;

		await summarize(textToSummarize, {
			type: summaryType,
			onProgress: (chunk) => {
				setSummary(chunk);
			},
		});
	};

	return (
		<div className="p-4">
			<div className="mb-6 flex items-center gap-2">
				<FileText size={24} className="text-primary" />
				<h2 className="text-xl font-semibold">Summarizer</h2>
			</div>

			<div className="space-y-4">
				<TabView
					tabs={tabs}
					activeTab={activeTab}
					onTabChange={setActiveTab}
				/>

				<SummaryTypeSelect
					value={summaryType}
					onChange={setSummaryType}
				/>

				{activeTab === "new" && (
					<ContentInput
						value={content}
						onChange={setContent}
						placeholder="Enter text to summarize..."
					/>
				)}

				{error && (
					<div className="rounded-lg bg-red-100 p-4 text-red-700">
						{error}
					</div>
				)}

				<button
					onClick={handleSummarize}
					disabled={
						isSummarizing ||
						(activeTab === "summarize" && !pageInfo?.content)
					}
					className="w-full rounded-lg bg-primary py-2 text-white hover:opacity-90 disabled:opacity-50"
				>
					{isSummarizing ? "Summarizing..." : "Summarize"}
				</button>

				{summary && (
					<div className="rounded-lg bg-surface-variant p-4">
						<div className="prose prose-sm max-w-none dark:prose-invert">
							<ReactMarkdown>{summary}</ReactMarkdown>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
