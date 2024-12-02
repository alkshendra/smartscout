import React from 'react';
import { ExternalLink, Image, FileText, Video, Link as LinkIcon } from 'lucide-react';
import { LinkMetadata } from '../../types';

interface LinkPreviewProps {
	link: LinkMetadata;
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({ link }) => {
	const getIcon = () => {
		if (link.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return <Image className="w-6 h-6" />;
		if (link.url.match(/\.(mp4|webm|mov)$/i)) return <Video className="w-6 h-6" />;
		if (link.url.match(/\.(pdf|doc|docx|txt)$/i)) return <FileText className="w-6 h-6" />;
		return <LinkIcon className="w-6 h-6" />;
	};

	return (
		<div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
			{link.thumbnail ? (
				<img
					src={link.thumbnail}
					alt={link.title}
					className="w-24 h-24 object-cover rounded-lg"
				/>
			) : (
				<div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
					{getIcon()}
				</div>
			)}
			<div className="flex-1 min-w-0">
				<h3 className="font-medium text-lg text-gray-900 truncate">{link.title}</h3>
				{link.description && (
					<p className="text-gray-600 text-sm mt-1 line-clamp-2">{link.description}</p>
				)}
				<div className="flex items-center gap-2 mt-2">
					<span className="text-sm text-gray-500 truncate">{link.url}</span>
					<a
						href={link.url}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-500 hover:text-blue-600"
					>
						<ExternalLink size={16} />
					</a>
				</div>
			</div>
		</div>
	);
};
