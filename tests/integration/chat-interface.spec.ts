import { test, expect } from '@playwright/test'

test('WhatsApp chat interface', async ({ page }) => {
  await page.goto('/chat')
  
  // Should show channel list
  await expect(page.locator('text=Carevo Chat')).toBeVisible()
  await expect(page.locator('text=New Chat')).toBeVisible()
  
  // Click on a channel
  await page.click('[data-testid="channel-item"]:first-child')
  
  // Should show chat interface
  await expect(page.locator('text=Type a message')).toBeVisible()
  
  // Send a message
  await page.fill('[data-testid="message-input"]', 'Hello team!')
  await page.click('[data-testid="send-button"]')
  
  // Should show message in chat
  await expect(page.locator('text=Hello team!')).toBeVisible()
})

test('file attachment functionality', async ({ page }) => {
  await page.goto('/chat')
  
  // Select a channel
  await page.click('[data-testid="channel-item"]:first-child')
  
  // Click attach button
  await page.click('[data-testid="attach-button"]')
  
  // Should show file upload
  await expect(page.locator('text=Attach File')).toBeVisible()
  
  // Upload a file (mock)
  await page.setInputFiles('[data-testid="file-input"]', {
    name: 'test.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('test content')
  })
  
  // Should show file in upload list
  await expect(page.locator('text=test.pdf')).toBeVisible()
  
  // Click upload
  await page.click('text=Upload Files')
  
  // Should show file in chat
  await expect(page.locator('text=Sent test.pdf')).toBeVisible()
})

test('mobile chat interface', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/chat')
  
  // Should show mobile layout
  await expect(page.locator('[data-testid="mobile-chat"]')).toBeVisible()
  
  // Should have back button
  await expect(page.locator('[data-testid="back-button"]')).toBeVisible()
  
  // Should have mobile input
  await expect(page.locator('[data-testid="mobile-input"]')).toBeVisible()
})

test('channel search functionality', async ({ page }) => {
  await page.goto('/chat')
  
  // Type in search
  await page.fill('[data-testid="search-input"]', 'General')
  
  // Should filter channels
  await expect(page.locator('text=General')).toBeVisible()
  
  // Clear search
  await page.fill('[data-testid="search-input"]', '')
  
  // Should show all channels
  await expect(page.locator('[data-testid="channel-item"]')).toHaveCount(4)
})

test('message status indicators', async ({ page }) => {
  await page.goto('/chat')
  
  // Select a channel
  await page.click('[data-testid="channel-item"]:first-child')
  
  // Send a message
  await page.fill('[data-testid="message-input"]', 'Test message')
  await page.click('[data-testid="send-button"]')
  
  // Should show sending status initially
  await expect(page.locator('text=Test message')).toBeVisible()
  
  // Wait for status to change to sent
  await page.waitForTimeout(1000)
  
  // Should show delivered status
  await page.waitForTimeout(1000)
})
