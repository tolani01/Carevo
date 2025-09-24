import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NotificationCenter } from '../NotificationCenter'

const mockOnSave = jest.fn()
const mockOnClose = jest.fn()

const defaultSettings = {
  email: true,
  sms: false,
  push: true,
  inApp: true,
  frequency: 'realtime' as const,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '07:00'
  },
  channels: {
    tasks: true,
    messages: true,
    system: true,
    security: true
  },
  emergencyOverride: true
}

const defaultProps = {
  isOpen: true,
  onClose: mockOnClose,
  onSave: mockOnSave,
  currentSettings: defaultSettings
}

describe('NotificationCenter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders notification settings when open', () => {
    render(<NotificationCenter {...defaultProps} />)
    
    expect(screen.getByText('Notification Preferences')).toBeInTheDocument()
    expect(screen.getByTestId('notification-center')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<NotificationCenter {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('Notification Preferences')).not.toBeInTheDocument()
  })

  it('renders all delivery method toggles', () => {
    render(<NotificationCenter {...defaultProps} />)
    
    expect(screen.getByLabelText('Email Notifications')).toBeInTheDocument()
    expect(screen.getByLabelText('SMS Notifications')).toBeInTheDocument()
    expect(screen.getByLabelText('Push Notifications')).toBeInTheDocument()
    expect(screen.getByLabelText('In-App Notifications')).toBeInTheDocument()
  })

  it('toggles delivery methods', () => {
    render(<NotificationCenter {...defaultProps} />)
    
    const emailToggle = screen.getByLabelText('Email Notifications')
    const smsToggle = screen.getByLabelText('SMS Notifications')
    
    // Email should be enabled by default
    expect(emailToggle).toBeChecked()
    
    // SMS should be disabled by default
    expect(smsToggle).not.toBeChecked()
    
    // Toggle SMS
    fireEvent.click(smsToggle)
    expect(smsToggle).toBeChecked()
  })

  it('changes notification frequency', () => {
    render(<NotificationCenter {...defaultProps} />)
    
    const frequencySelect = screen.getByLabelText('Select notification frequency')
    expect(frequencySelect).toHaveValue('realtime')
    
    // Change to daily
    fireEvent.click(frequencySelect)
    fireEvent.click(screen.getByText('Daily summary'))
    
    expect(frequencySelect).toHaveValue('daily')
  })

  it('toggles quiet hours', () => {
    render(<NotificationCenter {...defaultProps} />)
    
    const quietToggle = screen.getByTestId('quiet-toggle')
    
    // Quiet hours should be disabled by default
    expect(quietToggle).not.toBeChecked()
    
    // Enable quiet hours
    fireEvent.click(quietToggle)
    expect(quietToggle).toBeChecked()
    
    // Should show time inputs
    expect(screen.getByLabelText('Start Time')).toBeInTheDocument()
    expect(screen.getByLabelText('End Time')).toBeInTheDocument()
  })

  it('sets quiet hours times', () => {
    render(<NotificationCenter {...defaultProps} />)
    
    // Enable quiet hours first
    fireEvent.click(screen.getByTestId('quiet-toggle'))
    
    const startTimeInput = screen.getByLabelText('Start Time')
    const endTimeInput = screen.getByLabelText('End Time')
    
    fireEvent.change(startTimeInput, { target: { value: '23:00' } })
    fireEvent.change(endTimeInput, { target: { value: '08:00' } })
    
    expect(startTimeInput).toHaveValue('23:00')
    expect(endTimeInput).toHaveValue('08:00')
  })

  it('toggles channel preferences', () => {
    render(<NotificationCenter {...defaultProps} />)
    
    const taskToggle = screen.getByLabelText('Task Notifications')
    const messageToggle = screen.getByLabelText('Message Notifications')
    
    // Both should be enabled by default
    expect(taskToggle).toBeChecked()
    expect(messageToggle).toBeChecked()
    
    // Disable task notifications
    fireEvent.click(taskToggle)
    expect(taskToggle).not.toBeChecked()
  })

  it('toggles emergency override', () => {
    render(<NotificationCenter {...defaultProps} />)
    
    const emergencyToggle = screen.getByLabelText('Emergency Override')
    
    // Should be enabled by default
    expect(emergencyToggle).toBeChecked()
    
    // Disable it
    fireEvent.click(emergencyToggle)
    expect(emergencyToggle).not.toBeChecked()
  })

  it('saves notification settings', async () => {
    mockOnSave.mockResolvedValue(undefined)
    
    render(<NotificationCenter {...defaultProps} />)
    
    // Change some settings
    fireEvent.click(screen.getByLabelText('SMS Notifications'))
    fireEvent.click(screen.getByTestId('quiet-toggle'))
    
    // Save settings
    fireEvent.click(screen.getByTestId('notification-save'))
    
    expect(screen.getByText('Saving...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Notification settings saved successfully!')).toBeInTheDocument()
    })
    
    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      sms: true,
      quietHours: expect.objectContaining({
        enabled: true
      })
    }))
  })

  it('handles save error', async () => {
    const errorMessage = 'Failed to save settings'
    mockOnSave.mockRejectedValue(new Error(errorMessage))
    
    render(<NotificationCenter {...defaultProps} />)
    
    // Try to save
    fireEvent.click(screen.getByTestId('notification-save'))
    
    await waitFor(() => {
      expect(screen.getByText('Failed to save settings. Please try again.')).toBeInTheDocument()
    })
  })

  it('closes modal on cancel', () => {
    render(<NotificationCenter {...defaultProps} />)
    
    fireEvent.click(screen.getByText('Cancel'))
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('resets settings when modal closes', () => {
    const { rerender } = render(<NotificationCenter {...defaultProps} />)
    
    // Change some settings
    fireEvent.click(screen.getByLabelText('SMS Notifications'))
    
    // Close and reopen modal
    rerender(<NotificationCenter {...defaultProps} isOpen={false} />)
    rerender(<NotificationCenter {...defaultProps} isOpen={true} />)
    
    // Settings should be reset
    expect(screen.getByLabelText('SMS Notifications')).not.toBeChecked()
  })

  it('shows proper accessibility attributes', () => {
    render(<NotificationCenter {...defaultProps} />)
    
    // Check for proper ARIA descriptions
    expect(screen.getByLabelText('Email Notifications')).toHaveAttribute('aria-describedby')
    expect(screen.getByLabelText('SMS Notifications')).toHaveAttribute('aria-describedby')
    
    // Check for proper labels
    expect(screen.getByLabelText('Start Time')).toHaveAttribute('aria-describedby')
    expect(screen.getByLabelText('End Time')).toHaveAttribute('aria-describedby')
  })
})
