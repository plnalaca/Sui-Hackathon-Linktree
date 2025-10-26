import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useCurrentAccount, useSuiClientQuery, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { ArrowLeft, Edit, Share2, Copy, BarChart3, Trash2, GripVertical, Image as ImageIcon, X, ExternalLink, Briefcase, Code, Palette, Music, Camera, Heart, Gamepad2, BookOpen, Utensils, Plane } from 'lucide-react'
import { useState } from 'react'
import { Transaction } from '@mysten/sui/transactions'
import Navbar from '@/components/Navbar'
import LinkCard from '@/components/LinkCard'
import MediaEmbed from '@/components/MediaEmbed'
import SocialFeed from '@/components/SocialFeed'
import MonetizationCard from '@/components/MonetizationCard'
import SocialShare from '@/components/SocialShare'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import NFTGallery from '@/components/NFTGallery'
import ProfileBadges from '@/components/ProfileBadges'
import { toast } from '@/components/ui/Toaster'
import { THEMES, DEFAULT_AVATAR } from '@/config/constants'
import { useContract, CONTRACT_FUNCTIONS } from '@/hooks/useContract'
import { useNFTs } from '@/hooks/useNFTs'
import { detectLinkType, extractSocialUsername } from '@/utils/linkDetector'
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function ProfilePage() {
	const { objectId } = useParams<{ objectId: string }>()
	const account = useCurrentAccount()
	const navigate = useNavigate()
	const contract = useContract()
	const { mutate: signAndExecute } = useSignAndExecuteTransaction()
	const { nfts, loading: nftsLoading } = useNFTs()
	const [showShareModal, setShowShareModal] = useState(false)
	const [showAnalytics, setShowAnalytics] = useState(false)
	const [showNFTGallery, setShowNFTGallery] = useState(false)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [editMode, setEditMode] = useState(false)
	const [sortedLinks, setSortedLinks] = useState<any[]>([])
	const [originalLinks, setOriginalLinks] = useState<any[]>([])
	const [isSaving, setIsSaving] = useState(false)

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)

	// Sortable Link Component
	const SortableLink = ({ link, isOwner, editMode }: any) => {
		const {
			attributes,
			listeners,
			setNodeRef,
			transform,
			transition,
			isDragging,
		} = useSortable({ id: link.id, disabled: !editMode })

		const style = {
			transform: CSS.Transform.toString(transform),
			transition,
			opacity: isDragging ? 0.5 : 1,
		}

		const decoder = new TextDecoder()
		const linkLabel = link.fields?.label || link.label
		const linkUrl = link.fields?.url || link.url
		const decodedLabel = linkLabel ? decoder.decode(new Uint8Array(linkLabel)) : 'Untitled'
		const decodedUrl = linkUrl ? decoder.decode(new Uint8Array(linkUrl)) : '#'

		// Detect link type
		const detected = detectLinkType(decodedUrl, decodedLabel)

		// Render appropriate component based on type
		const renderLinkComponent = () => {
			switch (detected.type) {
				case 'media':
					return (
						<div className="space-y-2">
							<div className={`text-sm font-medium ${themeData.text} px-2`}>{decodedLabel}</div>
							<MediaEmbed url={decodedUrl} />
						</div>
					)
				
				case 'social':
					if (detected.platform) {
						const username = extractSocialUsername(decodedUrl, detected.platform)
						return (
							<div className="space-y-2">
								<div className={`text-sm font-medium ${themeData.text} px-2`}>{decodedLabel}</div>
								<SocialFeed 
									platform={detected.platform as any} 
									username={username || decodedUrl}
								/>
							</div>
						)
					}
					return <LinkCard label={decodedLabel} url={decodedUrl} theme={themeData} />
				
				case 'monetization':
					return (
						<MonetizationCard
							type={detected.monetizationType || 'donation'}
							title={decodedLabel}
							description=""
							paymentUrl={decodedUrl}
						/>
					)
				
				default:
					return <LinkCard label={decodedLabel} url={decodedUrl} theme={themeData} />
			}
		}

		return (
			<div ref={setNodeRef} style={style} className="relative">
				{isOwner && editMode && (
					<div
						{...attributes}
						{...listeners}
						className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10"
					>
						<GripVertical className="w-5 h-5 text-gray-400" />
					</div>
				)}
				<div className={isOwner && editMode ? 'pl-8' : ''}>
					{renderLinkComponent()}
				</div>
			</div>
		)
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event

		if (over && active.id !== over.id) {
			setSortedLinks((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id)
				const newIndex = items.findIndex((item) => item.id === over.id)
				return arrayMove(items, oldIndex, newIndex)
			})
		}
	}

	const handleSaveOrder = async () => {
		if (!account || !objectId) return
		setIsSaving(true)

		try {
			// Calculate swap operations needed
			const swaps: Array<[number, number]> = []
			const currentOrder = [...originalLinks]
			
			for (let targetIdx = 0; targetIdx < sortedLinks.length; targetIdx++) {
				const targetLink = sortedLinks[targetIdx]
				const currentIdx = currentOrder.findIndex((link: any) => link.id === targetLink.id)
				
				if (currentIdx !== targetIdx) {
					// Swap in our tracking array
					const temp = currentOrder[targetIdx]
					currentOrder[targetIdx] = currentOrder[currentIdx]
					currentOrder[currentIdx] = temp
					
					// Record the swap
					swaps.push([targetIdx, currentIdx])
				}
			}

			console.log('🔄 Performing', swaps.length, 'swap operations')

			// Execute swaps on blockchain
			for (const [idx1, idx2] of swaps) {
				const tx = new Transaction()
				tx.moveCall({
					target: contract.getTarget('swap_links'),
					arguments: [
						tx.object(objectId),
						tx.pure.u64(idx1),
						tx.pure.u64(idx2),
					],
				})

				await new Promise((resolve, reject) => {
					signAndExecute(
						{ transaction: tx as any },
						{
							onSuccess: (result) => {
								console.log('✅ Swap successful:', result.digest)
								resolve(true)
							},
							onError: (err) => {
								console.error('❌ Swap failed:', err)
								reject(err)
							},
						}
					)
				})
				
				// Wait between transactions
				await new Promise(resolve => setTimeout(resolve, 1500))
			}

			toast.success('Link order saved!')
			setEditMode(false)
			setTimeout(() => window.location.reload(), 1500)
		} catch (error: any) {
			console.error('Failed to save order:', error)
			toast.error('Failed to save link order')
		} finally {
			setIsSaving(false)
		}
	}

	const handleResetOrder = () => {
		// Reset to original blockchain order
		setSortedLinks([...originalLinks])
		toast.info('Order reset')
		setEditMode(false)
	}

	// Fetch profile object from blockchain
	const { data: profileData, isLoading, error } = useSuiClientQuery(
		'getObject',
		{
			id: objectId!,
			options: {
				showContent: true,
				showOwner: true,
			},
		},
		{
			enabled: !!objectId,
		}
	)

	const handleShare = () => {
		setShowShareModal(true)
	}

	const handleDelete = async () => {
		if (!account || !objectId) return

		setIsDeleting(true)
		try {
			const tx = new Transaction()

			tx.moveCall({
				target: contract.getTarget(CONTRACT_FUNCTIONS.DELETE_PROFILE),
				arguments: [
					tx.object(contract.registryId),
					tx.object(objectId),
				],
			})

			signAndExecute(
				{
					transaction: tx as any,
				},
				{
					onSuccess: (result) => {
						console.log('✅ Profile deleted:', result.digest)
						toast.success('Profile deleted successfully!')
						setTimeout(() => {
							navigate('/')
						}, 1500)
					},
					onError: (error) => {
						console.error('❌ Delete failed:', error)
						toast.error('Failed to delete profile')
						setIsDeleting(false)
						setShowDeleteConfirm(false)
					},
				}
			)
		} catch (error) {
			console.error('Delete error:', error)
			toast.error('Failed to delete profile')
			setIsDeleting(false)
			setShowDeleteConfirm(false)
		}
	}

	if (isLoading) {
		return (
			<div className="min-h-screen">
				<Navbar />
				<div className="container mx-auto px-4 py-20">
					<div className="max-w-2xl mx-auto text-center">
						<div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
						<p className="mt-4 text-gray-600">Loading profile...</p>
					</div>
				</div>
			</div>
		)
	}

	if (error || !profileData) {
		return (
			<div className="min-h-screen">
				<Navbar />
				<div className="container mx-auto px-4 py-20">
					<div className="max-w-2xl mx-auto card text-center">
						<h2 className="text-2xl font-bold mb-4 text-red-600">Profile Not Found</h2>
						<p className="text-gray-600 mb-6">
							This profile doesn't exist or couldn't be loaded.
						</p>
						<Link to="/" className="btn btn-primary">
							Go Back Home
						</Link>
					</div>
				</div>
			</div>
		)
	}

	// @ts-ignore - Sui object structure
	const content = profileData.data?.content?.fields
	const owner = profileData.data?.owner

	if (!content) {
		return (
			<div className="min-h-screen">
				<Navbar />
				<div className="container mx-auto px-4 py-20">
					<div className="max-w-2xl mx-auto card text-center">
						<h2 className="text-2xl font-bold mb-4">Invalid Profile</h2>
						<p className="text-gray-600 mb-6">
							This object is not a valid profile.
						</p>
						<Link to="/" className="btn btn-primary">
							Go Back Home
						</Link>
					</div>
				</div>
			</div>
		)
	}

	// Decode byte arrays to strings
	const decoder = new TextDecoder()
	const name = content.name ? decoder.decode(new Uint8Array(content.name)) : 'Unknown'
	const bio = content.bio ? decoder.decode(new Uint8Array(content.bio)) : ''
	const avatarCid = content.avatar_cid ? decoder.decode(new Uint8Array(content.avatar_cid)) : ''
	const theme = Number(content.theme || 1)
	const links = content.links || []

	// Initialize sortedLinks with unique IDs
	if (sortedLinks.length === 0 && links.length > 0) {
		const linksWithIds = links.map((link: any, index: number) => ({
			...link,
			id: `link-${index}`,
		}))
		setSortedLinks(linksWithIds)
		setOriginalLinks(linksWithIds)
	}

	const themeData = THEMES.find((t) => t.id === theme) || THEMES[0]
	const avatarUrl = avatarCid || `${DEFAULT_AVATAR}${name}`

	// Icon map for selected avatar icons (same ids as CreateProfilePage)
	const ICON_MAP: Record<string, { Icon: any; color: string }> = {
		business: { Icon: Briefcase, color: 'from-blue-500 to-blue-600' },
		tech: { Icon: Code, color: 'from-purple-500 to-purple-600' },
		creative: { Icon: Palette, color: 'from-pink-500 to-pink-600' },
		music: { Icon: Music, color: 'from-green-500 to-green-600' },
		photo: { Icon: Camera, color: 'from-yellow-500 to-yellow-600' },
		lifestyle: { Icon: Heart, color: 'from-red-500 to-red-600' },
		gaming: { Icon: Gamepad2, color: 'from-indigo-500 to-indigo-600' },
		education: { Icon: BookOpen, color: 'from-cyan-500 to-cyan-600' },
		food: { Icon: Utensils, color: 'from-orange-500 to-orange-600' },
		travel: { Icon: Plane, color: 'from-teal-500 to-teal-600' },
	}

	const isIconAvatar = avatarCid && !avatarCid.startsWith('http') && ICON_MAP[avatarCid]

	// @ts-ignore
	const isOwner = account?.address === (typeof owner === 'object' && owner.AddressOwner ? owner.AddressOwner : owner)

	// Use sortedLinks if available, otherwise use original links
	const displayLinks = sortedLinks.length > 0 ? sortedLinks : links.map((link: any, index: number) => ({
		...link,
		id: `link-${index}`,
	}))

	return (
		<div className={`min-h-screen ${themeData.bg}`}>
			<Navbar />

			<div className="container mx-auto px-4 py-12">
				<div className="max-w-2xl mx-auto">
					{/* Back Button */}
					<Link to="/" className={`inline-flex items-center gap-2 ${themeData.textSecondary} hover:${themeData.text} mb-6`}>
						<ArrowLeft className="w-4 h-4" />
						Back to Home
					</Link>

					{/* Profile Card */}
					<div className={`${themeData.cardBg} rounded-2xl shadow-xl p-6 relative overflow-hidden`}>
						{/* Theme Header */}
						<div className={`h-32 bg-gradient-to-r ${themeData.gradient} -mx-6 -mt-6 mb-4`} />

						{/* Avatar */}
						<div className="relative -mt-20 mb-6">
							{isIconAvatar ? (
								// Render selected icon as avatar
								<div className={`w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto flex items-center justify-center bg-white`}>
									<div className={`w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br ${ICON_MAP[avatarCid].color} text-white`}> 
										{React.createElement(ICON_MAP[avatarCid].Icon, { className: 'w-8 h-8' })}
									</div>
								</div>
							) : (
								<img
									src={avatarUrl}
									alt={name}
									className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto bg-white"
									onError={(e) => {
										e.currentTarget.src = `${DEFAULT_AVATAR}${name}`
									}}
								/>
							)}
						</div>

						{/* Profile Info */}
						<div className="text-center space-y-4 mb-6">
							<div>
								<h1 className={`text-3xl font-bold ${themeData.text} mb-2`}>{name}</h1>
								{bio && <p className={`${themeData.textSecondary} max-w-md mx-auto`}>{bio}</p>}
							</div>

							{/* Object ID - Visible Section */}
							<div className="flex items-center justify-center gap-2 p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200">
								<span className="text-xs font-semibold text-gray-600">Object ID:</span>
								<button
									onClick={() => {
										navigator.clipboard.writeText(objectId!)
										toast.success('Object ID copied!')
									}}
									className="text-xs font-mono text-blue-600 hover:text-blue-700 flex items-center gap-1 truncate max-w-[200px]"
									title={objectId}
								>
									{objectId?.slice(0, 8)}...{objectId?.slice(-6)}
									<Copy className="w-3 h-3 flex-shrink-0" />
								</button>
								<a
									href={`https://suiexplorer.com/object/${objectId}?network=testnet`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:text-blue-700"
									title="View on Explorer"
								>
									<ExternalLink className="w-3.5 h-3.5" />
								</a>
							</div>

							{/* Profile Badges */}
							{isOwner && (
								<ProfileBadges 
									nftCount={nfts.length}
									viewCount={0}
								/>
							)}

							{/* Action Buttons */}
							<div className="flex gap-3 justify-center flex-wrap">
								<button
									onClick={handleShare}
									className={`btn ${themeData.buttonSecondary}`}
								>
									<Share2 className="w-4 h-4" />
									Share
								</button>

								{isOwner && (
									<>
										<button
											onClick={() => setShowNFTGallery(!showNFTGallery)}
											className={`btn ${themeData.buttonSecondary}`}
										>
											<ImageIcon className="w-4 h-4" />
											NFT {nfts.length > 0 && `(${nfts.length})`}
										</button>

										<button
											onClick={() => setShowAnalytics(!showAnalytics)}
											className={`btn ${themeData.buttonSecondary}`}
										>
											<BarChart3 className="w-4 h-4" />
											Analytics
										</button>
										
										{!editMode && links.length > 1 && (
											<button
												onClick={() => setEditMode(true)}
												className={`btn ${themeData.buttonSecondary}`}
											>
												<GripVertical className="w-4 h-4" />
												Reorder Links
											</button>
										)}
										
										{editMode && (
											<>
												<button
													onClick={handleSaveOrder}
													className={`btn ${themeData.buttonPrimary} text-white`}
													disabled={isSaving}
												>
													{isSaving ? 'Saving...' : 'Save Order'}
												</button>
												<button
													onClick={handleResetOrder}
													className={`btn ${themeData.buttonSecondary}`}
													disabled={isSaving}
												>
													Cancel
												</button>
											</>
										)}
										
										{!editMode && (
											<>
												<Link
													to={`/edit/${objectId}`}
													className={`btn ${themeData.buttonPrimary} text-white`}
												>
													<Edit className="w-4 h-4" />
													Edit Profile
												</Link>
												<button
													onClick={() => setShowDeleteConfirm(true)}
													className="btn bg-red-600 hover:bg-red-700 text-white"
												>
													<Trash2 className="w-4 h-4" />
													Delete
												</button>
											</>
										)}
								</>
							)}
						</div>
					</div>

					{/* Share Modal */}
					{showShareModal && (
						<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
							<div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
								<button
									onClick={() => setShowShareModal(false)}
									className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
									title="Close"
								>
									<X className="w-5 h-5 text-gray-600" />
								</button>
								<SocialShare
									url={window.location.href}
									title={`${name}'s Profile`}
									description={bio || 'Check out my Blucky profile!'}
								/>
							</div>
						</div>
					)}

					{/* Analytics Dashboard */}
					{isOwner && showAnalytics && (
						<div className="mt-6">
							<AnalyticsDashboard
								profileId={objectId!}
								links={links.map((link: any) => {
									const linkLabel = link.fields?.label || link.label
									const linkUrl = link.fields?.url || link.url
									return {
										label: linkLabel ? decoder.decode(new Uint8Array(linkLabel)) : 'Untitled',
										url: linkUrl ? decoder.decode(new Uint8Array(linkUrl)) : '#',
									}
								})}
							/>
						</div>
					)}

					{/* NFT Gallery */}
					{isOwner && showNFTGallery && (
						<div className="mt-6 card">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xl font-bold">My NFT Collection</h3>
								<span className="text-sm text-gray-500">{nfts.length} NFTs</span>
							</div>
							<NFTGallery nfts={nfts} loading={nftsLoading} />
						</div>
					)}
					
					{/* Links */}
					<div className="space-y-3">
						{editMode && (
							<div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
								<p className="text-sm text-blue-800">
									<strong>Reorder Mode:</strong> Drag and drop links to reorder them, then click "Save Order"
								</p>
							</div>
						)}
						
						{displayLinks.length === 0 ? (
							<div className="text-center py-12 text-gray-500">
								<p>No links added yet</p>
								{isOwner && (
									<Link to={`/edit/${objectId}`} className="text-blue-600 hover:underline mt-2 inline-block">
										Add your first link →
									</Link>
								)}
							</div>
						) : (
							<DndContext
								sensors={sensors}
								collisionDetection={closestCenter}
								onDragEnd={handleDragEnd}
							>
								<SortableContext
									items={displayLinks.map((link: any) => link.id)}
									strategy={verticalListSortingStrategy}
								>
									{displayLinks.map((link: any) => (
										<SortableLink
											key={link.id}
											link={link}
											isOwner={isOwner}
											editMode={editMode}
										/>
									))}
								</SortableContext>
							</DndContext>
						)}
					</div>

						{/* Owner Badge */}
						{isOwner && (
							<div className="mt-6 pt-6 border-t border-gray-200">
								<div className="flex items-center justify-center gap-2 text-sm text-gray-500">
									<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
									You own this profile
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Delete Confirmation Modal */}
				{showDeleteConfirm && (
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
							<h3 className="text-xl font-bold mb-4 text-gray-900">Delete Profile</h3>
							<p className="text-gray-600 mb-6">
								Are you sure you want to delete this profile? This action cannot be undone.
							</p>
							<div className="flex gap-3 justify-end">
								<button
									onClick={() => setShowDeleteConfirm(false)}
									className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
									disabled={isDeleting}
								>
									Cancel
								</button>
								<button
									onClick={handleDelete}
									className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
									disabled={isDeleting}
								>
									{isDeleting ? 'Deleting...' : 'Delete'}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}


