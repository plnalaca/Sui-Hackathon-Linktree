import { useState } from 'react'
import { DollarSign, ShoppingCart, Heart, ExternalLink, Copy, Check } from 'lucide-react'

type MonetizationType = 'donation' | 'product' | 'service' | 'subscription'

interface MonetizationCardProps {
	type: MonetizationType
	title: string
	description?: string
	price?: string
	currency?: string
	paymentUrl: string
	imageUrl?: string
}

export default function MonetizationCard({
	type,
	title,
	description,
	price,
	currency = 'USD',
	paymentUrl,
	imageUrl,
}: MonetizationCardProps) {
	const [copied, setCopied] = useState(false)

	const handleCopy = () => {
		navigator.clipboard.writeText(paymentUrl)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const getIcon = () => {
		switch (type) {
			case 'donation':
				return <Heart className="w-5 h-5" />
			case 'product':
				return <ShoppingCart className="w-5 h-5" />
			case 'service':
				return <DollarSign className="w-5 h-5" />
			case 'subscription':
				return <DollarSign className="w-5 h-5" />
		}
	}

	const getGradient = () => {
		switch (type) {
			case 'donation':
				return 'from-pink-500 to-rose-500'
			case 'product':
				return 'from-blue-500 to-cyan-500'
			case 'service':
				return 'from-purple-500 to-indigo-500'
			case 'subscription':
				return 'from-green-500 to-emerald-500'
		}
	}

	const getButtonText = () => {
		switch (type) {
			case 'donation':
				return 'Support Me'
			case 'product':
				return 'Buy Now'
			case 'service':
				return 'Book Service'
			case 'subscription':
				return 'Subscribe'
		}
	}

	// Detect payment platform
	const getPaymentPlatform = () => {
		const url = paymentUrl.toLowerCase()
		if (url.includes('paypal')) return '💳 PayPal'
		if (url.includes('stripe')) return '💳 Stripe'
		if (url.includes('ko-fi')) return '☕ Ko-fi'
		if (url.includes('patreon')) return '🎨 Patreon'
		if (url.includes('buymeacoffee')) return '☕ Buy Me a Coffee'
		if (url.includes('gumroad')) return '📦 Gumroad'
		if (url.includes('etsy')) return '🛍️ Etsy'
		return '💳 Payment'
	}

	return (
		<div className="card p-0 overflow-hidden hover:shadow-xl transition-all">
			{/* Image */}
			{imageUrl && (
				<div className="aspect-video bg-gray-100 overflow-hidden">
					<img
						src={imageUrl}
						alt={title}
						className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
						onError={(e) => {
							;(e.target as HTMLImageElement).style.display = 'none'
						}}
					/>
				</div>
			)}

			<div className="p-6 space-y-4">
				{/* Header */}
				<div className="flex items-start justify-between gap-3">
					<div className="flex-1">
						<h3 className="font-bold text-lg mb-1">{title}</h3>
						{description && <p className="text-gray-600 text-sm">{description}</p>}
					</div>
					<div className={`p-3 bg-gradient-to-r ${getGradient()} text-white rounded-xl shadow-lg`}>
						{getIcon()}
					</div>
				</div>

				{/* Price */}
				{price && (
					<div className="flex items-baseline gap-1">
						<span className="text-3xl font-bold text-gray-900">{price}</span>
						<span className="text-gray-600 text-sm">{currency}</span>
						{type === 'subscription' && <span className="text-gray-500 text-sm ml-1">/month</span>}
					</div>
				)}

				{/* Platform Badge */}
				<div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
					{getPaymentPlatform()}
				</div>

				{/* Action Buttons */}
				<div className="flex gap-2">
					<a
						href={paymentUrl}
						target="_blank"
						rel="noopener noreferrer"
						className={`btn btn-primary flex-1 bg-gradient-to-r ${getGradient()} hover:opacity-90`}
					>
						{getButtonText()}
						<ExternalLink className="w-4 h-4 ml-2" />
					</a>
					<button
						onClick={handleCopy}
						className="btn btn-secondary px-4"
						title="Copy payment link"
					>
						{copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
					</button>
				</div>

				{/* Trust Badge */}
				{type === 'donation' && (
					<div className="text-center text-xs text-gray-500">
						💝 Your support helps create more content
					</div>
				)}
			</div>
		</div>
	)
}

// Helper component for quick setup
interface QuickPaymentButtonProps {
	type: 'paypal' | 'kofi' | 'patreon' | 'buymeacoffee'
	username: string
	amount?: string
}

export function QuickPaymentButton({ type, username, amount }: QuickPaymentButtonProps) {
	const getUrl = () => {
		switch (type) {
			case 'paypal':
				return `https://paypal.me/${username}${amount ? `/${amount}` : ''}`
			case 'kofi':
				return `https://ko-fi.com/${username}`
			case 'patreon':
				return `https://patreon.com/${username}`
			case 'buymeacoffee':
				return `https://buymeacoffee.com/${username}`
		}
	}

	const getIcon = () => {
		switch (type) {
			case 'paypal':
				return '💳'
			case 'kofi':
				return '☕'
			case 'patreon':
				return '🎨'
			case 'buymeacoffee':
				return '☕'
		}
	}

	const getName = () => {
		switch (type) {
			case 'paypal':
				return 'PayPal'
			case 'kofi':
				return 'Ko-fi'
			case 'patreon':
				return 'Patreon'
			case 'buymeacoffee':
				return 'Buy Me a Coffee'
		}
	}

	return (
		<a
			href={getUrl()}
			target="_blank"
			rel="noopener noreferrer"
			className="btn btn-primary w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
		>
			<span className="text-lg mr-2">{getIcon()}</span>
			Support on {getName()}
		</a>
	)
}
