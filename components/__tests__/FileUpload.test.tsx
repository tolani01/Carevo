import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FileUpload } from '../FileUpload'

const mockOnFileSelect = jest.fn()

const defaultProps = {
  onFileSelect: mockOnFileSelect,
  maxFiles: 3,
  maxSize: 5,
  acceptedTypes: ['image/*', 'application/pdf']
}

describe('FileUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders file upload button', () => {
    render(<FileUpload {...defaultProps} />)
    
    expect(screen.getByText('Attach Files')).toBeInTheDocument()
    expect(screen.getByTestId('file-input')).toBeInTheDocument()
  })

  it('opens file dialog when button is clicked', () => {
    render(<FileUpload {...defaultProps} />)
    
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement
    const clickSpy = jest.spyOn(fileInput, 'click')
    
    fireEvent.click(screen.getByText('Attach Files'))
    
    expect(clickSpy).toHaveBeenCalled()
  })

  it('validates file size', () => {
    render(<FileUpload {...defaultProps} />)
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 }) // 6MB
    
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    expect(screen.getByText(/File size must be less than 5MB/)).toBeInTheDocument()
    expect(mockOnFileSelect).not.toHaveBeenCalled()
  })

  it('validates file type', () => {
    render(<FileUpload {...defaultProps} />)
    
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    expect(screen.getByText(/File type not supported/)).toBeInTheDocument()
    expect(mockOnFileSelect).not.toHaveBeenCalled()
  })

  it('accepts valid files', () => {
    render(<FileUpload {...defaultProps} />)
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    Object.defineProperty(file, 'size', { value: 1024 * 1024 }) // 1MB
    
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    expect(screen.getByText('test.jpg')).toBeInTheDocument()
    expect(mockOnFileSelect).toHaveBeenCalledWith([file])
  })

  it('removes files when X button is clicked', () => {
    render(<FileUpload {...defaultProps} />)
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    Object.defineProperty(file, 'size', { value: 1024 * 1024 })
    
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    expect(screen.getByText('test.jpg')).toBeInTheDocument()
    
    fireEvent.click(screen.getByLabelText('Remove test.jpg'))
    
    expect(screen.queryByText('test.jpg')).not.toBeInTheDocument()
    expect(mockOnFileSelect).toHaveBeenCalledWith([])
  })

  it('shows upload progress', async () => {
    render(<FileUpload {...defaultProps} />)
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    Object.defineProperty(file, 'size', { value: 1024 * 1024 })
    
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    fireEvent.click(screen.getByText('Upload Files'))
    
    await waitFor(() => {
      expect(screen.getByText('Uploading...')).toBeInTheDocument()
    })
  })

  it('respects max files limit', () => {
    render(<FileUpload {...defaultProps} maxFiles={1} />)
    
    const file1 = new File(['test1'], 'test1.jpg', { type: 'image/jpeg' })
    const file2 = new File(['test2'], 'test2.jpg', { type: 'image/jpeg' })
    Object.defineProperty(file1, 'size', { value: 1024 * 1024 })
    Object.defineProperty(file2, 'size', { value: 1024 * 1024 })
    
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement
    
    // Add first file
    fireEvent.change(fileInput, { target: { files: [file1] } })
    expect(screen.getByText('test1.jpg')).toBeInTheDocument()
    
    // Try to add second file
    fireEvent.change(fileInput, { target: { files: [file2] } })
    expect(screen.getByText(/Maximum 1 files allowed/)).toBeInTheDocument()
  })
})
