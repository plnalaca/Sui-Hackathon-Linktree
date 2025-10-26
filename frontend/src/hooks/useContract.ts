import { PACKAGE_ID, REGISTRY_ID, MODULE_NAME } from '@/config/constants'

/**
 * Hook to get contract configuration
 */
export function useContract() {
  return {
    packageId: PACKAGE_ID,
    registryId: REGISTRY_ID,
    moduleName: MODULE_NAME,
    
    // Helper to get function target
    getTarget: (functionName: string) => {
      return `${PACKAGE_ID}::${MODULE_NAME}::${functionName}`
    },
    
    // Validate configuration
    isConfigured: () => {
      const isValid = 
        String(PACKAGE_ID) !== '0x0000000000000000000000000000000000000000000000000000000000000000' &&
        String(REGISTRY_ID) !== '0x0000000000000000000000000000000000000000000000000000000000000000'
      
      if (!isValid) {
        console.error('⚠️ Contract not configured! Please update constants.ts')
      }
      
      return isValid
    },
  }
}

/**
 * Contract function targets
 */
export const CONTRACT_FUNCTIONS = {
  // Profile management
  CREATE_PROFILE: 'create_profile',
  CREATE_PROFILE_SIMPLE: 'create_profile_simple',
  UPDATE_OWNER: 'update_owner',
  TRANSFER_PROFILE: 'transfer_profile',
  DELETE_PROFILE: 'delete_profile',
  
  // Profile updates
  SET_BIO: 'set_bio',
  SET_AVATAR: 'set_avatar',
  SET_THEME: 'set_theme',
  
  // Link management
  ADD_LINK: 'add_link',
  UPDATE_LINK_AT: 'update_link_at',
  REMOVE_LINK_AT: 'remove_link_at',
  SET_LINKS: 'set_links',
  SWAP_LINKS: 'swap_links',
} as const

/**
 * Get full function target
 */
export function getFunctionTarget(functionName: string): string {
  return `${PACKAGE_ID}::${MODULE_NAME}::${functionName}`
}


