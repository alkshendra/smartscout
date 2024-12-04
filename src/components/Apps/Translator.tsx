import React, { useState, useEffect } from 'react';
import { Languages } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TabView } from '../shared/TabView';
import { ContentInput } from '../shared/ContentInput';
import { LanguageSelect } from '../shared/LanguageSelect';
import { usePageInfo } from '../../hooks/usePageInfo';
import { useTranslation } from '../../hooks/useTranslation';

const tabs = [
	{ id: 'new', label: 'New Content' },
	{ id: 'translate', label: 'Translate Page' },
];

export function Translator() {
	const pageInfo = usePageInfo();
	const { translate, isTranslating, error, detectedLanguage, getLanguageDisplay } =
		useTranslation();
	const [activeTab, setActiveTab] = useState('new');
	const [content, setContent] = useState('');
	const [targetLang, setTargetLang] = useState('es');
	const [translation, setTranslation] = useState('');

	const handleTranslate = async () => {
		const textToTranslate = activeTab === 'new' ? content : pageInfo?.content || '';

		await translate(textToTranslate, {
			targetLanguage: targetLang,
			onProgress: chunk => {
				setTranslation(chunk);
			},
		});
	};

	console.log({ translate, detectedLanguage });
	return (
		<div className="p-4">
			<div className="space-y-4">
				<TabView tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

				{detectedLanguage && (
					<div className="text-sm text-gray-600">
						{/* {detectedLanguage.confidence * 100}% sure this is{' '} */}
						Content Language: {getLanguageDisplay(detectedLanguage.detectedLanguage)}
					</div>
				)}

				<LanguageSelect value={targetLang} onChange={setTargetLang} />

				{activeTab === 'new' && (
					<ContentInput
						value={content}
						onChange={setContent}
						placeholder="Enter text to translate..."
					/>
				)}

				<button
					onClick={handleTranslate}
					disabled={isTranslating || (activeTab === 'translate' && !pageInfo)}
					className="w-full rounded-lg bg-primary py-2 text-white hover:opacity-90 disabled:opacity-50"
				>
					{isTranslating ? 'Translating...' : 'Translate'}
				</button>

				{error && <div className="rounded-lg bg-red-100 p-4 text-red-700">{error}</div>}

				{translation && (
					<div className="rounded-lg bg-surface-variant p-4">
						<div className="prose prose-sm max-w-none dark:prose-invert overflow-x-auto">
							<ReactMarkdown>{translation}</ReactMarkdown>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
