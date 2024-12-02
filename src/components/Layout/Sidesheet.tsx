import React from "react";
import { X, ChevronLeft } from "lucide-react";
import { useTime } from "../../hooks/useTime";
import { usePageInfo } from "../../hooks/usePageInfo";

interface SidesheetProps {
	onClose: () => void;
	children: React.ReactNode;
	showBack?: boolean;
	onBack?: () => void;
	title?: string;
}

export function Sidesheet({
	onClose,
	children,
	showBack,
	onBack,
	title,
}: SidesheetProps) {
	const time = useTime();
	const pageInfo = usePageInfo();

	return (
		<div className="fixed right-0 top-0 h-screen w-full max-w-[500px] bg-surface-variant shadow-2xl rounded-bl-[56px] overflow-y-auto">
			<div className="flex items-center justify-between p-4 sticky top-0 bg-surface-variant">
				<div className="flex items-center gap-4">
					{showBack && (
						<button
							onClick={onBack}
							className="rounded-full p-2 hover:bg-surface-variant transition-colors"
							title="Go back"
						>
							<ChevronLeft size={24} className="text-primary" />
						</button>
					)}
					<span className="text-xl font-medium text-primary">
						{title || time}
					</span>
				</div>
				<button
					onClick={onClose}
					className="rounded-full p-2 hover:bg-surface-variant transition-colors"
					title="Close"
				>
					<X size={24} className="text-primary" />
				</button>
			</div>
			{pageInfo && (
				<div className="border-b border-surface-variant p-4">
					<p className="text-sm font-medium text-primary">
						Current Page
					</p>
					<h2 className="text-lg truncate">{pageInfo.title}</h2>
				</div>
			)}
			<div className="min-h-[calc(100vh-4rem)] h-auto bg-surface rounded-[56px] rounded-br-[0px] p-8">
				{children}
			</div>
		</div>
	);
}
