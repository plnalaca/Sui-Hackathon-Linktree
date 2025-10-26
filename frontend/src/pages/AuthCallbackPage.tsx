import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleGoogleCallback } from '@/utils/zklogin'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
	const navigate = useNavigate()
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const processCallback = async () => {
			try {
				const hash = window.location.hash
				console.log('Hash:', hash)
				
				if (!hash) {
					throw new Error('No hash fragment found')
				}

				const result = handleGoogleCallback(hash)
				console.log('Callback result:', result)
				
				// Store the JWT and zkLogin state in localStorage
				localStorage.setItem('zklogin_jwt', result.idToken)
				localStorage.setItem('zklogin_state', JSON.stringify(result.state))
				localStorage.setItem('zklogin_user', JSON.stringify(result.decoded))
				
				console.log('zkLogin data stored, redirecting...')
				
				// Redirect to home after a short delay to ensure storage
				setTimeout(() => {
					navigate('/', { replace: true })
				}, 500)
			} catch (err) {
				console.error('zkLogin callback error:', err)
				setError(err instanceof Error ? err.message : 'Authentication failed')
			}
		}

		processCallback()
	}, [navigate])

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
					<h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
					<p className="text-gray-600 mb-6">{error}</p>
					<button
						onClick={() => navigate('/')}
						className="btn btn-primary w-full"
					>
						Return Home
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="text-center">
				<Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Authenticating...</h2>
				<p className="text-gray-600">Please wait while we verify your credentials</p>
			</div>
		</div>
	)
}
