# Weeks 3-4 Coding Steps - Sprint 2: Search & KPIs

## 🚀 **Sprint 2 Goals**
- Implement semantic search with natural language processing
- Create KPI dashboard for board overview
- Complete filter system consolidation
- Add performance monitoring

---

## Week 3: Semantic Search & Filter Integration

### Day 11: Semantic Search Foundation
**Goal**: Create intelligent search with natural language understanding

#### Step 11.1: Create SearchService
```bash
touch lib/services/search-service.ts
```

**File: `lib/services/search-service.ts`**
```typescript
interface SearchResult {
  id: string
  type: 'task' | 'message' | 'user'
  title: string
  description: string
  metadata: Record<string, any>
  relevanceScore: number
}

interface SearchQuery {
  query: string
  scope: 'all' | 'tasks' | 'messages' | 'users'
  filters?: Record<string, string>
  limit?: number
}

class SearchService {
  private tasks: any[] = []
  private messages: any[] = []
  private users: any[] = []

  // Natural language query processing
  parseQuery(query: string): {
    keywords: string[]
    intent: 'search' | 'filter' | 'action'
    entities: string[]
    timeRange?: { start: Date; end: Date }
  } {
    const keywords = query.toLowerCase().split(/\s+/)
    
    // Detect intent
    let intent: 'search' | 'filter' | 'action' = 'search'
    if (keywords.some(k => ['show', 'find', 'get'].includes(k))) {
      intent = 'filter'
    } else if (keywords.some(k => ['create', 'add', 'new'].includes(k))) {
      intent = 'action'
    }

    // Extract entities
    const entities: string[] = []
    const statusKeywords = ['todo', 'in-progress', 'waiting', 'done', 'completed']
    const typeKeywords = ['refill', 'pa', 'lab', 'callback', 'billing']
    const priorityKeywords = ['urgent', 'high', 'medium', 'low']
    
    keywords.forEach(keyword => {
      if (statusKeywords.includes(keyword)) entities.push(`status:${keyword}`)
      if (typeKeywords.includes(keyword)) entities.push(`type:${keyword}`)
      if (priorityKeywords.includes(keyword)) entities.push(`priority:${keyword}`)
    })

    // Detect time ranges
    let timeRange: { start: Date; end: Date } | undefined
    if (keywords.includes('today')) {
      const today = new Date()
      timeRange = { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    } else if (keywords.includes('this week')) {
      const now = new Date()
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
      const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
      timeRange = { start: startOfWeek, end: endOfWeek }
    }

    return { keywords, intent, entities, timeRange }
  }

  // Semantic search implementation
  async search(query: SearchQuery): Promise<{
    results: SearchResult[]
    suggestions: string[]
    queryAnalysis: string
  }> {
    const analysis = this.parseQuery(query.query)
    
    // Mock semantic search - in real implementation, this would use AI
    const results = await this.performSearch(query, analysis)
    
    // Generate suggestions based on query
    const suggestions = this.generateSuggestions(query.query, analysis)
    
    // Create query analysis summary
    const queryAnalysis = this.createQueryAnalysis(analysis)

    return {
      results: results.slice(0, query.limit || 20),
      suggestions,
      queryAnalysis
    }
  }

  private async performSearch(query: SearchQuery, analysis: any): Promise<SearchResult[]> {
    // Mock implementation - replace with real search logic
    const allResults: SearchResult[] = []
    
    if (query.scope === 'all' || query.scope === 'tasks') {
      const taskResults = this.searchTasks(query.query, analysis)
      allResults.push(...taskResults)
    }
    
    if (query.scope === 'all' || query.scope === 'messages') {
      const messageResults = this.searchMessages(query.query, analysis)
      allResults.push(...messageResults)
    }
    
    if (query.scope === 'all' || query.scope === 'users') {
      const userResults = this.searchUsers(query.query, analysis)
      allResults.push(...userResults)
    }

    // Sort by relevance score
    return allResults.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }

  private searchTasks(query: string, analysis: any): SearchResult[] {
    // Mock task search - implement with real data
    return [
      {
        id: 'task-1',
        type: 'task',
        title: 'Follow up with patient about lab results',
        description: 'Patient called asking about test results from last week',
        metadata: { status: 'in-progress', priority: 'high', assignee: 'Dr. Smith' },
        relevanceScore: 0.95
      }
    ]
  }

  private searchMessages(query: string, analysis: any): SearchResult[] {
    // Mock message search
    return [
      {
        id: 'msg-1',
        type: 'message',
        title: 'Lab results discussion',
        description: 'Team discussion about patient lab results',
        metadata: { channel: 'general', author: 'Dr. Johnson', timestamp: '2024-12-19' },
        relevanceScore: 0.85
      }
    ]
  }

  private searchUsers(query: string, analysis: any): SearchResult[] {
    // Mock user search
    return [
      {
        id: 'user-1',
        type: 'user',
        title: 'Dr. Sarah Smith',
        description: 'Primary Care Physician',
        metadata: { role: 'provider', department: 'internal-medicine' },
        relevanceScore: 0.90
      }
    ]
  }

  private generateSuggestions(query: string, analysis: any): string[] {
    const suggestions: string[] = []
    
    if (analysis.keywords.includes('urgent')) {
      suggestions.push('Show me all urgent tasks')
      suggestions.push('Find overdue high priority tasks')
    }
    
    if (analysis.keywords.includes('patient')) {
      suggestions.push('Tasks related to patient care')
      suggestions.push('Patient follow-up tasks')
    }
    
    if (analysis.keywords.includes('lab')) {
      suggestions.push('Lab result tasks')
      suggestions.push('Pending lab results')
    }

    return suggestions.slice(0, 5)
  }

  private createQueryAnalysis(analysis: any): string {
    let summary = `Searching for: ${analysis.keywords.join(', ')}`
    
    if (analysis.entities.length > 0) {
      summary += `\nFilters: ${analysis.entities.join(', ')}`
    }
    
    if (analysis.timeRange) {
      summary += `\nTime range: ${analysis.timeRange.start.toLocaleDateString()} - ${analysis.timeRange.end.toLocaleDateString()}`
    }
    
    return summary
  }
}

export const searchService = new SearchService()
```

#### Step 11.2: Create Enhanced SearchResults Component
**File: `components/SearchResults.tsx`** (update existing)

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Search, Clock, User, MessageSquare, CheckSquare, Filter, Lightbulb } from 'lucide-react'
import { searchService } from '../lib/services/search-service'

interface SearchResultsProps {
  query: string
  scope: 'all' | 'tasks' | 'messages' | 'users'
  onResultClick: (result: any) => void
}

export function SearchResults({ query, scope, onResultClick }: SearchResultsProps) {
  const [results, setResults] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [queryAnalysis, setQueryAnalysis] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [refinedQuery, setRefinedQuery] = useState(query)

  useEffect(() => {
    if (query.trim()) {
      performSearch()
    }
  }, [query, scope])

  const performSearch = async () => {
    setIsLoading(true)
    try {
      const searchResults = await searchService.search({
        query: refinedQuery,
        scope,
        limit: 20
      })
      
      setResults(searchResults.results)
      setSuggestions(searchResults.suggestions)
      setQueryAnalysis(searchResults.queryAnalysis)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckSquare className="h-4 w-4" />
      case 'message': return <MessageSquare className="h-4 w-4" />
      case 'user': return <User className="h-4 w-4" />
      default: return <Search className="h-4 w-4" />
    }
  }

  const getResultColor = (type: string) => {
    switch (type) {
      case 'task': return 'bg-blue-100 text-blue-800'
      case 'message': return 'bg-green-100 text-green-800'
      case 'user': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatMetadata = (metadata: Record<string, any>) => {
    const items = []
    if (metadata.status) items.push(`Status: ${metadata.status}`)
    if (metadata.priority) items.push(`Priority: ${metadata.priority}`)
    if (metadata.assignee) items.push(`Assignee: ${metadata.assignee}`)
    if (metadata.channel) items.push(`Channel: ${metadata.channel}`)
    if (metadata.role) items.push(`Role: ${metadata.role}`)
    return items
  }

  return (
    <div className="space-y-4">
      {/* Query Analysis */}
      {queryAnalysis && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 font-medium">AI Understanding</p>
                <p className="text-sm text-blue-700">{queryAnalysis}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Refinement */}
      <div className="flex gap-2">
        <Input
          value={refinedQuery}
          onChange={(e) => setRefinedQuery(e.target.value)}
          placeholder="Refine your search..."
          className="flex-1"
        />
        <Button onClick={performSearch} disabled={isLoading}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Try these searches:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setRefinedQuery(suggestion)}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-3">
          {results.map((result) => (
            <Card 
              key={result.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onResultClick(result)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${getResultColor(result.type)}`}>
                    {getResultIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {result.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {result.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formatMetadata(result.metadata).map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.round(result.relevanceScore * 100)}% match
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button variant="outline" onClick={() => setRefinedQuery('')}>
              Clear search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

### Day 12: KPI Dashboard Foundation
**Goal**: Create the KPI bar component for board overview

#### Step 12.1: Create KPIBar Component
```bash
touch components/KPIBar.tsx
```

**File: `components/KPIBar.tsx`**
```typescript
'use client'

import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Users, 
  DollarSign, 
  Shield, 
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react'

interface KPIMetric {
  id: string
  label: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'stable'
  status?: 'good' | 'warning' | 'danger'
  icon: React.ReactNode
  color: string
}

interface KPIBarProps {
  metrics: {
    completedToday: number
    overdue: number
    dueToday: number
    avgCompletionTime: string
    staffUtilization: number
    revenueAtRisk: number
    hipaaIncidents: number
    efficiencyImprovement: number
  }
  onMetricClick?: (metricId: string) => void
}

export function KPIBar({ metrics, onMetricClick }: KPIBarProps) {
  const kpiMetrics: KPIMetric[] = [
    {
      id: 'completed-today',
      label: 'Completed Today',
      value: metrics.completedToday,
      change: 12,
      trend: 'up',
      status: 'good',
      icon: <CheckCircle className="h-4 w-4" />,
      color: 'text-green-600'
    },
    {
      id: 'overdue',
      label: 'Overdue',
      value: metrics.overdue,
      change: -8,
      trend: 'down',
      status: metrics.overdue > 5 ? 'danger' : 'good',
      icon: <AlertTriangle className="h-4 w-4" />,
      color: metrics.overdue > 5 ? 'text-red-600' : 'text-green-600'
    },
    {
      id: 'due-today',
      label: 'Due Today',
      value: metrics.dueToday,
      status: metrics.dueToday > 20 ? 'warning' : 'good',
      icon: <Calendar className="h-4 w-4" />,
      color: metrics.dueToday > 20 ? 'text-yellow-600' : 'text-blue-600'
    },
    {
      id: 'avg-time',
      label: 'Avg Time',
      value: metrics.avgCompletionTime,
      trend: 'down',
      status: 'good',
      icon: <Clock className="h-4 w-4" />,
      color: 'text-blue-600'
    },
    {
      id: 'utilization',
      label: 'Staff Utilization',
      value: `${metrics.staffUtilization}%`,
      status: metrics.staffUtilization > 90 ? 'warning' : 'good',
      icon: <Users className="h-4 w-4" />,
      color: metrics.staffUtilization > 90 ? 'text-yellow-600' : 'text-green-600'
    },
    {
      id: 'revenue-risk',
      label: 'Revenue at Risk',
      value: `$${(metrics.revenueAtRisk / 1000).toFixed(1)}K`,
      status: metrics.revenueAtRisk > 10000 ? 'danger' : 'good',
      icon: <DollarSign className="h-4 w-4" />,
      color: metrics.revenueAtRisk > 10000 ? 'text-red-600' : 'text-green-600'
    },
    {
      id: 'hipaa',
      label: 'HIPAA Incidents',
      value: metrics.hipaaIncidents,
      status: metrics.hipaaIncidents > 0 ? 'danger' : 'good',
      icon: <Shield className="h-4 w-4" />,
      color: metrics.hipaaIncidents > 0 ? 'text-red-600' : 'text-green-600'
    },
    {
      id: 'efficiency',
      label: 'Efficiency',
      value: `+${metrics.efficiencyImprovement}%`,
      trend: 'up',
      status: 'good',
      icon: <TrendingUp className="h-4 w-4" />,
      color: 'text-green-600'
    }
  ]

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'good': return 'bg-green-50 border-green-200'
      case 'warning': return 'bg-yellow-50 border-yellow-200'
      case 'danger': return 'bg-red-50 border-red-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return '↗️'
      case 'down': return '↘️'
      default: return '→'
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 overflow-x-auto">
          {kpiMetrics.map((metric) => (
            <div
              key={metric.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow min-w-fit ${getStatusColor(metric.status)}`}
              onClick={() => onMetricClick?.(metric.id)}
            >
              <div className={metric.color}>
                {metric.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-600">{metric.label}</span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">{metric.value}</span>
                  {metric.change && (
                    <Badge 
                      variant={metric.trend === 'up' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {getTrendIcon(metric.trend)} {Math.abs(metric.change)}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Target className="h-4 w-4 mr-1" />
            Goals
          </Button>
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            Trends
          </Button>
        </div>
      </div>
    </div>
  )
}
```

#### Step 12.2: Create KPIModal for Detailed View
```bash
touch components/KPIModal.tsx
```

**File: `components/KPIModal.tsx`**
```typescript
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Users, 
  DollarSign, 
  Shield,
  TrendingUp,
  BarChart3,
  Download
} from 'lucide-react'

interface KPIModalProps {
  isOpen: boolean
  onClose: () => void
  metricId: string
  metrics: any
}

export function KPIModal({ isOpen, onClose, metricId, metrics }: KPIModalProps) {
  const getMetricDetails = (id: string) => {
    switch (id) {
      case 'completed-today':
        return {
          title: 'Tasks Completed Today',
          description: 'Total tasks completed in the last 24 hours',
          data: [
            { label: 'This Week', value: 47, change: 12 },
            { label: 'Last Week', value: 42, change: -5 },
            { label: 'This Month', value: 180, change: 8 }
          ],
          insights: [
            'Productivity is up 12% from yesterday',
            'On track to exceed weekly goal of 200 tasks',
            'Peak completion time: 2-4 PM'
          ]
        }
      case 'overdue':
        return {
          title: 'Overdue Tasks',
          description: 'Tasks that have passed their due date',
          data: [
            { label: 'Critical (>7 days)', value: 2, change: -1 },
            { label: 'High Priority', value: 3, change: -2 },
            { label: 'Medium Priority', value: 3, change: 0 }
          ],
          insights: [
            'Overdue tasks reduced by 8% this week',
            'Focus needed on high-priority overdue items',
            'Consider reassigning stuck tasks'
          ]
        }
      case 'utilization':
        return {
          title: 'Staff Utilization',
          description: 'Percentage of staff capacity being used',
          data: [
            { label: 'Providers', value: 92, change: 3 },
            { label: 'Nurses', value: 88, change: -2 },
            { label: 'Support Staff', value: 76, change: 5 }
          ],
          insights: [
            'Optimal utilization range: 80-90%',
            'Providers are slightly over-utilized',
            'Support staff capacity available'
          ]
        }
      default:
        return {
          title: 'Metric Details',
          description: 'Detailed view of selected metric',
          data: [],
          insights: []
        }
    }
  }

  const details = getMetricDetails(metricId)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {details.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-gray-600">{details.description}</p>
          
          {/* Data Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {details.data.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <Badge variant={item.change > 0 ? 'default' : 'secondary'}>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold mt-2">{item.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {details.insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span className="text-sm">{insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### Day 13: Filter System Integration
**Goal**: Complete filter system with chips and persistence

#### Step 13.1: Create FilterState Hook
```bash
touch lib/hooks/use-filter-state.ts
```

**File: `lib/hooks/use-filter-state.ts`**
```typescript
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface FilterState {
  search: string
  assignee: string
  status: string
  type: string
  dueDate: string
  priority: string
  location: string
}

const defaultFilters: FilterState = {
  search: '',
  assignee: '',
  status: '',
  type: '',
  dueDate: '',
  priority: '',
  location: ''
}

export function useFilterState() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize filters from URL
  useEffect(() => {
    const urlFilters: FilterState = { ...defaultFilters }
    
    searchParams.forEach((value, key) => {
      if (key in urlFilters) {
        urlFilters[key as keyof FilterState] = value
      }
    })
    
    setFilters(urlFilters)
    setIsLoading(false)
  }, [searchParams])

  // Update URL when filters change
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    
    // Update URL
    const params = new URLSearchParams()
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    router.push(newUrl, { scroll: false })
  }, [filters, router])

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters(defaultFilters)
    router.push(window.location.pathname, { scroll: false })
  }, [router])

  // Remove specific filter
  const removeFilter = useCallback((key: keyof FilterState) => {
    updateFilters({ [key]: '' })
  }, [updateFilters])

  // Get active filter count
  const getActiveFilterCount = useCallback(() => {
    return Object.values(filters).filter(value => value !== '').length
  }, [filters])

  // Get filter chips for display
  const getFilterChips = useCallback(() => {
    const chips = []
    
    if (filters.search) chips.push({ key: 'search', label: 'Search', value: filters.search })
    if (filters.status) chips.push({ key: 'status', label: 'Status', value: filters.status })
    if (filters.type) chips.push({ key: 'type', label: 'Type', value: filters.type })
    if (filters.priority) chips.push({ key: 'priority', label: 'Priority', value: filters.priority })
    if (filters.assignee) chips.push({ key: 'assignee', label: 'Assignee', value: filters.assignee })
    if (filters.dueDate) chips.push({ key: 'dueDate', label: 'Due Date', value: filters.dueDate })
    if (filters.location) chips.push({ key: 'location', label: 'Location', value: filters.location })
    
    return chips
  }, [filters])

  return {
    filters,
    isLoading,
    updateFilters,
    clearAllFilters,
    removeFilter,
    getActiveFilterCount,
    getFilterChips
  }
}
```

#### Step 13.2: Update Board Page with KPI and Filters
**File: `app/board/page.tsx`** (update existing)

Add KPI and filter integration:
```typescript
import { KPIBar } from '../components/KPIBar'
import { KPIModal } from '../components/KPIModal'
import { FilterChips } from '../components/FilterChips'
import { useFilterState } from '../lib/hooks/use-filter-state'

// Add state
const [showKPIModal, setShowKPIModal] = useState(false)
const [selectedMetric, setSelectedMetric] = useState<string>('')
const { filters, updateFilters, clearAllFilters, removeFilter, getFilterChips } = useFilterState()

// Mock KPI data
const kpiMetrics = {
  completedToday: 47,
  overdue: 8,
  dueToday: 23,
  avgCompletionTime: '2.3h',
  staffUtilization: 85,
  revenueAtRisk: 12400,
  hipaaIncidents: 0,
  efficiencyImprovement: 12
}

// Add KPI click handler
const handleKPIClick = (metricId: string) => {
  setSelectedMetric(metricId)
  setShowKPIModal(true)
}

// Update JSX
return (
  <div className="flex-1 flex flex-col board-page">
    {/* KPI Bar */}
    <KPIBar 
      metrics={kpiMetrics} 
      onMetricClick={handleKPIClick}
    />
    
    {/* Filter Chips */}
    <FilterChips
      filters={getFilterChips()}
      onRemoveFilter={removeFilter}
      onClearAll={clearAllFilters}
    />
    
    {/* Board Columns */}
    <BoardColumns
      tasks={filteredTasks}
      onTaskSelect={setSelectedTask}
      onTaskMove={handleTaskMove}
      onTaskAssign={async (taskId, assignmentData) => { /* ... */ }}
      onStatusChange={async (taskId, status) => { /* ... */ }}
      onSetDue={handleSetDue}
      onSetWaiting={handleSetWaiting}
      onAddTask={handleAddTask}
      onFilterColumn={handleFilterColumn}
      onSelectAll={handleSelectAll}
      onExportColumn={handleExportColumn}
      onShowStats={handleShowStats}
      onColumnSettings={handleColumnSettings}
    />
    
    {/* KPI Modal */}
    <KPIModal
      isOpen={showKPIModal}
      onClose={() => setShowKPIModal(false)}
      metricId={selectedMetric}
      metrics={kpiMetrics}
    />
  </div>
)
```

### Day 14: Performance Monitoring
**Goal**: Add performance tracking and optimization

#### Step 14.1: Create Performance Monitor
```bash
touch lib/utils/performance-monitor.ts
```

**File: `lib/utils/performance-monitor.ts`**
```typescript
interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  type: 'navigation' | 'task' | 'search' | 'filter'
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private observers: PerformanceObserver[] = []

  constructor() {
    this.initializeObservers()
  }

  private initializeObservers() {
    // Navigation timing
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.recordMetric('page-load', entry.duration, 'navigation')
          }
        })
      })
      navObserver.observe({ entryTypes: ['navigation'] })
      this.observers.push(navObserver)
    }
  }

  recordMetric(name: string, value: number, type: PerformanceMetric['type']) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      type
    }
    
    this.metrics.push(metric)
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100)
    }
    
    // Log performance issues
    if (value > this.getThreshold(name)) {
      console.warn(`Performance issue detected: ${name} took ${value}ms`)
    }
  }

  private getThreshold(name: string): number {
    const thresholds: Record<string, number> = {
      'page-load': 3000,
      'task-complete': 1000,
      'search': 500,
      'filter': 200
    }
    return thresholds[name] || 1000
  }

  getMetrics(type?: PerformanceMetric['type']) {
    if (type) {
      return this.metrics.filter(m => m.type === type)
    }
    return this.metrics
  }

  getAverageMetric(name: string, type?: PerformanceMetric['type']) {
    const filtered = type 
      ? this.metrics.filter(m => m.name === name && m.type === type)
      : this.metrics.filter(m => m.name === name)
    
    if (filtered.length === 0) return 0
    
    const sum = filtered.reduce((acc, m) => acc + m.value, 0)
    return sum / filtered.length
  }

  // Task performance tracking
  trackTaskAction(action: string, startTime: number) {
    const duration = Date.now() - startTime
    this.recordMetric(`task-${action}`, duration, 'task')
  }

  // Search performance tracking
  trackSearch(query: string, resultCount: number, startTime: number) {
    const duration = Date.now() - startTime
    this.recordMetric('search', duration, 'search')
    
    // Log search performance
    console.log(`Search "${query}" returned ${resultCount} results in ${duration}ms`)
  }

  // Filter performance tracking
  trackFilter(filterType: string, startTime: number) {
    const duration = Date.now() - startTime
    this.recordMetric(`filter-${filterType}`, duration, 'filter')
  }
}

export const performanceMonitor = new PerformanceMonitor()
```

#### Step 14.2: Add Performance Tracking to Components
**File: `components/SearchResults.tsx`** (add performance tracking)

```typescript
import { performanceMonitor } from '../lib/utils/performance-monitor'

// In performSearch function
const performSearch = async () => {
  const startTime = Date.now()
  setIsLoading(true)
  
  try {
    const searchResults = await searchService.search({
      query: refinedQuery,
      scope,
      limit: 20
    })
    
    // Track performance
    performanceMonitor.trackSearch(refinedQuery, searchResults.results.length, startTime)
    
    setResults(searchResults.results)
    setSuggestions(searchResults.suggestions)
    setQueryAnalysis(searchResults.queryAnalysis)
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    setIsLoading(false)
  }
}
```

### Day 15: Testing & Documentation
**Goal**: Complete Sprint 2 testing and documentation

#### Step 15.1: Add Integration Tests
```bash
touch tests/integration/search-kpi.spec.ts
```

**File: `tests/integration/search-kpi.spec.ts`**
```typescript
import { test, expect } from '@playwright/test'

test('semantic search functionality', async ({ page }) => {
  await page.goto('/board')
  
  // Open search
  await page.click('[data-testid="search-button"]')
  await expect(page.locator('text=Search Tasks')).toBeVisible()
  
  // Enter natural language query
  await page.fill('[data-testid="search-input"]', 'urgent patient follow-ups')
  
  // Should show AI understanding
  await expect(page.locator('text=AI Understanding')).toBeVisible()
  
  // Should show search results
  await expect(page.locator('[data-testid="search-result"]')).toBeVisible()
  
  // Should show suggestions
  await expect(page.locator('text=Try these searches')).toBeVisible()
})

test('KPI dashboard functionality', async ({ page }) => {
  await page.goto('/board')
  
  // Should show KPI bar
  await expect(page.locator('[data-testid="kpi-bar"]')).toBeVisible()
  
  // Click on a KPI metric
  await page.click('[data-testid="kpi-completed-today"]')
  
  // Should open KPI modal
  await expect(page.locator('text=Tasks Completed Today')).toBeVisible()
  
  // Should show detailed metrics
  await expect(page.locator('text=This Week')).toBeVisible()
  await expect(page.locator('text=Insights')).toBeVisible()
})

test('filter system integration', async ({ page }) => {
  await page.goto('/board')
  
  // Open filter drawer
  await page.click('[data-testid="filter-button"]')
  await expect(page.locator('text=Filters')).toBeVisible()
  
  // Apply multiple filters
  await page.selectOption('[data-testid="status-filter"]', 'in-progress')
  await page.selectOption('[data-testid="priority-filter"]', 'high')
  await page.click('text=Apply Filters')
  
  // Should show filter chips
  await expect(page.locator('text=Status: in-progress')).toBeVisible()
  await expect(page.locator('text=Priority: high')).toBeVisible()
  
  // Remove individual filter
  await page.click('[data-testid="remove-status-filter"]')
  await expect(page.locator('text=Status: in-progress')).not.toBeVisible()
  
  // Clear all filters
  await page.click('text=Clear all')
  await expect(page.locator('[data-testid="filter-chip"]')).not.toBeVisible()
})
```

#### Step 15.2: Update Documentation
**File: `docs/sprint-2-demo.md`**
```markdown
# Sprint 2 Demo - Search & KPIs

## Features Completed

### 1. Semantic Search
- Natural language query processing
- AI-powered query understanding
- Intelligent search suggestions
- Multi-entity search (tasks, messages, users)
- Relevance scoring and ranking

### 2. KPI Dashboard
- Real-time metrics display
- Interactive KPI tiles
- Detailed metric modals
- Performance insights
- Trend analysis

### 3. Filter System Integration
- URL-based filter persistence
- Filter chips for active filters
- Advanced filter combinations
- Clear individual or all filters
- Performance tracking

## Demo Script

1. **Semantic Search**
   - Go to /board
   - Click search button
   - Try: "urgent patient follow-ups"
   - See AI understanding and suggestions
   - Click on search results

2. **KPI Dashboard**
   - View KPI bar at top of board
   - Click on any metric (e.g., "Completed Today")
   - See detailed breakdown and insights
   - Try different metrics

3. **Filter System**
   - Click "Filters" button
   - Apply multiple filters
   - See filter chips appear
   - Remove individual filters
   - Clear all filters

## Success Metrics Achieved
- ✅ Semantic search with AI understanding
- ✅ Interactive KPI dashboard
- ✅ Complete filter system integration
- ✅ Performance monitoring and optimization
- ✅ URL-based state persistence
```

---

## 🎯 **Week 3-4 Success Criteria**

By end of Day 15, you should have:
- [ ] Semantic search with natural language processing
- [ ] AI-powered query understanding and suggestions
- [ ] Interactive KPI dashboard with detailed modals
- [ ] Complete filter system with URL persistence
- [ ] Performance monitoring and optimization
- [ ] Integration tests passing
- [ ] Sprint 2 demo ready

## 🚀 **Ready for Sprint 3**

Next sprint we'll focus on:
1. **Personal Productivity**: Calendar view and planning tools
2. **My Tasks Enhancement**: Quick filters and personal KPIs
3. **Mobile Optimization**: Touch interactions and responsive design

Sprint 2 search and KPI foundation is complete! 🎉
