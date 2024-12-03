import React, { useState } from 'react';
import { Notebook } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TabView } from '../shared/TabView';
import { ContextInput } from '../shared/ContextInput';
import { ContentInput } from '../shared/ContentInput';
import { usePageInfo } from '../../hooks/usePageInfo';
import { aiPrompt } from '../../utils/aiPrompt';

const tabs = [
	{ id: 'new', label: 'New Content' },
	{ id: 'rewrite', label: 'Rewrite Page' },
];

export function WritingAssistant() {
	const pageInfo = usePageInfo();
	const [activeTab, setActiveTab] = useState('new');
	const [content, setContent] = useState('');
	const [context, setContext] = useState('');
	const [result, setResult] = useState('');
	const [loading, setLoading] = useState(false);

	const handleWrite = async () => {
		if (loading) return;

		setLoading(true);
		setResult('');

		try {
			const prompt =
				activeTab === 'new'
					? `Write content based on this context: ${context}\n\nContent to work with: ${content}`
					: `Rewrite this content based on the context: ${context}\n\nContent to rewrite: ${
							pageInfo?.content || ''
					  }`;

			await aiPrompt({
				prompt,
				callbacks: {
					onChunk: chunk => {
						setResult(chunk);
					},
					onError: error => {
						console.error('Failed to write:', error);
						setResult('Failed to generate content. Please try again.');
					},
				},
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			<TabView tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

			<ContextInput
				value={context}
				onChange={setContext}
				placeholder="e.g., Make it more formal, write it in a friendly tone..."
			/>

			{activeTab === 'new' && (
				<ContentInput
					value={content}
					onChange={setContent}
					placeholder="Enter your content here..."
				/>
			)}

			<button
				onClick={handleWrite}
				disabled={loading || (activeTab === 'rewrite' && !pageInfo)}
				className="w-full rounded-lg bg-primary py-2 text-white hover:opacity-90 disabled:opacity-50"
			>
				{loading ? 'Writing...' : 'Write'}
			</button>

			{result && (
				<div className="rounded-lg bg-surface-variant p-4">
					<div className="prose prose-sm max-w-none dark:prose-invert">
						<ReactMarkdown>{result}</ReactMarkdown>
					</div>
				</div>
			)}
		</div>
	);
}
