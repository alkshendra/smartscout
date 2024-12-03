import { Share2 } from 'lucide-react';

type ShareButtonProps = {
	onClick: () => void;
	disabled?: boolean;
};

export function ShareButton({ onClick, disabled }: ShareButtonProps) {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
				disabled
					? 'bg-gray-300 cursor-not-allowed'
					: 'bg-blue-600 text-white hover:bg-blue-700'
			}`}
		>
			<Share2 size={20} />
			<span>Share</span>
		</button>
	);
}
