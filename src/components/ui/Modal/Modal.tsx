import React, { useEffect, useRef } from 'react';
import { X, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { ModalHeader } from './ModalHeader';
import { ModalContent } from './ModalContent';
import { ModalFooter } from './ModalFooter';
import { ModalOverlay } from './ModalOverlay';
import { ModalProps } from './types';

export const Modal: React.FC<ModalProps> & {
	Header: typeof ModalHeader;
	Content: typeof ModalContent;
	Footer: typeof ModalFooter;
} = ({
	isOpen,
	onClose,
	children,
	className,
	variant = 'default',
	showCloseButton = true,
	closeOnOverlayClick = true,
}) => {
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const variantStyles = {
		default: '',
		alert: 'border-l-4 border-red-500',
		success: 'border-l-4 border-green-500',
		warning: 'border-l-4 border-yellow-500',
	};

	const variantIcons = {
		default: null,
		alert: <AlertCircle className="w-6 h-6 text-red-500" />,
		success: <CheckCircle2 className="w-6 h-6 text-green-500" />,
		warning: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
	};

	return (
		<ModalOverlay onClose={closeOnOverlayClick ? onClose : undefined}>
			<div
				ref={modalRef}
				role="dialog"
				aria-modal="true"
				className={cn(
					'relative w-full max-w-lg bg-white rounded-lg shadow-xl',
					'transform transition-all',
					variantStyles[variant],
					className,
				)}
				onClick={e => e.stopPropagation()}
			>
				{showCloseButton && (
					<button
						onClick={onClose}
						className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						aria-label="Close modal"
					>
						<X className="w-5 h-5" />
					</button>
				)}
				{variantIcons[variant] && (
					<div className="absolute top-4 left-4">{variantIcons[variant]}</div>
				)}
				{children}
			</div>
		</ModalOverlay>
	);
};

Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;
