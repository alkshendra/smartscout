export type SocialPlatform = {
	id: string;
	name: string;
	icon: JSX.Element;
	shareUrl: (text: string) => string;
	maxLength?: number;
};

export type TabId = 'new' | 'existing';

export type Tab = {
	id: 'new' | 'existing';
	label: string;
};

export type PostContent = {
	title: string;
	content: string;
	url?: string;
};

export type PostEditorProps = {
	content: PostContent;
	onChange: (content: PostContent) => void;
	placeholder?: string;
};

export type ShareModalProps = {
	isOpen: boolean;
	onClose: () => void;
	content: string;
	onShare: (platform: SocialPlatform) => void;
};
