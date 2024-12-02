export type ModalVariant = 'default' | 'alert' | 'success' | 'warning';

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	variant?: ModalVariant;
	className?: string;
	showCloseButton?: boolean;
	closeOnOverlayClick?: boolean;
}
