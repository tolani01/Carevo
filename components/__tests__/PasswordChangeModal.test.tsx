import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PasswordChangeModal } from '../PasswordChangeModal'

const mockOnPasswordChange = jest.fn()
const mockOnClose = jest.fn()

const defaultProps = {
  isOpen: true,
  onClose: mockOnClose,
  onPasswordChange: mockOnPasswordChange
}

describe('PasswordChangeModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders password change form when open', () => {
    render(<PasswordChangeModal {...defaultProps} />)
    
    expect(screen.getByText('Change Password')).toBeInTheDocument()
    expect(screen.getByTestId('pwd-current')).toBeInTheDocument()
    expect(screen.getByTestId('pwd-new')).toBeInTheDocument()
    expect(screen.getByTestId('pwd-confirm')).toBeInTheDocument()
    expect(screen.getByTestId('pwd-submit')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<PasswordChangeModal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('Change Password')).not.toBeInTheDocument()
  })

  it('validates password strength', () => {
    render(<PasswordChangeModal {...defaultProps} />)
    
    const newPasswordInput = screen.getByTestId('pwd-new')
    
    // Test weak password
    fireEvent.change(newPasswordInput, { target: { value: 'weak' } })
    expect(screen.getByText('Very Weak')).toBeInTheDocument()
    
    // Test medium password
    fireEvent.change(newPasswordInput, { target: { value: 'MediumPass123' } })
    expect(screen.getByText('Good')).toBeInTheDocument()
    
    // Test strong password
    fireEvent.change(newPasswordInput, { target: { value: 'VeryStrongPassword123!@#' } })
    expect(screen.getByText('Strong')).toBeInTheDocument()
  })

  it('shows password strength feedback', () => {
    render(<PasswordChangeModal {...defaultProps} />)
    
    const newPasswordInput = screen.getByTestId('pwd-new')
    fireEvent.change(newPasswordInput, { target: { value: 'weak' } })
    
    expect(screen.getByText('At least 8 characters')).toBeInTheDocument()
    expect(screen.getByText('Uppercase letter')).toBeInTheDocument()
    expect(screen.getByText('Number')).toBeInTheDocument()
    expect(screen.getByText('Special character')).toBeInTheDocument()
  })

  it('validates password confirmation', () => {
    render(<PasswordChangeModal {...defaultProps} />)
    
    const newPasswordInput = screen.getByTestId('pwd-new')
    const confirmPasswordInput = screen.getByTestId('pwd-confirm')
    
    // Set different passwords
    fireEvent.change(newPasswordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } })
    
    expect(screen.getByText("Passwords don't match")).toBeInTheDocument()
    
    // Set matching passwords
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    expect(screen.getByText('Passwords match')).toBeInTheDocument()
  })

  it('disables submit button when form is invalid', () => {
    render(<PasswordChangeModal {...defaultProps} />)
    
    const submitButton = screen.getByTestId('pwd-submit')
    expect(submitButton).toBeDisabled()
    
    // Fill weak password
    fireEvent.change(screen.getByTestId('pwd-new'), { target: { value: 'weak' } })
    expect(submitButton).toBeDisabled()
    
    // Fill valid password
    fireEvent.change(screen.getByTestId('pwd-new'), { target: { value: 'StrongPassword123!' } })
    fireEvent.change(screen.getByTestId('pwd-confirm'), { target: { value: 'StrongPassword123!' } })
    fireEvent.change(screen.getByTestId('pwd-current'), { target: { value: 'current123' } })
    
    expect(submitButton).toBeEnabled()
  })

  it('handles password change submission', async () => {
    mockOnPasswordChange.mockResolvedValue(undefined)
    
    render(<PasswordChangeModal {...defaultProps} />)
    
    // Fill valid form
    fireEvent.change(screen.getByTestId('pwd-current'), { target: { value: 'current123' } })
    fireEvent.change(screen.getByTestId('pwd-new'), { target: { value: 'StrongPassword123!' } })
    fireEvent.change(screen.getByTestId('pwd-confirm'), { target: { value: 'StrongPassword123!' } })
    
    // Submit form
    fireEvent.click(screen.getByTestId('pwd-submit'))
    
    expect(screen.getByText('Changing...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Password Changed Successfully')).toBeInTheDocument()
    })
    
    expect(mockOnPasswordChange).toHaveBeenCalledWith('current123', 'StrongPassword123!')
  })

  it('handles password change error', async () => {
    const errorMessage = 'Current password is incorrect'
    mockOnPasswordChange.mockRejectedValue(new Error(errorMessage))
    
    render(<PasswordChangeModal {...defaultProps} />)
    
    // Fill valid form
    fireEvent.change(screen.getByTestId('pwd-current'), { target: { value: 'wrong123' } })
    fireEvent.change(screen.getByTestId('pwd-new'), { target: { value: 'StrongPassword123!' } })
    fireEvent.change(screen.getByTestId('pwd-confirm'), { target: { value: 'StrongPassword123!' } })
    
    // Submit form
    fireEvent.click(screen.getByTestId('pwd-submit'))
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('toggles password visibility', () => {
    render(<PasswordChangeModal {...defaultProps} />)
    
    const newPasswordInput = screen.getByTestId('pwd-new')
    const toggleButton = screen.getByLabelText('Show new password')
    
    expect(newPasswordInput).toHaveAttribute('type', 'password')
    
    fireEvent.click(toggleButton)
    expect(newPasswordInput).toHaveAttribute('type', 'text')
    expect(screen.getByLabelText('Hide new password')).toBeInTheDocument()
    
    fireEvent.click(screen.getByLabelText('Hide new password'))
    expect(newPasswordInput).toHaveAttribute('type', 'password')
  })

  it('closes modal on cancel', () => {
    render(<PasswordChangeModal {...defaultProps} />)
    
    fireEvent.click(screen.getByText('Cancel'))
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('resets form when modal closes', () => {
    const { rerender } = render(<PasswordChangeModal {...defaultProps} />)
    
    // Fill some data
    fireEvent.change(screen.getByTestId('pwd-new'), { target: { value: 'test123' } })
    
    // Close and reopen modal
    rerender(<PasswordChangeModal {...defaultProps} isOpen={false} />)
    rerender(<PasswordChangeModal {...defaultProps} isOpen={true} />)
    
    expect(screen.getByTestId('pwd-new')).toHaveValue('')
  })
})
