import React, { useState, useRef, useEffect } from 'react';
import { Bot, Trash2 } from 'lucide-react';
import { ChatMessage } from '../shared/ChatMessage';
import { aiPrompt } from '../../utils/aiPrompt';

interface Message {
	content: string;
	isUser: boolean;
}

export function Freestyle() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() || loading) return;

		const userMessage = { content: input, isUser: true };
		setMessages(prev => [...prev, userMessage]);
		setInput('');
		setLoading(true);

		let aiResponse = '';
		try {
			await aiPrompt({
				prompt: input,
				callbacks: {
					onChunk: chunk => {
						aiResponse = chunk;
						setMessages(prev => {
							const newMessages = [...prev];
							const lastMessage = newMessages[newMessages.length - 1];
							if (!lastMessage.isUser) {
								lastMessage.content = aiResponse;
							} else {
								newMessages.push({
									content: aiResponse,
									isUser: false,
								});
							}
							return newMessages;
						});
					},
					onError: error => {
						console.error('Chat error:', error);
						setMessages(prev => [
							...prev,
							{
								content: 'Sorry, I encountered an error. Please try again.',
								isUser: false,
							},
						]);
					},
				},
			});
		} finally {
			setLoading(false);
		}
	};

	const handleClear = () => {
		setMessages([]);
		setInput('');
	};

	return (
		<div className="flex flex-col h-[calc(100vh-8rem)]">
			<div className="flex items-center justify-between p-4 border-b border-surface-variant">
				<div className="flex items-center gap-2">
					<Bot size={24} className="text-primary" />
					<h2 className="text-xl font-semibold">Freestyle Chat</h2>
				</div>
				<button
					onClick={handleClear}
					className="p-2 rounded-full hover:bg-surface-variant transition-colors"
					title="Clear chat"
				>
					<Trash2 size={20} className="text-primary" />
				</button>
			</div>

			<div className="flex-1 overflow-y-auto">
				{messages.length === 0 ? (
					<div className="h-full flex items-center justify-center text-center p-8">
						<div className="max-w-sm">
							<Bot size={48} className="mx-auto mb-4 text-primary opacity-50" />
							<h3 className="text-lg font-medium mb-2">Welcome to Freestyle Chat!</h3>
							<p className="text-sm text-gray-600">
								Ask me anything! I'm here to help with writing, analysis, coding, or
								any other topic.
							</p>
						</div>
					</div>
				) : (
					messages.map((message, index) => (
						<ChatMessage
							key={index}
							content={message.content}
							isUser={message.isUser}
						/>
					))
				)}
				<div ref={messagesEndRef} />
			</div>

			<form onSubmit={handleSubmit} className="p-4 border-t border-surface-variant">
				<div className="flex gap-2">
					<input
						type="text"
						value={input}
						onChange={e => setInput(e.target.value)}
						placeholder="Type your message..."
						className="flex-1 rounded-lg border border-surface-variant bg-white px-4 py-2 text-sm focus:border-primary focus:outline-none"
						disabled={loading}
					/>
					<button
						type="submit"
						disabled={loading || !input.trim()}
						className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
					>
						{loading ? 'Sending...' : 'Send'}
					</button>
				</div>
			</form>
		</div>
	);
}
