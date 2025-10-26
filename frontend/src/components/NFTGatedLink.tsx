import { Lock, ExternalLink } from 'lucide-react'
import { useState } from 'react'

interface NFTGatedLinkProps {
	label: string
	url: string
	requiredNFT?: {
		type?: string // NFT type pattern
		collection?: string // Collection name
		specificId?: string // Specific NFT ID
	}
	userNFTs: Array<{
		id: string
		type: string
		collection?: string
	}>
	onClick?: () => void
}

export default function NFTGatedLink({ label, url, requiredNFT, userNFTs, onClick }: NFTGatedLinkProps) {
	const [showLockMessage, setShowLockMessage] = useState(false)

	// Check if user has required NFT
	const hasAccess = () => {
		if (!requiredNFT) return true

		return userNFTs.some((nft) => {
			// Check specific NFT ID
			if (requiredNFT.specificId) {
				return nft.id === requiredNFT.specificId
			}

			// Check collection
			if (requiredNFT.collection) {
				return nft.collection?.toLowerCase().includes(requiredNFT.collection.toLowerCase())
			}

			// Check NFT type pattern
			if (requiredNFT.type) {
				return nft.type.toLowerCase().includes(requiredNFT.type.toLowerCase())
			}

			return false
		})
	}

	const hasNFT = hasAccess()

	const handleClick = (e: React.MouseEvent) => {
		if (!hasNFT) {
			e.preventDefault()
			setShowLockMessage(true)
			setTimeout(() => setShowLockMessage(false), 3000)
		} else {
			onClick?.()
		}
	}

	return (
		<div className="relative">
			<a
				href={hasNFT ? url : '#'}
				target="_blank"
				rel="noopener noreferrer"
				onClick={handleClick}
				className={`
					block w-full text-center py-4 px-6 rounded-xl font-medium transition-all
					${
						hasNFT
							? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-[1.02]'
							: 'bg-gray-200 text-gray-500 cursor-not-allowed'
					}
				`}
			>
				<div className="flex items-center justify-center gap-2">
					{!hasNFT && <Lock className="w-4 h-4" />}
					<span>{label}</span>
					{hasNFT && <ExternalLink className="w-4 h-4" />}
				</div>
			</a>

			{/* Lock Message */}
			{showLockMessage && !hasNFT && (
				<div className="absolute top-full mt-2 left-0 right-0 bg-red-100 text-red-700 text-sm p-3 rounded-lg shadow-lg animate-fade-in">
					🔒 This link requires{' '}
					{requiredNFT?.collection || requiredNFT?.type || 'a specific NFT'} to access
				</div>
			)}

			{/* NFT Requirement Badge */}
			{!hasNFT && requiredNFT && (
				<div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-md">
					NFT Required
				</div>
			)}
		</div>
	)
}
