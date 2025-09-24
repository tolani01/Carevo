import { test, expect } from '@playwright/test'

test('profile page loads and displays user information', async ({ page }) => {
  await page.goto('/profile')
  
  // Should show profile header
  await expect(page.locator('[data-testid="profile-header"]')).toBeVisible()
  await expect(page.locator('h1')).toContainText('User')
  
  // Should show quick actions
  await expect(page.locator('text=Notifications')).toBeVisible()
  await expect(page.locator('text=Password')).toBeVisible()
  await expect(page.locator('text=Security')).toBeVisible()
})

test('notification center functionality', async ({ page }) => {
  await page.goto('/profile')
  
  // Open notification center
  await page.click('[data-testid="open-notification-center"]')
  await expect(page.locator('[data-testid="notification-center"]')).toBeVisible()
  
  // Toggle quiet hours
  await page.click('[data-testid="quiet-toggle"]')
  
  // Set quiet hours times
  await page.fill('input[type="time"][id="quiet-start"]', '22:00')
  await page.fill('input[type="time"][id="quiet-end"]', '07:00')
  
  // Save settings
  await page.click('[data-testid="notification-save"]')
  
  // Should show success message
  await expect(page.locator('text=Notification settings saved successfully!')).toBeVisible()
})

test('password change modal with validation', async ({ page }) => {
  await page.goto('/profile')
  
  // Open password modal
  await page.click('[data-testid="open-password-modal"]')
  
  // Fill invalid password (too weak)
  await page.fill('[data-testid="pwd-new"]', 'weak')
  await page.fill('[data-testid="pwd-confirm"]', 'different')
  
  // Submit button should be disabled
  await expect(page.locator('[data-testid="pwd-submit"]')).toBeDisabled()
  
  // Fill valid password
  await page.fill('[data-testid="pwd-current"]', 'currentPassword123!')
  await page.fill('[data-testid="pwd-new"]', 'NewSecurePassword123!')
  await page.fill('[data-testid="pwd-confirm"]', 'NewSecurePassword123!')
  
  // Submit button should be enabled
  await expect(page.locator('[data-testid="pwd-submit"]')).toBeEnabled()
  
  // Submit password change
  await page.click('[data-testid="pwd-submit"]')
  
  // Should show success state
  await expect(page.locator('text=Password Changed Successfully')).toBeVisible()
})

test('oauth provider management', async ({ page }) => {
  await page.goto('/profile')
  
  // Should show OAuth provider cards
  await expect(page.locator('[data-testid="oauth-card-google"]')).toBeVisible()
  await expect(page.locator('[data-testid="oauth-card-microsoft"]')).toBeVisible()
  
  // Google should be connected
  await expect(page.locator('[data-testid="oauth-card-google"]')).toContainText('Connected')
  
  // Microsoft should not be connected
  await expect(page.locator('[data-testid="oauth-card-microsoft"]')).toContainText('Not Connected')
  
  // Try to connect Microsoft
  await page.click('[data-testid="oauth-connect-microsoft"]')
  await expect(page.locator('text=Connecting...')).toBeVisible()
  
  // Try to disconnect Google
  await page.click('[data-testid="oauth-disconnect-google"]')
  await expect(page.locator('text=Disconnect')).toBeVisible()
})

test('security dashboard functionality', async ({ page }) => {
  await page.goto('/profile')
  
  // Open security dashboard
  await page.click('[data-testid="open-security-dashboard"]')
  await expect(page.locator('[data-testid="security-dashboard"]')).toBeVisible()
  
  // Should show security overview tiles
  await expect(page.locator('text=Safe Events')).toBeVisible()
  await expect(page.locator('text=Warnings')).toBeVisible()
  await expect(page.locator('text=Suspicious Events')).toBeVisible()
  
  // Filter by danger events
  await page.click('[data-testid="sec-filter-danger"]')
  
  // Should show only danger events
  const dangerEvents = page.locator('[data-testid="sec-event"]')
  await expect(dangerEvents.first()).toBeVisible()
  
  // Reset filter
  await page.click('[data-testid="sec-filter-all"]')
  
  // Should show all events
  await expect(dangerEvents).toHaveCount(4)
})

test('password strength indicator', async ({ page }) => {
  await page.goto('/profile')
  
  // Open password modal
  await page.click('[data-testid="open-password-modal"]')
  
  // Test weak password
  await page.fill('[data-testid="pwd-new"]', 'weak')
  await expect(page.locator('[data-testid="pwd-strength"]')).toBeVisible()
  await expect(page.locator('text=Very Weak')).toBeVisible()
  
  // Test medium password
  await page.fill('[data-testid="pwd-new"]', 'MediumPass123')
  await expect(page.locator('text=Good')).toBeVisible()
  
  // Test strong password
  await page.fill('[data-testid="pwd-new"]', 'VeryStrongPassword123!@#')
  await expect(page.locator('text=Strong')).toBeVisible()
})

test('notification delivery methods', async ({ page }) => {
  await page.goto('/profile')
  
  // Open notification center
  await page.click('[data-testid="open-notification-center"]')
  
  // Toggle email notifications
  await page.click('#email-notifications')
  
  // Toggle SMS notifications
  await page.click('#sms-notifications')
  
  // Change frequency
  await page.click('text=Real-time (immediate)')
  await page.click('text=Daily summary')
  
  // Save changes
  await page.click('[data-testid="notification-save"]')
  
  // Should show success
  await expect(page.locator('text=Notification settings saved successfully!')).toBeVisible()
})

test('security event filtering', async ({ page }) => {
  await page.goto('/profile')
  
  // Open security dashboard
  await page.click('[data-testid="open-security-dashboard"]')
  
  // Filter by success events
  await page.click('[data-testid="sec-filter-success"]')
  
  // Should show only success events
  await expect(page.locator('[data-testid="sec-event"]')).toHaveCount(2)
  
  // Filter by warning events
  await page.click('[data-testid="sec-filter-warning"]')
  
  // Should show only warning events
  await expect(page.locator('[data-testid="sec-event"]')).toHaveCount(1)
  
  // Filter by danger events
  await page.click('[data-testid="sec-filter-danger"]')
  
  // Should show only danger events
  await expect(page.locator('[data-testid="sec-event"]')).toHaveCount(1)
})

test('accessibility features', async ({ page }) => {
  await page.goto('/profile')
  
  // Check for proper ARIA labels
  await expect(page.locator('[data-testid="open-notification-center"]')).toHaveAttribute('aria-label')
  await expect(page.locator('[data-testid="open-password-modal"]')).toHaveAttribute('aria-label')
  
  // Open notification center and check accessibility
  await page.click('[data-testid="open-notification-center"]')
  
  // Check for proper form labels
  await expect(page.locator('label[for="email-notifications"]')).toBeVisible()
  await expect(page.locator('label[for="quiet-start"]')).toBeVisible()
  
  // Check for ARIA descriptions
  await expect(page.locator('[aria-describedby="email-notifications-description"]')).toBeVisible()
})
