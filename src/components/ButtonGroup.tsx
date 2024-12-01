import React from "react";

import { cn } from "../utils/cn";

export default function ButtonGroup({
	items,
	activeId,
	onClick,
}: {
	items: { id: string; label: string; onClick?: () => void }[];
	activeId?: string;
	onClick?: (id: string) => void;
}) {
	return (
		<div className="flex rounded-lg shadow-sm">
			{items.map((item, index) => (
				<button
					type="button"
					// className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
					className={cn(
						"py-3 px-4 inline-flex items-center gap-x-2 bg-primary text-white hover:bg-primary-active -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10",
						item.id === activeId && "bg-primary-active"
					)}
					// className="py-3 px-4 w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600 first:rounded-s-lg first:ms-0 last:rounded-e-lg "
					onClick={() => {
						if (item.onClick) {
							item.onClick();
						} else if (onClick) {
							onClick(item.id);
						}
					}}
				>
					{item.label}
				</button>
			))}
		</div>
	);
}
