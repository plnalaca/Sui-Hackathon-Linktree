import { useState } from 'react'
import { X, ExternalLink } from 'lucide-react'

interface NFT {
	id: string
	name: string
	description: string
	imageUrl: string
	collection?: string
	type: string
}

interface NFTGalleryProps {
	nfts: NFT[]
	loading?: boolean
	onSelectNFT?: (nft: NFT) => void
	selectable?: boolean
}

export default function NFTGallery({ nfts, loading, onSelectNFT, selectable }: NFTGalleryProps) {
	const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)

	const handleNFTClick = (nft: NFT) => {
		if (selectable && onSelectNFT) {
			onSelectNFT(nft)
		} else {
			setSelectedNFT(nft)
		}
	}

	if (loading) {
		return (
			<div className="text-center py-8">
				<div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
				<p className="text-gray-600 mt-4">Loading NFTs...</p>
			</div>
		)
	}

	if (nfts.length === 0) {
		return (
			<div className="text-center py-8">
				<p className="text-gray-600">No NFTs found in your wallet</p>
			</div>
		)
	}

	return (
		<>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{nfts.map((nft) => (
					<div
						key={nft.id}
						className={`card p-3 transition-all cursor-pointer ${
							selectable ? 'hover:ring-2 hover:ring-blue-500' : 'hover:shadow-lg'
						}`}
						onClick={() => handleNFTClick(nft)}
					>
						<div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
							{nft.imageUrl ? (
								<img
									src={nft.imageUrl}
									alt={nft.name}
									className="w-full h-full object-cover"
									onError={(e) => {
										// Fallback for broken images
										;(e.target as HTMLImageElement).src =
											'https://via.placeholder.com/300x300?text=NFT'
									}}
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center text-gray-400">
									No Image
								</div>
							)}
						</div>
						<h3 className="font-semibold text-sm truncate">{nft.name}</h3>
						{nft.collection && (
							<p className="text-xs text-gray-500 truncate">{nft.collection}</p>
						)}
					</div>
				))}
			</div>

			{/* NFT Detail Modal */}
			{selectedNFT && !selectable && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex items-start justify-between mb-4">
								<h2 className="text-2xl font-bold">{selectedNFT.name}</h2>
								<button
									onClick={() => setSelectedNFT(null)}
									className="text-gray-500 hover:text-gray-700"
								>
									<X className="w-6 h-6" />
								</button>
							</div>

							<div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
								{selectedNFT.imageUrl && (
									<img
										src={selectedNFT.imageUrl}
										alt={selectedNFT.name}
										className="w-full h-full object-contain"
									/>
								)}
							</div>

							{selectedNFT.description && (
								<div className="mb-4">
									<h3 className="font-semibold mb-2">Description</h3>
									<p className="text-gray-600">{selectedNFT.description}</p>
								</div>
							)}

							{selectedNFT.collection && (
								<div className="mb-4">
									<h3 className="font-semibold mb-2">Collection</h3>
									<p className="text-gray-600">{selectedNFT.collection}</p>
								</div>
							)}

							<div className="mb-4">
								<h3 className="font-semibold mb-2">Token ID</h3>
								<p className="text-xs text-gray-500 font-mono break-all">
									{selectedNFT.id}
								</p>
							</div>

							<a
								href={`https://suiscan.xyz/testnet/object/${selectedNFT.id}`}
								target="_blank"
								rel="noopener noreferrer"
								className="btn btn-primary w-full"
							>
								<ExternalLink className="w-4 h-4" />
								View on Suiscan
							</a>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
