import { test, expect } from '@playwright/test'

test('My Tasks page personal productivity features', async ({ page }) => {
  await page.goto('/my')
  
  // Should show personal KPIs
  await expect(page.locator('[data-testid="personal-kpis"]')).toBeVisible()
  
  // Should show time range selector
  await expect(page.locator('text=Today')).toBeVisible()
  await expect(page.locator('text=Week')).toBeVisible()
  await expect(page.locator('text=Month')).toBeVisible()
  
  // Should show quick filters
  await expect(page.locator('[data-testid="quick-filters"]')).toBeVisible()
  
  // Should show view toggle
  await expect(page.locator('[data-testid="view-list"]')).toBeVisible()
  await expect(page.locator('[data-testid="view-calendar"]')).toBeVisible()
})

test('toggle between list and calendar view', async ({ page }) => {
  await page.goto('/my')
  
  // Start in list view
  await expect(page.locator('[data-testid="view-list"]')).toHaveAttribute('data-state', 'active')
  
  // Switch to calendar view
  await page.click('[data-testid="view-calendar"]')
  await expect(page.locator('[data-testid="task-calendar"]')).toBeVisible()
  
  // Switch back to list view
  await page.click('[data-testid="view-list"]')
  await expect(page.locator('[data-testid="mobile-task-card"]')).toBeVisible()
})

test('quick filters functionality', async ({ page }) => {
  await page.goto('/my')
  
  // Toggle a filter
  await page.click('[data-testid="quick-filter-today"]')
  await expect(page.locator('[data-testid="quick-filter-today"]')).toHaveAttribute('aria-pressed', 'true')
  
  // Clear all filters
  await page.click('[data-testid="quick-filters-clear"]')
  await expect(page.locator('[data-testid="quick-filter-today"]')).toHaveAttribute('aria-pressed', 'false')
})

test('mobile task card quick actions', async ({ page }) => {
  await page.goto('/my')
  
  // Wait for task cards to load
  await expect(page.locator('[data-testid="mobile-task-card"]')).toBeVisible()
  
  // Open quick actions
  await page.click('[data-testid="mobile-task-card"] [aria-label="Show quick actions"]')
  
  // Should show quick action buttons
  await expect(page.locator('[data-testid="quick-action-complete"]')).toBeVisible()
  await expect(page.locator('[data-testid="quick-action-waiting"]')).toBeVisible()
  await expect(page.locator('[data-testid="quick-action-due-date"]')).toBeVisible()
  await expect(page.locator('[data-testid="quick-action-assign"]')).toBeVisible()
  
  // Click a quick action
  await page.click('[data-testid="quick-action-complete"]')
  
  // Actions should be hidden after clicking
  await expect(page.locator('[data-testid="quick-action-complete"]')).not.toBeVisible()
})

test('calendar view functionality', async ({ page }) => {
  await page.goto('/my')
  
  // Switch to calendar view
  await page.click('[data-testid="view-calendar"]')
  
  // Should show calendar
  await expect(page.locator('[data-testid="task-calendar"]')).toBeVisible()
  
  // Should show month navigation
  await expect(page.locator('[aria-label="Previous month"]')).toBeVisible()
  await expect(page.locator('[aria-label="Next month"]')).toBeVisible()
  
  // Click on a day
  await page.click('[data-testid="calendar-day-2024-12-25"]')
  
  // Should show add task button on hover
  await page.hover('[data-testid="calendar-day-2024-12-25"]')
  await expect(page.locator('[data-testid="calendar-add-2024-12-25"]')).toBeVisible()
  
  // Click add task button
  await page.click('[data-testid="calendar-add-2024-12-25"]')
})

test('personal KPIs time range selection', async ({ page }) => {
  await page.goto('/my')
  
  // Should show today data by default
  await expect(page.locator('[data-testid="kpi-personal-completed"]')).toBeVisible()
  
  // Switch to week view
  await page.click('text=Week')
  
  // Switch to month view
  await page.click('text=Month')
  
  // Should show quick actions
  await expect(page.locator('text=Trends')).toBeVisible()
  await expect(page.locator('text=Goals')).toBeVisible()
  await expect(page.locator('text=Schedule')).toBeVisible()
  await expect(page.locator('text=Reports')).toBeVisible()
})
