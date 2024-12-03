import { PostContent } from './post.types';

type PostEditorProps = {
	content: PostContent;
	onChange: (content: PostContent) => void;
	placeholder?: string;
};

export function PostEditor({ content, onChange, placeholder }: PostEditorProps) {
	return (
		<div className="space-y-4">
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
				<input
					type="text"
					value={content.title}
					onChange={e => onChange({ ...content, title: e.target.value })}
					className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					placeholder={placeholder ? `${placeholder} (Title)` : 'Enter post title...'}
				/>
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
				<textarea
					value={content.content}
					onChange={e => onChange({ ...content, content: e.target.value })}
					className="w-full p-2 border rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					placeholder={placeholder ? `${placeholder} (Content)` : 'Enter post content...'}
				/>
			</div>
		</div>
	);
}
