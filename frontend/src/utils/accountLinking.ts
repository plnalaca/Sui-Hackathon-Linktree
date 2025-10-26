/**
 * Account Linking Utilities
 * Manages the connection between zkLogin (Google) accounts and Sui wallets
 */

export interface LinkedAccount {
	zkLoginEmail: string
	walletAddress: string
	linkedAt: string
}

/**
 * Get all linked accounts from localStorage
 */
export const getLinkedAccounts = (): LinkedAccount[] => {
	const data = localStorage.getItem('linked_accounts')
	return data ? JSON.parse(data) : []
}

/**
 * Check if a wallet address is linked to a zkLogin email
 */
export const isAccountLinked = (
	zkLoginEmail: string,
	walletAddress: string
): boolean => {
	const accounts = getLinkedAccounts()
	return accounts.some(
		(acc) =>
			acc.zkLoginEmail === zkLoginEmail && acc.walletAddress === walletAddress
	)
}

/**
 * Get the wallet address linked to a zkLogin email
 */
export const getLinkedWallet = (zkLoginEmail: string): string | null => {
	const accounts = getLinkedAccounts()
	const account = accounts.find((acc) => acc.zkLoginEmail === zkLoginEmail)
	return account ? account.walletAddress : null
}

/**
 * Get the zkLogin email linked to a wallet address
 */
export const getLinkedEmail = (walletAddress: string): string | null => {
	const accounts = getLinkedAccounts()
	const account = accounts.find((acc) => acc.walletAddress === walletAddress)
	return account ? account.zkLoginEmail : null
}
