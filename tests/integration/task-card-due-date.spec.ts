import { test, expect } from '@playwright/test'

test.describe('Task Card Due Date Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the board page
    await page.goto('/board')
    
    // Wait for the page to load
    await page.waitForSelector('[data-testid="task-card"]', { timeout: 10000 })
  })

  test('should open due date picker when clicking Set Due Date', async ({ page }) => {
    // Find the first task card with quick actions
    const taskCard = page.locator('[data-testid="task-card"]').first()
    
    // Click the more actions button (three dots)
    const moreActionsButton = taskCard.locator('button[aria-label*="More actions"], button:has(svg)').first()
    await moreActionsButton.click()
    
    // Wait for the dropdown menu to appear
    await page.waitForSelector('text=Set Due Date', { timeout: 5000 })
    
    // Click "Set Due Date"
    await page.click('text=Set Due Date')
    
    // Verify the due date picker modal opens
    await expect(page.locator('text=Set Due Date')).toBeVisible()
    await expect(page.locator('text=Quick Options')).toBeVisible()
    await expect(page.locator('text=Today')).toBeVisible()
    await expect(page.locator('text=Tomorrow')).toBeVisible()
    await expect(page.locator('text=Next Week')).toBeVisible()
  })

  test('should allow selecting a quick date option', async ({ page }) => {
    // Open the due date picker
    const taskCard = page.locator('[data-testid="task-card"]').first()
    const moreActionsButton = taskCard.locator('button[aria-label*="More actions"], button:has(svg)').first()
    await moreActionsButton.click()
    await page.waitForSelector('text=Set Due Date', { timeout: 5000 })
    await page.click('text=Set Due Date')
    
    // Select "Tomorrow" option
    await page.click('text=Tomorrow')
    
    // Verify the confirm button is enabled
    const confirmButton = page.locator('button:has-text("Set Due Date")')
    await expect(confirmButton).toBeEnabled()
    
    // Click confirm
    await confirmButton.click()
    
    // Verify the modal closes
    await expect(page.locator('text=Set Due Date')).not.toBeVisible()
  })

  test('should allow custom date selection', async ({ page }) => {
    // Open the due date picker
    const taskCard = page.locator('[data-testid="task-card"]').first()
    const moreActionsButton = taskCard.locator('button[aria-label*="More actions"], button:has(svg)').first()
    await moreActionsButton.click()
    await page.waitForSelector('text=Set Due Date', { timeout: 5000 })
    await page.click('text=Set Due Date')
    
    // Select a custom date
    const dateInput = page.locator('input[type="date"]')
    await dateInput.fill('2024-12-25')
    
    // Verify the confirm button is enabled
    const confirmButton = page.locator('button:has-text("Set Due Date")')
    await expect(confirmButton).toBeEnabled()
    
    // Click confirm
    await confirmButton.click()
    
    // Verify the modal closes
    await expect(page.locator('text=Set Due Date')).not.toBeVisible()
  })

  test('should prevent selection of past dates', async ({ page }) => {
    // Open the due date picker
    const taskCard = page.locator('[data-testid="task-card"]').first()
    const moreActionsButton = taskCard.locator('button[aria-label*="More actions"], button:has(svg)').first()
    await moreActionsButton.click()
    await page.waitForSelector('text=Set Due Date', { timeout: 5000 })
    await page.click('text=Set Due Date')
    
    // Try to select a past date
    const dateInput = page.locator('input[type="date"]')
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayString = yesterday.toISOString().split('T')[0]
    
    await dateInput.fill(yesterdayString)
    
    // Click confirm
    const confirmButton = page.locator('button:has-text("Set Due Date")')
    await confirmButton.click()
    
    // Verify an alert is shown (this will be replaced with a toast in the future)
    // For now, we just verify the modal doesn't close
    await expect(page.locator('text=Set Due Date')).toBeVisible()
  })

  test('should close modal when cancel is clicked', async ({ page }) => {
    // Open the due date picker
    const taskCard = page.locator('[data-testid="task-card"]').first()
    const moreActionsButton = taskCard.locator('button[aria-label*="More actions"], button:has(svg)').first()
    await moreActionsButton.click()
    await page.waitForSelector('text=Set Due Date', { timeout: 5000 })
    await page.click('text=Set Due Date')
    
    // Click cancel
    await page.click('text=Cancel')
    
    // Verify the modal closes
    await expect(page.locator('text=Set Due Date')).not.toBeVisible()
  })

  test('should be keyboard accessible', async ({ page }) => {
    // Open the due date picker
    const taskCard = page.locator('[data-testid="task-card"]').first()
    const moreActionsButton = taskCard.locator('button[aria-label*="More actions"], button:has(svg)').first()
    await moreActionsButton.click()
    await page.waitForSelector('text=Set Due Date', { timeout: 5000 })
    await page.click('text=Set Due Date')
    
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    await expect(page.locator('text=Today')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.locator('text=Tomorrow')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.locator('text=Next Week')).toBeFocused()
    
    // Test Enter key to select
    await page.keyboard.press('Enter')
    
    // Verify the confirm button is enabled
    const confirmButton = page.locator('button:has-text("Set Due Date")')
    await expect(confirmButton).toBeEnabled()
  })

  test('should show task title in modal', async ({ page }) => {
    // Get the first task title
    const taskCard = page.locator('[data-testid="task-card"]').first()
    const taskTitle = await taskCard.locator('h3').textContent()
    
    // Open the due date picker
    const moreActionsButton = taskCard.locator('button[aria-label*="More actions"], button:has(svg)').first()
    await moreActionsButton.click()
    await page.waitForSelector('text=Set Due Date', { timeout: 5000 })
    await page.click('text=Set Due Date')
    
    // Verify the task title is shown
    await expect(page.locator(`text=For task: "${taskTitle}"`)).toBeVisible()
  })
})
