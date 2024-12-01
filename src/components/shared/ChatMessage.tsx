import React from "react";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "../../utils/cn";

interface ChatMessageProps {
	content: string;
	isUser: boolean;
}

export function ChatMessage({ content, isUser }: ChatMessageProps) {
	return (
		<div
			className={cn(
				"flex gap-3 p-4",
				isUser ? "bg-surface" : "bg-surface-variant"
			)}
		>
			<div
				className={cn(
					"h-8 w-8 rounded-full flex items-center justify-center",
					isUser
						? "bg-primary text-white"
						: "bg-primary/10 text-primary"
				)}
			>
				{isUser ? <User size={18} /> : <Bot size={18} />}
			</div>
			<div className="flex-1 prose prose-sm max-w-none">
				<ReactMarkdown>{content}</ReactMarkdown>
			</div>
		</div>
	);
}
