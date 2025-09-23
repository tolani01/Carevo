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
          data-testid="search-input"
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
              data-testid="search-result"
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