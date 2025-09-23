import { render, screen, fireEvent } from '@testing-library/react'
import { MessageBubble } from '../MessageBubble'

const mockMessage = {
  id: '1',
  content: 'Hello team!',
  timestamp: new Date().toISOString(),
  sender: {
    id: 'user1',
    name: 'John Doe'
  },
  type: 'text' as const,
  status: 'sent' as const,
  channelId: 'channel1'
}

describe('MessageBubble', () => {
  it('renders text message', () => {
    render(<MessageBubble message={mockMessage} isOwn={false} />)
    
    expect(screen.getByText('Hello team!')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders own message with green background', () => {
    const ownMessage = { ...mockMessage, sender: { ...mockMessage.sender, id: 'current-user' } }
    render(<MessageBubble message={ownMessage} isOwn={true} />)
    
    const bubble = screen.getByText('Hello team!').closest('div')
    expect(bubble).toHaveClass('bg-green-500')
  })

  it('renders file message with attachment', () => {
    const fileMessage = {
      ...mockMessage,
      type: 'file' as const,
      content: 'Here is the document',
      attachments: [{
        id: 'file1',
        name: 'document.pdf',
        type: 'application/pdf',
        size: 1024000
      }]
    }
    
    render(<MessageBubble message={fileMessage} isOwn={false} />)
    
    expect(screen.getByText('Here is the document')).toBeInTheDocument()
    expect(screen.getByText('document.pdf')).toBeInTheDocument()
    expect(screen.getByText('1000.0 KB')).toBeInTheDocument()
  })

  it('renders image message', () => {
    const imageMessage = {
      ...mockMessage,
      type: 'image' as const,
      content: 'Check this out!',
      attachments: [{
        id: 'img1',
        name: 'photo.jpg',
        type: 'image/jpeg',
        size: 512000,
        url: '/test-image.jpg'
      }]
    }
    
    render(<MessageBubble message={imageMessage} isOwn={false} />)
    
    expect(screen.getByText('Check this out!')).toBeInTheDocument()
    const img = screen.getByAltText('photo.jpg')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/test-image.jpg')
  })

  it('shows correct status icons', () => {
    const statuses = [
      { status: 'sending', expectedClass: 'text-gray-400' },
      { status: 'sent', expectedClass: 'text-gray-400' },
      { status: 'delivered', expectedClass: 'text-gray-400' },
      { status: 'read', expectedClass: 'text-blue-500' },
      { status: 'failed', expectedClass: 'text-red-500' }
    ]

    statuses.forEach(({ status, expectedClass }) => {
      const message = { ...mockMessage, status: status as any }
      const { unmount } = render(<MessageBubble message={message} isOwn={true} />)
      
      const statusIcon = screen.getByRole('img', { hidden: true })
      expect(statusIcon).toHaveClass(expectedClass)
      
      unmount()
    })
  })

  it('shows message actions on hover', () => {
    render(<MessageBubble message={mockMessage} isOwn={false} />)
    
    const bubble = screen.getByText('Hello team!').closest('div')
    fireEvent.mouseEnter(bubble!)
    
    expect(screen.getByLabelText('Reply to message')).toBeInTheDocument()
    expect(screen.getByLabelText('React with thumbs up')).toBeInTheDocument()
    expect(screen.getByLabelText('More actions')).toBeInTheDocument()
  })

  it('calls onReply when reply button is clicked', () => {
    const mockOnReply = jest.fn()
    render(<MessageBubble message={mockMessage} isOwn={false} onReply={mockOnReply} />)
    
    const bubble = screen.getByText('Hello team!').closest('div')
    fireEvent.mouseEnter(bubble!)
    
    fireEvent.click(screen.getByLabelText('Reply to message'))
    expect(mockOnReply).toHaveBeenCalledWith(mockMessage)
  })

  it('calls onReact when react button is clicked', () => {
    const mockOnReact = jest.fn()
    render(<MessageBubble message={mockMessage} isOwn={false} onReact={mockOnReact} />)
    
    const bubble = screen.getByText('Hello team!').closest('div')
    fireEvent.mouseEnter(bubble!)
    
    fireEvent.click(screen.getByLabelText('React with thumbs up'))
    expect(mockOnReact).toHaveBeenCalledWith('1', '👍')
  })

  it('formats timestamp correctly', () => {
    const message = {
      ...mockMessage,
      timestamp: '2024-01-15T14:30:00Z'
    }
    
    render(<MessageBubble message={message} isOwn={false} />)
    
    expect(screen.getByText('2:30 PM')).toBeInTheDocument()
  })

  it('renders system message differently', () => {
    const systemMessage = {
      ...mockMessage,
      type: 'system' as const,
      content: 'User joined the channel'
    }
    
    render(<MessageBubble message={systemMessage} isOwn={false} />)
    
    expect(screen.getByText('User joined the channel')).toBeInTheDocument()
    expect(screen.getByText('User joined the channel')).toHaveClass('text-xs')
  })
})
