import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright Test Configuration
 * E2E tests for Blucky - Decentralized Link Sharing
 */
export default defineConfig({
	testDir: './tests',
	
	// Maximum time one test can run for
	timeout: 60 * 1000,
	
	// Run tests in parallel
	fullyParallel: true,
	
	// Fail the build on CI if you accidentally left test.only
	forbidOnly: !!process.env.CI,
	
	// Retry on CI only
	retries: process.env.CI ? 2 : 0,
	
	// Reporter to use
	reporter: 'html',
	
	// Shared settings for all projects
	use: {
		// Base URL for tests
		baseURL: 'http://localhost:5179',
		
		// Collect trace when retrying the failed test
		trace: 'on-first-retry',
		
		// Screenshot on failure
		screenshot: 'only-on-failure',
		
		// Video on failure
		video: 'retain-on-failure',
	},
	
	// Configure projects for major browsers
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	
	// Run local dev server before starting tests
	webServer: {
		command: 'npm run dev',
		url: 'http://localhost:5179',
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
	},
})
