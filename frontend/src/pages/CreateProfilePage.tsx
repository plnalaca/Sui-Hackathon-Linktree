import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { ArrowLeft, Briefcase, Code, Palette, Music, Camera, Heart, Gamepad2, BookOpen, Utensils, Plane, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import { toast } from '@/components/ui/Toaster'
import { THEMES } from '@/config/constants'
import { useContract, CONTRACT_FUNCTIONS } from '@/hooks/useContract'

// Avatar icons configuration
const AVATAR_ICONS = [
	{ id: 'business', icon: Briefcase, label: 'Business', color: 'from-blue-500 to-blue-600' },
	{ id: 'tech', icon: Code, label: 'Tech', color: 'from-purple-500 to-purple-600' },
	{ id: 'creative', icon: Palette, label: 'Creative', color: 'from-pink-500 to-pink-600' },
	{ id: 'music', icon: Music, label: 'Music', color: 'from-green-500 to-green-600' },
	{ id: 'photo', icon: Camera, label: 'Photography', color: 'from-yellow-500 to-yellow-600' },
	{ id: 'lifestyle', icon: Heart, label: 'Lifestyle', color: 'from-red-500 to-red-600' },
	{ id: 'gaming', icon: Gamepad2, label: 'Gaming', color: 'from-indigo-500 to-indigo-600' },
	{ id: 'education', icon: BookOpen, label: 'Education', color: 'from-cyan-500 to-cyan-600' },
	{ id: 'food', icon: Utensils, label: 'Food', color: 'from-orange-500 to-orange-600' },
	{ id: 'travel', icon: Plane, label: 'Travel', color: 'from-teal-500 to-teal-600' },
]

export default function CreateProfilePage() {
	const account = useCurrentAccount()
	const navigate = useNavigate()
	const { mutate: signAndExecute } = useSignAndExecuteTransaction()
	const contract = useContract()

	const [name, setName] = useState('')
	const [bio, setBio] = useState('')
	const [avatarCid, setAvatarCid] = useState('')
	const [selectedAvatar, setSelectedAvatar] = useState('business')
	const [theme, setTheme] = useState(1)
	const [loading, setLoading] = useState(false)
	const [zkLoginUser, setZkLoginUser] = useState<any>(null)

	useEffect(() => {
		const user = localStorage.getItem('zklogin_user')
		if (user) {
			setZkLoginUser(JSON.parse(user))
		}
	}, [])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!account) {
			toast.error('Please connect your wallet first')
			return
		}

		if (!name.trim()) {
			toast.error('Please enter a profile name')
			return
		}

		setLoading(true)

		try {
			// Validate contract configuration
			if (!contract.isConfigured()) {
				toast.error('Contract not configured. Please check constants.ts')
				return
			}

			const tx = new Transaction()

			// Use create_profile_simple (without links)
			tx.moveCall({
				target: contract.getTarget(CONTRACT_FUNCTIONS.CREATE_PROFILE_SIMPLE),
				arguments: [
					tx.object(contract.registryId),
					tx.pure.string(name),
					tx.pure.string(bio),
					tx.pure.string(avatarCid),
					tx.pure.u64(theme),
				],
			})

			signAndExecute(
				{
					transaction: tx as any,
				},
				{
					onSuccess: async (result) => {
						console.log('✅ Transaction successful:', result)
						console.log('📋 Transaction Digest:', result.digest)
						
						try {
							// Wait a bit for transaction to be indexed
							await new Promise(resolve => setTimeout(resolve, 3000))
							
							// Get transaction details to find created objects
							const txDetails = await fetch(`https://fullnode.testnet.sui.io:443`, {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({
									jsonrpc: '2.0',
									id: 1,
									method: 'sui_getTransactionBlock',
									params: [
										result.digest,
										{
											showEffects: true,
											showObjectChanges: true,
										}
									]
								})
							}).then(res => res.json())
							
							console.log('🔍 Transaction details:', JSON.stringify(txDetails, null, 2))
							
							// Find Profile object from objectChanges
							const objectChanges = txDetails.result?.objectChanges || []
							console.log('🔍 Object changes:', objectChanges)
							
							// Profile is the created object that's not a OwnerCap
							const profileChange = objectChanges.find((change: any) => 
								change.type === 'created' && 
								change.objectType?.includes('::linktree::Profile')
							)
							
							if (profileChange) {
								const profileId = profileChange.objectId
								console.log('✨ NEW Profile ID from transaction:', profileId)

								toast.success('Profile created! You can now add links.')
								navigate(`/profile/${profileId}`)
							} else {
								console.warn('⚠️ Profile object not found in transaction')
								console.warn('Available changes:', objectChanges)
								toast.error('Could not find profile ID')
								navigate('/')
							}
						} catch (error) {
							console.error('❌ Error fetching transaction details:', error)
							toast.error('Could not retrieve profile ID')
							navigate('/')
						}
					},
					onError: (error) => {
						console.error('Transaction failed:', error)
						toast.error(error.message || 'Failed to create profile')
					},
				}
			)
		} catch (error: any) {
			console.error('Error:', error)
			toast.error(error.message || 'An error occurred')
		} finally {
			setLoading(false)
		}
	}

	if (!account) {
		return (
			<div className="min-h-screen">
				<Navbar />
				<div className="container mx-auto px-4 py-20">
					<div className="max-w-md mx-auto card text-center">
						{zkLoginUser ? (
							<>
								<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
									<Wallet className="w-8 h-8 text-white" />
								</div>
								<h2 className="text-2xl font-bold mb-3">Wallet Connection Required</h2>
								<div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
									<p className="text-sm text-blue-900 mb-2">
										<strong>Welcome, {zkLoginUser.email}!</strong>
									</p>
									<p className="text-sm text-blue-800">
										To create a profile, you need to connect your Sui wallet. 
										Your wallet will be automatically linked to your Google account.
									</p>
								</div>
								<p className="text-gray-600 mb-6">
									Click the "Connect Wallet" button at the top right to connect your wallet.
								</p>
								<Link to="/" className="btn btn-primary">
									Back to Home
								</Link>
							</>
						) : (
							<>
								<h2 className="text-2xl font-bold mb-4">Wallet Required</h2>
								<p className="text-gray-600 mb-6">
									Please connect your wallet to create a profile
								</p>
								<Link to="/" className="btn btn-primary">
									Back to Home
								</Link>
							</>
						)}
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
					{/* Header */}
					<div className="mb-8">
						<Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
							<ArrowLeft className="w-4 h-4" />
							Back to Home
						</Link>
						<h1 className="text-4xl font-bold gradient-text mb-2">
							Create Your Profile
						</h1>
						<p className="text-gray-600">
							Set up your decentralized link hub on Sui blockchain
						</p>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="card space-y-6">
							<h2 className="text-xl font-bold">Basic Information</h2>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Profile Name *
								</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="johndoe"
									className="input"
									required
								/>
								<p className="text-sm text-gray-500 mt-1">
									This will be your unique identifier
								</p>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Bio
								</label>
								<textarea
									value={bio}
									onChange={(e) => setBio(e.target.value)}
									placeholder="Tell the world about yourself..."
									className="input min-h-[100px]"
									rows={4}
								/>
							</div>

							{/* Avatar Icon Selector */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-3">
									Choose Avatar Icon
								</label>
								<div className="grid grid-cols-5 gap-3">
									{AVATAR_ICONS.map((avatar) => {
										const IconComponent = avatar.icon
										const isSelected = selectedAvatar === avatar.id
										return (
											<button
												key={avatar.id}
												type="button"
												onClick={() => {
													setSelectedAvatar(avatar.id)
													setAvatarCid(avatar.id)
												}}
												className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${
													isSelected
														? `bg-gradient-to-br ${avatar.color} text-white shadow-lg scale-105`
														: 'bg-gray-100 hover:bg-gray-200 text-gray-600'
												}`}
												title={avatar.label}
											>
												<IconComponent className="w-8 h-8 mb-1" />
												<span className="text-xs font-medium">{avatar.label}</span>
											</button>
										)
									})}
								</div>
								<p className="text-sm text-gray-500 mt-2">
									Select an icon that represents your profile
								</p>
							</div>


						</div>

						{/* Theme Selection */}
						<div className="card space-y-4">
							<h2 className="text-xl font-bold">Choose Theme</h2>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
								{THEMES.map((t) => (
									<button
										key={t.id}
										type="button"
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
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={loading || !name.trim()}
							className="w-full btn btn-primary text-lg py-4"
						>
							{loading ? (
								<>
									<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
									Creating Profile...
								</>
							) : (
								'Create Profile'
							)}
						</button>
					</form>

				{/* Info Box */}
				<div className="mt-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl space-y-2">
					<p className="text-sm text-blue-900">
						<strong>💡 Tip:</strong> Create your profile first, then add links later.
					</p>
					<p className="text-xs text-blue-700">
						Profile creation requires a small gas fee (≈0.01 SUI). After creation, you can add and manage links from your profile page.
					</p>
				</div>
				</div>
			</div>
		</div>
	)
}
