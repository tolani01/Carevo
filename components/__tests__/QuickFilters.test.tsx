import { render, screen, fireEvent } from '@testing-library/react'
import { QuickFilters } from '../QuickFilters'

const mockFilters = [
  { id: 'today', label: 'Today', count: 5, active: false },
  { id: 'overdue', label: 'Overdue', count: 2, active: true },
  { id: 'high-priority', label: 'High Priority', count: 3, active: false }
]

const mockProps = {
  filters: mockFilters,
  onFilterToggle: jest.fn(),
  onClearAll: jest.fn(),
  onAdvancedFilters: jest.fn()
}

describe('QuickFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders quick filters component', () => {
    render(<QuickFilters {...mockProps} />)
    
    expect(screen.getByTestId('quick-filters')).toBeInTheDocument()
    expect(screen.getByText('Quick Filters')).toBeInTheDocument()
  })

  it('renders filter pills with counts', () => {
    render(<QuickFilters {...mockProps} />)
    
    expect(screen.getByTestId('quick-filter-today')).toBeInTheDocument()
    expect(screen.getByTestId('quick-filter-overdue')).toBeInTheDocument()
    expect(screen.getByTestId('quick-filter-high-priority')).toBeInTheDocument()
    
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows active state for active filters', () => {
    render(<QuickFilters {...mockProps} />)
    
    const overdueFilter = screen.getByTestId('quick-filter-overdue')
    expect(overdueFilter).toHaveAttribute('aria-pressed', 'true')
    
    const todayFilter = screen.getByTestId('quick-filter-today')
    expect(todayFilter).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onFilterToggle when filter is clicked', () => {
    render(<QuickFilters {...mockProps} />)
    
    const todayFilter = screen.getByTestId('quick-filter-today')
    fireEvent.click(todayFilter)
    
    expect(mockProps.onFilterToggle).toHaveBeenCalledWith('today')
  })

  it('shows clear all button when filters are active', () => {
    render(<QuickFilters {...mockProps} />)
    
    expect(screen.getByTestId('quick-filters-clear')).toBeInTheDocument()
    expect(screen.getByText('Clear all')).toBeInTheDocument()
  })

  it('calls onClearAll when clear all is clicked', () => {
    render(<QuickFilters {...mockProps} />)
    
    const clearButton = screen.getByTestId('quick-filters-clear')
    fireEvent.click(clearButton)
    
    expect(mockProps.onClearAll).toHaveBeenCalled()
  })

  it('calls onAdvancedFilters when advanced button is clicked', () => {
    render(<QuickFilters {...mockProps} />)
    
    const advancedButton = screen.getByText('Advanced')
    fireEvent.click(advancedButton)
    
    expect(mockProps.onAdvancedFilters).toHaveBeenCalled()
  })

  it('does not show clear all when no filters are active', () => {
    const inactiveFilters = mockFilters.map(f => ({ ...f, active: false }))
    render(<QuickFilters {...mockProps} filters={inactiveFilters} />)
    
    expect(screen.queryByTestId('quick-filters-clear')).not.toBeInTheDocument()
  })
})
