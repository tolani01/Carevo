import { test, expect } from '@playwright/test'

test('column header actions work', async ({ page }) => {
  await page.goto('/board')
  
  // Test plus button
  const plusButton = page.locator('[data-testid="column-todo"] [data-testid="plus-button"]')
  await plusButton.click()
  
  // Should open task creation modal
  await expect(page.locator('text=Create New Task')).toBeVisible()
  
  // Test more actions menu
  const moreButton = page.locator('[data-testid="column-todo"] [data-testid="more-button"]')
  await moreButton.click()
  
  // Should show dropdown menu
  await expect(page.locator('text=Filter Tasks')).toBeVisible()
  await expect(page.locator('text=Select All')).toBeVisible()
  await expect(page.locator('text=Export Tasks')).toBeVisible()
})

test('filter drawer functionality', async ({ page }) => {
  await page.goto('/board')
  
  // Open filter drawer
  await page.click('[data-testid="filter-button"]')
  await expect(page.locator('text=Filters')).toBeVisible()
  
  // Apply status filter
  await page.selectOption('[data-testid="status-filter"]', 'in-progress')
  await page.click('text=Apply Filters')
  
  // Should show filter chip
  await expect(page.locator('text=Status: In Progress')).toBeVisible()
  
  // Clear filter
  await page.click('[data-testid="clear-filter-chip"]')
  await expect(page.locator('text=Status: In Progress')).not.toBeVisible()
})
