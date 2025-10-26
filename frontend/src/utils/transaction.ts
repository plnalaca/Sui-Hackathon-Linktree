import { SuiTransactionBlockResponse } from '@mysten/sui/client'

/**
 * Extract profile ID from transaction response
 */
export function extractProfileId(
  result: SuiTransactionBlockResponse
): string | null {
  try {
    const createdObjects = result.effects?.created || []
    
    // Find the Profile object (owned by an address)
    const profileObject = createdObjects.find((obj: any) => 
      obj.owner && 
      typeof obj.owner === 'object' && 
      'AddressOwner' in obj.owner
    )

    if (profileObject) {
      return profileObject.reference.objectId
    }

    return null
  } catch (error) {
    console.error('Error extracting profile ID:', error)
    return null
  }
}

/**
 * Extract transaction digest
 */
export function getTransactionDigest(
  result: SuiTransactionBlockResponse
): string {
  return result.digest
}

/**
 * Get Sui Explorer URL for transaction
 */
export function getExplorerTxUrl(
  digest: string,
  network: 'testnet' | 'mainnet' | 'devnet' = 'testnet'
): string {
  return `https://suiexplorer.com/txblock/${digest}?network=${network}`
}

/**
 * Get Sui Explorer URL for object
 */
export function getExplorerObjectUrl(
  objectId: string,
  network: 'testnet' | 'mainnet' | 'devnet' = 'testnet'
): string {
  return `https://suiexplorer.com/object/${objectId}?network=${network}`
}

/**
 * Format address for display (0x1234...5678)
 */
export function formatAddress(address: string, length: number = 4): string {
  if (!address || address.length < length * 2) return address
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`
}

/**
 * Extract all created object IDs from transaction
 */
export function extractCreatedObjectIds(
  result: SuiTransactionBlockResponse
): string[] {
  try {
    const createdObjects = result.effects?.created || []
    return createdObjects.map((obj: any) => obj.reference.objectId)
  } catch (error) {
    console.error('Error extracting created object IDs:', error)
    return []
  }
}

/**
 * Check if transaction was successful
 */
export function isTransactionSuccessful(
  result: SuiTransactionBlockResponse
): boolean {
  return result.effects?.status?.status === 'success'
}

/**
 * Get gas used from transaction
 */
export function getGasUsed(
  result: SuiTransactionBlockResponse
): number | null {
  try {
    const gasUsed = result.effects?.gasUsed
    if (gasUsed && 'computationCost' in gasUsed) {
      return (
        Number(gasUsed.computationCost) +
        Number(gasUsed.storageCost) -
        Number(gasUsed.storageRebate)
      )
    }
    return null
  } catch (error) {
    console.error('Error calculating gas used:', error)
    return null
  }
}

/**
 * Transaction result logger
 */
export function logTransactionResult(
  result: SuiTransactionBlockResponse,
  action: string
) {
  console.group(`🔗 Transaction: ${action}`)
  console.log('✅ Status:', isTransactionSuccessful(result) ? 'Success' : 'Failed')
  console.log('📋 Digest:', getTransactionDigest(result))
  console.log('⛽ Gas Used:', getGasUsed(result))
  
  const createdIds = extractCreatedObjectIds(result)
  if (createdIds.length > 0) {
    console.log('🆕 Created Objects:', createdIds)
  }
  
  const profileId = extractProfileId(result)
  if (profileId) {
    console.log('✨ Profile ID:', profileId)
  }
  
  console.log('🔗 View on Explorer:', getExplorerTxUrl(result.digest))
  console.groupEnd()
}


