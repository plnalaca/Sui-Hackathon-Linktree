import { useState, useEffect } from 'react'
import { Eye, MousePointerClick, TrendingUp, Calendar } from 'lucide-react'

interface AnalyticsData {
	totalViews: number
	totalClicks: number
	clicksByLink: { [key: string]: number }
	viewsToday: number
	clicksToday: number
}

interface AnalyticsDashboardProps {
	profileId: string
	links?: Array<{ label: string; url: string }>
}

export default function AnalyticsDashboard({ profileId }: AnalyticsDashboardProps) {
	const [analytics, setAnalytics] = useState<AnalyticsData>({
		totalViews: 0,
		totalClicks: 0,
		clicksByLink: {},
		viewsToday: 0,
		clicksToday: 0,
	})

	useEffect(() => {
		// Load analytics from localStorage
		const loadAnalytics = () => {
			const stored = localStorage.getItem(`analytics_${profileId}`)
			if (stored) {
				setAnalytics(JSON.parse(stored))
			}
		}

		loadAnalytics()

		// Track page view
		trackView()
	}, [profileId])

	const trackView = () => {
		const today = new Date().toDateString()
		const viewKey = `lastView_${profileId}`
		const lastView = localStorage.getItem(viewKey)

		setAnalytics((prev) => {
			const newAnalytics = {
				...prev,
				totalViews: prev.totalViews + 1,
				viewsToday: lastView === today ? prev.viewsToday + 1 : 1,
			}
			localStorage.setItem(`analytics_${profileId}`, JSON.stringify(newAnalytics))
			localStorage.setItem(viewKey, today)
			return newAnalytics
		})
	}

	const trackLinkClick = (linkLabel: string) => {
		const today = new Date().toDateString()
		const clickKey = `lastClick_${profileId}`
		const lastClick = localStorage.getItem(clickKey)

		setAnalytics((prev) => {
			const newAnalytics = {
				...prev,
				totalClicks: prev.totalClicks + 1,
				clicksToday: lastClick === today ? prev.clicksToday + 1 : 1,
				clicksByLink: {
					...prev.clicksByLink,
					[linkLabel]: (prev.clicksByLink[linkLabel] || 0) + 1,
				},
			}
			localStorage.setItem(`analytics_${profileId}`, JSON.stringify(newAnalytics))
			localStorage.setItem(clickKey, today)
			return newAnalytics
		})
	}

	// Expose trackLinkClick globally for LinkCard
	useEffect(() => {
		;(window as any).trackLinkClick = trackLinkClick
	}, [])

	const getClickRate = () => {
		if (analytics.totalViews === 0) return 0
		return ((analytics.totalClicks / analytics.totalViews) * 100).toFixed(1)
	}

	const getMostClickedLink = () => {
		const entries = Object.entries(analytics.clicksByLink)
		if (entries.length === 0) return null
		return entries.reduce((a, b) => (a[1] > b[1] ? a : b))
	}

	const mostClicked = getMostClickedLink()

	return (
		<div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h3 className="text-xl font-bold text-gray-900">Analytics</h3>
				<span className="text-sm text-gray-500">Local Storage Based</span>
			</div>

			{/* Main Stats */}
			<div className="grid grid-cols-2 gap-4">
				{/* Total Views */}
				<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
					<div className="flex items-center gap-2 mb-2">
						<Eye className="w-5 h-5 text-blue-600" />
						<span className="text-sm font-medium text-blue-900">Total Views</span>
					</div>
					<p className="text-3xl font-bold text-blue-600">{analytics.totalViews}</p>
					<p className="text-xs text-blue-700 mt-1">
						{analytics.viewsToday} today
					</p>
				</div>

				{/* Total Clicks */}
				<div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
					<div className="flex items-center gap-2 mb-2">
						<MousePointerClick className="w-5 h-5 text-purple-600" />
						<span className="text-sm font-medium text-purple-900">Total Clicks</span>
					</div>
					<p className="text-3xl font-bold text-purple-600">{analytics.totalClicks}</p>
					<p className="text-xs text-purple-700 mt-1">
						{analytics.clicksToday} today
					</p>
				</div>

				{/* Click Rate */}
				<div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
					<div className="flex items-center gap-2 mb-2">
						<TrendingUp className="w-5 h-5 text-green-600" />
						<span className="text-sm font-medium text-green-900">Click Rate</span>
					</div>
					<p className="text-3xl font-bold text-green-600">{getClickRate()}%</p>
					<p className="text-xs text-green-700 mt-1">of visitors click</p>
				</div>

				{/* Most Clicked */}
				<div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
					<div className="flex items-center gap-2 mb-2">
						<Calendar className="w-5 h-5 text-orange-600" />
						<span className="text-sm font-medium text-orange-900">Most Clicked</span>
					</div>
					{mostClicked ? (
						<>
							<p className="text-lg font-bold text-orange-600 truncate">
								{mostClicked[0]}
							</p>
							<p className="text-xs text-orange-700 mt-1">
								{mostClicked[1]} clicks
							</p>
						</>
					) : (
						<p className="text-sm text-orange-600">No data yet</p>
					)}
				</div>
			</div>

			{/* Link Performance */}
			{Object.keys(analytics.clicksByLink).length > 0 && (
				<div>
					<h4 className="text-sm font-semibold text-gray-700 mb-3">
						Link Performance
					</h4>
					<div className="space-y-2">
						{Object.entries(analytics.clicksByLink)
							.sort((a, b) => b[1] - a[1])
							.map(([label, clicks]) => {
								const percentage =
									analytics.totalClicks > 0
										? ((clicks / analytics.totalClicks) * 100).toFixed(0)
										: 0
								return (
									<div key={label} className="flex items-center gap-3">
										<span className="text-sm text-gray-700 flex-1 truncate">
											{label}
										</span>
										<div className="flex items-center gap-2">
											<div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
												<div
													className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
													style={{ width: `${percentage}%` }}
												/>
											</div>
											<span className="text-sm font-semibold text-gray-900 w-8">
												{clicks}
											</span>
										</div>
									</div>
								)
							})}
					</div>
				</div>
			)}

			{/* Info */}
			<div className="text-xs text-gray-500 text-center pt-4 border-t">
				💡 Analytics are stored locally. Clear browser data to reset.
			</div>
		</div>
	)
}
