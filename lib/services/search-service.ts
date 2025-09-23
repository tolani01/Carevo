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
