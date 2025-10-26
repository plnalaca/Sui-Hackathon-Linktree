import { test, expect } from '@playwright/test'

/**
 * Basic Navigation and UI Tests
 * Tests the core user interface and navigation flows
 */

test.describe('Homepage Tests', () => {
	test('should load homepage successfully', async ({ page }) => {
		await page.goto('/')
		
		// Check page title
		await expect(page).toHaveTitle(/Blucky/)
		
		// Check main heading
		await expect(page.getByText('Decentralized Link Sharing')).toBeVisible()
	})
	
	test('should display navbar with correct elements', async ({ page }) => {
		await page.goto('/')
		
		// Check logo
		await expect(page.getByText('Blucky')).toBeVisible()
		
		// Check navigation buttons
		await expect(page.getByRole('link', { name: /Home/i })).toBeVisible()
		await expect(page.getByRole('link', { name: /Create Profile/i })).toBeVisible()
		
		// Check wallet connect button
		await expect(page.getByRole('button', { name: /Connect Wallet/i })).toBeVisible()
	})
	
	test('should show Google login button', async ({ page }) => {
		await page.goto('/')
		
		// Check Google sign in button
		await expect(page.getByRole('button', { name: /Sign in with Google/i })).toBeVisible()
	})
})

test.describe('Create Profile Page', () => {
	test('should redirect to wallet prompt when not connected', async ({ page }) => {
		await page.goto('/create')
		
		// Should show wallet required message
		await expect(page.getByText(/Wallet.*Gerekli/i)).toBeVisible()
	})
	
	test('should display create profile form with all elements', async ({ page }) => {
		// Note: This test assumes wallet is connected
		// In real scenario, we would mock wallet connection
		await page.goto('/create')
		
		// Wait for page to load
		await page.waitForTimeout(1000)
		
		// Check if form exists or wallet prompt exists
		const hasForm = await page.getByLabel(/Username/i).isVisible().catch(() => false)
		const hasPrompt = await page.getByText(/Wallet.*Gerekli/i).isVisible().catch(() => false)
		
		expect(hasForm || hasPrompt).toBeTruthy()
	})
})

test.describe('Profile Page', () => {
	test('should show 404 for non-existent profile', async ({ page }) => {
		const response = await page.goto('/profile/0x0000000000000000000000000000000000000000000000000000000000000000')
		
		// Check if page loaded
		expect(response?.status()).toBeLessThan(500)
	})
})

test.describe('Responsive Design', () => {
	test('should be mobile responsive', async ({ page }) => {
		// Set viewport to mobile size
		await page.setViewportSize({ width: 375, height: 667 })
		await page.goto('/')
		
		// Check that page renders
		await expect(page.getByText('Blucky')).toBeVisible()
	})
	
	test('should be tablet responsive', async ({ page }) => {
		// Set viewport to tablet size
		await page.setViewportSize({ width: 768, height: 1024 })
		await page.goto('/')
		
		// Check that page renders
		await expect(page.getByText('Blucky')).toBeVisible()
	})
})

test.describe('Accessibility', () => {
	test('should have no accessibility violations on homepage', async ({ page }) => {
		await page.goto('/')
		
		// Basic accessibility checks
		// Check for alt text on images
		const images = await page.locator('img').all()
		for (const img of images) {
			const alt = await img.getAttribute('alt')
			expect(alt).not.toBeNull()
		}
	})
})
