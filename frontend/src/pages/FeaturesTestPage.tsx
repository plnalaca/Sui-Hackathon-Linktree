import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Navbar from '@/components/Navbar'
import MediaEmbed from '@/components/MediaEmbed'
import SocialFeed from '@/components/SocialFeed'
import MonetizationCard from '@/components/MonetizationCard'

export default function FeaturesTestPage() {
	const [mediaUrl, setMediaUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
	const [socialPlatform, setSocialPlatform] = useState<'instagram' | 'twitter' | 'youtube' | 'tiktok'>('instagram')
	const [socialUsername, setSocialUsername] = useState('instagram')
	const [monetizationType, setMonetizationType] = useState<'donation' | 'product' | 'service' | 'subscription'>('donation')
	const [monetizationUrl, setMonetizationUrl] = useState('https://www.paypal.com/donate')

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			
			<div className="container mx-auto px-4 py-8">
				<Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8">
					<ArrowLeft className="w-4 h-4" />
					Back to Home
				</Link>

				<div className="max-w-4xl mx-auto space-y-12">
					<div className="text-center">
						<h1 className="text-4xl font-bold mb-4">🎨 Features Test Page</h1>
						<p className="text-gray-600">Test all new features here</p>
					</div>

					{/* Media Embed Section */}
					<section className="space-y-6">
						<div>
							<h2 className="text-2xl font-bold mb-2">🎥 Media Embeds</h2>
							<p className="text-gray-600 mb-4">Test YouTube, Spotify, TikTok, SoundCloud links</p>
						</div>

						<div className="card">
							<label className="block text-sm font-medium mb-2">Enter Media URL:</label>
							<input
								type="text"
								value={mediaUrl}
								onChange={(e) => setMediaUrl(e.target.value)}
								className="input mb-4"
								placeholder="YouTube, Spotify, TikTok, SoundCloud URL"
							/>
							
							<div className="space-y-4">
								<button
									onClick={() => setMediaUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
									className="btn btn-secondary text-sm"
								>
									YouTube Example
								</button>
								<button
									onClick={() => setMediaUrl('https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp')}
									className="btn btn-secondary text-sm ml-2"
								>
									Spotify Example
								</button>
								<button
									onClick={() => setMediaUrl('https://www.tiktok.com/@username/video/1234567890')}
									className="btn btn-secondary text-sm ml-2"
								>
									TikTok Example
								</button>
								<button
									onClick={() => setMediaUrl('https://soundcloud.com/artist/track')}
									className="btn btn-secondary text-sm ml-2"
								>
									SoundCloud Example
								</button>
							</div>

							{mediaUrl && (
								<div className="mt-6">
									<MediaEmbed url={mediaUrl} />
								</div>
							)}
						</div>
					</section>

					{/* Social Feed Section */}
					<section className="space-y-6">
						<div>
							<h2 className="text-2xl font-bold mb-2">📱 Social Feeds</h2>
							<p className="text-gray-600 mb-4">Display social media profiles</p>
						</div>

						<div className="card">
							<div className="grid grid-cols-2 gap-4 mb-4">
								<div>
									<label className="block text-sm font-medium mb-2">Platform:</label>
									<select
										value={socialPlatform}
										onChange={(e) => setSocialPlatform(e.target.value as any)}
										className="input"
									>
										<option value="instagram">Instagram</option>
										<option value="twitter">Twitter</option>
										<option value="youtube">YouTube</option>
										<option value="tiktok">TikTok</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">Kullanıcı Adı:</label>
									<input
										type="text"
										value={socialUsername}
										onChange={(e) => setSocialUsername(e.target.value)}
										className="input"
										placeholder="username"
									/>
								</div>
							</div>

							<SocialFeed platform={socialPlatform} username={socialUsername} />
						</div>
					</section>

					{/* Monetization Section */}
					<section className="space-y-6">
						<div>
							<h2 className="text-2xl font-bold mb-2">💰 Monetization Cards</h2>
							<p className="text-gray-600 mb-4">Payment, donation, and product cards</p>
						</div>

						<div className="card">
							<div className="grid grid-cols-2 gap-4 mb-4">
								<div>
									<label className="block text-sm font-medium mb-2">Type:</label>
									<select
										value={monetizationType}
										onChange={(e) => setMonetizationType(e.target.value as any)}
										className="input"
									>
										<option value="donation">Donation</option>
										<option value="product">Product</option>
										<option value="service">Service</option>
										<option value="subscription">Subscription</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">Ödeme URL:</label>
									<input
										type="text"
										value={monetizationUrl}
										onChange={(e) => setMonetizationUrl(e.target.value)}
										className="input"
										placeholder="Payment URL"
									/>
								</div>
							</div>

							<div className="space-y-2 mb-6 text-sm">
								<button
									onClick={() => setMonetizationUrl('https://www.paypal.com/donate')}
									className="btn btn-secondary text-xs mr-2"
								>
									PayPal
								</button>
								<button
									onClick={() => setMonetizationUrl('https://buy.stripe.com/test_xxx')}
									className="btn btn-secondary text-xs mr-2"
								>
									Stripe
								</button>
								<button
									onClick={() => setMonetizationUrl('https://ko-fi.com/username')}
									className="btn btn-secondary text-xs mr-2"
								>
									Ko-fi
								</button>
								<button
									onClick={() => setMonetizationUrl('https://www.patreon.com/username')}
									className="btn btn-secondary text-xs mr-2"
								>
									Patreon
								</button>
								<button
									onClick={() => setMonetizationUrl('https://www.buymeacoffee.com/username')}
									className="btn btn-secondary text-xs mr-2"
								>
									Buy Me a Coffee
								</button>
							</div>

							<MonetizationCard
								type={monetizationType}
								title={`Sample ${monetizationType === 'donation' ? 'Donation' : monetizationType === 'product' ? 'Product' : monetizationType === 'service' ? 'Service' : 'Subscription'}`}
								description="This is a test description. You can write your own descriptions in your real profile."
								paymentUrl={monetizationUrl}
								price={monetizationType !== 'donation' ? '29.99' : undefined}
								currency={monetizationType !== 'donation' ? '$' : undefined}
							/>
						</div>
					</section>

					{/* Examples Grid */}
					<section className="space-y-6">
						<div>
							<h2 className="text-2xl font-bold mb-2">📋 Ready Examples</h2>
							<p className="text-gray-600 mb-4">Different combinations</p>
						</div>

						<div className="grid md:grid-cols-2 gap-6">
							{/* YouTube + Ko-fi */}
							<div className="space-y-4">
								<h3 className="font-bold">Content Creator Setup</h3>
								<MediaEmbed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
								<MonetizationCard
									type="donation"
									title="Support My Content"
									description="Help me create more awesome videos!"
									paymentUrl="https://ko-fi.com/creator"
								/>
							</div>

							{/* Spotify + Patreon */}
							<div className="space-y-4">
								<h3 className="font-bold">Music Artist Setup</h3>
								<MediaEmbed url="https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp" />
								<MonetizationCard
									type="subscription"
									title="Exclusive Content"
									description="Get early access to new releases"
									paymentUrl="https://www.patreon.com/artist"
									price="5.00"
									currency="$"
								/>
							</div>

							{/* Instagram Feed */}
							<div className="space-y-4">
								<h3 className="font-bold">Influencer Setup</h3>
								<SocialFeed platform="instagram" username="instagram" />
								<MonetizationCard
									type="product"
									title="My Merch Store"
									description="Check out my exclusive merchandise"
									paymentUrl="https://www.etsy.com/shop/myshop"
									price="24.99"
									currency="$"
								/>
							</div>

							{/* Twitter + Buy Me a Coffee */}
							<div className="space-y-4">
								<h3 className="font-bold">Writer Setup</h3>
								<SocialFeed platform="twitter" username="username" />
								<MonetizationCard
									type="donation"
									title="Buy Me a Coffee"
									description="Support my writing journey"
									paymentUrl="https://www.buymeacoffee.com/writer"
								/>
							</div>
						</div>
					</section>

					{/* Instructions */}
					<section className="card bg-blue-50 border-blue-200">
						<h3 className="text-lg font-bold mb-3">💡 How to Use?</h3>
						<ul className="space-y-2 text-sm text-gray-700">
							<li><strong>1. Media Embeds:</strong> Paste YouTube, Spotify, TikTok, or SoundCloud links</li>
							<li><strong>2. Social Feeds:</strong> Select platform and enter username</li>
							<li><strong>3. Monetization:</strong> Choose payment type and add URL (PayPal, Stripe, Ko-fi, etc.)</li>
							<li><strong>4. Real Usage:</strong> You're testing on this page for now. In the future, you'll be able to add these from EditProfile!</li>
						</ul>
					</section>
				</div>
			</div>
		</div>
	)
}
