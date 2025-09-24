import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AISuggestionPanel } from '../AISuggestionPanel'

const mockTask = {
  id: '1',
  title: 'Call patient about test results',
  description: 'Follow up with patient regarding lab results',
  type: 'patient-care'
}

const mockOnApplySuggestion = jest.fn()
const mockOnDismissSuggestion = jest.fn()

describe('AISuggestionPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders AI suggestions panel', () => {
    render(
      <AISuggestionPanel
        task={mockTask}
        onApplySuggestion={mockOnApplySuggestion}
        onDismissSuggestion={mockOnDismissSuggestion}
      />
    )

    expect(screen.getByText('AI Suggestions')).toBeInTheDocument()
    expect(screen.getByTestId('refresh-suggestions')).toBeInTheDocument()
    expect(screen.getByTestId('disable-ai')).toBeInTheDocument()
  })

  it('shows disabled state when AI is disabled', () => {
    render(
      <AISuggestionPanel
        task={mockTask}
        onApplySuggestion={mockOnApplySuggestion}
        onDismissSuggestion={mockOnDismissSuggestion}
      />
    )

    // Click disable button
    fireEvent.click(screen.getByTestId('disable-ai'))

    expect(screen.getByText('AI Suggestions Disabled')).toBeInTheDocument()
    expect(screen.getByText('Enable AI Suggestions')).toBeInTheDocument()
  })

  it('generates suggestions when task changes', async () => {
    render(
      <AISuggestionPanel
        task={mockTask}
        onApplySuggestion={mockOnApplySuggestion}
        onDismissSuggestion={mockOnDismissSuggestion}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Patient Care')).toBeInTheDocument()
      expect(screen.getByText('Suggested Tags')).toBeInTheDocument()
      expect(screen.getByText('Related Tasks')).toBeInTheDocument()
      expect(screen.getByText('Suggested Workflow')).toBeInTheDocument()
    })
  })

  it('applies suggestion when apply button is clicked', async () => {
    render(
      <AISuggestionPanel
        task={mockTask}
        onApplySuggestion={mockOnApplySuggestion}
        onDismissSuggestion={mockOnDismissSuggestion}
      />
    )

    await waitFor(() => {
      const applyButtons = screen.getAllByTestId('apply-suggestion')
      fireEvent.click(applyButtons[0])
    })

    expect(mockOnApplySuggestion).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        type: 'category',
        title: 'Patient Care'
      })
    )
  })

  it('dismisses suggestion when dismiss button is clicked', async () => {
    render(
      <AISuggestionPanel
        task={mockTask}
        onApplySuggestion={mockOnApplySuggestion}
        onDismissSuggestion={mockOnDismissSuggestion}
      />
    )

    await waitFor(() => {
      const dismissButtons = screen.getAllByTestId('dismiss-suggestion')
      fireEvent.click(dismissButtons[0])
    })

    expect(mockOnDismissSuggestion).toHaveBeenCalledWith('1')
  })

  it('shows confidence levels for suggestions', async () => {
    render(
      <AISuggestionPanel
        task={mockTask}
        onApplySuggestion={mockOnApplySuggestion}
        onDismissSuggestion={mockOnDismissSuggestion}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('85%')).toBeInTheDocument()
      expect(screen.getByText('92%')).toBeInTheDocument()
      expect(screen.getByText('78%')).toBeInTheDocument()
      expect(screen.getByText('88%')).toBeInTheDocument()
    })
  })

  it('displays suggestion content correctly', async () => {
    render(
      <AISuggestionPanel
        task={mockTask}
        onApplySuggestion={mockOnApplySuggestion}
        onDismissSuggestion={mockOnDismissSuggestion}
      />
    )

    await waitFor(() => {
      // Check tags are displayed
      expect(screen.getByText('follow-up')).toBeInTheDocument()
      expect(screen.getByText('lab-results')).toBeInTheDocument()
      expect(screen.getByText('urgent')).toBeInTheDocument()

      // Check workflow steps
      expect(screen.getByText('Review patient history')).toBeInTheDocument()
      expect(screen.getByText('Call patient with results')).toBeInTheDocument()

      // Check related tasks
      expect(screen.getByText('Call patient about test results')).toBeInTheDocument()
      expect(screen.getByText('Schedule follow-up appointment')).toBeInTheDocument()
    })
  })

  it('refreshes suggestions when refresh button is clicked', async () => {
    render(
      <AISuggestionPanel
        task={mockTask}
        onApplySuggestion={mockOnApplySuggestion}
        onDismissSuggestion={mockOnDismissSuggestion}
      />
    )

    const refreshButton = screen.getByTestId('refresh-suggestions')
    fireEvent.click(refreshButton)

    // Should show loading state briefly
    await waitFor(() => {
      expect(screen.getByText('Patient Care')).toBeInTheDocument()
    })
  })
})
