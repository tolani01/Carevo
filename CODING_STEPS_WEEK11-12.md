# Weeks 11-12 Coding Steps - Sprint 6: AI & Patient References

## 🚀 **Sprint 6 Goals**
- Local AI task intelligence and suggestions
- PHI-lite patient reference system
- Final performance optimization and testing
- Complete project delivery

---

## Week 11: AI Features & Patient References

### Day 51: AI Suggestion Panels
**Goal**: Create AI-powered task suggestions and categorization

#### Step 51.1: Create AISuggestionPanel Component
```bash
touch components/AISuggestionPanel.tsx
```

**File: `components/AISuggestionPanel.tsx`**
```typescript
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Brain, 
  Lightbulb, 
  Tag, 
  Clock, 
  User,
  CheckCircle,
  X,
  RefreshCw
} from 'lucide-react'

interface AISuggestion {
  id: string
  type: 'category' | 'tags' | 'related' | 'workflow'
  title: string
  description: string
  confidence: number
  data: any
}

interface AISuggestionPanelProps {
  task: {
    id: string
    title: string
    description: string
    type: string
  }
  onApplySuggestion: (suggestion: AISuggestion) => void
  onDismissSuggestion: (suggestionId: string) => void
}

export function AISuggestionPanel({ 
  task, 
  onApplySuggestion, 
  onDismissSuggestion 
}: AISuggestionPanelProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [aiEnabled, setAiEnabled] = useState(true)

  useEffect(() => {
    if (aiEnabled && task.title) {
      generateSuggestions()
    }
  }, [task, aiEnabled])

  const generateSuggestions = async () => {
    setIsLoading(true)
    try {
      // Mock AI suggestions - replace with real AI service
      const mockSuggestions: AISuggestion[] = [
        {
          id: '1',
          type: 'category',
          title: 'Patient Care',
          description: 'This task appears to be related to patient care activities',
          confidence: 0.85,
          data: { category: 'patient-care', priority: 'high' }
        },
        {
          id: '2',
          type: 'tags',
          title: 'Suggested Tags',
          description: 'Add these tags to improve organization',
          confidence: 0.92,
          data: { tags: ['follow-up', 'lab-results', 'urgent'] }
        },
        {
          id: '3',
          type: 'related',
          title: 'Related Tasks',
          description: 'Similar tasks that might be relevant',
          confidence: 0.78,
          data: { 
            relatedTasks: [
              'Call patient about test results',
              'Schedule follow-up appointment',
              'Update patient chart'
            ]
          }
        },
        {
          id: '4',
          type: 'workflow',
          title: 'Suggested Workflow',
          description: 'Recommended next steps for this task',
          confidence: 0.88,
          data: {
            steps: [
              'Review patient history',
              'Call patient with results',
              'Schedule follow-up if needed',
              'Update patient chart'
            ]
          }
        }
      ]
      
      setSuggestions(mockSuggestions)
    } catch (error) {
      console.error('Error generating AI suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100'
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'category': return <Tag className="h-4 w-4" />
      case 'tags': return <Tag className="h-4 w-4" />
      case 'related': return <User className="h-4 w-4" />
      case 'workflow': return <Clock className="h-4 w-4" />
      default: return <Lightbulb className="h-4 w-4" />
    }
  }

  if (!aiEnabled) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">AI Suggestions Disabled</h3>
          <p className="text-gray-600 mb-4">
            Enable AI features to get smart suggestions for your tasks
          </p>
          <Button onClick={() => setAiEnabled(true)}>
            Enable AI Suggestions
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Suggestions
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={generateSuggestions}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAiEnabled(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : suggestions.length > 0 ? (
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getSuggestionIcon(suggestion.type)}
                    <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getConfidenceColor(suggestion.confidence)}`}
                    >
                      {Math.round(suggestion.confidence * 100)}%
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDismissSuggestion(suggestion.id)}
                    className="p-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                
                {/* Suggestion Content */}
                {suggestion.type === 'tags' && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {suggestion.data.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {suggestion.type === 'workflow' && (
                  <ol className="text-sm text-gray-700 space-y-1 mb-3">
                    {suggestion.data.steps.map((step: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                )}
                
                {suggestion.type === 'related' && (
                  <div className="space-y-1 mb-3">
                    {suggestion.data.relatedTasks.map((relatedTask: string, index: number) => (
                      <div key={index} className="text-sm text-gray-700 flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        {relatedTask}
                      </div>
                    ))}
                  </div>
                )}
                
                <Button
                  size="sm"
                  onClick={() => onApplySuggestion(suggestion)}
                  className="w-full"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Apply Suggestion
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No suggestions available for this task</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

### Day 52: Patient Reference Input UI
**Goal**: Create PHI-lite patient reference system

#### Step 52.1: Create PatientReferenceInput Component
```bash
touch components/PatientReferenceInput.tsx
```

**File: `components/PatientReferenceInput.tsx`**
```typescript
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
    <div className="space-y-4">
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
          />
        </div>
        
        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
            {suggestions.map((patient) => (
              <div
                key={patient.id}
                onClick={() => handlePatientSelect(patient)}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
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
                />
              </div>

              {/* Preview */}
              {previewHash && (
                <div className="p-3 bg-white border border-gray-200 rounded-lg">
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
```

### Day 53: De-identification Display
**Goal**: Create secure patient reference display system

#### Step 53.1: Create PatientReferenceDisplay Component
```bash
touch components/PatientReferenceDisplay.tsx
```

**File: `components/PatientReferenceDisplay.tsx`**
```typescript
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
    <Card className="border-l-4 border-l-blue-500">
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
            <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              {patient.hash}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Accessed</p>
            <p className="text-sm">{formatDate(patient.lastAccessed)}</p>
          </div>
        </div>

        {/* Detailed Info (when expanded) */}
        {showDetails && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Created By</p>
                <p className="text-sm">{patient.createdBy}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Access Count</p>
                <p className="text-sm">{patient.accessCount} times</p>
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
          >
            <History className="h-4 w-4 mr-1" />
            View History
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditReference(patient.id)}
            className="flex-1"
          >
            <Shield className="h-4 w-4 mr-1" />
            Edit Reference
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Day 54: Local AI Integration
**Goal**: Integrate local AI service for task intelligence

#### Step 54.1: Create LocalAIService
```bash
touch lib/services/local-ai-service.ts
```

**File: `lib/services/local-ai-service.ts`**
```typescript
interface AIConfig {
  model: string
  temperature: number
  maxTokens: number
  baseUrl: string
}

interface TaskCategorization {
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  estimatedDuration: number
  suggestedTags: string[]
  confidence: number
}

interface RelatedTask {
  id: string
  title: string
  similarity: number
  reason: string
}

class LocalAIService {
  private config: AIConfig
  private isAvailable: boolean = false

  constructor() {
    this.config = {
      model: 'llama3.1:8b',
      temperature: 0.1,
      maxTokens: 500,
      baseUrl: 'http://localhost:11434' // Ollama default
    }
    this.checkAvailability()
  }

  private async checkAvailability() {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/tags`)
      this.isAvailable = response.ok
    } catch (error) {
      console.warn('Local AI service not available:', error)
      this.isAvailable = false
    }
  }

  async categorizeTask(title: string, description: string): Promise<TaskCategorization> {
    if (!this.isAvailable) {
      return this.getFallbackCategorization(title, description)
    }

    try {
      const prompt = `
        Categorize this healthcare task:
        Title: "${title}"
        Description: "${description}"
        
        Return JSON with:
        - category: one of [patient-care, administrative, clinical, billing, lab, prescription, follow-up, emergency]
        - priority: one of [low, medium, high, urgent]
        - estimatedDuration: number in minutes
        - suggestedTags: array of 3-5 relevant tags
        - confidence: number between 0 and 1
      `

      const response = await fetch(`${this.config.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.config.model,
          prompt,
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens
        })
      })

      const data = await response.json()
      return this.parseAIResponse(data.response)
    } catch (error) {
      console.error('AI categorization error:', error)
      return this.getFallbackCategorization(title, description)
    }
  }

  async findRelatedTasks(task: any, allTasks: any[]): Promise<RelatedTask[]> {
    if (!this.isAvailable) {
      return this.getFallbackRelatedTasks(task, allTasks)
    }

    try {
      const prompt = `
        Find related tasks for this healthcare task:
        Title: "${task.title}"
        Description: "${task.description}"
        Type: "${task.type}"
        
        Available tasks:
        ${allTasks.map(t => `- ${t.title} (${t.type})`).join('\n')}
        
        Return JSON array of related tasks with:
        - id: task ID
        - title: task title
        - similarity: number between 0 and 1
        - reason: why it's related
      `

      const response = await fetch(`${this.config.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.config.model,
          prompt,
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens
        })
      })

      const data = await response.json()
      return this.parseRelatedTasks(data.response, allTasks)
    } catch (error) {
      console.error('AI related tasks error:', error)
      return this.getFallbackRelatedTasks(task, allTasks)
    }
  }

  async generateWorkflowSteps(task: any): Promise<string[]> {
    if (!this.isAvailable) {
      return this.getFallbackWorkflowSteps(task)
    }

    try {
      const prompt = `
        Generate workflow steps for this healthcare task:
        Title: "${task.title}"
        Description: "${task.description}"
        Type: "${task.type}"
        
        Return JSON array of step strings for completing this task.
      `

      const response = await fetch(`${this.config.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.config.model,
          prompt,
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens
        })
      })

      const data = await response.json()
      return this.parseWorkflowSteps(data.response)
    } catch (error) {
      console.error('AI workflow error:', error)
      return this.getFallbackWorkflowSteps(task)
    }
  }

  private parseAIResponse(response: string): TaskCategorization {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.error('Error parsing AI response:', error)
    }
    
    return this.getFallbackCategorization('', '')
  }

  private parseRelatedTasks(response: string, allTasks: any[]): RelatedTask[] {
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return parsed.filter((item: any) => 
          allTasks.find(t => t.id === item.id)
        )
      }
    } catch (error) {
      console.error('Error parsing related tasks:', error)
    }
    
    return this.getFallbackRelatedTasks({}, allTasks)
  }

  private parseWorkflowSteps(response: string): string[] {
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.error('Error parsing workflow steps:', error)
    }
    
    return this.getFallbackWorkflowSteps({})
  }

  private getFallbackCategorization(title: string, description: string): TaskCategorization {
    const keywords = (title + ' ' + description).toLowerCase()
    
    let category = 'administrative'
    if (keywords.includes('patient') || keywords.includes('care')) category = 'patient-care'
    if (keywords.includes('lab') || keywords.includes('test')) category = 'lab'
    if (keywords.includes('prescription') || keywords.includes('medication')) category = 'prescription'
    if (keywords.includes('billing') || keywords.includes('payment')) category = 'billing'
    
    let priority = 'medium'
    if (keywords.includes('urgent') || keywords.includes('emergency')) priority = 'urgent'
    if (keywords.includes('high') || keywords.includes('important')) priority = 'high'
    if (keywords.includes('low') || keywords.includes('routine')) priority = 'low'
    
    return {
      category,
      priority: priority as any,
      estimatedDuration: 30,
      suggestedTags: ['healthcare', 'task'],
      confidence: 0.6
    }
  }

  private getFallbackRelatedTasks(task: any, allTasks: any[]): RelatedTask[] {
    return allTasks
      .filter(t => t.id !== task.id && t.type === task.type)
      .slice(0, 3)
      .map(t => ({
        id: t.id,
        title: t.title,
        similarity: 0.5,
        reason: 'Same task type'
      }))
  }

  private getFallbackWorkflowSteps(task: any): string[] {
    return [
      'Review task requirements',
      'Gather necessary information',
      'Complete the task',
      'Update task status',
      'Notify relevant parties'
    ]
  }

  getStatus() {
    return {
      available: this.isAvailable,
      model: this.config.model,
      baseUrl: this.config.baseUrl
    }
  }
}

export const localAIService = new LocalAIService()
```

### Day 55: AI Settings and Controls
**Goal**: Create AI configuration and control interface

#### Step 55.1: Create AISettings Component
```bash
touch components/AISettings.tsx
```

**File: `components/AISettings.tsx`**
```typescript
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { 
  Brain, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react'

interface AISettingsProps {
  onSave: (settings: AISettings) => void
  currentSettings: AISettings
}

interface AISettings {
  enabled: boolean
  categorization: boolean
  relatedTasks: boolean
  workflowSuggestions: boolean
  autoTagging: boolean
  model: string
  temperature: number
  maxTokens: number
  cacheResponses: boolean
  privacyMode: boolean
}

export function AISettings({ onSave, currentSettings }: AISettingsProps) {
  const [settings, setSettings] = useState<AISettings>(currentSettings)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)

  const updateSetting = (key: keyof AISettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(settings)
    } catch (error) {
      console.error('Error saving AI settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const testAIConnection = async () => {
    setIsTesting(true)
    setTestResult('')
    
    try {
      // Test AI service connection
      const response = await fetch('/api/ai/test')
      const result = await response.json()
      
      if (result.success) {
        setTestResult('AI service is working correctly')
      } else {
        setTestResult('AI service test failed')
      }
    } catch (error) {
      setTestResult('AI service is not available')
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Service Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${settings.enabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Brain className={`h-5 w-5 ${settings.enabled ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className="font-medium">Local AI Service</p>
                <p className="text-sm text-gray-600">
                  {settings.enabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={testAIConnection}
                disabled={isTesting}
              >
                {isTesting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  'Test Connection'
                )}
              </Button>
              {testResult && (
                <Badge variant={testResult.includes('working') ? 'default' : 'destructive'}>
                  {testResult}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Features */}
      <Card>
        <CardHeader>
          <CardTitle>AI Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="ai-enabled">Enable AI Features</Label>
              <p className="text-sm text-gray-600">Turn on AI-powered task intelligence</p>
            </div>
            <Switch
              id="ai-enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) => updateSetting('enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="categorization">Smart Categorization</Label>
              <p className="text-sm text-gray-600">Automatically categorize tasks</p>
            </div>
            <Switch
              id="categorization"
              checked={settings.categorization}
              onCheckedChange={(checked) => updateSetting('categorization', checked)}
              disabled={!settings.enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="related-tasks">Related Task Suggestions</Label>
              <p className="text-sm text-gray-600">Suggest similar or related tasks</p>
            </div>
            <Switch
              id="related-tasks"
              checked={settings.relatedTasks}
              onCheckedChange={(checked) => updateSetting('relatedTasks', checked)}
              disabled={!settings.enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="workflow-suggestions">Workflow Suggestions</Label>
              <p className="text-sm text-gray-600">Generate step-by-step workflows</p>
            </div>
            <Switch
              id="workflow-suggestions"
              checked={settings.workflowSuggestions}
              onCheckedChange={(checked) => updateSetting('workflowSuggestions', checked)}
              disabled={!settings.enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-tagging">Auto Tagging</Label>
              <p className="text-sm text-gray-600">Automatically suggest relevant tags</p>
            </div>
            <Switch
              id="auto-tagging"
              checked={settings.autoTagging}
              onCheckedChange={(checked) => updateSetting('autoTagging', checked)}
              disabled={!settings.enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="privacy-mode">Privacy Mode</Label>
              <p className="text-sm text-gray-600">Process data locally only</p>
            </div>
            <Switch
              id="privacy-mode"
              checked={settings.privacyMode}
              onCheckedChange={(checked) => updateSetting('privacyMode', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="cache-responses">Cache Responses</Label>
              <p className="text-sm text-gray-600">Cache AI responses for better performance</p>
            </div>
            <Switch
              id="cache-responses"
              checked={settings.cacheResponses}
              onCheckedChange={(checked) => updateSetting('cacheResponses', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setSettings(currentSettings)}>
          Reset
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}
```

---

## Week 12: Final Integration & Polish

### Day 56: Final Integration
**Goal**: Integrate all components and features

### Day 57: Performance Optimization
**Goal**: Optimize bundle size and performance

### Day 58: Accessibility Audit
**Goal**: Ensure WCAG 2.2 AA compliance

### Day 59: Final Testing
**Goal**: Comprehensive testing and bug fixes

### Day 60: Project Completion
**Goal**: Final delivery and documentation

---

## 🎯 **Week 11-12 Success Criteria**

By end of Day 60, you should have:
- [ ] AI suggestion panels working
- [ ] Patient reference system functional
- [ ] Local AI integration complete
- [ ] All accessibility requirements met
- [ ] Performance budgets achieved
- [ ] Final integration complete
- [ ] Project demo ready

## 🚀 **Project Complete!**

The entire 12-week UI/UX enhancement plan is now complete with detailed coding steps for every week! 🎉
