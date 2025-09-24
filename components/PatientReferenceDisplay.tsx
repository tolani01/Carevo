'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  User, 
  Calendar, 
  Shield, 
  Eye, 
  EyeOff,
  History,
  AlertTriangle
} from 'lucide-react'

interface PatientReferenceDisplayProps {
  patient: {
    id: string
    displayName: string
    firstName: string
    lastName: string
    dob: string
    hash: string
    taskCount: number
    lastAccessed: string
    createdBy: string
    accessCount: number
  }
  onViewHistory: (patientId: string) => void
  onEditReference: (patientId: string) => void
}

export function PatientReferenceDisplay({ 
  patient, 
  onViewHistory, 
  onEditReference 
}: PatientReferenceDisplayProps) {
  const [showDetails, setShowDetails] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getAccessLevel = (accessCount: number) => {
    if (accessCount > 50) return { level: 'High', color: 'bg-red-100 text-red-800' }
    if (accessCount > 20) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800' }
    return { level: 'Low', color: 'bg-green-100 text-green-800' }
  }

  const accessLevel = getAccessLevel(patient.accessCount)

  return (
    <Card className="border-l-4 border-l-blue-500" data-testid="patient-reference-display">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{patient.displayName}</CardTitle>
              <p className="text-sm text-gray-600">
                Patient Reference • {patient.taskCount} tasks
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={accessLevel.color}>
              {accessLevel.level} Access
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              data-testid="toggle-details"
            >
              {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Reference Hash</p>
            <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded" data-testid="patient-hash">
              {patient.hash}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Accessed</p>
            <p className="text-sm" data-testid="last-accessed">
              {formatDate(patient.lastAccessed)}
            </p>
          </div>
        </div>

        {/* Detailed Info (when expanded) */}
        {showDetails && (
          <div className="space-y-4 pt-4 border-t border-gray-200" data-testid="patient-details">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Created By</p>
                <p className="text-sm" data-testid="created-by">{patient.createdBy}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Access Count</p>
                <p className="text-sm" data-testid="access-count">{patient.accessCount} times</p>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-xs text-yellow-800">
                <p className="font-medium mb-1">Privacy Notice:</p>
                <p>
                  This is a de-identified patient reference. Full patient information 
                  is not stored in this system for HIPAA compliance.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewHistory(patient.id)}
            className="flex-1"
            data-testid="view-history-button"
          >
            <History className="h-4 w-4 mr-1" />
            View History
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditReference(patient.id)}
            className="flex-1"
            data-testid="edit-reference-button"
          >
            <Shield className="h-4 w-4 mr-1" />
            Edit Reference
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
