import React from 'react';

export function Loader() {
	return (
		<svg width="120" height="110" viewBox="0 0 120 110" xmlns="http://www.w3.org/2000/svg">
			<rect
				x="20"
				y="30"
				width="80"
				height="50"
				rx="25"
				fill="none"
				stroke="var(--color-primary)"
				stroke-width="4"
			/>

			<line x1="40" y1="20" x2="40" y2="30" stroke="var(--color-primary)" stroke-width="4" />
			<circle cx="40" cy="18" r="3" fill="var(--color-primary)">
				<animate attributeName="r" values="3;5;3" dur="1s" repeatCount="indefinite" />
			</circle>
			<line x1="80" y1="20" x2="80" y2="30" stroke="var(--color-primary)" stroke-width="4" />
			<circle cx="80" cy="18" r="3" fill="var(--color-primary)">
				<animate
					attributeName="r"
					values="3;5;3"
					dur="1s"
					repeatCount="indefinite"
					begin="0.2s"
				/>
			</circle>

			<circle cx="45" cy="55" r="5" fill="var(--color-primary)">
				<animate attributeName="r" values="5;7;5" dur="1s" repeatCount="indefinite" />
			</circle>
			<circle cx="75" cy="55" r="5" fill="var(--color-primary)">
				<animate
					attributeName="r"
					values="5;7;5"
					dur="1s"
					repeatCount="indefinite"
					begin="0.2s"
				/>
			</circle>

			<circle cx="20" cy="30" r="4" fill="var(--color-primary)">
				<animate
					attributeName="opacity"
					values="1;0;1"
					dur="1.5s"
					repeatCount="indefinite"
				/>
			</circle>
			<circle cx="100" cy="30" r="4" fill="var(--color-primary)">
				<animate
					attributeName="opacity"
					values="1;0;1"
					dur="1.5s"
					repeatCount="indefinite"
					begin="0.3s"
				/>
			</circle>
		</svg>
	);
}
