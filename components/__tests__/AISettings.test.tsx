import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AISettings } from '../AISettings'

const mockAISettings = {
  enabled: true,
  categorization: true,
  relatedTasks: true,
  workflowSuggestions: false,
  autoTagging: true,
  model: 'llama3.1:8b',
  temperature: 0.1,
  maxTokens: 500,
  cacheResponses: true,
  privacyMode: true
}

const mockOnSave = jest.fn()

describe('AISettings', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders AI settings', () => {
    render(
      <AISettings
        onSave={mockOnSave}
        currentSettings={mockAISettings}
      />
    )

    expect(screen.getByText('AI Service Status')).toBeInTheDocument()
    expect(screen.getByText('AI Features')).toBeInTheDocument()
    expect(screen.getByText('Privacy & Performance')).toBeInTheDocument()
  })

  it('shows AI service status', () => {
    render(
      <AISettings
        onSave={mockOnSave}
        currentSettings={mockAISettings}
      />
    )

    expect(screen.getByText('Local AI Service')).toBeInTheDocument()
    expect(screen.getByText('Enabled')).toBeInTheDocument()
    expect(screen.getByTestId('test-ai-connection')).toBeInTheDocument()
  })

  it('toggles AI features', () => {
    render(
      <AISettings
        onSave={mockOnSave}
        currentSettings={mockAISettings}
      />
    )

    const aiEnabledSwitch = screen.getByTestId('ai-enabled-switch')
    expect(aiEnabledSwitch).toBeChecked()

    fireEvent.click(aiEnabledSwitch)
    expect(aiEnabledSwitch).not.toBeChecked()
  })

  it('disables dependent features when AI is disabled', () => {
    const disabledSettings = {
      ...mockAISettings,
      enabled: false
    }

    render(
      <AISettings
        onSave={mockOnSave}
        currentSettings={disabledSettings}
      />
    )

    expect(screen.getByTestId('categorization-switch')).toBeDisabled()
    expect(screen.getByTestId('related-tasks-switch')).toBeDisabled()
    expect(screen.getByTestId('workflow-suggestions-switch')).toBeDisabled()
    expect(screen.getByTestId('auto-tagging-switch')).toBeDisabled()
  })

  it('toggles individual AI features', () => {
    render(
      <AISettings
        onSave={mockOnSave}
        currentSettings={mockAISettings}
      />
    )

    const categorizationSwitch = screen.getByTestId('categorization-switch')
    expect(categorizationSwitch).toBeChecked()

    fireEvent.click(categorizationSwitch)
    expect(categorizationSwitch).not.toBeChecked()
  })

  it('toggles privacy and performance settings', () => {
    render(
      <AISettings
        onSave={mockOnSave}
        currentSettings={mockAISettings}
      />
    )

    const privacyModeSwitch = screen.getByTestId('privacy-mode-switch')
    expect(privacyModeSwitch).toBeChecked()

    fireEvent.click(privacyModeSwitch)
    expect(privacyModeSwitch).not.toBeChecked()
  })

  it('saves settings when save button is clicked', async () => {
    render(
      <AISettings
        onSave={mockOnSave}
        currentSettings={mockAISettings}
      />
    )

    const saveButton = screen.getByTestId('save-settings')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(mockAISettings)
    })
  })

  it('resets settings when reset button is clicked', () => {
    render(
      <AISettings
        onSave={mockOnSave}
        currentSettings={mockAISettings}
      />
    )

    // Change a setting
    fireEvent.click(screen.getByTestId('categorization-switch'))

    // Reset
    fireEvent.click(screen.getByTestId('reset-settings'))

    // Should be back to original state
    expect(screen.getByTestId('categorization-switch')).toBeChecked()
  })

  it('shows loading state when saving', async () => {
    mockOnSave.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(
      <AISettings
        onSave={mockOnSave}
        currentSettings={mockAISettings}
      />
    )

    const saveButton = screen.getByTestId('save-settings')
    fireEvent.click(saveButton)

    expect(screen.getByText('Saving...')).toBeInTheDocument()
    expect(saveButton).toBeDisabled()
  })

  it('tests AI connection', async () => {
    // Mock fetch for AI test
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true })
    })

    render(
      <AISettings
        onSave={mockOnSave}
        currentSettings={mockAISettings}
      />
    )

    const testButton = screen.getByTestId('test-ai-connection')
    fireEvent.click(testButton)

    await waitFor(() => {
      expect(screen.getByText('AI service is working correctly')).toBeInTheDocument()
    })
  })

  it('handles AI connection test failure', async () => {
    // Mock fetch for AI test failure
    global.fetch = jest.fn().mockRejectedValue(new Error('Connection failed'))

    render(
      <AISettings
        onSave={mockOnSave}
        currentSettings={mockAISettings}
      />
    )

    const testButton = screen.getByTestId('test-ai-connection')
    fireEvent.click(testButton)

    await waitFor(() => {
      expect(screen.getByText('AI service is not available')).toBeInTheDocument()
    })
  })

  it('shows correct feature descriptions', () => {
    render(
      <AISettings
        onSave={mockOnSave}
        currentSettings={mockAISettings}
      />
    )

    expect(screen.getByText('Turn on AI-powered task intelligence')).toBeInTheDocument()
    expect(screen.getByText('Automatically categorize tasks')).toBeInTheDocument()
    expect(screen.getByText('Suggest similar or related tasks')).toBeInTheDocument()
    expect(screen.getByText('Generate step-by-step workflows')).toBeInTheDocument()
    expect(screen.getByText('Automatically suggest relevant tags')).toBeInTheDocument()
    expect(screen.getByText('Process data locally only')).toBeInTheDocument()
    expect(screen.getByText('Cache AI responses for better performance')).toBeInTheDocument()
  })
})
