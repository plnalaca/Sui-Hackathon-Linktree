import { Link } from 'react-router-dom'
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit'
import { Sparkles, Shield, Zap, ExternalLink, Edit, QrCode, BarChart3, Share2, DollarSign, Video, Instagram, Briefcase, Code, Palette, Music, Camera, Heart, Gamepad2, BookOpen, Utensils, Plane } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useContract } from '@/hooks/useContract'
import { handleGoogleCallback } from '@/utils/zklogin'
import { useEffect } from 'react'

// Custom Clover Chain Icon - 4-leaf clover made of blockchain chain links with circuit lines
const CloverChainIcon = ({ className }: { className?: string }) => (
	<svg 
		viewBox="0 0 200 200" 
		fill="none" 
		xmlns="http://www.w3.org/2000/svg"
		className={className}
	>
		<defs>
			<linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" stopColor="currentColor" stopOpacity="1" />
				<stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
			</linearGradient>
		</defs>
		
		{/* Circuit lines radiating from center */}
		<line x1="100" y1="100" x2="50" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.3" />
		<line x1="100" y1="100" x2="150" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.3" />
		<line x1="100" y1="100" x2="180" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.3" />
		<line x1="100" y1="100" x2="180" y2="150" stroke="currentColor" strokeWidth="1" opacity="0.3" />
		<line x1="100" y1="100" x2="150" y2="180" stroke="currentColor" strokeWidth="1" opacity="0.3" />
		<line x1="100" y1="100" x2="50" y2="180" stroke="currentColor" strokeWidth="1" opacity="0.3" />
		<line x1="100" y1="100" x2="20" y2="150" stroke="currentColor" strokeWidth="1" opacity="0.3" />
		<line x1="100" y1="100" x2="20" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.3" />
		
		{/* Top petal - chain links forming rounded heart shape */}
		<path d="M 100 30 Q 80 20 65 30 Q 55 40 55 55 Q 55 70 70 80 L 100 100 L 130 80 Q 145 70 145 55 Q 145 40 135 30 Q 120 20 100 30 Z" 
			stroke="currentColor" strokeWidth="4" fill="none" strokeLinejoin="round" />
		{/* Chain segments on top petal */}
		<rect x="75" y="35" width="15" height="15" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
		<rect x="110" y="35" width="15" height="15" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
		<rect x="92" y="50" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.2" />
		
		{/* Right petal - chain links forming rounded heart shape */}
		<path d="M 170 100 Q 180 80 170 65 Q 160 55 145 55 Q 130 55 120 70 L 100 100 L 120 130 Q 130 145 145 145 Q 160 145 170 135 Q 180 120 170 100 Z" 
			stroke="currentColor" strokeWidth="4" fill="none" strokeLinejoin="round" />
		{/* Chain segments on right petal */}
		<rect x="150" y="75" width="15" height="15" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
		<rect x="150" y="110" width="15" height="15" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
		<rect x="134" y="92" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.2" />
		
		{/* Bottom petal - chain links forming rounded heart shape */}
		<path d="M 100 170 Q 120 180 135 170 Q 145 160 145 145 Q 145 130 130 120 L 100 100 L 70 120 Q 55 130 55 145 Q 55 160 65 170 Q 80 180 100 170 Z" 
			stroke="currentColor" strokeWidth="4" fill="none" strokeLinejoin="round" />
		{/* Chain segments on bottom petal */}
		<rect x="75" y="150" width="15" height="15" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
		<rect x="110" y="150" width="15" height="15" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
		<rect x="92" y="134" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.2" />
		
		{/* Left petal - chain links forming rounded heart shape */}
		<path d="M 30 100 Q 20 120 30 135 Q 40 145 55 145 Q 70 145 80 130 L 100 100 L 80 70 Q 70 55 55 55 Q 40 55 30 65 Q 20 80 30 100 Z" 
			stroke="currentColor" strokeWidth="4" fill="none" strokeLinejoin="round" />
		{/* Chain segments on left petal */}
		<rect x="35" y="75" width="15" height="15" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
		<rect x="35" y="110" width="15" height="15" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
		<rect x="50" y="92" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.2" />
		
		{/* Center glowing circle */}
		<circle cx="100" cy="100" r="20" fill="url(#glowGradient)" opacity="0.4" />
		<circle cx="100" cy="100" r="15" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.3" />
		<circle cx="100" cy="100" r="10" fill="currentColor" />
		
		{/* Circuit node dots at petal tips */}
		<circle cx="100" cy="25" r="3" fill="currentColor" />
		<circle cx="175" cy="100" r="3" fill="currentColor" />
		<circle cx="100" cy="175" r="3" fill="currentColor" />
		<circle cx="25" cy="100" r="3" fill="currentColor" />
		
		{/* Small connecting circuit nodes */}
		<circle cx="70" cy="70" r="2" fill="currentColor" opacity="0.6" />
		<circle cx="130" cy="70" r="2" fill="currentColor" opacity="0.6" />
		<circle cx="130" cy="130" r="2" fill="currentColor" opacity="0.6" />
		<circle cx="70" cy="130" r="2" fill="currentColor" opacity="0.6" />
	</svg>
)

// Avatar icon map (same as ProfilePage and CreateProfilePage)
const ICON_MAP: Record<string, any> = {
	business: Briefcase,
	tech: Code,
	creative: Palette,
	music: Music,
	photo: Camera,
	lifestyle: Heart,
	gaming: Gamepad2,
	education: BookOpen,
	food: Utensils,
	travel: Plane,
}

const ICON_COLORS: Record<string, string> = {
	business: 'from-blue-500 to-blue-600',
	tech: 'from-purple-500 to-purple-600',
	creative: 'from-pink-500 to-pink-600',
	music: 'from-green-500 to-green-600',
	photo: 'from-yellow-500 to-yellow-600',
	lifestyle: 'from-red-500 to-red-600',
	gaming: 'from-indigo-500 to-indigo-600',
	education: 'from-cyan-500 to-cyan-600',
	food: 'from-orange-500 to-orange-600',
	travel: 'from-teal-500 to-teal-600',
}

export default function HomePage() {
	const account = useCurrentAccount()
	const contract = useContract()

	// Handle Google OAuth callback
	useEffect(() => {
		const hash = window.location.hash
		if (hash && hash.includes('id_token')) {
			try {
				const result = handleGoogleCallback(hash)
				localStorage.setItem('zklogin_jwt', result.idToken)
				localStorage.setItem('zklogin_state', JSON.stringify(result.state))
				localStorage.setItem('zklogin_user', JSON.stringify(result.decoded))
				
				// Clean URL
				window.history.replaceState({}, document.title, window.location.pathname)
				
				// Reload to update navbar
				window.location.reload()
			} catch (error) {
				console.error('zkLogin callback error:', error)
			}
		}
	}, [])

	// Fetch user's profiles
	const { data: ownedObjects } = useSuiClientQuery(
		'getOwnedObjects',
		{
			owner: account?.address as string,
			options: {
				showType: true,
				showContent: true,
				showDisplay: true,
			},
		},
		{
			enabled: !!account,
		}
	)

	// Filter Profile objects
	const profiles = ownedObjects?.data?.filter((obj) =>
		obj.data?.type?.includes(`${contract.packageId}::${contract.moduleName}::Profile`)
	) || []

	return (
		<div className="min-h-screen">
			<Navbar />

			{/* Hero Section */}
			<div className="container mx-auto px-4 py-20">
				<div className="text-center max-w-4xl mx-auto space-y-8">
					{/* Animated Icon */}
					<div className="flex justify-center">
						<div className="relative">
							<div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
							<div className="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center animate-float shadow-2xl">
								<CloverChainIcon className="w-12 h-12 text-white" />
							</div>
					</div>
				</div>

				{/* Title */}
				<div className="space-y-4">
					<h1 className="text-5xl md:text-6xl font-bold text-gray-900">
						<span className="gradient-text">Your Links, Forever Yours</span>
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Create your decentralized link hub on Sui blockchain.
						No subscriptions, no middleman, complete ownership.
					</p>
				</div>

				{/* CTA Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						{account ? (
							<>
								<Link
									to="/create"
									className="btn btn-primary text-lg px-8 py-4 shadow-2xl hover:shadow-3xl"
								>
									<Sparkles className="w-5 h-5" />
									Create Your Profile
								</Link>
								{profiles.length > 0 && (
									<a
										href="#my-profiles"
										className="btn btn-secondary text-lg px-8 py-4"
									>
										View My Profiles ({profiles.length})
									</a>
								)}
							</>
						) : (
							<div className="card max-w-md">
								<p className="text-gray-600 mb-4">
									Connect your wallet to get started
								</p>
								<div className="flex justify-center">
									{/* ConnectButton is in Navbar */}
									<p className="text-sm text-gray-500">
										Click "Connect Wallet" in the top right
									</p>
								</div>
							</div>
						)}
					</div>

					{/* Features */}
					<div className="grid md:grid-cols-3 gap-6 pt-16">
						<div className="card text-center space-y-4 hover:shadow-2xl transition-all">
							<div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
								<Shield className="w-7 h-7 text-blue-600" />
							</div>
							<h3 className="font-bold text-xl">Truly Yours</h3>
							<p className="text-gray-600">
								Your profile is an NFT. You own it, control it, and can transfer it.
							</p>
						</div>

						<div className="card text-center space-y-4 hover:shadow-2xl transition-all">
							<div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
								<Zap className="w-7 h-7 text-purple-600" />
							</div>
							<h3 className="font-bold text-xl">Lightning Fast</h3>
							<p className="text-gray-600">
								Built on Sui blockchain for instant transactions and updates.
							</p>
						</div>

						<div className="card text-center space-y-4 hover:shadow-2xl transition-all">
							<div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
								<CloverChainIcon className="w-7 h-7 text-green-600" />
							</div>
							<h3 className="font-bold text-xl">Unlimited Links</h3>
							<p className="text-gray-600">
								Add as many links as you want. No premium plans, no limits.
							</p>
						</div>
					</div>

					{/* How It Works */}
					<div className="pt-16 space-y-8">
						<div className="text-center space-y-4">
							<h2 className="text-3xl font-bold">How It Works</h2>
							<p className="text-gray-600 max-w-2xl mx-auto">
								Get started in three simple steps
							</p>
						</div>
						<div className="grid md:grid-cols-3 gap-6">
							<div className="card text-center space-y-3 hover:shadow-2xl transition-all hover:scale-105">
								<div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">
									1
								</div>
								<h3 className="font-semibold text-lg">Connect Wallet</h3>
								<p className="text-gray-600 text-sm">
									Use Sui Wallet or any compatible wallet
								</p>
							</div>

							<div className="card text-center space-y-3 hover:shadow-2xl transition-all hover:scale-105">
								<div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">
									2
								</div>
								<h3 className="font-semibold text-lg">Create Profile</h3>
								<p className="text-gray-600 text-sm">
									Add your name, bio, avatar, and links
								</p>
							</div>

							<div className="card text-center space-y-3 hover:shadow-2xl transition-all hover:scale-105">
								<div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">
									3
								</div>
								<h3 className="font-semibold text-lg">Share & Own</h3>
								<p className="text-gray-600 text-sm">
									Share your profile link everywhere
								</p>
							</div>
						</div>
					</div>

					{/* My Profiles Section */}
					{account && profiles.length > 0 && (
						<div id="my-profiles" className="pt-16 space-y-8">
							<div className="flex items-center justify-between">
								<h2 className="text-3xl font-bold">My Profiles</h2>
								<Link
									to="/create"
									className="btn btn-primary"
								>
									<Sparkles className="w-4 h-4" />
									Create New
								</Link>
							</div>

							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								{profiles.map((profile) => {
									const content = profile.data?.content as any
									const fields = content?.fields || {}
									const objectId = profile.data?.objectId || ''
									
									// Decode avatar_cid
									const avatarCid = fields.avatar_cid 
										? new TextDecoder().decode(new Uint8Array(fields.avatar_cid))
										: ''
									
									// Check if avatar is an icon ID or URL
									const isIconAvatar = avatarCid && !avatarCid.startsWith('http') && ICON_MAP[avatarCid]
									const IconComponent = isIconAvatar ? ICON_MAP[avatarCid] : null
									const iconColor = isIconAvatar ? ICON_COLORS[avatarCid] : 'from-gray-400 to-gray-500'

									return (
										<div key={objectId} className="card hover:shadow-2xl transition-all">
											<div className="space-y-4">
												{/* Profile Header */}
												<div className="flex items-start justify-between">
													<div className="flex items-center gap-3">
														{/* Avatar - Icon or Image */}
														{isIconAvatar && IconComponent ? (
															<div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
																<div className={`w-10 h-10 rounded-full bg-gradient-to-br ${iconColor} flex items-center justify-center`}>
																	<IconComponent className="w-4 h-4 text-white" />
																</div>
															</div>
														) : avatarCid && avatarCid.startsWith('http') ? (
															<img
																src={avatarCid}
																alt={new TextDecoder().decode(new Uint8Array(fields.name || [])) || 'Avatar'}
																className="w-12 h-12 rounded-full object-cover"
															/>
														) : (
															<img
																src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${fields.name || 'default'}`}
																alt="Default avatar"
																className="w-12 h-12 rounded-full"
															/>
														)}
														<div>
															<h3 className="font-bold text-lg">
																{new TextDecoder().decode(
																	new Uint8Array(fields.name || [])
																) || 'Unnamed'}
															</h3>
															<p className="text-sm text-gray-500">
																{fields.links?.length || 0} links
															</p>
														</div>
													</div>
												</div>

												{/* Bio */}
												{fields.bio && (
													<p className="text-gray-600 text-sm line-clamp-2">
														{new TextDecoder().decode(
															new Uint8Array(fields.bio || [])
														)}
													</p>
												)}

												{/* Actions */}
												<div className="flex gap-2 pt-2">
													<Link
														to={`/profile/${objectId}`}
														className="btn btn-secondary flex-1"
													>
														<ExternalLink className="w-4 h-4" />
														View
													</Link>
													<Link
														to={`/edit/${objectId}`}
														className="btn btn-primary flex-1"
													>
														<Edit className="w-4 h-4" />
														Edit
													</Link>
												</div>
											</div>
										</div>
									)
								})}
							</div>
						</div>
					)}

					{/* Demo Features Button */}
					<div className="pt-16 text-center">
						<Link
							to="/test-features"
							className="inline-flex items-center gap-2 btn bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
						>
							<Sparkles className="w-5 h-5" />
							Demo Features
						</Link>
					</div>

					{/* Bonus Features Section */}
					<div className="pt-12 pb-8 space-y-8">
						<div className="grid md:grid-cols-3 gap-6">
							<div className="card text-center space-y-4 hover:shadow-2xl transition-all hover:scale-105">
								<div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto">
									<BarChart3 className="w-7 h-7 text-purple-600" />
								</div>
								<h3 className="font-bold text-xl">Analytics Dashboard</h3>
								<p className="text-gray-600 text-sm">
									Track views, clicks, and engagement. See which links perform best.
								</p>
								<div className="flex justify-center gap-2 text-xs text-purple-600 font-medium">
									<span>📊 Views</span>
									<span>•</span>
									<span>👆 Clicks</span>
									<span>•</span>
									<span>📈 Rates</span>
								</div>
							</div>

							<div className="card text-center space-y-4 hover:shadow-2xl transition-all hover:scale-105">
								<div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto">
									<QrCode className="w-7 h-7 text-blue-600" />
								</div>
								<h3 className="font-bold text-xl">QR Code Generator</h3>
								<p className="text-gray-600 text-sm">
									Instant QR codes for your profile. Download and share offline.
								</p>
								<div className="flex justify-center gap-2 text-xs text-blue-600 font-medium">
									<span>📱 Scannable</span>
									<span>•</span>
									<span>⬇️ Download</span>
									<span>•</span>
									<span>🎨 Custom</span>
								</div>
							</div>

							<div className="card text-center space-y-4 hover:shadow-2xl transition-all hover:scale-105">
								<div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
									<Share2 className="w-7 h-7 text-green-600" />
								</div>
								<h3 className="font-bold text-xl">Social Sharing</h3>
								<p className="text-gray-600 text-sm">
									Share to Twitter, Facebook, WhatsApp with one click.
								</p>
								<div className="flex justify-center gap-2 text-xs text-green-600 font-medium">
									<span>🐦 Twitter</span>
									<span>•</span>
									<span>📘 Facebook</span>
									<span>•</span>
									<span>💬 WhatsApp</span>
								</div>
							</div>

							<div className="card text-center space-y-4 hover:shadow-2xl transition-all hover:scale-105">
								<div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto">
									<DollarSign className="w-7 h-7 text-pink-600" />
								</div>
								<h3 className="font-bold text-xl">💰 Monetization</h3>
								<p className="text-gray-600 text-sm">
									Accept payments, donations, and sell products directly
								</p>
								<div className="flex justify-center gap-2 text-xs text-pink-600 font-medium">
									<span>💳 Payments</span>
									<span>•</span>
									<span>🛒 Products</span>
									<span>•</span>
									<span>💝 Donations</span>
								</div>
							</div>

							<div className="card text-center space-y-4 hover:shadow-2xl transition-all hover:scale-105">
								<div className="w-14 h-14 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto">
									<Video className="w-7 h-7 text-red-600" />
								</div>
								<h3 className="font-bold text-xl">🎥 Media Embeds</h3>
								<p className="text-gray-600 text-sm">
									Embed YouTube, Spotify, TikTok, and more directly
								</p>
								<div className="flex justify-center gap-2 text-xs text-red-600 font-medium">
									<span>▶️ YouTube</span>
									<span>•</span>
									<span>🎵 Spotify</span>
									<span>•</span>
									<span>📱 TikTok</span>
								</div>
							</div>

							<div className="card text-center space-y-4 hover:shadow-2xl transition-all hover:scale-105">
								<div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto">
									<Instagram className="w-7 h-7 text-indigo-600" />
								</div>
								<h3 className="font-bold text-xl">📱 Social Feeds</h3>
								<p className="text-gray-600 text-sm">
									Display your Instagram, Twitter, YouTube feeds live
								</p>
								<div className="flex justify-center gap-2 text-xs text-indigo-600 font-medium">
									<span>📸 Instagram</span>
									<span>•</span>
									<span>🐦 Twitter</span>
									<span>•</span>
									<span>📺 YouTube</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className="border-t border-gray-200 py-8 mt-20">
				<div className="container mx-auto px-4 text-center text-gray-600">
					<p>Built on Sui • Powered by Move • Open Source</p>
				</div>
			</footer>
		</div>
	)
}


