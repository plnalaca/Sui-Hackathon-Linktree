import { useState } from 'react'
import { Play, Music, Video, X } from 'lucide-react'

interface MediaEmbedProps {
	url: string
	type?: 'youtube' | 'spotify' | 'tiktok' | 'soundcloud' | 'auto'
	title?: string
}

export default function MediaEmbed({ url, type = 'auto', title }: MediaEmbedProps) {
	const [showEmbed, setShowEmbed] = useState(false)

	// Auto-detect media type from URL
	const detectType = (url: string): 'youtube' | 'spotify' | 'tiktok' | 'soundcloud' | 'unknown' => {
		if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
		if (url.includes('spotify.com')) return 'spotify'
		if (url.includes('tiktok.com')) return 'tiktok'
		if (url.includes('soundcloud.com')) return 'soundcloud'
		return 'unknown'
	}

	const mediaType = type === 'auto' ? detectType(url) : type

	// Extract video/track IDs
	const getEmbedUrl = (): string => {
		switch (mediaType) {
			case 'youtube': {
				const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]
				return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
			}
			case 'spotify': {
				// Extract spotify URI (track, album, playlist, etc)
				const spotifyId = url.match(/spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/)?.[2]
				const spotifyType = url.match(/spotify\.com\/(track|album|playlist|episode)\//)?.[1]
				return spotifyId ? `https://open.spotify.com/embed/${spotifyType}/${spotifyId}` : ''
			}
			case 'tiktok': {
				// TikTok embeds are trickier, use oEmbed or direct link
				return url
			}
			case 'soundcloud': {
				return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=true`
			}
			default:
				return url
		}
	}

	const embedUrl = getEmbedUrl()

	const getIcon = () => {
		switch (mediaType) {
			case 'youtube':
				return <Video className="w-5 h-5" />
			case 'spotify':
			case 'soundcloud':
				return <Music className="w-5 h-5" />
			case 'tiktok':
				return <Play className="w-5 h-5" />
			default:
				return <Play className="w-5 h-5" />
		}
	}

	const getColor = () => {
		switch (mediaType) {
			case 'youtube':
				return 'from-red-500 to-red-600'
			case 'spotify':
				return 'from-green-500 to-green-600'
			case 'tiktok':
				return 'from-pink-500 to-purple-600'
			case 'soundcloud':
				return 'from-orange-500 to-orange-600'
			default:
				return 'from-blue-500 to-purple-600'
		}
	}

	if (!embedUrl) {
		return (
			<div className="card bg-red-50 text-red-700 text-center py-4">
				<p className="font-semibold">Invalid media URL</p>
				<p className="text-sm">{url}</p>
			</div>
		)
	}

	return (
		<div className="card p-0 overflow-hidden">
			{!showEmbed ? (
				<button
					onClick={() => setShowEmbed(true)}
					className={`w-full p-6 bg-gradient-to-r ${getColor()} text-white hover:opacity-90 transition-all flex items-center justify-center gap-3`}
				>
					{getIcon()}
					<span className="font-semibold">
						{title || `Play ${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}`}
					</span>
				</button>
			) : (
				<div className="relative">
					<button
						onClick={() => setShowEmbed(false)}
						className="absolute top-2 right-2 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
					>
						<X className="w-4 h-4" />
					</button>
					
					{mediaType === 'tiktok' ? (
						<div className="aspect-[9/16] max-h-[600px] mx-auto bg-black">
							<blockquote
								className="tiktok-embed"
								cite={url}
								data-video-id={url.match(/\/video\/(\d+)/)?.[1]}
								style={{ maxWidth: '605px', minWidth: '325px' }}
							>
								<section>
									<a target="_blank" rel="noopener noreferrer" href={url}>
										View on TikTok
									</a>
								</section>
							</blockquote>
							<script async src="https://www.tiktok.com/embed.js"></script>
						</div>
					) : (
						<iframe
							src={embedUrl}
							className={`w-full ${
								mediaType === 'spotify' ? 'h-[152px]' : 'aspect-video'
							}`}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
							loading="lazy"
						/>
					)}
				</div>
			)}
		</div>
	)
}
