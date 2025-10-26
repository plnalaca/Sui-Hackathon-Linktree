import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Download, Share2, X } from 'lucide-react'

interface QRCodeGeneratorProps {
	url: string
	title?: string
	onClose?: () => void
}

export default function QRCodeGenerator({ url, title = 'Profile QR Code', onClose }: QRCodeGeneratorProps) {
	const [size, setSize] = useState(256)
	const [includeImage, setIncludeImage] = useState(false)

	const downloadQRCode = () => {
		const svg = document.getElementById('qr-code-svg')
		if (!svg) return

		const svgData = new XMLSerializer().serializeToString(svg)
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')
		const img = new Image()

		canvas.width = size
		canvas.height = size

		img.onload = () => {
			ctx?.drawImage(img, 0, 0)
			const pngFile = canvas.toDataURL('image/png')

			const downloadLink = document.createElement('a')
			downloadLink.download = 'profile-qr-code.png'
			downloadLink.href = pngFile
			downloadLink.click()
		}

		img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
	}

	const shareQRCode = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: title,
					text: 'Check out my profile!',
					url: url,
				})
			} catch (err) {
				console.log('Error sharing:', err)
			}
		} else {
			// Fallback: copy to clipboard
			navigator.clipboard.writeText(url)
			alert('Profile URL copied to clipboard!')
		}
	}

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
				{/* Close Button */}
				{onClose && (
					<button
						onClick={onClose}
						className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X className="w-5 h-5 text-gray-600" />
					</button>
				)}

				{/* Header */}
				<div className="text-center mb-6">
					<h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
					<p className="text-sm text-gray-600">
						Scan this QR code to visit the profile
					</p>
				</div>

				{/* QR Code */}
				<div className="flex justify-center mb-6 p-6 bg-gray-50 rounded-xl">
					<QRCodeSVG
						id="qr-code-svg"
						value={url}
						size={size}
						level="H"
						includeMargin={true}
						imageSettings={
							includeImage
								? {
										src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI4IiBmaWxsPSIjNkY0MUQxIi8+PHBhdGggZD0iTTE2IDhMMjAgMTZMMTYgMjRMMTIgMTZMMTYgOFoiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
										height: 32,
										width: 32,
										excavate: true,
								  }
								: undefined
						}
					/>
				</div>

				{/* Options */}
				<div className="space-y-4 mb-6">
					{/* Size Selector */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							QR Code Size: {size}px
						</label>
						<input
							type="range"
							min="128"
							max="512"
							step="64"
							value={size}
							onChange={(e) => setSize(parseInt(e.target.value))}
							className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
						/>
					</div>

					{/* Include Logo */}
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-gray-700">
							Include Logo
						</label>
						<button
							onClick={() => setIncludeImage(!includeImage)}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								includeImage ? 'bg-purple-600' : 'bg-gray-200'
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									includeImage ? 'translate-x-6' : 'translate-x-1'
								}`}
							/>
						</button>
					</div>
				</div>

				{/* Actions */}
				<div className="flex gap-3">
					<button
						onClick={downloadQRCode}
						className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
					>
						<Download className="w-5 h-5" />
						Download
					</button>
					<button
						onClick={shareQRCode}
						className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
					>
						<Share2 className="w-5 h-5" />
						Share
					</button>
				</div>

				{/* URL Display */}
				<div className="mt-4 p-3 bg-gray-50 rounded-lg">
					<p className="text-xs text-gray-600 break-all">{url}</p>
				</div>
			</div>
		</div>
	)
}
