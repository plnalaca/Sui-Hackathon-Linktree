import { useState, useEffect } from 'react'
import { Instagram, Twitter, Youtube, TrendingUp } from 'lucide-react'

interface SocialFeedProps {
	platform: 'instagram' | 'twitter' | 'youtube' | 'tiktok'
	username: string
	maxPosts?: number
}

export default function SocialFeed({ platform, username }: SocialFeedProps) {
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// Simulate loading
		const timer = setTimeout(() => setLoading(false), 1000)
		return () => clearTimeout(timer)
	}, [username])

	const getIcon = () => {
		switch (platform) {
			case 'instagram':
				return <Instagram className="w-5 h-5" />
			case 'twitter':
				return <Twitter className="w-5 h-5" />
			case 'youtube':
				return <Youtube className="w-5 h-5" />
			case 'tiktok':
				return <TrendingUp className="w-5 h-5" />
		}
	}

	const getColor = () => {
		switch (platform) {
			case 'instagram':
				return 'from-pink-500 via-purple-500 to-orange-500'
			case 'twitter':
				return 'from-blue-400 to-blue-600'
			case 'youtube':
				return 'from-red-600 to-red-700'
			case 'tiktok':
				return 'from-black to-gray-800'
		}
	}

	const getPlatformName = () => {
		return platform.charAt(0).toUpperCase() + platform.slice(1)
	}

	const getEmbedCode = () => {
		switch (platform) {
			case 'instagram':
				// Instagram embed widget
				return (
					<div className="bg-white rounded-xl p-4">
						<div className="text-center space-y-4">
							<div className={`w-16 h-16 mx-auto bg-gradient-to-r ${getColor()} rounded-full flex items-center justify-center text-white`}>
								{getIcon()}
							</div>
							<div>
								<h3 className="font-bold text-lg">@{username}</h3>
								<p className="text-gray-600 text-sm">Follow on Instagram</p>
							</div>
							<a
								href={`https://instagram.com/${username}`}
								target="_blank"
								rel="noopener noreferrer"
								className="btn btn-primary w-full"
							>
								View Profile
							</a>
						</div>
						<div className="mt-4 text-xs text-gray-500 text-center">
							💡 Tip: Use Instagram's official embed widget for live feed
						</div>
					</div>
				)
			case 'twitter':
				// Twitter timeline embed
				return (
					<div className="bg-white rounded-xl overflow-hidden">
						<a
							className="twitter-timeline"
							data-height="600"
							data-theme="light"
							href={`https://twitter.com/${username}?ref_src=twsrc%5Etfw`}
						>
							Tweets by @{username}
						</a>
						<script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
					</div>
				)
			case 'youtube':
				// YouTube channel embed
				return (
					<div className="space-y-4">
						<div className="bg-white rounded-xl p-4">
							<div className="text-center space-y-4">
								<div className={`w-16 h-16 mx-auto bg-gradient-to-r ${getColor()} rounded-full flex items-center justify-center text-white`}>
									{getIcon()}
								</div>
								<div>
									<h3 className="font-bold text-lg">@{username}</h3>
									<p className="text-gray-600 text-sm">Subscribe on YouTube</p>
								</div>
								<a
									href={`https://youtube.com/@${username}`}
									target="_blank"
									rel="noopener noreferrer"
									className="btn btn-primary w-full"
								>
									Visit Channel
								</a>
							</div>
						</div>
						<div className="text-xs text-gray-500 text-center">
							💡 Tip: Embed specific videos using MediaEmbed component
						</div>
					</div>
				)
			case 'tiktok':
				return (
					<div className="bg-white rounded-xl p-4">
						<div className="text-center space-y-4">
							<div className={`w-16 h-16 mx-auto bg-gradient-to-r ${getColor()} rounded-full flex items-center justify-center text-white`}>
								{getIcon()}
							</div>
							<div>
								<h3 className="font-bold text-lg">@{username}</h3>
								<p className="text-gray-600 text-sm">Follow on TikTok</p>
							</div>
							<a
								href={`https://tiktok.com/@${username}`}
								target="_blank"
								rel="noopener noreferrer"
								className="btn btn-primary w-full"
							>
								View Profile
							</a>
						</div>
					</div>
				)
		}
	}

	if (loading) {
		return (
			<div className="card">
				<div className="flex items-center gap-3 mb-4">
					<div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
					<div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
				</div>
				<div className="space-y-3">
					{[1, 2, 3].map((i) => (
						<div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
					))}
				</div>
			</div>
		)
	}

	return (
		<div className="card">
			<div className="flex items-center gap-3 mb-4">
				<div className={`w-8 h-8 bg-gradient-to-r ${getColor()} rounded-lg flex items-center justify-center text-white`}>
					{getIcon()}
				</div>
				<h3 className="font-bold text-lg">{getPlatformName()} Feed</h3>
			</div>
			{getEmbedCode()}
		</div>
	)
}
