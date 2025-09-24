'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Search, Clock, User, MessageSquare, CheckSquare, Filter, Lightbulb } from 'lucide-react'
import { searchService } from '../lib/services/search-service'
import { performanceMonitor } from '../lib/utils/performance-monitor'

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
  const [refinementSuggestions, setRefinementSuggestions] = useState<string[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    if (query.trim()) {
      performSearch()
    }
  }, [query, scope])

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
      
      // Generate refinement suggestions
      generateRefinementSuggestions(refinedQuery, searchResults.queryAnalysis)
      
      // Add to search history
      addToSearchHistory(refinedQuery)
      
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateRefinementSuggestions = (currentQuery: string, analysis: string) => {
    const baseQuery = currentQuery.toLowerCase()
    const suggestions: string[] = []
    
    // Time-based refinements
    if (!baseQuery.includes('today') && !baseQuery.includes('urgent')) {
      suggestions.push(`${currentQuery} today`)
      suggestions.push(`urgent ${currentQuery}`)
    }
    
    // Status-based refinements
    if (!baseQuery.includes('overdue') && !baseQuery.includes('pending')) {
      suggestions.push(`${currentQuery} overdue`)
      suggestions.push(`pending ${currentQuery}`)
    }
    
    // Priority-based refinements
    if (!baseQuery.includes('high') && !baseQuery.includes('priority')) {
      suggestions.push(`high priority ${currentQuery}`)
    }
    
    // Context-specific refinements
    if (analysis.includes('clinical')) {
      suggestions.push(`${currentQuery} process`)
      suggestions.push(`clinical ${currentQuery}`)
    } else if (analysis.includes('patient')) {
      suggestions.push(`patient ${currentQuery}`)
      suggestions.push(`${currentQuery} follow-up`)
    }
    
    setRefinementSuggestions(suggestions.slice(0, 4)) // Limit to 4 suggestions
  }

  const addToSearchHistory = (query: string) => {
    if (query.trim() && !searchHistory.includes(query)) {
      const newHistory = [query, ...searchHistory].slice(0, 5) // Keep last 5 searches
      setSearchHistory(newHistory)
      // Store in localStorage for persistence
      localStorage.setItem('carevo-search-history', JSON.stringify(newHistory))
    }
  }

  // Load search history on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('carevo-search-history')
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Debounced search for refinement input
  useEffect(() => {
    if (refinedQuery !== query && refinedQuery.trim().length >= 1) {
      const timeoutId = setTimeout(() => {
        if (refinedQuery.trim()) {
          performSearch()
        }
      }, 500) // Increased debounce for better UX
      
      return () => clearTimeout(timeoutId)
    }
  }, [refinedQuery])

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

  // Phase 2: Context-Aware Quick Actions
  const getContextActions = () => {
    const actions = []
    
    // Based on search context
    if (queryAnalysis?.includes('clinical')) {
      actions.push({ type: 'export', label: 'Export List' })
      actions.push({ type: 'assign', label: 'Assign to Me' })
    }
    
    if (queryAnalysis?.includes('patient')) {
      actions.push({ type: 'follow-up', label: 'Set Follow-up' })
      actions.push({ type: 'reminder', label: 'Set Reminder' })
    }
    
    // Based on results
    if (results.some(r => r.metadata?.status === 'overdue')) {
      actions.push({ type: 'escalate', label: 'Escalate Overdue' })
    }
    
    if (results.some(r => r.metadata?.priority === 'high')) {
      actions.push({ type: 'priority', label: 'Mark Priority' })
    }
    
    // Default actions
    actions.push({ type: 'export', label: 'Export Results' })
    actions.push({ type: 'bookmark', label: 'Save Search' })
    
    return actions.slice(0, 4) // Limit to 4 actions
  }

  const handleQuickAction = (actionType: string) => {
    switch (actionType) {
      case 'export':
        console.log('Exporting search results:', results)
        // TODO: Implement export functionality
        break
      case 'assign':
        console.log('Assigning results to current user')
        // TODO: Implement assignment functionality
        break
      case 'follow-up':
        console.log('Setting follow-up for patient results')
        // TODO: Implement follow-up functionality
        break
      case 'reminder':
        console.log('Setting reminder for results')
        // TODO: Implement reminder functionality
        break
      case 'escalate':
        console.log('Escalating overdue results')
        // TODO: Implement escalation functionality
        break
      case 'priority':
        console.log('Marking results as priority')
        // TODO: Implement priority functionality
        break
      case 'bookmark':
        console.log('Saving search as bookmark')
        // TODO: Implement bookmark functionality
        break
      default:
        console.log('Unknown action:', actionType)
    }
  }

  return (
    <div 
      className="space-y-3"
      data-search-results
      onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
      onClick={(e) => e.stopPropagation()} // Prevent event bubbling
    >
      {/* AI Understanding - Compact */}
      {queryAnalysis && (
        <div className="flex items-start gap-2 p-2 bg-blue-50 border border-blue-200 rounded">
          <Lightbulb className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-blue-800 font-medium">AI Understanding</p>
            <p className="text-xs text-blue-700">{queryAnalysis}</p>
            {/* Context-aware suggestions */}
            <div className="mt-1 flex gap-1">
              <span className="text-xs text-blue-600 bg-blue-100 px-1 rounded">
                {queryAnalysis.includes('clinical') ? 'Clinical Process' : 
                 queryAnalysis.includes('patient') ? 'Patient Search' : 'General Search'}
              </span>
            </div>
                    </div>
                        </div>
                      )}

      {/* Search Refinement - Enhanced with Smart Suggestions */}
      <div className="space-y-2">
        {/* Smart Refinement Suggestions */}
        {refinementSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-1 items-center">
            <span className="text-xs text-gray-600 mr-2">Try:</span>
            {refinementSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  setRefinedQuery(suggestion)
                  performSearch()
                }}
                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
            {/* Clear Suggestions Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setRefinedQuery('')
                performSearch()
              }}
              className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors ml-2"
              title="Clear search"
            >
              Clear
                </button>
          </div>
        )}

        {/* One-Click Filter Chips */}
        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-xs text-gray-600 mr-2">Filters:</span>
          {['today', 'overdue', 'urgent', 'pending', 'completed'].map((filter) => (
            <button
              key={filter}
              onClick={(e) => {
                e.stopPropagation()
                const newQuery = refinedQuery.includes(filter) 
                  ? refinedQuery.replace(new RegExp(`\\b${filter}\\b`, 'gi'), '').trim()
                  : `${refinedQuery} ${filter}`.trim()
                setRefinedQuery(newQuery)
                performSearch()
              }}
              className={`text-xs px-2 py-1 rounded-full transition-colors ${
                refinedQuery.toLowerCase().includes(filter)
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {filter}
            </button>
          ))}
          {/* Clear Filters Button */}
          {['today', 'overdue', 'urgent', 'pending', 'completed'].some(filter => 
            refinedQuery.toLowerCase().includes(filter)
          ) && (
                <button
              onClick={(e) => {
                e.stopPropagation()
                // Remove all filter terms from the query
                let clearedQuery = refinedQuery
                const filterTerms = ['today', 'overdue', 'urgent', 'pending', 'completed']
                filterTerms.forEach((filter: string) => {
                  clearedQuery = clearedQuery.replace(new RegExp(`\\b${filter}\\b`, 'gi'), '').trim()
                })
                // Clean up extra spaces
                clearedQuery = clearedQuery.replace(/\s+/g, ' ').trim()
                setRefinedQuery(clearedQuery)
                performSearch()
              }}
              className="text-xs px-2 py-1 rounded-full bg-red-100 hover:bg-red-200 text-red-700 transition-colors ml-2"
              title="Clear all filters"
            >
              Clear all
            </button>
                      )}
                    </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="flex flex-wrap gap-1 items-center">
            <span className="text-xs text-gray-600 mr-2">Recent:</span>
            {searchHistory.slice(0, 3).map((historyItem, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  setRefinedQuery(historyItem)
                  performSearch()
                }}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
              >
                {historyItem}
              </button>
            ))}
            {/* Clear History Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSearchHistory([])
                localStorage.removeItem('carevo-search-history')
              }}
              className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors ml-2"
              title="Clear search history"
            >
              Clear history
                </button>
          </div>
        )}

        {/* Refinement Input */}
        <div className="flex gap-1">
          <div className="flex-1 relative">
            <Input
              value={refinedQuery}
              onChange={(e) => {
                e.stopPropagation()
                setRefinedQuery(e.target.value)
                setShowSuggestions(true)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  e.stopPropagation()
                  performSearch()
                  setShowSuggestions(false)
                }
                if (e.key === 'Escape') {
                  setShowSuggestions(false)
                }
              }}
              onFocus={(e) => {
                e.stopPropagation()
                setShowSuggestions(true)
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
              }}
              placeholder={
                queryAnalysis?.includes('clinical') ? "Refine clinical process search..." :
                queryAnalysis?.includes('patient') ? "Refine patient search..." :
                "Refine your search..."
              }
              className="flex-1 text-sm h-8 pr-8"
              data-testid="search-input"
              autoComplete="off"
              spellCheck="false"
            />
            {refinedQuery !== query && refinedQuery.length > 0 && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            )}
          </div>
          <Button 
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              performSearch()
              setShowSuggestions(false)
            }} 
            disabled={isLoading || !refinedQuery.trim()} 
            size="sm" 
            className="h-8 px-2"
          >
            {isLoading ? (
              <div className="w-3 h-3 border border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            ) : (
              <Search className="h-3 w-3" />
            )}
          </Button>
                  </div>
                    </div>

      {/* Suggestions - Compact */}
      {suggestions.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-700">Try these:</p>
          <div className="flex flex-wrap gap-1">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setRefinedQuery(suggestion)}
                className="text-xs h-6 px-2"
              >
                {suggestion}
              </Button>
            ))}
          </div>
          </div>
        )}

      {/* Results - Compact */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse p-2">
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div className="h-2 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-1">
          {results.map((result) => (
            <div 
                  key={result.id}
              className="p-2 hover:bg-gray-50 rounded cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => onResultClick(result)}
              data-testid="search-result"
            >
              <div className="flex items-start gap-2">
                <div className={`p-1 rounded ${getResultColor(result.type)} flex-shrink-0`}>
                  {getResultIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                    {result.description}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="secondary" className="text-xs h-4 px-1">
                        {result.type}
                      </Badge>
                    <span className="text-xs text-gray-500">
                      {Math.round(result.relevanceScore * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <Search className="h-6 w-6 text-gray-400 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-gray-900 mb-1">No results found</h3>
          <p className="text-xs text-gray-600">Try different keywords</p>
          </div>
        )}

      {/* Phase 2: Context-Aware Quick Actions */}
      {results.length > 0 && (
        <div className="border-t pt-2 mt-2">
          <div className="flex flex-wrap gap-1">
            <span className="text-xs text-gray-600 mr-2">Actions:</span>
            {getContextActions().map((action, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  handleQuickAction(action.type)
                }}
                className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 px-2 py-1 rounded-full transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Phase 2: Search Analytics */}
      {results.length > 0 && (
        <div className="border-t pt-2 mt-2">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Found {results.length} results</span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Search optimized</span>
            </span>
        </div>
      </div>
      )}
    </div>
  )
}