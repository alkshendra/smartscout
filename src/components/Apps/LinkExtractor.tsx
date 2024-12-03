import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

// import ReactMarkdown from 'react-markdown';

import { Modal } from '../ui/Modal/Modal';
import { LinkList } from '../shared/LinkList';
import { ModalVariant } from '../ui/Modal/types';
import { usePageInfo } from '../../hooks/usePageInfo';
import { useLinkExtractor } from '../../hooks/useLinkExtractor';

export function LinkExtractor() {
	const pageInfo = usePageInfo();
	const { links, loading, error, rescan } = useLinkExtractor();
	const [isOpen, setIsOpen] = useState(false);
	const [modalVariant, setModalVariant] = useState<ModalVariant>('default');

	const openModal = (variant: ModalVariant) => {
		setModalVariant(variant);
		setIsOpen(true);
	};

	useEffect(() => {
		if (error && !loading) {
			openModal('alert');
		}
	}, [error, loading]);

	return (
		<div className="space-y-4">
			<button
				onClick={rescan}
				disabled={loading || !pageInfo}
				className="w-full rounded-lg bg-primary py-2 text-white hover:opacity-90 disabled:opacity-50"
			>
				{loading ? 'Extracting...' : 'Extract Links'}
			</button>

			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} variant={modalVariant}>
				<Modal.Header>
					<h2 className="text-xl font-semibold text-gray-900 pl-8">Oops 😮‍💨</h2>
				</Modal.Header>
				<Modal.Content>
					<p className="text-gray-60" dangerouslySetInnerHTML={{ __html: error }} />
				</Modal.Content>
				<Modal.Footer>
					<button
						onClick={() => setIsOpen(false)}
						className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
					>
						Sad 😪
					</button>
				</Modal.Footer>
			</Modal>

			{loading ? (
				<div className="flex items-center justify-center my-8">
					<Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
				</div>
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
