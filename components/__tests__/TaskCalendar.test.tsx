import { render, screen, fireEvent } from '@testing-library/react'
import { TaskCalendar } from '../TaskCalendar'

// Use current date for testing
const today = new Date()
const todayString = today.toISOString().split('T')[0]
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)
const tomorrowString = tomorrow.toISOString().split('T')[0]

const mockTasks = [
  {
    id: '1',
    title: 'Test Task 1',
    due_at: `${todayString}T10:00:00Z`,
    priority: 'high' as const,
    status: 'todo',
    type: 'refill'
  },
  {
    id: '2',
    title: 'Test Task 2',
    due_at: `${todayString}T14:00:00Z`,
    priority: 'urgent' as const,
    status: 'in-progress',
    type: 'lab'
  },
  {
    id: '3',
    title: 'Test Task 3',
    due_at: `${tomorrowString}T09:00:00Z`,
    priority: 'medium' as const,
    status: 'waiting',
    type: 'callback'
  }
]

const mockProps = {
  tasks: mockTasks,
  onTaskClick: jest.fn(),
  onDateClick: jest.fn(),
  onCreateTask: jest.fn()
}

describe('TaskCalendar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders calendar with month view', () => {
    render(<TaskCalendar {...mockProps} />)
    
    expect(screen.getByTestId('task-calendar')).toBeInTheDocument()
    expect(screen.getByText('Task Calendar')).toBeInTheDocument()
    expect(screen.getByText('Month')).toBeInTheDocument()
  })

  it('shows task counts on calendar days', () => {
    render(<TaskCalendar {...mockProps} />)
    
    // Today should show 2 tasks
    const todayElements = screen.getAllByTestId(`calendar-day-${todayString}`)
    expect(todayElements.length).toBeGreaterThan(0)
    expect(todayElements[0]).toBeInTheDocument()
    expect(todayElements[0]).toHaveTextContent('2')
  })

  it('calls onDateClick when day is clicked', () => {
    render(<TaskCalendar {...mockProps} />)
    
    const todayElements = screen.getAllByTestId(`calendar-day-${todayString}`)
    fireEvent.click(todayElements[0])
    
    expect(mockProps.onDateClick).toHaveBeenCalledWith(expect.any(Date))
  })

  it('calls onCreateTask when add button is clicked', () => {
    render(<TaskCalendar {...mockProps} />)
    
    const addButtons = screen.getAllByTestId(`calendar-add-${todayString}`)
    fireEvent.click(addButtons[0])
    
    expect(mockProps.onCreateTask).toHaveBeenCalledWith(expect.any(Date))
  })

  it('shows task previews with priority colors', () => {
    render(<TaskCalendar {...mockProps} />)
    
    const todayElements = screen.getAllByTestId(`calendar-day-${todayString}`)
    expect(todayElements[0]).toHaveTextContent('Test Task 1')
    expect(todayElements[0]).toHaveTextContent('Test Task 2')
  })

  it('shows "+ more" when there are more than 2 tasks', () => {
    // Add a third task to test the "+ more" functionality
    const tasksWithMore = [
      ...mockTasks,
      {
        id: '4',
        title: 'Test Task 4',
        due_at: `${todayString}T16:00:00Z`,
        priority: 'low' as const,
        status: 'todo',
        type: 'callback'
      }
    ]
    
    render(<TaskCalendar {...mockProps} tasks={tasksWithMore} />)
    
    const todayElements = screen.getAllByTestId(`calendar-day-${todayString}`)
    expect(todayElements[0]).toHaveTextContent('+1 more') // Shows 2 tasks + 1 more
  })

  it('supports keyboard navigation', () => {
    render(<TaskCalendar {...mockProps} />)
    
    const todayElements = screen.getAllByTestId(`calendar-day-${todayString}`)
    fireEvent.keyDown(todayElements[0], { key: 'Enter' })
    
    expect(mockProps.onDateClick).toHaveBeenCalledWith(expect.any(Date))
  })

  it('highlights today', () => {
    render(<TaskCalendar {...mockProps} />)
    
    const todayElements = screen.getAllByTestId(`calendar-day-${todayString}`)
    expect(todayElements.length).toBeGreaterThan(0)
    expect(todayElements[0]).toHaveClass('bg-blue-50')
  })
})
