import React from 'react';
import { cn } from '../../../utils/cn';

interface ModalHeaderProps {
	children: React.ReactNode;
	className?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ children, className }) => (
	<div className={cn('px-6 py-4 border-b border-gray-200', className)}>{children}</div>
);
