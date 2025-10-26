import { Link } from 'react-router-dom'
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
import { Plus, Home, LogIn } from 'lucide-react'
import { useEffect, useState } from 'react'
import { prepareZkLogin, getGoogleAuthUrl } from '@/utils/zklogin'

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

export default function Navbar() {
	const account = useCurrentAccount()
	const [zkLoginUser, setZkLoginUser] = useState<any>(null)
	const [showLinkNotification, setShowLinkNotification] = useState(false)

	// Load zkLogin user from localStorage
	useEffect(() => {
		const user = localStorage.getItem('zklogin_user')
		if (user) {
			setZkLoginUser(JSON.parse(user))
		}
	}, [])

	// Auto-link accounts when both zkLogin and wallet are connected
	useEffect(() => {
		if (!zkLoginUser || !account) return

		const linkedAccounts = localStorage.getItem('linked_accounts')
		const accounts = linkedAccounts ? JSON.parse(linkedAccounts) : []
		
		const isAlreadyLinked = accounts.some((acc: any) => 
			acc.zkLoginEmail === zkLoginUser.email && 
			acc.walletAddress === account.address
		)
		
		if (isAlreadyLinked) return

		// Create new link
		const newLink = {
			zkLoginEmail: zkLoginUser.email,
			walletAddress: account.address,
			linkedAt: new Date().toISOString(),
			autoLinked: true
		}
		
		accounts.push(newLink)
		localStorage.setItem('linked_accounts', JSON.stringify(accounts))
		
		// Show notification for 3 seconds
		setShowLinkNotification(true)
		const timer = setTimeout(() => setShowLinkNotification(false), 3000)
		return () => clearTimeout(timer)
	}, [zkLoginUser, account])

	const handleGoogleLogin = async () => {
		try {
			const { state, nonce } = await prepareZkLogin()
			const authUrl = getGoogleAuthUrl(state, nonce)
			window.location.href = authUrl
		} catch (error) {
			console.error('Failed to initiate Google login:', error)
		}
	}

	const handleLogout = () => {
		localStorage.removeItem('zklogin_jwt')
		localStorage.removeItem('zklogin_state')
		localStorage.removeItem('zklogin_user')
		localStorage.removeItem('zklogin_address')
		setZkLoginUser(null)
	}

	return (
		<>
			<nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-between h-16">
						{/* Logo */}
						<Link to="/" className="flex items-center gap-2 group">
							<div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
								<CloverChainIcon className="w-6 h-6 text-white" />
							</div>
							<span className="font-bold text-xl gradient-text">
								Blucky
							</span>
						</Link>

						{/* Navigation */}
						<div className="flex items-center gap-4">
							<Link
								to="/"
								className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
							>
								<Home className="w-4 h-4" />
								<span className="font-medium">Home</span>
							</Link>

							<Link
								to="/create"
								className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
							>
							<Plus className="w-4 h-4" />
							<span className="font-medium">Create Profile</span>
						</Link>

						{!account && !zkLoginUser && (
							<button
								onClick={handleGoogleLogin}
								className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border-2 border-gray-300 hover:border-blue-500 transition-colors"
							>
								<LogIn className="w-4 h-4" />
								<span className="font-medium">Sign in with Google</span>
							</button>
						)}

						{zkLoginUser && !account && (
							<div className="flex items-center gap-3">
								<div className="flex items-center gap-2">
									{zkLoginUser.picture && (
										<img src={zkLoginUser.picture} alt="Profile" className="w-8 h-8 rounded-full" />
									)}
									<span className="text-sm font-medium">{zkLoginUser.email}</span>
								</div>
								<button
									onClick={handleLogout}
									className="text-sm text-red-600 hover:underline"
								>
									Logout
								</button>
							</div>
						)}

						<ConnectButton />
					</div>
				</div>
			</div>
		</nav>

		{/* Account Linking Success Notification */}
		{showLinkNotification && zkLoginUser && account && (
			<div className="fixed bottom-4 right-4 z-50 max-w-sm">
				<div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-2xl p-4 animate-slide-up">
					<div className="flex items-start gap-3">
						<div className="flex-shrink-0">
							<div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
							</div>
						</div>
						<div className="flex-1">
							<h3 className="font-bold text-lg mb-1">
								✨ Accounts Linked Successfully!
							</h3>
							<p className="text-sm text-white/90 mb-2">
								Your Google account has been linked with your Sui wallet.
							</p>
							<div className="space-y-1 text-xs text-white/80">
								<div className="flex items-center gap-2">
									<span className="font-semibold">📧</span>
									<span className="truncate">{zkLoginUser.email}</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="font-semibold">👛</span>
									<span className="font-mono">
										{account.address.slice(0, 8)}...{account.address.slice(-6)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)}
		</>
	)
}
