import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DueDatePicker } from '../due-date-picker'

// Mock the UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}))

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: any) => open ? <div role="dialog">{children}</div> : null,
  DialogContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
}))

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor, ...props }: any) => (
    <label htmlFor={htmlFor} {...props}>{children}</label>
  ),
}))

jest.mock('@/components/ui/input', () => ({
  Input: ({ onChange, value, ...props }: any) => (
    <input onChange={onChange} value={value} {...props} />
  ),
}))

describe('DueDatePicker', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    taskTitle: 'Test Task',
    currentDueDate: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders when open', () => {
    render(<DueDatePicker {...defaultProps} />)
    
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Set Due Date')).toBeInTheDocument()
    expect(screen.getByText('For task: "Test Task"')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<DueDatePicker {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('displays quick options', () => {
    render(<DueDatePicker {...defaultProps} />)
    
    expect(screen.getByText('Today')).toBeInTheDocument()
    expect(screen.getByText('Tomorrow')).toBeInTheDocument()
    expect(screen.getByText('Next Week')).toBeInTheDocument()
  })

  it('allows selecting quick options', async () => {
    const user = userEvent.setup()
    const onConfirm = jest.fn()
    
    render(<DueDatePicker {...defaultProps} onConfirm={onConfirm} />)
    
    const todayButton = screen.getByText('Today')
    await user.click(todayButton)
    
    const confirmButton = screen.getByText('Set Due Date')
    await user.click(confirmButton)
    
    expect(onConfirm).toHaveBeenCalled()
  })

  it('allows custom date selection', async () => {
    const user = userEvent.setup()
    const onConfirm = jest.fn()
    
    render(<DueDatePicker {...defaultProps} onConfirm={onConfirm} />)
    
    const customDateInput = screen.getByLabelText('Date')
    await user.type(customDateInput, '2024-12-25')
    
    const confirmButton = screen.getByText('Set Due Date')
    await user.click(confirmButton)
    
    expect(onConfirm).toHaveBeenCalledWith(expect.stringContaining('2024-12-25'))
  })

  it('allows custom time selection', async () => {
    const user = userEvent.setup()
    const onConfirm = jest.fn()
    
    render(<DueDatePicker {...defaultProps} onConfirm={onConfirm} />)
    
    const customTimeInput = screen.getByLabelText('Time (optional)')
    await user.type(customTimeInput, '14:30')
    
    const confirmButton = screen.getByText('Set Due Date')
    await user.click(confirmButton)
    
    expect(onConfirm).toHaveBeenCalledWith(expect.stringContaining('14:30'))
  })

  it('prevents selection of past dates', async () => {
    const user = userEvent.setup()
    const onConfirm = jest.fn()
    
    // Mock alert to avoid actual alert in test
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    
    render(<DueDatePicker {...defaultProps} onConfirm={onConfirm} />)
    
    // Set a past date
    const customDateInput = screen.getByLabelText('Date')
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayString = yesterday.toISOString().split('T')[0]
    
    await user.type(customDateInput, yesterdayString)
    
    const confirmButton = screen.getByText('Set Due Date')
    await user.click(confirmButton)
    
    expect(alertSpy).toHaveBeenCalledWith('Please select a date in the future')
    expect(onConfirm).not.toHaveBeenCalled()
    
    alertSpy.mockRestore()
  })

  it('displays current due date when provided', () => {
    const currentDate = '2024-12-25T10:00:00Z'
    render(<DueDatePicker {...defaultProps} currentDueDate={currentDate} />)
    
    const dateInput = screen.getByLabelText('Date')
    expect(dateInput).toHaveValue('2024-12-25')
  })

  it('calls onClose when cancel is clicked', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    
    render(<DueDatePicker {...defaultProps} onClose={onClose} />)
    
    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)
    
    expect(onClose).toHaveBeenCalled()
  })

  it('disables confirm button when no date is selected', () => {
    render(<DueDatePicker {...defaultProps} />)
    
    const confirmButton = screen.getByText('Set Due Date')
    expect(confirmButton).toBeDisabled()
  })

  it('enables confirm button when date is selected', async () => {
    const user = userEvent.setup()
    
    render(<DueDatePicker {...defaultProps} />)
    
    const todayButton = screen.getByText('Today')
    await user.click(todayButton)
    
    const confirmButton = screen.getByText('Set Due Date')
    expect(confirmButton).not.toBeDisabled()
  })

  it('shows selected date preview', async () => {
    const user = userEvent.setup()
    
    render(<DueDatePicker {...defaultProps} />)
    
    const todayButton = screen.getByText('Today')
    await user.click(todayButton)
    
    expect(screen.getByText('Selected Due Date:')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<DueDatePicker {...defaultProps} />)
    
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-labelledby', 'due-date-picker-title')
    expect(dialog).toHaveAttribute('aria-describedby', 'due-date-picker-description')
    
    const title = screen.getByText('Set Due Date')
    expect(title).toHaveAttribute('id', 'due-date-picker-title')
  })

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    
    render(<DueDatePicker {...defaultProps} />)
    
    // Tab to first quick option
    await user.tab()
    expect(screen.getByText('Today')).toHaveFocus()
    
    // Tab to next option
    await user.tab()
    expect(screen.getByText('Tomorrow')).toHaveFocus()
  })
})
