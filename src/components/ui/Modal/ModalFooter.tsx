import React from 'react';
import { cn } from '../../../utils/cn';

interface ModalFooterProps {
	children: React.ReactNode;
	className?: string;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ children, className }) => (
	<div className={cn('px-6 py-4 border-t border-gray-200 flex justify-end gap-2', className)}>
		{children}
	</div>
);
