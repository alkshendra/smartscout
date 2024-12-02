export interface ThemeColor {
	id: string;
	name: string;
	primary: string;
	surface: string;
	surfaceVariant: string;
	onSurface: string;
}

export interface LinkMetadata {
	url: string;
	title: string;
	description?: string;
	thumbnail?: string;
	category: string;
}
