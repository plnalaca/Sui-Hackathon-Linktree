import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { generateNonce, generateRandomness } from '@mysten/sui/zklogin'
import { jwtDecode } from 'jwt-decode'

const REDIRECT_URI = `${window.location.origin}/`
const CLIENT_ID = '285628955881-anvf9eo7c36thju540el0igkl6mbjbrf.apps.googleusercontent.com'

export interface ZkLoginState {
	randomness: string
	maxEpoch: number
	ephemeralPrivateKey: string
	ephemeralPublicKey: string
}

export const getGoogleAuthUrl = (state: string, nonce: string): string => {
	const params = new URLSearchParams({
		client_id: CLIENT_ID,
		redirect_uri: REDIRECT_URI,
		response_type: 'id_token',
		scope: 'openid email profile',
		nonce: nonce,
		state: state,
	})

	return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export const prepareZkLogin = async (): Promise<{ state: string; nonce: string; randomness: string }> => {
	// Generate randomness for the zkLogin
	const randomness = generateRandomness()
	
	// Get current epoch (in production, fetch from RPC)
	const maxEpoch = 10 // This should be current epoch + buffer
	
	// Generate ephemeral keypair
	const ephemeralKeyPair = new Ed25519Keypair()
	const ephemeralPrivateKey = ephemeralKeyPair.getSecretKey()
	const ephemeralPublicKey = ephemeralKeyPair.getPublicKey().toBase64()
	
	// Generate nonce using the public key
	const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, randomness)
	
	// Create state for OAuth
	const state = JSON.stringify({
		randomness: randomness.toString(),
		maxEpoch,
		ephemeralPrivateKey,
		ephemeralPublicKey,
	})
	
	return { state, nonce, randomness: randomness.toString() }
}

export const handleGoogleCallback = (hash: string) => {
	const params = new URLSearchParams(hash.substring(1))
	const idToken = params.get('id_token')
	const state = params.get('state')
	
	if (!idToken || !state) {
		throw new Error('Missing id_token or state')
	}
	
	const decoded = jwtDecode(idToken)
	
	return {
		idToken,
		state: JSON.parse(state) as ZkLoginState,
		decoded,
	}
}
