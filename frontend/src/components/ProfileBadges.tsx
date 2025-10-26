import { Award, Star, Trophy, Shield, Crown } from 'lucide-react'

interface Badge {
	id: string
	name: string
	description: string
	icon: 'award' | 'star' | 'trophy' | 'shield' | 'crown'
	nftType?: string // NFT type pattern to match
	color: string
}

export const AVAILABLE_BADGES: Badge[] = [
	{
		id: 'nft-collector',
		name: 'NFT Collector',
		description: 'Own 5+ NFTs',
		icon: 'award',
		color: 'text-blue-600',
	},
	{
		id: 'nft-whale',
		name: 'NFT Whale',
		description: 'Own 20+ NFTs',
		icon: 'crown',
		color: 'text-yellow-600',
	},
	{
		id: 'early-adopter',
		name: 'Early Adopter',
		description: 'Created profile in first week',
		icon: 'star',
		color: 'text-purple-600',
	},
	{
		id: 'verified',
		name: 'Verified',
		description: 'Profile verified by community',
		icon: 'shield',
		color: 'text-green-600',
	},
	{
		id: 'top-creator',
		name: 'Top Creator',
		description: 'Profile viewed 1000+ times',
		icon: 'trophy',
		color: 'text-orange-600',
	},
]

interface ProfileBadgesProps {
	nftCount: number
	profileCreatedAt?: number
	viewCount?: number
	earnedBadgeIds?: string[]
}

export default function ProfileBadges({
	nftCount,
	profileCreatedAt,
	viewCount = 0,
	earnedBadgeIds = [],
}: ProfileBadgesProps) {
	const earnedBadges: Badge[] = []

	// NFT-based badges
	if (nftCount >= 20) {
		earnedBadges.push(AVAILABLE_BADGES.find((b) => b.id === 'nft-whale')!)
	} else if (nftCount >= 5) {
		earnedBadges.push(AVAILABLE_BADGES.find((b) => b.id === 'nft-collector')!)
	}

	// View count badges
	if (viewCount >= 1000) {
		earnedBadges.push(AVAILABLE_BADGES.find((b) => b.id === 'top-creator')!)
	}

	// Early adopter badge (within first week of deployment)
	if (profileCreatedAt) {
		const deploymentDate = new Date('2025-10-25').getTime()
		const oneWeek = 7 * 24 * 60 * 60 * 1000
		if (profileCreatedAt - deploymentDate < oneWeek) {
			earnedBadges.push(AVAILABLE_BADGES.find((b) => b.id === 'early-adopter')!)
		}
	}

	// Add manually earned badges
	earnedBadgeIds.forEach((id) => {
		const badge = AVAILABLE_BADGES.find((b) => b.id === id)
		if (badge && !earnedBadges.find((b) => b.id === id)) {
			earnedBadges.push(badge)
		}
	})

	if (earnedBadges.length === 0) return null

	const getIcon = (iconName: string, className: string) => {
		switch (iconName) {
			case 'award':
				return <Award className={className} />
			case 'star':
				return <Star className={className} />
			case 'trophy':
				return <Trophy className={className} />
			case 'shield':
				return <Shield className={className} />
			case 'crown':
				return <Crown className={className} />
			default:
				return <Award className={className} />
		}
	}

	return (
		<div className="flex gap-2 flex-wrap justify-center">
			{earnedBadges.map((badge) => (
				<div
					key={badge.id}
					className="group relative"
					title={`${badge.name}: ${badge.description}`}
				>
					<div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center shadow-md hover:shadow-lg transition-all cursor-pointer">
						{getIcon(badge.icon, `w-5 h-5 ${badge.color}`)}
					</div>
					
					{/* Tooltip */}
					<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
						<div className="font-semibold">{badge.name}</div>
						<div className="text-gray-300 text-[10px]">{badge.description}</div>
						<div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
					</div>
				</div>
			))}
		</div>
	)
}
