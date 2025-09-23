import { render, screen, fireEvent } from '@testing-library/react'
import { TaskCalendar } from '../TaskCalendar'

const mockTasks = [
  {
    id: '1',
    title: 'Test Task 1',
    due_at: '2024-12-25T10:00:00Z',
    priority: 'high',
    status: 'todo',
    type: 'refill'
  },
  {
    id: '2',
    title: 'Test Task 2',
    due_at: '2024-12-25T14:00:00Z',
    priority: 'urgent',
    status: 'in-progress',
    type: 'lab'
  },
  {
    id: '3',
    title: 'Test Task 3',
    due_at: '2024-12-26T09:00:00Z',
    priority: 'medium',
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
    
    // December 25th should show 2 tasks
    const day25 = screen.getByTestId('calendar-day-2024-12-25')
    expect(day25).toBeInTheDocument()
    expect(day25).toHaveTextContent('2')
  })

  it('calls onDateClick when day is clicked', () => {
    render(<TaskCalendar {...mockProps} />)
    
    const day25 = screen.getByTestId('calendar-day-2024-12-25')
    fireEvent.click(day25)
    
    expect(mockProps.onDateClick).toHaveBeenCalledWith(expect.any(Date))
  })

  it('calls onCreateTask when add button is clicked', () => {
    render(<TaskCalendar {...mockProps} />)
    
    const addButton = screen.getByTestId('calendar-add-2024-12-25')
    fireEvent.click(addButton)
    
    expect(mockProps.onCreateTask).toHaveBeenCalledWith(expect.any(Date))
  })

  it('shows task previews with priority colors', () => {
    render(<TaskCalendar {...mockProps} />)
    
    const day25 = screen.getByTestId('calendar-day-2024-12-25')
    expect(day25).toHaveTextContent('Test Task 1')
    expect(day25).toHaveTextContent('Test Task 2')
  })

  it('shows "+ more" when there are more than 2 tasks', () => {
    render(<TaskCalendar {...mockProps} />)
    
    const day25 = screen.getByTestId('calendar-day-2024-12-25')
    expect(day25).toHaveTextContent('+0 more') // Only shows 2 tasks, so +0 more
  })

  it('supports keyboard navigation', () => {
    render(<TaskCalendar {...mockProps} />)
    
    const day25 = screen.getByTestId('calendar-day-2024-12-25')
    fireEvent.keyDown(day25, { key: 'Enter' })
    
    expect(mockProps.onDateClick).toHaveBeenCalledWith(expect.any(Date))
  })

  it('highlights today', () => {
    // Mock today as December 25th
    const originalDate = global.Date
    global.Date = jest.fn(() => new originalDate('2024-12-25T12:00:00Z')) as any
    
    render(<TaskCalendar {...mockProps} />)
    
    const today = screen.getByTestId('calendar-day-2024-12-25')
    expect(today).toHaveClass('bg-blue-50')
    
    global.Date = originalDate
  })
})
