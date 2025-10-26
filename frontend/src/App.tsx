import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui/client'
import { Toaster } from '@/components/ui/Toaster'
import '@mysten/dapp-kit/dist/index.css'

// Pages
import HomePage from '@/pages/HomePage'
import ProfilePage from '@/pages/ProfilePage'
import CreateProfilePage from '@/pages/CreateProfilePage'
import EditProfilePage from '@/pages/EditProfilePage'
import AuthCallbackPage from '@/pages/AuthCallbackPage'
import FeaturesTestPage from '@/pages/FeaturesTestPage'

// Networks
const networks = {
	testnet: { url: getFullnodeUrl('testnet') },
	mainnet: { url: getFullnodeUrl('mainnet') },
	devnet: { url: getFullnodeUrl('devnet') },
}

const queryClient = new QueryClient()

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<SuiClientProvider networks={networks} defaultNetwork="testnet">
				<WalletProvider autoConnect>
					<div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route path="/test-features" element={<FeaturesTestPage />} />
							<Route path="/create" element={<CreateProfilePage />} />
							<Route path="/profile/:objectId" element={<ProfilePage />} />
							<Route path="/edit/:objectId" element={<EditProfilePage />} />
							<Route path="/auth/callback" element={<AuthCallbackPage />} />
						</Routes>
						<Toaster />
					</div>
				</WalletProvider>
			</SuiClientProvider>
		</QueryClientProvider>
	)
}

export default App


