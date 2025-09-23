import { render, screen, fireEvent } from '@testing-library/react'
import { PersonalKPIs } from '../PersonalKPIs'

const mockProps = {
  userId: 'test-user',
  timeRange: 'today' as const,
  onTimeRangeChange: jest.fn()
}

describe('PersonalKPIs', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders personal KPIs dashboard', () => {
    render(<PersonalKPIs {...mockProps} />)
    
    expect(screen.getByTestId('personal-kpis')).toBeInTheDocument()
    expect(screen.getByText('Your Performance')).toBeInTheDocument()
  })

  it('shows time range selector buttons', () => {
    render(<PersonalKPIs {...mockProps} />)
    
    expect(screen.getByText('Today')).toBeInTheDocument()
    expect(screen.getByText('Week')).toBeInTheDocument()
    expect(screen.getByText('Month')).toBeInTheDocument()
  })

  it('calls onTimeRangeChange when time range is clicked', () => {
    render(<PersonalKPIs {...mockProps} />)
    
    const weekButton = screen.getByText('Week')
    fireEvent.click(weekButton)
    
    expect(mockProps.onTimeRangeChange).toHaveBeenCalledWith('week')
  })

  it('displays metric cards with data', () => {
    render(<PersonalKPIs {...mockProps} />)
    
    expect(screen.getByTestId('kpi-personal-completed')).toBeInTheDocument()
    expect(screen.getByTestId('kpi-personal-overdue')).toBeInTheDocument()
    expect(screen.getByTestId('kpi-personal-efficiency')).toBeInTheDocument()
  })

  it('shows correct data for today time range', () => {
    render(<PersonalKPIs {...mockProps} />)
    
    expect(screen.getByText('8')).toBeInTheDocument() // Today's completed tasks
    expect(screen.getByText('2')).toBeInTheDocument() // Today's overdue tasks
    expect(screen.getByText('92%')).toBeInTheDocument() // Today's efficiency
  })

  it('shows quick actions section', () => {
    render(<PersonalKPIs {...mockProps} />)
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument()
    expect(screen.getByText('Trends')).toBeInTheDocument()
    expect(screen.getByText('Goals')).toBeInTheDocument()
    expect(screen.getByText('Schedule')).toBeInTheDocument()
    expect(screen.getByText('Reports')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<PersonalKPIs {...mockProps} />)
    
    const todayButton = screen.getByText('Today')
    expect(todayButton).toHaveAttribute('aria-pressed', 'true')
    
    const weekButton = screen.getByText('Week')
    expect(weekButton).toHaveAttribute('aria-pressed', 'false')
  })
})
