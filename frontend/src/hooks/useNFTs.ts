import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit'
import { useState, useEffect } from 'react'

interface NFT {
	id: string
	name: string
	description: string
	imageUrl: string
	collection?: string
	type: string
}

export function useNFTs() {
	const account = useCurrentAccount()
	const client = useSuiClient()
	const [nfts, setNfts] = useState<NFT[]>([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (!account?.address) {
			setNfts([])
			return
		}

		fetchNFTs()
	}, [account?.address])

	const fetchNFTs = async () => {
		if (!account?.address) return

		setLoading(true)
		try {
			// Get all objects owned by user
			const objects = await client.getOwnedObjects({
				owner: account.address,
				options: {
					showType: true,
					showContent: true,
					showDisplay: true,
				},
			})

			const nftList: NFT[] = []

			for (const obj of objects.data) {
				if (!obj.data) continue

				// @ts-ignore
				const display = obj.data.display?.data
				// @ts-ignore
				const content = obj.data.content

				// Check if object has display metadata (typical for NFTs)
				if (display) {
					nftList.push({
						id: obj.data.objectId,
						name: display.name || 'Unnamed NFT',
						description: display.description || '',
						imageUrl: display.image_url || display.img_url || '',
						collection: display.collection || display.project_name,
						// @ts-ignore
						type: obj.data.type || '',
					})
				}
				// Also check for common NFT patterns
				else if (
					content &&
					// @ts-ignore
					(content.fields?.name || content.fields?.url || content.fields?.image_url)
				) {
					// @ts-ignore
					const fields = content.fields
					nftList.push({
						id: obj.data.objectId,
						name: fields.name || 'NFT',
						description: fields.description || '',
						imageUrl: fields.url || fields.image_url || '',
						// @ts-ignore
						type: obj.data.type || '',
					})
				}
			}

			setNfts(nftList)
		} catch (error) {
			console.error('Failed to fetch NFTs:', error)
			setNfts([])
		} finally {
			setLoading(false)
		}
	}

	return { nfts, loading, refetch: fetchNFTs }
}
