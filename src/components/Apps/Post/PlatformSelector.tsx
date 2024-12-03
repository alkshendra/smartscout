import { SocialPlatform } from './post.types';
import { platforms } from '../../../utils/socialPlatforms';

type PlatformSelectorProps = {
	selectedPlatform: SocialPlatform | null;
	onSelect: (platform: SocialPlatform) => void;
};

export function PlatformSelector({ selectedPlatform, onSelect }: PlatformSelectorProps) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
			{platforms.map(platform => (
				<button
					key={platform.id}
					onClick={() => onSelect(platform)}
					className={`flex items-center gap-2 p-3 rounded-lg border transition-colors bg-white ${
						selectedPlatform?.id === platform.id
							? 'border-blue-500 bg-blue-100'
							: 'hover:bg-gray-50'
					}`}
				>
					{platform.icon}
					<span>{platform.name}</span>
				</button>
			))}
		</div>
	);
}
