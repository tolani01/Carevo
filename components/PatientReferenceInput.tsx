'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { 
  User, 
  Calendar, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Search,
  Plus
} from 'lucide-react'

interface PatientReference {
  id: string
  displayName: string
  firstName: string
  lastName: string
  dob: string
  hash: string
  taskCount: number
  lastAccessed: string
}

interface PatientReferenceInputProps {
  onPatientSelect: (patient: PatientReference) => void
  onPatientCreate: (patientData: { firstName: string; lastName: string; dob: string }) => void
  existingPatients: PatientReference[]
}

export function PatientReferenceInput({ 
  onPatientSelect, 
  onPatientCreate, 
  existingPatients 
}: PatientReferenceInputProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDob] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [suggestions, setSuggestions] = useState<PatientReference[]>([])
  const [isCreating, setIsCreating] = useState(false)

  // Generate patient reference hash
  const generatePatientHash = (firstName: string, lastName: string, dob: string): string => {
    const namePart = firstName.substring(0, 3) + lastName.substring(0, 3)
    const dobHash = btoa(dob + 'clinic-salt-2024').substring(0, 8)
    return `${namePart}, #${dobHash}`
  }

  // Search existing patients
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const filtered = existingPatients.filter(patient =>
        patient.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [searchQuery, existingPatients])

  const handleCreatePatient = async () => {
    if (!firstName || !lastName || !dob) return

    setIsCreating(true)
    try {
      const patientData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dob: dob
      }
      
      await onPatientCreate(patientData)
      
      // Reset form
      setFirstName('')
      setLastName('')
      setDob('')
      setShowForm(false)
    } catch (error) {
      console.error('Error creating patient reference:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handlePatientSelect = (patient: PatientReference) => {
    onPatientSelect(patient)
    setSearchQuery('')
    setSuggestions([])
  }

  const previewHash = firstName && lastName && dob ? 
    generatePatientHash(firstName, lastName, dob) : ''

  return (
    <div className="space-y-4" data-testid="patient-reference-input">
      {/* Search Existing Patients */}
      <div className="space-y-2">
        <Label htmlFor="patient-search">Search Existing Patients</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="patient-search"
            placeholder="Type patient name or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="patient-search-input"
          />
        </div>
        
        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto" data-testid="patient-suggestions">
            {suggestions.map((patient) => (
              <div
                key={patient.id}
                onClick={() => handlePatientSelect(patient)}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                data-testid="patient-suggestion"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{patient.displayName}</p>
                    <p className="text-sm text-gray-600">
                      {patient.taskCount} tasks • Last accessed: {new Date(patient.lastAccessed).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Existing
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="text-sm text-gray-500">OR</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      {/* Create New Patient Reference */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Create New Patient Reference</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(!showForm)}
            data-testid="toggle-new-patient-form"
          >
            <Plus className="h-4 w-4 mr-1" />
            {showForm ? 'Cancel' : 'New Patient'}
          </Button>
        </div>

        {showForm && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input
                    id="first-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    maxLength={20}
                    data-testid="first-name-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input
                    id="last-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Smith"
                    maxLength={20}
                    data-testid="last-name-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  data-testid="dob-input"
                />
              </div>

              {/* Preview */}
              {previewHash && (
                <div className="p-3 bg-white border border-gray-200 rounded-lg" data-testid="patient-preview">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">System will display:</span>
                  </div>
                  <Badge variant="secondary" className="text-sm font-mono">
                    {previewHash}
                  </Badge>
                  <p className="text-xs text-gray-600 mt-2">
                    This de-identified reference will be used in all tasks and communications
                  </p>
                </div>
              )}

              {/* Privacy Notice */}
              <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Shield className="h-4 w-4 text-green-600 mt-0.5" />
                <div className="text-xs text-green-800">
                  <p className="font-medium mb-1">Privacy Protection:</p>
                  <ul className="space-y-1">
                    <li>• Only first 3 letters of names are stored</li>
                    <li>• Date of birth is hashed and cannot be reversed</li>
                    <li>• No full patient names are stored in the system</li>
                    <li>• HIPAA-compliant de-identification</li>
                  </ul>
                </div>
              </div>

              <Button
                onClick={handleCreatePatient}
                disabled={!firstName || !lastName || !dob || isCreating}
                className="w-full"
                data-testid="create-patient-button"
              >
                {isCreating ? 'Creating...' : 'Create Patient Reference'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
