import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { platforms } from '../../../utils/socialPlatforms';
import { SocialPlatform } from './post.types';

import { ShareModalProps } from './post.types';

export function ShareModal({ isOpen, onClose, content: initialContent, onShare }: ShareModalProps) {
	const [content, setContent] = useState(initialContent);
	const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);

	useEffect(() => {
		setContent(initialContent);
	}, [initialContent]);

	if (!isOpen) return null;

	const handlePlatformSelect = (platform: SocialPlatform) => {
		setSelectedPlatform(platform);
	};

	const handleShare = () => {
		if (selectedPlatform) {
			onShare(selectedPlatform);
			setSelectedPlatform(null);
		}
	};

	const isContentTooLong = selectedPlatform?.maxLength
		? content.length > selectedPlatform.maxLength
		: false;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-xl w-full max-w-md p-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">Share to Social Media</h2>
					<button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
						<X size={20} />
					</button>
				</div>

				<div className="mb-4">
					<textarea
						className={`w-full p-3 border rounded-lg h-32 resize-none ${
							isContentTooLong ? 'border-red-500' : 'border-gray-300'
						}`}
						value={content}
						onChange={e => setContent(e.target.value)}
						placeholder="Edit your post content..."
					/>
					{selectedPlatform?.maxLength && (
						<div
							className={`text-sm mt-1 flex items-center gap-1 ${
								isContentTooLong ? 'text-red-500' : 'text-gray-500'
							}`}
						>
							{isContentTooLong && <AlertCircle size={14} />}
							<span>
								{content.length} / {selectedPlatform.maxLength} characters
							</span>
						</div>
					)}
				</div>

				<div className="grid grid-cols-2 gap-3 mb-4">
					{platforms.map(platform => (
						<button
							key={platform.id}
							onClick={() => handlePlatformSelect(platform)}
							className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
								selectedPlatform?.id === platform.id
									? 'border-blue-500 bg-blue-50'
									: 'hover:bg-gray-50'
							}`}
						>
							{platform.icon}
							<span>{platform.name}</span>
						</button>
					))}
				</div>

				<button
					onClick={handleShare}
					disabled={!selectedPlatform || isContentTooLong}
					className={`w-full py-2 px-4 rounded-lg text-white transition-colors ${
						!selectedPlatform || isContentTooLong
							? 'bg-gray-400 cursor-not-allowed'
							: 'bg-blue-600 hover:bg-blue-700'
					}`}
				>
					{isContentTooLong
						? 'Content too long'
						: selectedPlatform
						? `Share to ${selectedPlatform.name}`
						: 'Select a platform'}
				</button>
			</div>
		</div>
	);
}
