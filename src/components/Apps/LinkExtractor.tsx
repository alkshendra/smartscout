import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

// import ReactMarkdown from 'react-markdown';

import { usePageInfo } from '../../hooks/usePageInfo';
// import { aiPrompt } from '../../utils/aiPrompt';
// import { LinkMetadata } from '../../types';
import { LinkList } from '../shared/LinkList';
// import { categorizeLink, extractLinks } from '../../utils/linkExtractor';
import { useLinkExtractor } from '../../hooks/useLinkExtractor';

export function LinkExtractor() {
	const pageInfo = usePageInfo();
	console.log('🚀 ~ LinkExtractor ~ pageInfo:', pageInfo);
	const { links, loading, error, rescan } = useLinkExtractor();
	// const [links, setLinks] = useState<Array<LinkMetadata>>([]);
	// const [loading, setLoading] = useState(false);
	// const [error, setError] = useState<string | null>(null);
	// console.log('🚀 ~ LinkExtractor ~ links:', links);

	// const handleExtract = async () => {
	// 	if (!pageInfo?.htmlContent || loading) return;

	// 	setLoading(true);
	// 	setLinks([]);

	// try {
	// 	await aiPrompt(
	// 		'Go through the page content thoroughly extract all the links along with their titles, then categorize and list it down as markdown' +
	// 			pageInfo.htmlContent,
	// 		'',
	// 		{
	// 			onChunk: chunk => {
	// 				console.log('🚀 ~ handleExtract ~ chunk:', chunk);
	// 				// setLinks(prev => prev + chunk);
	// 				// setLinks(prev => [...prev, chunk]);
	// 			},
	// 			onError: error => {
	// 				console.error('Failed to extract links:', error);
	// 				// setLinks('Failed to extract links. Please try again.');
	// 				setError(error.message);
	// 			},
	// 		},
	// 	);
	// } finally {
	// 	setLoading(false);
	// }
	// };

	return (
		<div className="space-y-4">
			<button
				onClick={rescan}
				disabled={loading || !pageInfo}
				className="w-full rounded-lg bg-primary py-2 text-white hover:opacity-90 disabled:opacity-50"
			>
				{loading ? 'Extracting...' : 'Extract Links'}
			</button>
			{loading ? (
				<div className="flex items-center justify-center my-8">
					<Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
				</div>
			) : error ? (
				<div className="text-center text-red-500 mt-8">{error}</div>
			) : links.length > 0 ? (
				<LinkList links={links} />
			) : (
				<div className="text-center text-gray-500 mt-8">No links found on this page</div>
			)}

			{/* {links && (
				<div className="rounded-lg bg-surface-variant p-4">
					<div className="prose prose-sm max-w-none dark:prose-invert">
						<ReactMarkdown>{links}</ReactMarkdown>
					</div>
				</div>
			)} */}
		</div>
	);
}
