/**
 * Smart Contract Configuration
 * Deployed on Sui Testnet
 */
export const PACKAGE_ID = '0x1dbf331569f949091d2217ba3e85204f7d1313185d49dc4030697ccf8136f62b'
export const REGISTRY_ID = '0x73cf4301d9ce60c36cb76fa0339a9a0f8ac31fa32f9863f08621b6c7e84486f9'
export const MODULE_NAME = 'linktree'

/**
 * Theme Configuration
 * 5 pre-defined themes with comprehensive styling
 */
export const THEMES = [
  { 
    id: 1, 
    name: 'Ocean Blue', 
    gradient: 'from-blue-400 to-cyan-300',
    bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    cardBg: 'bg-white',
    linkBg: 'bg-blue-50 hover:bg-blue-100',
    linkBorder: 'border-blue-200',
    buttonPrimary: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
    buttonSecondary: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    accent: 'text-blue-600'
  },
  { 
    id: 2, 
    name: 'Sunset Orange', 
    gradient: 'from-orange-400 to-pink-400',
    bg: 'bg-gradient-to-br from-orange-50 to-pink-50',
    cardBg: 'bg-white',
    linkBg: 'bg-orange-50 hover:bg-orange-100',
    linkBorder: 'border-orange-200',
    buttonPrimary: 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600',
    buttonSecondary: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    accent: 'text-orange-600'
  },
  { 
    id: 3, 
    name: 'Forest Green', 
    gradient: 'from-green-400 to-teal-400',
    bg: 'bg-gradient-to-br from-green-50 to-teal-50',
    cardBg: 'bg-white',
    linkBg: 'bg-green-50 hover:bg-green-100',
    linkBorder: 'border-green-200',
    buttonPrimary: 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600',
    buttonSecondary: 'bg-green-100 text-green-700 hover:bg-green-200',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    accent: 'text-green-600'
  },
  { 
    id: 4, 
    name: 'Purple Dream', 
    gradient: 'from-purple-400 to-pink-400',
    bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
    cardBg: 'bg-white',
    linkBg: 'bg-purple-50 hover:bg-purple-100',
    linkBorder: 'border-purple-200',
    buttonPrimary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    buttonSecondary: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    accent: 'text-purple-600'
  },
  { 
    id: 5, 
    name: 'Dark Mode', 
    gradient: 'from-gray-800 to-gray-900',
    bg: 'bg-gradient-to-br from-gray-900 to-black',
    cardBg: 'bg-gray-800',
    linkBg: 'bg-gray-700 hover:bg-gray-600',
    linkBorder: 'border-gray-600',
    buttonPrimary: 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700',
    buttonSecondary: 'bg-gray-700 text-gray-100 hover:bg-gray-600',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    accent: 'text-gray-400'
  },
]

/**
 * Default Avatar URL (DiceBear API)
 */
export const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed='
