import { test, expect } from '@playwright/test'

/**
 * Manual Test Checklist
 * Run these tests manually since they require wallet interaction
 */

test.describe('Manual: Profile Creation Flow', () => {
	test.skip('MANUAL: Create profile with icon and theme', async ({ page }) => {
		// This test requires manual execution due to wallet interaction
		
		console.log(`
========================================
MANUAL TEST: Profile Creation
========================================

Prerequisites:
- Sui Wallet extension installed
- Wallet connected with testnet SUI
- Google account for zkLogin (optional)

Steps:
1. Navigate to http://localhost:5179
2. (Optional) Click "Sign in with Google" and authenticate
3. Click "Connect Wallet" button
4. Select Sui Wallet and approve connection
5. If zkLogin used, verify green notification appears
6. Click "Create Profile" button
7. Fill in the form:
   - Username: testuser${Date.now()}
   - Bio: "Test profile for E2E testing"
   - Avatar: Select "Tech" icon (purple code icon)
   - Theme: Select "Purple Dream" theme
8. Click "Create Profile" button
9. Approve transaction in wallet
10. Wait for confirmation

Expected Results:
✓ Transaction succeeds
✓ "Profile created!" toast message appears
✓ Redirected to profile page
✓ Tech icon displays correctly
✓ Purple Dream theme is applied (purple gradient background)
✓ Bio text is displayed
✓ "No links yet" message shows
✓ "Edit Profile" button is visible

Save the Profile ID for next tests!
========================================
		`)
	})
})

test.describe('Manual: Add Links', () => {
	test.skip('MANUAL: Add multiple links with different types', async ({ page }) => {
		console.log(`
========================================
MANUAL TEST: Add Links
========================================

Prerequisites:
- Profile already created (use ID from previous test)
- Wallet still connected

Steps:
1. Navigate to your profile page
2. Click "Edit Profile" button
3. Add the following links:

   Link 1:
   - Label: "My Website"
   - URL: "https://example.com"
   
   Link 2:
   - Label: "YouTube Channel"
   - URL: "https://youtube.com/watch?v=dQw4w9WgXcQ"
   
   Link 3:
   - Label: "GitHub Profile"
   - URL: "https://github.com/kdrturan"
   
   Link 4:
   - Label: "Twitter"
   - URL: "https://twitter.com/username"

4. Click "Save Links" button
5. Approve transaction
6. Navigate back to profile page

Expected Results:
✓ All 4 links are displayed
✓ YouTube link shows video embed player
✓ GitHub/Twitter links show appropriate styling
✓ Links are clickable
✓ Link order matches input order
========================================
		`)
	})
})

test.describe('Manual: Drag & Drop Reordering', () => {
	test.skip('MANUAL: Reorder links via drag and drop', async ({ page }) => {
		console.log(`
========================================
MANUAL TEST: Drag & Drop Reordering
========================================

Prerequisites:
- Profile with at least 3 links

Steps:
1. Navigate to profile Edit page
2. Use drag handle (⋮⋮) to drag and drop links
3. Reorder: Move bottom link to top
4. Click "Save Links"
5. Approve transaction
6. Go back to profile page

Expected Results:
✓ Drag and drop works smoothly
✓ Visual feedback during drag
✓ New order is saved
✓ Profile page shows new order
========================================
		`)
	})
})

test.describe('Manual: Theme Switching', () => {
	test.skip('MANUAL: Change theme and verify application', async ({ page }) => {
		console.log(`
========================================
MANUAL TEST: Theme Switching
========================================

Steps:
1. Go to profile Edit page
2. Change theme from "Purple Dream" to "Dark Mode"
3. Save changes
4. View profile page

Expected Results:
✓ Profile background is dark (black/gray)
✓ Text is white/light gray
✓ Cards have dark background
✓ All elements are readable
✓ Links maintain dark theme

5. Change to "Ocean Blue" theme
6. Save and verify blue gradient appears

7. Test all 5 themes:
   - Ocean Blue (blue gradient)
   - Sunset Orange (orange gradient)
   - Forest Green (green gradient)
   - Purple Dream (purple gradient)
   - Dark Mode (dark background)
========================================
		`)
	})
})

test.describe('Manual: Advanced Features', () => {
	test.skip('MANUAL: Test QR code, social share, analytics', async ({ page }) => {
		console.log(`
========================================
MANUAL TEST: Advanced Features
========================================

QR Code:
1. On profile page, click QR code icon
2. Verify QR code modal opens
3. Verify QR code displays
4. Test download/share functionality

Social Sharing:
1. Click share button
2. Test X (Twitter) share - verify modal/redirect
3. Test Facebook share
4. Test WhatsApp share
5. Test "Copy Link" functionality

Analytics Dashboard:
1. Click analytics/stats button (if visible)
2. Verify dashboard opens
3. Check if stats are displayed

NFT Features (if applicable):
1. If wallet has NFTs, verify NFT gallery
2. Test NFT avatar selection
3. Test NFT gated links

Expected Results:
✓ All features work without errors
✓ Modals open and close properly
✓ Share links work correctly
✓ Analytics display (if any data exists)
========================================
		`)
	})
})

test.describe('Manual: zkLogin Flow', () => {
	test.skip('MANUAL: Test Google authentication and linking', async ({ page }) => {
		console.log(`
========================================
MANUAL TEST: zkLogin Integration
========================================

Fresh Start Test:
1. Clear localStorage and cookies
2. Navigate to homepage
3. Click "Sign in with Google"
4. Select Google account and authenticate
5. Redirected back to homepage
6. Verify email displayed in navbar

Auto-Linking Test:
7. Click "Connect Wallet"
8. Approve wallet connection
9. Verify green notification appears:
   "✨ Hesaplar Otomatik Bağlandı!"
10. Verify notification shows:
    - 📧 Your email
    - 👛 Wallet address

Persistence Test:
11. Refresh page
12. Verify you're still logged in
13. Check localStorage:
    - zklogin_user
    - linked_accounts

Create Profile with zkLogin:
14. Navigate to Create Profile
15. Should see welcome message with email
16. Connect wallet if not connected
17. Create profile
18. Verify profile is created with wallet address

Expected Results:
✓ Google auth flow works smoothly
✓ Automatic account linking happens
✓ Notification displays correctly
✓ State persists across page reloads
✓ Can create profile after linking
========================================
		`)
	})
})
