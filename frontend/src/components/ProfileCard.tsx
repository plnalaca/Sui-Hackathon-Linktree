import { Link } from 'react-router-dom'
import { Edit, ExternalLink } from 'lucide-react'
import { THEMES, DEFAULT_AVATAR } from '@/config/constants'

interface ProfileCardProps {
	objectId: string
	name: string
	bio: string
	avatarCid: string
	theme: number
	linksCount: number
	isOwner?: boolean
}

export default function ProfileCard({
	objectId,
	name,
	bio,
	avatarCid,
	theme,
	linksCount,
	isOwner,
}: ProfileCardProps) {
	const themeData = THEMES.find((t) => t.id === theme) || THEMES[0]
	const avatarUrl = avatarCid || `${DEFAULT_AVATAR}${name}`

	return (
		<div className="card hover:shadow-xl transition-all duration-300">
			<div className={`h-32 rounded-xl bg-gradient-to-r ${themeData.gradient} -mx-6 -mt-6 mb-4`} />

			<div className="relative -mt-20 mb-4">
				<img
					src={avatarUrl}
					alt={name}
					className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto bg-white"
				/>
			</div>

			<div className="text-center space-y-2 mb-4">
				<h2 className="text-2xl font-bold text-gray-900">{name}</h2>
				<p className="text-gray-600">{bio}</p>
				<p className="text-sm text-gray-500">{linksCount} links</p>
			</div>

			<div className="flex gap-2">
				<Link
					to={`/profile/${objectId}`}
					className="flex-1 btn btn-primary"
				>
					<ExternalLink className="w-4 h-4" />
					View Profile
				</Link>

				{isOwner && (
					<Link
						to={`/edit/${objectId}`}
						className="btn btn-secondary"
					>
						<Edit className="w-4 h-4" />
					</Link>
				)}
			</div>
		</div>
	)
}


