import React from 'react';
import { Copy, Check } from 'lucide-react';
import { SocialPlatform } from './post.types';

type ContentPreviewProps = {
	content: string;
	platform: SocialPlatform;
};

export function ContentPreview({ content, platform }: ContentPreviewProps) {
	const [copied, setCopied] = React.useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(content);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const isContentTooLong = platform.maxLength && content.length > platform.maxLength;

	return (
		<div className="mt-6 bg-gray-50 rounded-lg p-4">
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center gap-2">
					{platform.icon}
					<span className="font-medium">{platform.name}</span>
				</div>
				<button
					onClick={handleCopy}
					className="p-2 hover:bg-gray-200 rounded-full transition-colors"
					title="Copy to clipboard"
				>
					{copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
				</button>
			</div>
			<div className="whitespace-pre-wrap break-words">{content}</div>
			{platform.maxLength && (
				<div
					className={`text-sm mt-2 ${
						isContentTooLong ? 'text-red-500' : 'text-gray-500'
					}`}
				>
					{content.length} / {platform.maxLength} characters
					{isContentTooLong && ' (Content too long)'}
				</div>
			)}
		</div>
	);
}
