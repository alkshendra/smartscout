import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

import { TabView } from '../../shared/TabView';
// import { ShareButton } from './ShareButton';
// import { ShareModal } from './ShareModal';
import { PostEditor } from './PostEditor';
import { Tab, TabId, PostContent, SocialPlatform } from './post.types';
import { PlatformSelector } from './PlatformSelector';
import { ContentPreview } from './ContentPreview';
import { aiPrompt } from '../../../utils/aiPrompt';
import { parseJSONFromMarkdown } from '../../../utils/parseJSONFromMarkdown';
import { extractPageContent } from '../../../utils/seoAnalyzer';
import { usePageInfo } from '../../../hooks/usePageInfo';
// import { getPageContent } from './utils/pageData';

function formatShareContent(post: PostContent): string {
	const parts = [post.title];

	if (post.content) {
		parts.push('\n\n' + post.content);
	}

	if (post.url) {
		parts.push('\n\n' + post.url);
	}

	return parts.join('');
}

const tabs: Tab[] = [
	{
		id: 'new',
		label: 'Create New Post',
	},
	{
		id: 'existing',
		label: 'Use Page Content',
	},
];

export function Post() {
	const pageInfo = usePageInfo();
	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState<TabId>('new');
	const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
	const [newPost, setNewPost] = useState<PostContent>({
		title: '',
		content: '',
	});
	const [existingPost, setExistingPost] = useState<PostContent>({
		title: '',
		content: '',
		url: '',
	});
	const [editedExistingPost, setEditedExistingPost] = useState<PostContent>({
		title: '',
		content: '',
		url: '',
	});
	const [showPreview, setShowPreview] = useState(false);

	useEffect(() => {
		const fetchAnalysis = async () => {
			setLoading(true);
			try {
				const systemPrompt = `You are a social media expert. You are analyzing the following text content and creating a short summary to post on social media for ${selectedPlatform?.name} platform`;
				const prompt = ` Analyze the following webpage content.
                Create a short summary to post on social media for ${selectedPlatform?.name} with the following content:

                Respond in the following JSON format:
                {
                    title: pageData.title,
                    content: pageData.selectedText || pageData.description,
                    url: pageData.url,
                }

                Page text content:
                ${pageInfo?.content}
            `;

				await aiPrompt({
					prompt,
					systemPrompt,
					content: pageInfo?.content,
					stream: false,
					callbacks: {
						onChunk: chunk => {
							try {
								const parsedJSON = parseJSONFromMarkdown(chunk);
								console.log('parsedJSON', parsedJSON);
								setExistingPost(parsedJSON);
								setEditedExistingPost(parsedJSON);
							} catch (error) {
								console.error(error.message);
							} finally {
								setLoading(false);
							}
						},
						onError: error => {
							console.error('Chat error:', error);
						},
					},
				});
			} catch (error) {
				console.error('Post creation failed:', error);
				throw error;
			} finally {
				setLoading(false);
			}
		};

		if (pageInfo?.content && activeTab === 'existing' && selectedPlatform) {
			fetchAnalysis();
		}
	}, [activeTab, selectedPlatform, pageInfo]);

	const handleTabChange = (tabId: TabId) => {
		setActiveTab(tabId);
		if (tabId === 'existing') {
			setEditedExistingPost(existingPost);
		}
		setShowPreview(false);
	};

	const handleCreate = () => {
		if (selectedPlatform && currentPost.content) {
			setShowPreview(true);
		}
	};

	const currentPost = activeTab === 'new' ? newPost : editedExistingPost;
	const setCurrentPost = activeTab === 'new' ? setNewPost : setEditedExistingPost;

	const formattedContent = formatShareContent(currentPost);
	const isContentValid = currentPost.title || currentPost.content;
	const isContentTooLong = selectedPlatform?.maxLength
		? formattedContent.length > selectedPlatform.maxLength
		: false;

	if (loading) {
		return (
			<>
				<TabView tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

				{loading && (
					<div className="w-[400px] h-[600px] flex items-center justify-center">
						<Activity className="w-8 h-8 text-blue-500 animate-spin" />
					</div>
				)}
			</>
		);
	}

	return (
		<>
			<TabView tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

			<div className="mb-6">
				<h2 className="text-lg font-medium mb-3">Select Platform</h2>
				<PlatformSelector
					selectedPlatform={selectedPlatform}
					onSelect={setSelectedPlatform}
				/>
			</div>

			{activeTab === 'existing' && (
				<div className="mb-4 p-4 bg-gray-50 rounded-lg">
					<h2 className="text-sm font-medium text-gray-700 mb-2">
						Original Page Content
					</h2>
					<div className="text-sm text-gray-600">
						<p className="font-medium">
							Title: <span className="font-normal">{existingPost.title}</span>
						</p>
						<p className="font-medium mt-1">
							Content: <span className="font-normal">{existingPost.content}</span>
						</p>
					</div>
				</div>
			)}

			<PostEditor
				content={currentPost}
				onChange={setCurrentPost}
				placeholder={
					activeTab === 'existing' ? 'Edit the page content...' : 'Create your post...'
				}
			/>

			<div className="mt-6">
				<button
					onClick={handleCreate}
					disabled={!selectedPlatform || !isContentValid || isContentTooLong}
					className={`w-full py-2 px-4 rounded-lg text-white transition-colors ${
						!selectedPlatform || !isContentValid || isContentTooLong
							? 'bg-gray-400 cursor-not-allowed'
							: 'bg-blue-600 hover:bg-blue-700'
					}`}
				>
					{!selectedPlatform
						? 'Select a platform'
						: !isContentValid
						? 'Add content'
						: isContentTooLong
						? 'Content too long'
						: 'Create Post'}
				</button>
			</div>

			{showPreview && selectedPlatform && (
				<ContentPreview content={formattedContent} platform={selectedPlatform} />
			)}
		</>
	);
}
