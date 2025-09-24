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
              data-testid="refresh-suggestions"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAiEnabled(false)}
              data-testid="disable-ai"
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
              <div key={suggestion.id} className="border border-gray-200 rounded-lg p-3" data-testid="ai-suggestion">
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
                    data-testid="dismiss-suggestion"
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
                  data-testid="apply-suggestion"
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
