import { ExternalLink } from 'lucide-react'

interface LinkCardProps {
	label: string
	url: string
	onEdit?: () => void
	onDelete?: () => void
	editable?: boolean
	theme?: {
		linkBg?: string
		linkBorder?: string
		text?: string
		textSecondary?: string
		accent?: string
	}
}

export default function LinkCard({ label, url, onEdit, onDelete, editable, theme }: LinkCardProps) {
	const handleClick = () => {
		if (!editable) {
			// Track click in analytics
			if ((window as any).trackLinkClick) {
				(window as any).trackLinkClick(label)
			}
			window.open(url, '_blank', 'noopener,noreferrer')
		}
	}

	// Default theme values
	const linkBg = theme?.linkBg || 'bg-blue-50 hover:bg-blue-100'
	const linkBorder = theme?.linkBorder || 'border-blue-200'
	const text = theme?.text || 'text-gray-900'
	const textSecondary = theme?.textSecondary || 'text-gray-500'
	const accent = theme?.accent || 'text-blue-600'

	return (
		<div
			className={`relative group p-4 rounded-xl border-2 ${linkBorder} ${linkBg} transition-all cursor-pointer`}
			onClick={handleClick}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3 flex-1 min-w-0">
					<div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
						<ExternalLink className={`w-5 h-5 ${accent}`} />
					</div>
					<div className="flex-1 min-w-0">
						<h3 className={`font-semibold ${text} truncate`}>{label}</h3>
						<p className={`text-sm ${textSecondary} truncate`}>{url}</p>
					</div>
				</div>

				{editable && (
					<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
						<button
							onClick={(e) => {
								e.stopPropagation()
								onEdit?.()
							}}
							className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
						>
							Edit
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation()
								onDelete?.()
							}}
							className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
						>
							Delete
						</button>
					</div>
				)}
			</div>
		</div>
	)
}


