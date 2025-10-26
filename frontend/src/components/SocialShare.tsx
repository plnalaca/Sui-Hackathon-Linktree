import { useState } from 'react'
import { Twitter, Facebook, MessageCircle, Link2, Check, QrCode } from 'lucide-react'
import QRCodeGenerator from './QRCodeGenerator'

interface SocialShareProps {
	url: string
	title: string
	description?: string
}

export default function SocialShare({ url, title }: SocialShareProps) {
	const [copied, setCopied] = useState(false)
	const [showQR, setShowQR] = useState(false)

	const encodedUrl = encodeURIComponent(url)
	const encodedTitle = encodeURIComponent(title)

	const shareLinks = {
		twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
		facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
		whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
		telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
	}

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(url)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error('Failed to copy:', err)
		}
	}

	return (
		<>
			<div className="space-y-4">
				{/* Share Header */}
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold text-gray-900">Share Profile</h3>
				</div>

				{/* Social Media Buttons */}
				<div className="grid grid-cols-2 gap-3">
					{/* Twitter */}
					<a
						href={shareLinks.twitter}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1DA1F2] text-white font-medium rounded-xl hover:bg-[#1a8cd8] transition-all hover:scale-105"
					>
						<Twitter className="w-5 h-5" />
						Twitter
					</a>

					{/* Facebook */}
					<a
						href={shareLinks.facebook}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center justify-center gap-2 px-4 py-3 bg-[#4267B2] text-white font-medium rounded-xl hover:bg-[#365899] transition-all hover:scale-105"
					>
						<Facebook className="w-5 h-5" />
						Facebook
					</a>

					{/* WhatsApp */}
					<a
						href={shareLinks.whatsapp}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white font-medium rounded-xl hover:bg-[#20ba5a] transition-all hover:scale-105"
					>
						<MessageCircle className="w-5 h-5" />
						WhatsApp
					</a>

					{/* QR Code */}
					<button
						onClick={() => setShowQR(true)}
						className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-all hover:scale-105"
					>
						<QrCode className="w-5 h-5" />
						QR Code
					</button>
				</div>

				{/* Copy Link */}
				<div className="flex gap-2">
					<input
						type="text"
						value={url}
						readOnly
						className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
					/>
					<button
						onClick={copyToClipboard}
						className={`px-4 py-2 rounded-xl font-medium transition-all ${
							copied
								? 'bg-green-500 text-white'
								: 'bg-gray-900 text-white hover:bg-gray-800'
						}`}
					>
						{copied ? (
							<Check className="w-5 h-5" />
						) : (
							<Link2 className="w-5 h-5" />
						)}
					</button>
				</div>

				{/* Copy Confirmation */}
				{copied && (
					<div className="text-center">
						<p className="text-sm text-green-600 font-medium">
							✓ Link copied to clipboard!
						</p>
					</div>
				)}
			</div>

			{/* QR Code Modal */}
			{showQR && (
				<QRCodeGenerator
					url={url}
					title={title}
					onClose={() => setShowQR(false)}
				/>
			)}
		</>
	)
}
