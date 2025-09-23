import { test, expect } from '@playwright/test'

test('semantic search functionality', async ({ page }) => {
  await page.goto('/board')
  
  // Open search
  await page.click('[data-testid="search-button"]')
  await expect(page.locator('text=Search Tasks')).toBeVisible()
  
  // Enter natural language query
  await page.fill('[data-testid="search-input"]', 'urgent patient follow-ups')
  
  // Should show AI understanding
  await expect(page.locator('text=AI Understanding')).toBeVisible()
  
  // Should show search results
  await expect(page.locator('[data-testid="search-result"]')).toBeVisible()
  
  // Should show suggestions
  await expect(page.locator('text=Try these searches')).toBeVisible()
})

test('KPI dashboard functionality', async ({ page }) => {
  await page.goto('/board')
  
  // Should show KPI bar
  await expect(page.locator('[data-testid="kpi-bar"]')).toBeVisible()
  
  // Click on a KPI metric
  await page.click('[data-testid="kpi-completed-today"]')
  
  // Should open KPI modal
  await expect(page.locator('text=Tasks Completed Today')).toBeVisible()
  
  // Should show detailed metrics
  await expect(page.locator('text=This Week')).toBeVisible()
  await expect(page.locator('text=Insights')).toBeVisible()
})

test('filter system integration', async ({ page }) => {
  await page.goto('/board')
  
  // Open filter drawer
  await page.click('[data-testid="filter-button"]')
  await expect(page.locator('text=Filters')).toBeVisible()
  
  // Apply multiple filters
  await page.selectOption('[data-testid="status-filter"]', 'in-progress')
  await page.selectOption('[data-testid="priority-filter"]', 'high')
  await page.click('text=Apply Filters')
  
  // Should show filter chips
  await expect(page.locator('text=Status: in-progress')).toBeVisible()
  await expect(page.locator('text=Priority: high')).toBeVisible()
  
  // Remove individual filter
  await page.click('[data-testid="remove-status-filter"]')
  await expect(page.locator('text=Status: in-progress')).not.toBeVisible()
  
  // Clear all filters
  await page.click('text=Clear all')
  await expect(page.locator('[data-testid="filter-chip"]')).not.toBeVisible()
})
