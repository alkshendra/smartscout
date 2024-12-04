import React, { useEffect, useState } from 'react';
import { useTOC } from '../../hooks/useToc';
import { usePageInfo } from '../../hooks/usePageInfo';
import ReactMarkdown from 'react-markdown';

export function TOC() {
	const { toc, error } = useTOC();
	const pageInfo = usePageInfo();
	const [headings, setHeadings] = useState<any[]>([]);

	const handleClick = (heading: any) => {
		window.parent.postMessage({ action: 'redirect', url: `#${heading.id}` }, '*');
	};

	useEffect(() => {
		if (!pageInfo?.htmlContent) {
			return;
		}
		const dom = document.createElement('body');
		dom.innerHTML = pageInfo?.htmlContent || '';
		const headings = dom.querySelectorAll('h1, h2, h3, h4, h5, h6');
		const filteredHeadings: any = [];
		headings.forEach(headingsItem => {
			if (headingsItem.id) {
				filteredHeadings.push(headingsItem);
			}
		});
		setHeadings(filteredHeadings);
	}, [pageInfo?.htmlContent]);

	const getLinkStyle = (level: string) => ({
		paddingLeft: `calc(${level} * 1rem)`,
		fontSize: level === '1' ? '1.125rem' : level === '2' ? '1rem' : '0.875rem',
		fontWeight: level === '1' ? 700 : level === '2' ? 600 : 400,
	});
	return (
		<>
			{headings.length ? (
				<>
					<ul>
						{headings.map(heading => (
							<li key={heading.id} className="mb-2">
								<a
									onClick={() => handleClick(heading)}
									className="cursor-pointer font-semibold"
									style={getLinkStyle(heading.nodeName.replace('H', ''))}
								>
									{heading.innerText}
								</a>
							</li>
						))}
					</ul>
				</>
			) : null}

			{toc && (
				<>
					<h2>Smart TOC</h2>
					<div>
						<ReactMarkdown>{toc}</ReactMarkdown>
						{error && (
							<div className="rounded-lg bg-red-100 p-4 text-red-700">{error}</div>
						)}
					</div>
				</>
			)}
		</>
	);
}
