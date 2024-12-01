import {
	Calculator,
	Languages,
	Notebook,
	FileText,
	ListCollapse,
	Link,
	SearchCheck,
	Youtube,
	Bot,
	type LucideIcon,
} from "lucide-react";

interface App {
	id: string;
	name: string;
	description: string;
	icon: LucideIcon;
}

export const apps: App[] = [
	{
		id: "calculator",
		name: "Natural Calculator",
		description: "Calculate using natural language",
		icon: Calculator,
	},
	{
		id: "translator",
		name: "Translator",
		description: "Translate text between languages",
		icon: Languages,
	},
	{
		id: "summarizer",
		name: "Summarizer",
		description: "Get a quick summary of the current page",
		icon: FileText,
	},
	{
		id: "links",
		name: "Link Extractor",
		description: "Extract and categorize all links from the page",
		icon: Link,
	},
	{
		id: "writingAssistant",
		name: "Writing Assistant",
		description: "Quick notes and text editing",
		icon: Notebook,
	},
	{
		id: "toc",
		name: "Table Of Contents",
		description: "Add TOC to your page",
		icon: ListCollapse,
	},
	{
		id: "seo",
		name: "SEO Analyzer",
		description: "Analyze the content for SEO",
		icon: SearchCheck,
	},
	{
		id: "yt",
		name: "YT Sidekick",
		description: "Your YouTube Assistant",
		icon: Youtube,
	},
	{
		id: "freestyle",
		name: "Freestyle",
		description: "Chat with AI",
		icon: Bot,
	},
];
