import { Facebook, Linkedin, MessageCircle, Share2, Twitter } from 'lucide-react';
import { SocialPlatform } from '../components/Apps/Post/post.types';

export const platforms: SocialPlatform[] = [
	{
		id: 'twitter',
		name: 'X (Twitter)',
		icon: <Twitter size={20} />,
		shareUrl: text => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
		maxLength: 280,
	},
	{
		id: 'facebook',
		name: 'Facebook',
		icon: <Facebook size={20} />,
		shareUrl: text =>
			`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
				window.location.href,
			)}&quote=${encodeURIComponent(text)}`,
		maxLength: 500,
	},
	{
		id: 'linkedin',
		name: 'LinkedIn',
		icon: <Linkedin size={20} />,
		shareUrl: text =>
			`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
				window.location.href,
			)}&title=${encodeURIComponent(text)}`,
		maxLength: 700,
	},
	{
		id: 'reddit',
		name: 'Reddit',
		icon: <Share2 size={20} />,
		shareUrl: text =>
			`https://reddit.com/submit?url=${encodeURIComponent(
				window.location.href,
			)}&title=${encodeURIComponent(text)}`,
		maxLength: 300,
	},
	{
		id: 'peer',
		name: 'Peer List',
		icon: <MessageCircle size={20} />,
		shareUrl: text =>
			`mailto:?subject=${encodeURIComponent('Check this out')}&body=${encodeURIComponent(
				text,
			)}`,
	},
];
