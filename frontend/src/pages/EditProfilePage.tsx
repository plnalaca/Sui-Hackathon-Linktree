import { useState, useEffect } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { toast } from '@/components/ui/Toaster'
import { THEMES } from '@/config/constants'
import { useContract } from '@/hooks/useContract'

interface LinkInput {
	id: string
	label: string
	url: string
	index?: number
	type?: 'normal' | 'media' | 'monetization' | 'social'
	metadata?: {
		price?: string
		currency?: string
		monetizationType?: 'donation' | 'product' | 'service' | 'subscription'
		socialPlatform?: 'instagram' | 'twitter' | 'youtube' | 'tiktok'
	}
}

export default function EditProfilePage() {
	const { objectId } = useParams<{ objectId: string }>()
	const location = useLocation()
	const account = useCurrentAccount()
	const { mutate: signAndExecute } = useSignAndExecuteTransaction()
	const contract = useContract()

	const [bio, setBio] = useState('')
	const [theme, setTheme] = useState(1)
	const [links, setLinks] = useState<LinkInput[]>([])
	const [loading, setLoading] = useState(false)
	const [pendingLinks, setPendingLinks] = useState<Array<{label: string, url: string}>>([])
	const [autoAddingLinks, setAutoAddingLinks] = useState(false)

	// Fetch profile object
	const { data: profileData, isLoading } = useSuiClientQuery(
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

	// Load profile data
	useEffect(() => {
		if (profileData?.data?.content) {
			// @ts-ignore
			const content = profileData.data.content.fields
			const decoder = new TextDecoder()

			// Decode byte arrays
			const decodedBio = content.bio
				? decoder.decode(new Uint8Array(content.bio))
				: ''

			setBio(decodedBio)
			setTheme(Number(content.theme || 1))

			const existingLinks = content.links || []
			setLinks(
				existingLinks.map((link: any, index: number) => {
					const linkLabel = link.fields?.label || link.label
					const linkUrl = link.fields?.url || link.url

					return {
						id: Math.random().toString(),
						label: linkLabel ? decoder.decode(new Uint8Array(linkLabel)) : '',
						url: linkUrl ? decoder.decode(new Uint8Array(linkUrl)) : '',
						index,
					}
				})
			)
		}
	}, [profileData])

	// Load pending links from navigation state
	useEffect(() => {
		if (location.state?.pendingLinks) {
			const pending = location.state.pendingLinks as Array<{label: string, url: string}>
			console.log('📦 Pending links received:', pending)
			setPendingLinks(pending)
			
			// Add them to the links state for display
			const newLinks = pending.map(link => ({
				id: Math.random().toString(),
				label: link.label,
				url: link.url,
			}))
			setLinks(prev => [...prev, ...newLinks])
		}
	}, [location.state])

	// Auto-add pending links when profile is loaded
	useEffect(() => {
		console.log('🔍 Auto-add check:', { 
			pendingLinksCount: pendingLinks.length, 
			autoAddingLinks, 
			hasProfileData: !!profileData, 
			loading 
		})
		
		if (pendingLinks.length > 0 && !autoAddingLinks && profileData && !loading) {
			console.log('✅ Starting auto-add process...')
			setAutoAddingLinks(true)
			handleAutoAddLinks()
		}
	}, [pendingLinks, profileData, loading, autoAddingLinks])

	const handleAutoAddLinks = async () => {
		if (pendingLinks.length === 0 || !objectId) {
			console.log('⚠️ Cannot auto-add:', { pendingLinks: pendingLinks.length, objectId })
			return
		}

		console.log('🚀 Starting to add', pendingLinks.length, 'links...')
		toast.info(`Adding ${pendingLinks.length} link(s)...`)
		let successCount = 0

		for (let i = 0; i < pendingLinks.length; i++) {
			const link = pendingLinks[i]
			console.log(`➕ Adding link ${i + 1}/${pendingLinks.length}:`, link)
			
			try {
				await handleAddLink(link.label, link.url)
				successCount++
				console.log(`✅ Link ${i + 1} added successfully`)
				await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2s between transactions
			} catch (error) {
				console.error(`❌ Failed to add link ${i + 1}:`, error)
			}
		}

		setPendingLinks([])
		
		if (successCount > 0) {
			console.log(`✅ ${successCount} of ${pendingLinks.length} links added successfully`)
			toast.success(`${successCount} of ${pendingLinks.length} links added! Refreshing...`)
			setTimeout(() => window.location.reload(), 2000)
		} else {
			console.error('❌ Failed to add all links')
			toast.error('Failed to add links')
		}
	}

	const addLink = () => {
		setLinks([...links, { 
			id: Math.random().toString(), 
			label: '', 
			url: '',
			type: 'normal',
			metadata: {}
		}])
	}

	const updateLink = (id: string, field: 'label' | 'url' | 'type', value: string) => {
		setLinks(links.map(link =>
			link.id === id ? { ...link, [field]: value } : link
		))
	}

	const updateLinkMetadata = (id: string, metadata: any) => {
		setLinks(links.map(link =>
			link.id === id ? { ...link, metadata: { ...link.metadata, ...metadata } } : link
		))
	}

	const removeLink = (id: string, index?: number) => {
		if (index !== undefined) {
			// Existing link - call blockchain to remove
			handleRemoveLink(index)
		}
		setLinks(links.filter(link => link.id !== id))
	}

	const handleUpdateBio = async () => {
		if (!account || !objectId) return
		setLoading(true)

		try {
			const tx = new Transaction()
			tx.moveCall({
				target: contract.getTarget('set_bio'),
				arguments: [
					tx.object(objectId),
					tx.pure.string(bio),
				],
			})

			signAndExecute(
				{ transaction: tx as any },
				{
					onSuccess: (result) => {
						console.log('✅ Bio updated! TX:', result.digest)
						toast.success(`Bio updated! TX: ${result.digest.slice(0, 8)}...`)
						setTimeout(() => window.location.reload(), 1500)
					},
					onError: (error) => {
						console.error('❌ Bio update failed:', error)
						toast.error(error.message || 'Failed to update bio')
					},
				}
			)
		} catch (error: any) {
			toast.error(error.message || 'An error occurred')
		} finally {
			setLoading(false)
		}
	}

	const handleUpdateTheme = async () => {
		if (!account || !objectId) return
		setLoading(true)

		try {
			const tx = new Transaction()
			tx.moveCall({
				target: contract.getTarget('set_theme'),
				arguments: [
					tx.object(objectId),
					tx.pure.u64(theme),
				],
			})

			signAndExecute(
				{ transaction: tx as any },
				{
					onSuccess: (result) => {
						console.log('✅ Theme updated! TX:', result.digest)
						toast.success(`Theme updated! TX: ${result.digest.slice(0, 8)}...`)
						setTimeout(() => window.location.reload(), 1500)
					},
					onError: (error) => {
						console.error('❌ Theme update failed:', error)
						toast.error(error.message || 'Failed to update theme')
					},
				}
			)
		} catch (error: any) {
			toast.error(error.message || 'An error occurred')
		} finally {
			setLoading(false)
		}
	}

	const handleAddLink = async (label: string, url: string): Promise<void> => {
		if (!account || !objectId) return Promise.reject('No account or objectId')
		setLoading(true)

		return new Promise((resolve, reject) => {
			try {
				const tx = new Transaction()
				tx.moveCall({
					target: contract.getTarget('add_link'),
					arguments: [
						tx.object(objectId),
						tx.pure.string(label),
						tx.pure.string(url),
					],
				})

				signAndExecute(
					{ transaction: tx as any },
					{
						onSuccess: (result) => {
							console.log('✅ Link added! TX:', result.digest)
							toast.success(`Link "${label}" added!`)
							setLoading(false)
							resolve()
						},
						onError: (error) => {
							console.error('❌ Add link failed:', error)
							toast.error(error.message || 'Failed to add link')
							setLoading(false)
							reject(error)
						},
					}
				)
			} catch (error: any) {
				toast.error(error.message || 'An error occurred')
				setLoading(false)
				reject(error)
			}
		})
	}

	const handleRemoveLink = async (index: number) => {
		if (!account || !objectId) return
		setLoading(true)

		try {
			const tx = new Transaction()
			tx.moveCall({
				target: contract.getTarget('remove_link_at'),
				arguments: [
					tx.object(objectId),
					tx.pure.u64(index),
				],
			})

			signAndExecute(
				{ transaction: tx as any },
				{
					onSuccess: (result) => {
						console.log('✅ Link removed! TX:', result.digest)
						toast.success(`Link removed! TX: ${result.digest.slice(0, 8)}...`)
						setTimeout(() => window.location.reload(), 1500)
					},
					onError: (error) => {
						console.error('❌ Remove link failed:', error)
						toast.error(error.message || 'Failed to remove link')
					},
				}
			)
		} catch (error: any) {
			toast.error(error.message || 'An error occurred')
		} finally {
			setLoading(false)
		}
	}

	if (isLoading) {
		return (
			<div className="min-h-screen">
				<Navbar />
				<div className="container mx-auto px-4 py-20 text-center">
					<div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
					<p className="mt-4 text-gray-600">Loading profile...</p>
				</div>
			</div>
		)
	}

	if (!profileData?.data) {
		return (
			<div className="min-h-screen">
				<Navbar />
				<div className="container mx-auto px-4 py-20">
					<div className="max-w-2xl mx-auto card text-center">
						<h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
						<Link to="/" className="btn btn-primary">Go Home</Link>
					</div>
				</div>
			</div>
		)
	}

	// @ts-ignore
	const owner = profileData.data.owner
	// @ts-ignore
	const isOwner = account?.address === (typeof owner === 'object' && owner.AddressOwner ? owner.AddressOwner : owner)

	if (!isOwner) {
		return (
			<div className="min-h-screen">
				<Navbar />
				<div className="container mx-auto px-4 py-20">
					<div className="max-w-2xl mx-auto card text-center">
						<h2 className="text-2xl font-bold mb-4">Access Denied</h2>
						<p className="text-gray-600 mb-6">You don't own this profile</p>
						<Link to={`/profile/${objectId}`} className="btn btn-primary">
							View Profile
						</Link>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen">
			<Navbar />

			<div className="container mx-auto px-4 py-12">
				<div className="max-w-2xl mx-auto">
					<div className="mb-8">
						<Link
							to={`/profile/${objectId}`}
							className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
						>
							<ArrowLeft className="w-4 h-4" />
							Back to Profile
						</Link>
						<h1 className="text-4xl font-bold gradient-text">Edit Profile</h1>
					</div>

					<div className="space-y-6">
						{/* Bio Section */}
						<div className="card space-y-4">
							<h2 className="text-xl font-bold">Bio</h2>
							<textarea
								value={bio}
								onChange={(e) => setBio(e.target.value)}
								placeholder="Tell the world about yourself..."
								className="input min-h-[100px]"
								rows={4}
							/>
							<button
								onClick={handleUpdateBio}
								disabled={loading}
								className="btn btn-primary"
							>
								<Save className="w-4 h-4" />
								Update Bio
							</button>
						</div>

						{/* Theme Section */}
						<div className="card space-y-4">
							<h2 className="text-xl font-bold">Theme</h2>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
								{THEMES.map((t) => (
									<button
										key={t.id}
										onClick={() => setTheme(t.id)}
										className={`p-4 rounded-xl border-2 transition-all ${theme === t.id
											? 'border-blue-500 ring-2 ring-blue-500/20'
											: 'border-gray-200 hover:border-gray-300'
											}`}
									>
										<div className={`h-16 rounded-lg bg-gradient-to-r ${t.gradient} mb-2`} />
										<p className="text-sm font-medium">{t.name}</p>
									</button>
								))}
							</div>
							<button
								onClick={handleUpdateTheme}
								disabled={loading}
								className="btn btn-primary"
							>
								<Save className="w-4 h-4" />
								Update Theme
							</button>
						</div>

						{/* Links Section */}
						<div className="card space-y-4">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-bold">Links</h2>
								<button
									onClick={addLink}
									className="btn btn-secondary"
								>
									<Plus className="w-4 h-4" />
									Add Link
								</button>
							</div>

							<div className="space-y-3">
								{links.map((link) => (
									<div key={link.id} className="p-4 bg-gray-50 rounded-xl space-y-3">
										{/* Link Type Selector */}
										<div>
											<label className="block text-sm font-medium mb-2">Link Type</label>
											<select
												value={link.type || 'normal'}
												onChange={(e) => updateLink(link.id, 'type', e.target.value)}
												className="input"
											>
												<option value="normal">🔗 Normal Link</option>
												<option value="media">🎥 Media Embed (YouTube, Spotify, TikTok)</option>
												<option value="monetization">💰 Payment/Donation</option>
												<option value="social">📱 Social Profile</option>
											</select>
										</div>

										{/* Label Input */}
										<input
											type="text"
											value={link.label}
											onChange={(e) => updateLink(link.id, 'label', e.target.value)}
											placeholder={
												link.type === 'media' ? 'e.g., My Latest Video' :
												link.type === 'monetization' ? 'e.g., Support Me' :
												link.type === 'social' ? 'e.g., Follow on Instagram' :
												'e.g., Twitter'
											}
											className="input"
										/>

										{/* URL Input */}
										<input
											type="text"
											value={link.url}
											onChange={(e) => updateLink(link.id, 'url', e.target.value)}
											placeholder={
												link.type === 'media' ? 'YouTube, Spotify, TikTok or SoundCloud URL' :
												link.type === 'monetization' ? 'PayPal, Stripe, Ko-fi, Patreon URL' :
												link.type === 'social' ? 'Instagram, Twitter, YouTube or TikTok profile URL' :
												'https://...'
											}
											className="input"
										/>

										{/* Monetization Extra Fields */}
										{link.type === 'monetization' && (
											<div className="grid grid-cols-3 gap-2">
												<select
													value={link.metadata?.monetizationType || 'donation'}
													onChange={(e) => updateLinkMetadata(link.id, { monetizationType: e.target.value })}
													className="input text-sm"
												>
													<option value="donation">Donation</option>
													<option value="product">Product</option>
													<option value="service">Service</option>
													<option value="subscription">Subscription</option>
												</select>
												<input
													type="text"
													value={link.metadata?.price || ''}
													onChange={(e) => updateLinkMetadata(link.id, { price: e.target.value })}
													placeholder="Price (optional)"
													className="input text-sm"
												/>
												<input
													type="text"
													value={link.metadata?.currency || '$'}
													onChange={(e) => updateLinkMetadata(link.id, { currency: e.target.value })}
													placeholder="$"
													className="input text-sm"
												/>
											</div>
										)}

										{/* Social Platform Hint */}
										{link.type === 'social' && (
											<div className="text-xs text-gray-500 p-2 bg-blue-50 rounded">
												💡 Tip: Paste your Instagram, Twitter, YouTube or TikTok profile URL
											</div>
										)}

										{/* Media Embed Hint */}
										{link.type === 'media' && (
											<div className="text-xs text-gray-500 p-2 bg-purple-50 rounded">
												💡 Supported: YouTube videos, Spotify tracks/playlists, TikTok videos, SoundCloud tracks
											</div>
										)}

										<div className="flex gap-2">
											{link.index === undefined ? (
												<button
													onClick={() => handleAddLink(link.label, link.url)}
													disabled={!link.label || !link.url || loading}
													className="btn btn-primary flex-1"
												>
													Save Link
												</button>
											) : null}
											<button
												onClick={() => removeLink(link.id, link.index)}
												disabled={loading}
												className="btn btn-secondary text-red-600"
											>
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									</div>
								))}

								{links.length === 0 && (
									<p className="text-center text-gray-500 py-8">
										No links yet. Click "Add Link" to get started!
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

