import React from 'react';

interface ModalOverlayProps {
	children: React.ReactNode;
	onClose?: () => void;
}

export const ModalOverlay: React.FC<ModalOverlayProps> = ({ children, onClose }) => (
	<div className="relative inset-0 z-50 overflow-y-auto">
		<div className="flex min-h-full items-center justify-center p-4">
			<div
				className="fixed max-w-[500px] inset-0 ml-auto bg-black bg-opacity-25 transition-opacity"
				onClick={onClose}
				aria-hidden="true"
			/>
			{children}
		</div>
	</div>
);
