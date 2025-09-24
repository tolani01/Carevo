import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PatientReferenceInput } from '../PatientReferenceInput'

const mockExistingPatients = [
  {
    id: '1',
    displayName: 'JohSmi, #a1b2c3d4',
    firstName: 'John',
    lastName: 'Smith',
    dob: '1990-01-01',
    hash: 'JohSmi, #a1b2c3d4',
    taskCount: 5,
    lastAccessed: '2024-12-19T10:00:00Z'
  },
  {
    id: '2',
    displayName: 'JanDoe, #e5f6g7h8',
    firstName: 'Jane',
    lastName: 'Doe',
    dob: '1985-05-15',
    hash: 'JanDoe, #e5f6g7h8',
    taskCount: 3,
    lastAccessed: '2024-12-18T14:30:00Z'
  }
]

const mockOnPatientSelect = jest.fn()
const mockOnPatientCreate = jest.fn()

describe('PatientReferenceInput', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders patient reference input', () => {
    render(
      <PatientReferenceInput
        onPatientSelect={mockOnPatientSelect}
        onPatientCreate={mockOnPatientCreate}
        existingPatients={mockExistingPatients}
      />
    )

    expect(screen.getByText('Search Existing Patients')).toBeInTheDocument()
    expect(screen.getByText('Create New Patient Reference')).toBeInTheDocument()
    expect(screen.getByTestId('patient-search-input')).toBeInTheDocument()
  })

  it('shows search suggestions when typing', async () => {
    render(
      <PatientReferenceInput
        onPatientSelect={mockOnPatientSelect}
        onPatientCreate={mockOnPatientCreate}
        existingPatients={mockExistingPatients}
      />
    )

    const searchInput = screen.getByTestId('patient-search-input')
    fireEvent.change(searchInput, { target: { value: 'John' } })

    await waitFor(() => {
      expect(screen.getByTestId('patient-suggestions')).toBeInTheDocument()
      expect(screen.getByText('JohSmi, #a1b2c3d4')).toBeInTheDocument()
      expect(screen.getByText('5 tasks • Last accessed: 12/19/2024')).toBeInTheDocument()
    })
  })

  it('selects patient when suggestion is clicked', async () => {
    render(
      <PatientReferenceInput
        onPatientSelect={mockOnPatientSelect}
        onPatientCreate={mockOnPatientCreate}
        existingPatients={mockExistingPatients}
      />
    )

    const searchInput = screen.getByTestId('patient-search-input')
    fireEvent.change(searchInput, { target: { value: 'John' } })

    await waitFor(() => {
      const suggestion = screen.getByTestId('patient-suggestion')
      fireEvent.click(suggestion)
    })

    expect(mockOnPatientSelect).toHaveBeenCalledWith(mockExistingPatients[0])
  })

  it('toggles new patient form', () => {
    render(
      <PatientReferenceInput
        onPatientSelect={mockOnPatientSelect}
        onPatientCreate={mockOnPatientCreate}
        existingPatients={mockExistingPatients}
      />
    )

    const toggleButton = screen.getByTestId('toggle-new-patient-form')
    fireEvent.click(toggleButton)

    expect(screen.getByText('Patient Information')).toBeInTheDocument()
    expect(screen.getByTestId('first-name-input')).toBeInTheDocument()
    expect(screen.getByTestId('last-name-input')).toBeInTheDocument()
    expect(screen.getByTestId('dob-input')).toBeInTheDocument()
  })

  it('shows patient preview when form is filled', () => {
    render(
      <PatientReferenceInput
        onPatientSelect={mockOnPatientSelect}
        onPatientCreate={mockOnPatientCreate}
        existingPatients={mockExistingPatients}
      />
    )

    // Open form
    fireEvent.click(screen.getByTestId('toggle-new-patient-form'))

    // Fill form
    fireEvent.change(screen.getByTestId('first-name-input'), { target: { value: 'John' } })
    fireEvent.change(screen.getByTestId('last-name-input'), { target: { value: 'Smith' } })
    fireEvent.change(screen.getByTestId('dob-input'), { target: { value: '1990-01-01' } })

    expect(screen.getByTestId('patient-preview')).toBeInTheDocument()
    expect(screen.getByText('System will display:')).toBeInTheDocument()
  })

  it('creates new patient when form is submitted', async () => {
    render(
      <PatientReferenceInput
        onPatientSelect={mockOnPatientSelect}
        onPatientCreate={mockOnPatientCreate}
        existingPatients={mockExistingPatients}
      />
    )

    // Open form
    fireEvent.click(screen.getByTestId('toggle-new-patient-form'))

    // Fill form
    fireEvent.change(screen.getByTestId('first-name-input'), { target: { value: 'John' } })
    fireEvent.change(screen.getByTestId('last-name-input'), { target: { value: 'Smith' } })
    fireEvent.change(screen.getByTestId('dob-input'), { target: { value: '1990-01-01' } })

    // Submit form
    fireEvent.click(screen.getByTestId('create-patient-button'))

    expect(mockOnPatientCreate).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Smith',
      dob: '1990-01-01'
    })
  })

  it('disables create button when form is incomplete', () => {
    render(
      <PatientReferenceInput
        onPatientSelect={mockOnPatientSelect}
        onPatientCreate={mockOnPatientCreate}
        existingPatients={mockExistingPatients}
      />
    )

    // Open form
    fireEvent.click(screen.getByTestId('toggle-new-patient-form'))

    const createButton = screen.getByTestId('create-patient-button')
    expect(createButton).toBeDisabled()
  })

  it('shows privacy protection notice', () => {
    render(
      <PatientReferenceInput
        onPatientSelect={mockOnPatientSelect}
        onPatientCreate={mockOnPatientCreate}
        existingPatients={mockExistingPatients}
      />
    )

    // Open form
    fireEvent.click(screen.getByTestId('toggle-new-patient-form'))

    expect(screen.getByText('Privacy Protection:')).toBeInTheDocument()
    expect(screen.getByText('Only first 3 letters of names are stored')).toBeInTheDocument()
    expect(screen.getByText('Date of birth is hashed and cannot be reversed')).toBeInTheDocument()
    expect(screen.getByText('No full patient names are stored in the system')).toBeInTheDocument()
    expect(screen.getByText('HIPAA-compliant de-identification')).toBeInTheDocument()
  })

  it('clears search when patient is selected', async () => {
    render(
      <PatientReferenceInput
        onPatientSelect={mockOnPatientSelect}
        onPatientCreate={mockOnPatientCreate}
        existingPatients={mockExistingPatients}
      />
    )

    const searchInput = screen.getByTestId('patient-search-input')
    fireEvent.change(searchInput, { target: { value: 'John' } })

    await waitFor(() => {
      const suggestion = screen.getByTestId('patient-suggestion')
      fireEvent.click(suggestion)
    })

    expect(searchInput).toHaveValue('')
  })
})
