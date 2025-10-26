/**
 * Utility functions to detect link types and render appropriate components
 */

export type LinkType = 'normal' | 'media' | 'social' | 'monetization'

export interface DetectedLink {
	type: LinkType
	platform?: string
	// For monetization
	monetizationType?: 'donation' | 'product' | 'service' | 'subscription'
}

/**
 * Detect if URL is a media embed (YouTube, Spotify, TikTok, SoundCloud)
 */
export function detectMediaEmbed(url: string): boolean {
	const mediaPatterns = [
		/youtube\.com\/watch/i,
		/youtu\.be\//i,
		/spotify\.com\/(track|playlist|album)/i,
		/tiktok\.com\/@[\w]+\/video/i,
		/soundcloud\.com\//i,
	]
	return mediaPatterns.some(pattern => pattern.test(url))
}

/**
 * Detect if URL is a payment/monetization link
 */
export function detectMonetization(url: string): boolean {
	const paymentPatterns = [
		/paypal\.com\/(donate|paypalme)/i,
		/ko-fi\.com\//i,
		/patreon\.com\//i,
		/buymeacoffee\.com\//i,
		/stripe\.com\/(buy|checkout)/i,
		/gumroad\.com\//i,
		/etsy\.com\/shop/i,
	]
	return paymentPatterns.some(pattern => pattern.test(url))
}

/**
 * Detect if URL is a social media profile
 */
export function detectSocialProfile(url: string): string | null {
	if (/instagram\.com\//i.test(url)) return 'instagram'
	if (/twitter\.com\/|x\.com\//i.test(url)) return 'twitter'
	if (/youtube\.com\/@|youtube\.com\/channel|youtube\.com\/c\//i.test(url)) return 'youtube'
	if (/tiktok\.com\/@[\w]+$/i.test(url)) return 'tiktok'
	return null
}

/**
 * Extract username from social URL
 */
export function extractSocialUsername(url: string, platform: string): string {
	try {
		const urlObj = new URL(url)
		const pathname = urlObj.pathname
		
		switch (platform) {
			case 'instagram':
			case 'twitter':
			case 'tiktok':
				// Get first path segment after /
				const match = pathname.match(/^\/(@)?([^\/]+)/)
				return match ? match[2] : ''
			case 'youtube':
				// Handle @username, /c/channel or /channel/id
				const ytMatch = pathname.match(/^\/@([^\/]+)|\/c\/([^\/]+)|\/channel\/([^\/]+)/)
				return ytMatch ? (ytMatch[1] || ytMatch[2] || ytMatch[3]) : ''
			default:
				return ''
		}
	} catch {
		return ''
	}
}

/**
 * Detect monetization type from URL
 */
export function detectMonetizationType(url: string): 'donation' | 'product' | 'service' | 'subscription' {
	if (/paypal\.com\/donate|ko-fi\.com|buymeacoffee\.com/i.test(url)) {
		return 'donation'
	}
	if (/etsy\.com|gumroad\.com/i.test(url)) {
		return 'product'
	}
	if (/patreon\.com/i.test(url)) {
		return 'subscription'
	}
	return 'donation' // default
}

/**
 * Main function to detect link type
 */
export function detectLinkType(url: string, label: string): DetectedLink {
	// Check label for hints (emojis)
	const labelLower = label.toLowerCase()
	
	// Media hints in label
	if (labelLower.includes('video') || labelLower.includes('music') || labelLower.includes('song') || label.includes('🎥') || label.includes('🎵')) {
		if (detectMediaEmbed(url)) {
			return { type: 'media' }
		}
	}
	
	// Payment hints in label
	if (labelLower.includes('support') || labelLower.includes('donate') || labelLower.includes('buy') || labelLower.includes('shop') || label.includes('💰') || label.includes('💳')) {
		if (detectMonetization(url)) {
			return { 
				type: 'monetization',
				monetizationType: detectMonetizationType(url)
			}
		}
	}
	
	// Social hints in label
	if (labelLower.includes('follow') || labelLower.includes('profile') || label.includes('📱') || label.includes('👤')) {
		const platform = detectSocialProfile(url)
		if (platform) {
			return { type: 'social', platform }
		}
	}
	
	// Auto-detect from URL
	if (detectMediaEmbed(url)) {
		return { type: 'media' }
	}
	
	const socialPlatform = detectSocialProfile(url)
	if (socialPlatform) {
		return { type: 'social', platform: socialPlatform }
	}
	
	if (detectMonetization(url)) {
		return { 
			type: 'monetization',
			monetizationType: detectMonetizationType(url)
		}
	}
	
	return { type: 'normal' }
}
