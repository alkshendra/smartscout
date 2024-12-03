import React from 'react';
import { cn } from '../../../utils/cn';

interface ModalContentProps {
	children: React.ReactNode;
	className?: string;
}

export const ModalContent: React.FC<ModalContentProps> = ({ children, className }) => (
	<div className={cn('px-6 py-4', className)}>{children}</div>
);
