import { render, screen, fireEvent } from '@testing-library/react'
import { MobileTaskCard } from '../MobileTaskCard'

const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test task description',
  priority: 'high',
  status: 'in-progress',
  type: 'refill',
  due_at: '2024-12-25T10:00:00Z',
  assignee: { name: 'John Doe' }
}

const mockProps = {
  task: mockTask,
  onTaskClick: jest.fn(),
  onQuickAction: jest.fn()
}

describe('MobileTaskCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders mobile task card', () => {
    render(<MobileTaskCard {...mockProps} />)
    
    expect(screen.getByTestId('mobile-task-card')).toBeInTheDocument()
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('Test task description')).toBeInTheDocument()
  })

  it('displays task badges with correct colors', () => {
    render(<MobileTaskCard {...mockProps} />)
    
    expect(screen.getByText('refill')).toBeInTheDocument()
    expect(screen.getByText('high')).toBeInTheDocument()
    expect(screen.getByText('in-progress')).toBeInTheDocument()
  })

  it('shows task metadata', () => {
    render(<MobileTaskCard {...mockProps} />)
    
    expect(screen.getByText('12/25/2024')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('opens quick actions when more button is clicked', () => {
    render(<MobileTaskCard {...mockProps} />)
    
    const moreButton = screen.getByLabelText('Show quick actions')
    fireEvent.click(moreButton)
    
    expect(screen.getByTestId('quick-action-complete')).toBeInTheDocument()
    expect(screen.getByTestId('quick-action-waiting')).toBeInTheDocument()
    expect(screen.getByTestId('quick-action-due-date')).toBeInTheDocument()
    expect(screen.getByTestId('quick-action-assign')).toBeInTheDocument()
  })

  it('calls onQuickAction when action is clicked', () => {
    render(<MobileTaskCard {...mockProps} />)
    
    const moreButton = screen.getByLabelText('Show quick actions')
    fireEvent.click(moreButton)
    
    const completeButton = screen.getByTestId('quick-action-complete')
    fireEvent.click(completeButton)
    
    expect(mockProps.onQuickAction).toHaveBeenCalledWith('complete', mockTask)
  })

  it('calls onTaskClick when task title is clicked', () => {
    render(<MobileTaskCard {...mockProps} />)
    
    const taskTitle = screen.getByText('Test Task')
    fireEvent.click(taskTitle)
    
    expect(mockProps.onTaskClick).toHaveBeenCalledWith(mockTask)
  })

  it('supports keyboard navigation', () => {
    render(<MobileTaskCard {...mockProps} />)
    
    const taskTitle = screen.getByText('Test Task')
    fireEvent.keyDown(taskTitle, { key: 'Enter' })
    
    expect(mockProps.onTaskClick).toHaveBeenCalledWith(mockTask)
  })

  it('has proper accessibility attributes', () => {
    render(<MobileTaskCard {...mockProps} />)
    
    const moreButton = screen.getByLabelText('Show quick actions')
    expect(moreButton).toHaveAttribute('aria-expanded', 'false')
    expect(moreButton).toHaveAttribute('aria-haspopup', 'true')
  })

  it('hides actions after action is clicked', () => {
    render(<MobileTaskCard {...mockProps} />)
    
    const moreButton = screen.getByLabelText('Show quick actions')
    fireEvent.click(moreButton)
    
    const completeButton = screen.getByTestId('quick-action-complete')
    fireEvent.click(completeButton)
    
    expect(screen.queryByTestId('quick-action-complete')).not.toBeInTheDocument()
  })
})
