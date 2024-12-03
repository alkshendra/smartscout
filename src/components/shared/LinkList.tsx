import React from 'react';
import { LinkPreview } from './LinkPreview';
import { LinkMetadata } from '../../types/index';

export interface LinkListProps {
	links: LinkMetadata[];
}

export const LinkList: React.FC<LinkListProps> = ({ links }) => {
	const categories = Array.from(new Set(links.map(link => link.category)));

	return (
		<div className="w-full max-w-4xl space-y-8">
			{categories.map(category => (
				<div key={category}>
					<h2 className="text-xl font-semibold mb-4 text-gray-800">{category}</h2>
					<div className="space-y-4">
						{links
							.filter(link => link.category === category)
							.map((link, index) => (
								<LinkPreview key={`${link.url}-${index}`} link={link} />
							))}
					</div>
				</div>
			))}
		</div>
	);
};
