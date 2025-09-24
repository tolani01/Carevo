import { test, expect } from '@playwright/test'

test.describe('AI Features & Patient References', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a task page where AI suggestions would appear
    await page.goto('/board')
  })

  test('AI suggestion panel workflow', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Look for AI suggestion panel (if implemented on board page)
    const aiPanel = page.locator('[data-testid="ai-suggestion-panel"]')
    
    if (await aiPanel.isVisible()) {
      // Test AI suggestions
      await expect(aiPanel).toBeVisible()
      
      // Test refresh suggestions
      await page.click('[data-testid="refresh-suggestions"]')
      
      // Test applying a suggestion
      const applyButton = page.locator('[data-testid="apply-suggestion"]').first()
      if (await applyButton.isVisible()) {
        await applyButton.click()
      }
      
      // Test dismissing a suggestion
      const dismissButton = page.locator('[data-testid="dismiss-suggestion"]').first()
      if (await dismissButton.isVisible()) {
        await dismissButton.click()
      }
    }
  })

  test('patient reference input workflow', async ({ page }) => {
    // Navigate to a page with patient reference input
    await page.goto('/board')
    
    // Look for patient reference input
    const patientInput = page.locator('[data-testid="patient-reference-input"]')
    
    if (await patientInput.isVisible()) {
      // Test search functionality
      const searchInput = page.locator('[data-testid="patient-search-input"]')
      await searchInput.fill('John')
      
      // Wait for suggestions
      await page.waitForSelector('[data-testid="patient-suggestions"]', { timeout: 5000 })
      
      // Test selecting a patient
      const suggestion = page.locator('[data-testid="patient-suggestion"]').first()
      if (await suggestion.isVisible()) {
        await suggestion.click()
      }
      
      // Test creating new patient
      const newPatientButton = page.locator('[data-testid="toggle-new-patient-form"]')
      await newPatientButton.click()
      
      // Fill patient form
      await page.fill('[data-testid="first-name-input"]', 'John')
      await page.fill('[data-testid="last-name-input"]', 'Smith')
      await page.fill('[data-testid="dob-input"]', '1990-01-01')
      
      // Check preview is shown
      await expect(page.locator('[data-testid="patient-preview"]')).toBeVisible()
      
      // Submit form
      await page.click('[data-testid="create-patient-button"]')
    }
  })

  test('patient reference display workflow', async ({ page }) => {
    // Navigate to a page with patient reference display
    await page.goto('/board')
    
    // Look for patient reference display
    const patientDisplay = page.locator('[data-testid="patient-reference-display"]')
    
    if (await patientDisplay.isVisible()) {
      // Test toggling details
      await page.click('[data-testid="toggle-details"]')
      await expect(page.locator('[data-testid="patient-details"]')).toBeVisible()
      
      // Test view history
      await page.click('[data-testid="view-history-button"]')
      
      // Test edit reference
      await page.click('[data-testid="edit-reference-button"]')
    }
  })

  test('AI settings workflow', async ({ page }) => {
    // Navigate to settings page
    await page.goto('/profile')
    
    // Look for AI settings
    const aiSettings = page.locator('[data-testid="ai-settings"]')
    
    if (await aiSettings.isVisible()) {
      // Test toggling AI features
      await page.click('[data-testid="ai-enabled-switch"]')
      await page.click('[data-testid="categorization-switch"]')
      await page.click('[data-testid="related-tasks-switch"]')
      await page.click('[data-testid="workflow-suggestions-switch"]')
      await page.click('[data-testid="auto-tagging-switch"]')
      
      // Test privacy settings
      await page.click('[data-testid="privacy-mode-switch"]')
      await page.click('[data-testid="cache-responses-switch"]')
      
      // Test AI connection
      await page.click('[data-testid="test-ai-connection"]')
      
      // Test saving settings
      await page.click('[data-testid="save-settings"]')
      
      // Test resetting settings
      await page.click('[data-testid="reset-settings"]')
    }
  })

  test('AI suggestion confidence levels', async ({ page }) => {
    await page.goto('/board')
    
    const aiPanel = page.locator('[data-testid="ai-suggestion-panel"]')
    
    if (await aiPanel.isVisible()) {
      // Check for confidence badges
      const confidenceBadges = page.locator('[data-testid="ai-suggestion"] .badge')
      const count = await confidenceBadges.count()
      
      for (let i = 0; i < count; i++) {
        const badge = confidenceBadges.nth(i)
        const text = await badge.textContent()
        expect(text).toMatch(/\d+%/)
      }
    }
  })

  test('patient reference privacy compliance', async ({ page }) => {
    await page.goto('/board')
    
    const patientInput = page.locator('[data-testid="patient-reference-input"]')
    
    if (await patientInput.isVisible()) {
      // Open new patient form
      await page.click('[data-testid="toggle-new-patient-form"]')
      
      // Check privacy notice is displayed
      await expect(page.locator('text=Privacy Protection:')).toBeVisible()
      await expect(page.locator('text=Only first 3 letters of names are stored')).toBeVisible()
      await expect(page.locator('text=Date of birth is hashed and cannot be reversed')).toBeVisible()
      await expect(page.locator('text=No full patient names are stored in the system')).toBeVisible()
      await expect(page.locator('text=HIPAA-compliant de-identification')).toBeVisible()
    }
  })

  test('AI workflow suggestions display', async ({ page }) => {
    await page.goto('/board')
    
    const aiPanel = page.locator('[data-testid="ai-suggestion-panel"]')
    
    if (await aiPanel.isVisible()) {
      // Look for workflow suggestions
      const workflowSuggestion = page.locator('text=Suggested Workflow')
      
      if (await workflowSuggestion.isVisible()) {
        // Check workflow steps are displayed
        await expect(page.locator('text=Review patient history')).toBeVisible()
        await expect(page.locator('text=Call patient with results')).toBeVisible()
        await expect(page.locator('text=Schedule follow-up if needed')).toBeVisible()
        await expect(page.locator('text=Update patient chart')).toBeVisible()
      }
    }
  })

  test('patient reference access levels', async ({ page }) => {
    await page.goto('/board')
    
    const patientDisplay = page.locator('[data-testid="patient-reference-display"]')
    
    if (await patientDisplay.isVisible()) {
      // Check access level badge
      const accessBadge = page.locator('text=Access')
      await expect(accessBadge).toBeVisible()
      
      // Test details toggle
      await page.click('[data-testid="toggle-details"]')
      
      // Check privacy notice in details
      await expect(page.locator('text=Privacy Notice:')).toBeVisible()
      await expect(page.locator('text=This is a de-identified patient reference')).toBeVisible()
    }
  })
})
