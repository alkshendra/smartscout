import React, { useState, useEffect, useRef } from "react";
import { FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { usePageInfo } from "../../hooks/usePageInfo";
import { summarizerPrompt } from "../../utils/summarizerPrompt";
import ButtonGroup from "../ButtonGroup";

const content = `Use cases
Based on discussions with web developers, we've been made aware so far of the following use cases:

Summarizer API
Summarizing a meeting transcript for those joining the meeting late.
Summarizing support conversations for input into a database.
Giving a sentence- or paragraph-sized summary of many product reviews.
Summarizing long posts or articles for the reader, to let the reader judge whether to read the whole article.
Generating article titles (a very specific form of summary).
Summarizing questions on Q&A sites so that experts can scan through many summaries to find ones they are well-suited to answer.
Writer API
Generating textual explanations of structured data (e.g. poll results over time, bug counts by product, …)
Expanding pro/con lists into full reviews.
Generating author biographies based on background information (e.g., from a CV or previous-works list).
Break through writer's block and make creating blog articles less intimidating by generating a first draft based on stream-of-thought or bullet point inputs.
Composing a post about a product for sharing on social media, based on either the user's review or the general product description.
Rewriter API
Removing redundancies or less-important information in order to fit into a word limit.
Increasing or lowering the formality of a message to suit the intended audience.
Suggest rephrasings of reviews or posts to be more constructive, when they're found to be using toxic language.
Rephrasing a post or article to use simpler words and concepts ("explain like I'm 5").
Why built-in?
Web developers can accomplish these use cases today using language models, either by calling out to cloud APIs, or bringing their own and running them using technologies like WebAssembly and WebGPU. By providing access to the browser or operating system's existing language model, we can provide the following benefits compared to cloud APIs:

Local processing of sensitive data, e.g. allowing websites to combine AI features with end-to-end encryption.
Potentially faster results, since there is no server round-trip involved.
Offline usage.
Lower API costs for web developers.
Allowing hybrid approaches, e.g. free users of a website use on-device AI whereas paid users use a more powerful API-based model.
Similarly, compared to bring-your-own-AI approaches, using a built-in language model can save the user's bandwidth, likely benefit from more optimizations, and have a lower barrier to entry for web developers.

Shared goals
When designing these APIs, we have the following goals shared among them all:

Provide web developers a uniform JavaScript API for these writing assistance tasks.
Abstract away the fact that they are powered by a language model as much as possible, by creating higher-level APIs with specified inputs and output formats.
Guide web developers to gracefully handle failure cases, e.g. no browser-provided model being available.
Allow a variety of implementation strategies, including on-device or cloud-based models, while keeping these details abstracted from developers.
Encourage interoperability by funneling web developers into these higher-level use cases and away from dependence on specific outputs. That is, whereas it is relatively easy to depend on specific language model outputs for very specific tasks (like structured data extraction or code generation), it's harder to depend on the specific content of a summary, write, or rewrite.
The following are explicit non-goals:

We do not intend to force every browser to ship or expose a language model; in particular, not all devices will be capable of storing or running one. It would be conforming to implement these APIs by always signaling that the functionality in question is unavailable, or to implement these APIs entirely by using cloud services instead of on-device models.
We do not intend to provide guarantees of output quality, stability, or interoperability between browsers. In particular, we cannot guarantee that the models exposed by these APIs are particularly good at any given use case. These are left as quality-of-implementation issues, similar to the shape detection API. (See also a discussion of interop in the W3C "AI & the Web" document.)
The following are potential goals we are not yet certain of:

Allow web developers to know, or control, whether language model interactions are done on-device or using cloud services. This would allow them to guarantee that any user data they feed into this API does not leave the device, which can be important for privacy purposes. Similarly, we might want to allow developers to request on-device-only language models, in case a browser offers both varieties.
Allow web developers to know some identifier for the language model in use, separate from the browser version. This would allow them to allowlist or blocklist specific models to maintain a desired level of quality, or restrict certain use cases to a specific model.
Both of these potential goals could pose challenges to interoperability, so we want to investigate more how important such functionality is to developers to find the right tradeoff.

`;

export function Summarizer() {
	const pageInfo = usePageInfo();
	const [type, setType] = useState<string>("tl;dr");
	const [summary, setSummary] = useState<string>("");
	const [loading, setLoading] = useState(false);

	const handleSummarize = async () => {
		if (loading) return;
		setLoading(true);
		setSummary("");

		try {
			await summarizerPrompt({
				type,
				// content: pageInfo?.content || "",
				content,
				callbacks: {
					onChunk: (chunk) => {
						setSummary(chunk);
					},
					onError: (error) => {
						console.error("Failed to summarize:", error);
						setSummary(
							"Failed to generate summary. Please try again."
						);
					},
				},
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		// if (pageInfo?.content && type) {
		if (type) {
			handleSummarize();
		}
	}, [pageInfo?.content, type]);

	return (
		<div className="p-8">
			<div className="mb-6 flex items-center gap-2">
				<FileText size={24} className="text-primary" />
				<h2 className="text-xl font-semibold">Summarizer</h2>
			</div>

			<ButtonGroup
				items={[
					{
						id: "tl;dr",
						label: "TL;DR",
					},
					{
						id: "key-points",
						label: "Key Points",
					},
					{
						id: "teaser",
						label: "Teaser",
					},
					{
						id: "headline",
						label: "Headline",
					},
				]}
				activeId={type}
				onClick={setType}
			/>
			<div className="space-y-4">
				{summary ? (
					<ReactMarkdown>{summary}</ReactMarkdown>
				) : (
					loading && "Summarizing..."
				)}
			</div>
		</div>
	);
}
