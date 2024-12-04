import React from 'react';
import { X, ChevronLeft, Bot } from 'lucide-react';

import { cn } from '../../utils/cn';
import { useTime } from '../../hooks/useTime';
import { usePageInfo } from '../../hooks/usePageInfo';
import { useTheme } from '../../context/ThemeContext';

interface SidesheetProps {
	onClose: () => void;
	children: React.ReactNode;
	showBack?: boolean;
	onBack?: () => void;
	title?: string;
}

export function Sidesheet({ onClose, children, showBack, onBack, title }: SidesheetProps) {
	const time = useTime();
	const pageInfo = usePageInfo();
	const { currentTheme } = useTheme();

	const rotate = () => {
		// setRotate(rotate + 1);
	};
	return (
		<div
			className={cn(
				'fixed right-0 top-0 flex flex-col h-screen w-[calc(100%-30px)] max-w-[500px] bg-surface-variant shadow-2xl rounded-bl-[56px] overflow-y-auto',
				currentTheme?.id === 'black' ? 'darkMode' : '',
			)}
		>
			<div className="flex items-center justify-between p-4 sticky top-0 bg-surface-variant">
				<div className="flex items-center gap-4">
					<button
						onClick={showBack ? onBack : rotate}
						className="rounded-full p-2 hover:bg-surface-variant transition-colors"
						title="Go back"
					>
						{showBack ? (
							<ChevronLeft size={24} className="text-primary" />
						) : (
							<Bot size={24} className="text-primary" />
						)}
					</button>
				</div>
				<span className="text-xl font-medium text-primary">{title || 'SmartScout'}</span>
				<button
					onClick={onClose}
					className="rounded-full p-2 hover:bg-surface-variant transition-colors"
					title="Close"
				>
					<X size={24} className="text-primary" />
				</button>
			</div>
			{/* {pageInfo && (
				<div className="border-b border-surface-variant p-4">
					<p className="text-sm font-medium text-primary">
						Current Page
					</p>
					<h2 className="text-lg truncate">{pageInfo.title}</h2>
				</div>
			)} */}
			<div className="flex-grow h-auto bg-surface rounded-[56px] rounded-br-[0px] p-8">
				{children}
			</div>
		</div>
	);
}
