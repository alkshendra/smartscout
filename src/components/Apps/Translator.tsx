import React, { useState } from "react";
import { Languages } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { TabView } from "../shared/TabView";
import { ContentInput } from "../shared/ContentInput";
import { LanguageSelect } from "../shared/LanguageSelect";
import { usePageInfo } from "../../hooks/usePageInfo";
import { aiPrompt } from "../../utils/aiPrompt";

const tabs = [
	{ id: "new", label: "New Content" },
	{ id: "translate", label: "Translate Page" },
];

export function Translator() {
	const pageInfo = usePageInfo();
	const [activeTab, setActiveTab] = useState("new");
	const [content, setContent] = useState("");
	const [targetLang, setTargetLang] = useState("es");
	const [translation, setTranslation] = useState("");
	const [loading, setLoading] = useState(false);

	const handleTranslate = async () => {
		if (loading) return;

		setLoading(true);
		setTranslation("");

		try {
			const prompt = `Translate the following content to ${targetLang}:\n\n${
				activeTab === "new" ? content : pageInfo?.content || ""
			}`;

			await aiPrompt(prompt, "", {
				onChunk: (chunk) => {
					setTranslation((prev) => prev + chunk);
				},
				onError: (error) => {
					console.error("Failed to translate:", error);
					setTranslation(
						"Failed to translate content. Please try again."
					);
				},
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-4">
			<div className="mb-6 flex items-center gap-2">
				<Languages size={24} className="text-primary" />
				<h2 className="text-xl font-semibold">Translator</h2>
			</div>

			<div className="space-y-4">
				<TabView
					tabs={tabs}
					activeTab={activeTab}
					onTabChange={setActiveTab}
				/>

				<LanguageSelect value={targetLang} onChange={setTargetLang} />

				{activeTab === "new" && (
					<ContentInput
						value={content}
						onChange={setContent}
						placeholder="Enter text to translate..."
					/>
				)}

				<button
					onClick={handleTranslate}
					disabled={
						loading || (activeTab === "translate" && !pageInfo)
					}
					className="w-full rounded-lg bg-primary py-2 text-white hover:opacity-90 disabled:opacity-50"
				>
					{loading ? "Translating..." : "Translate"}
				</button>

				{translation && (
					<div className="rounded-lg bg-surface-variant p-4">
						<div className="prose prose-sm max-w-none dark:prose-invert">
							<ReactMarkdown>{translation}</ReactMarkdown>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
