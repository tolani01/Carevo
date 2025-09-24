import { render, screen, fireEvent } from '@testing-library/react'
import { PatientReferenceDisplay } from '../PatientReferenceDisplay'

const mockPatient = {
  id: '1',
  displayName: 'JohSmi, #a1b2c3d4',
  firstName: 'John',
  lastName: 'Smith',
  dob: '1990-01-01',
  hash: 'JohSmi, #a1b2c3d4',
  taskCount: 5,
  lastAccessed: '2024-12-19T10:00:00Z',
  createdBy: 'Dr. Smith',
  accessCount: 15
}

const mockOnViewHistory = jest.fn()
const mockOnEditReference = jest.fn()

describe('PatientReferenceDisplay', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders patient reference display', () => {
    render(
      <PatientReferenceDisplay
        patient={mockPatient}
        onViewHistory={mockOnViewHistory}
        onEditReference={mockOnEditReference}
      />
    )

    expect(screen.getByText('JohSmi, #a1b2c3d4')).toBeInTheDocument()
    expect(screen.getByText('Patient Reference • 5 tasks')).toBeInTheDocument()
    expect(screen.getByTestId('patient-hash')).toBeInTheDocument()
    expect(screen.getByTestId('last-accessed')).toBeInTheDocument()
  })

  it('shows access level badge', () => {
    render(
      <PatientReferenceDisplay
        patient={mockPatient}
        onViewHistory={mockOnViewHistory}
        onEditReference={mockOnEditReference}
      />
    )

    expect(screen.getByText('Low Access')).toBeInTheDocument()
  })

  it('toggles details when eye button is clicked', () => {
    render(
      <PatientReferenceDisplay
        patient={mockPatient}
        onViewHistory={mockOnViewHistory}
        onEditReference={mockOnEditReference}
      />
    )

    const toggleButton = screen.getByTestId('toggle-details')
    fireEvent.click(toggleButton)

    expect(screen.getByTestId('patient-details')).toBeInTheDocument()
    expect(screen.getByTestId('created-by')).toBeInTheDocument()
    expect(screen.getByTestId('access-count')).toBeInTheDocument()
  })

  it('shows privacy notice in details', () => {
    render(
      <PatientReferenceDisplay
        patient={mockPatient}
        onViewHistory={mockOnViewHistory}
        onEditReference={mockOnEditReference}
      />
    )

    // Open details
    fireEvent.click(screen.getByTestId('toggle-details'))

    expect(screen.getByText('Privacy Notice:')).toBeInTheDocument()
    expect(screen.getByText(/This is a de-identified patient reference/)).toBeInTheDocument()
    expect(screen.getByText(/Full patient information is not stored/)).toBeInTheDocument()
  })

  it('calls onViewHistory when view history button is clicked', () => {
    render(
      <PatientReferenceDisplay
        patient={mockPatient}
        onViewHistory={mockOnViewHistory}
        onEditReference={mockOnEditReference}
      />
    )

    fireEvent.click(screen.getByTestId('view-history-button'))
    expect(mockOnViewHistory).toHaveBeenCalledWith('1')
  })

  it('calls onEditReference when edit reference button is clicked', () => {
    render(
      <PatientReferenceDisplay
        patient={mockPatient}
        onViewHistory={mockOnViewHistory}
        onEditReference={mockOnEditReference}
      />
    )

    fireEvent.click(screen.getByTestId('edit-reference-button'))
    expect(mockOnEditReference).toHaveBeenCalledWith('1')
  })

  it('displays correct access level for high access count', () => {
    const highAccessPatient = {
      ...mockPatient,
      accessCount: 75
    }

    render(
      <PatientReferenceDisplay
        patient={highAccessPatient}
        onViewHistory={mockOnViewHistory}
        onEditReference={mockOnEditReference}
      />
    )

    expect(screen.getByText('High Access')).toBeInTheDocument()
  })

  it('displays correct access level for medium access count', () => {
    const mediumAccessPatient = {
      ...mockPatient,
      accessCount: 35
    }

    render(
      <PatientReferenceDisplay
        patient={mediumAccessPatient}
        onViewHistory={mockOnViewHistory}
        onEditReference={mockOnEditReference}
      />
    )

    expect(screen.getByText('Medium Access')).toBeInTheDocument()
  })

  it('formats dates correctly', () => {
    render(
      <PatientReferenceDisplay
        patient={mockPatient}
        onViewHistory={mockOnViewHistory}
        onEditReference={mockOnEditReference}
      />
    )

    expect(screen.getByTestId('last-accessed')).toHaveTextContent('Dec 19, 2024')
  })

  it('shows patient hash in monospace font', () => {
    render(
      <PatientReferenceDisplay
        patient={mockPatient}
        onViewHistory={mockOnViewHistory}
        onEditReference={mockOnEditReference}
      />
    )

    const hashElement = screen.getByTestId('patient-hash')
    expect(hashElement).toHaveTextContent('JohSmi, #a1b2c3d4')
    expect(hashElement).toHaveClass('font-mono')
  })
})
