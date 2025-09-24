interface SearchResult {
  id: string
  type: 'task' | 'message' | 'user'
  title: string
  description: string
  metadata: Record<string, any>
  relevanceScore: number
  url: string
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

  // Generate URL for search result
  private generateResultUrl(result: { id: string; type: string }): string {
    switch (result.type) {
      case 'task': return `/task/${result.id}`;
      case 'message': return `/message/${result.id}`;
      case 'user': return `/user/${result.id}`;
      default: return '#';
    }
  }

  // Natural language query processing with AI enhancement
  async parseQuery(query: string): Promise<{
    keywords: string[]
    intent: 'search' | 'filter' | 'action'
    entities: string[]
    timeRange?: { start: Date; end: Date }
    aiAnalysis?: any
    searchContext?: 'clinical' | 'patient' | 'general'
  }> {
    // Try AI-powered analysis first
    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          context: {
            userRole: 'healthcare-provider',
            domain: 'healthcare-tasks',
            enableFullSearch: true // Remove any character limitations
          }
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        const aiAnalysis = data.data
        
        // Convert AI analysis to our format
        const keywords = aiAnalysis.keywords || query.toLowerCase().split(/\s+/)
        const intent = aiAnalysis.intent || 'search'
        const entities = this.extractEntitiesFromAI(aiAnalysis)
        const searchContext = this.detectSearchContext(query, aiAnalysis)
        
        return { keywords, intent, entities, aiAnalysis, searchContext }
      }
    } catch (error) {
      console.error('AI analysis failed, using fallback:', error)
    }
    
    // Fallback to rule-based analysis
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

    const searchContext = this.detectSearchContext(query)

    return { keywords, intent, entities, timeRange, searchContext }
  }

  private detectSearchContext(query: string, aiAnalysis?: any): 'clinical' | 'patient' | 'general' {
    const lowerQuery = query.toLowerCase()
    
    // Clinical process indicators
    const clinicalKeywords = [
      'lab', 'test', 'result', 'prescription', 'medication', 'treatment', 'diagnosis',
      'procedure', 'appointment', 'follow-up', 'refill', 'pa', 'prior authorization',
      'billing', 'insurance', 'referral', 'consultation'
    ]
    
    // Patient-specific indicators
    const patientKeywords = [
      'patient', 'mr', 'mrs', 'ms', 'dr', 'doctor', 'name', 'dob', 'birth',
      'contact', 'phone', 'address', 'chart', 'medical record'
    ]
    
    if (clinicalKeywords.some(keyword => lowerQuery.includes(keyword))) {
      return 'clinical'
    }
    
    if (patientKeywords.some(keyword => lowerQuery.includes(keyword))) {
      return 'patient'
    }
    
    return 'general'
  }

  private extractEntitiesFromAI(aiAnalysis: any): string[] {
    const entities: string[] = []
    // Extract entities from AI analysis
    if (aiAnalysis.entities) {
      entities.push(...aiAnalysis.entities)
    }
    return entities
  }

  // Semantic search implementation
  async search(query: SearchQuery): Promise<{
    results: SearchResult[]
    suggestions: string[]
    queryAnalysis: string
  }> {
    const analysis = await this.parseQuery(query.query)
    
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
    const lowerQuery = query.toLowerCase()
    const results: SearchResult[] = []
    
    // Dynamic task search based on query
    const allTasks = [
      {
        id: 'task-1',
        type: 'task' as const,
        title: 'Follow up with patient about lab results',
        description: 'Patient called asking about test results from last week',
        metadata: { status: 'in-progress', priority: 'high', assignee: 'Dr. Smith' },
        keywords: ['follow', 'patient', 'lab', 'results', 'test']
      },
      {
        id: 'task-2',
        type: 'task' as const,
        title: 'Prescription refill for diabetes medication',
        description: 'Patient needs Metformin refill - prior authorization required',
        metadata: { status: 'waiting', priority: 'medium', assignee: 'Dr. Johnson' },
        keywords: ['prescription', 'refill', 'diabetes', 'medication', 'metformin']
      },
      {
        id: 'task-3',
        type: 'task' as const,
        title: 'Schedule MRI appointment for patient',
        description: 'Patient needs MRI for knee injury - insurance pre-auth needed',
        metadata: { status: 'todo', priority: 'high', assignee: 'Dr. Williams' },
        keywords: ['mri', 'appointment', 'knee', 'injury', 'insurance']
      },
      {
        id: 'task-4',
        type: 'task' as const,
        title: 'Review blood pressure medication',
        description: 'Patient on Lisinopril - check for side effects and effectiveness',
        metadata: { status: 'in-progress', priority: 'medium', assignee: 'Dr. Brown' },
        keywords: ['blood', 'pressure', 'medication', 'lisinopril', 'review']
      },
      {
        id: 'task-5',
        type: 'task' as const,
        title: 'Patient discharge planning',
        description: 'Prepare discharge instructions and follow-up appointments',
        metadata: { status: 'todo', priority: 'high', assignee: 'Dr. Davis' },
        keywords: ['discharge', 'planning', 'instructions', 'follow-up']
      }
    ]
    
    // Calculate relevance based on keyword matching
    allTasks.forEach(task => {
      const keywordMatches = task.keywords.filter(keyword => 
        lowerQuery.includes(keyword)
      ).length
      
      const titleMatch = task.title.toLowerCase().includes(lowerQuery) ? 2 : 0
      const descriptionMatch = task.description.toLowerCase().includes(lowerQuery) ? 1 : 0
      
      // More lenient scoring for shorter queries
      const baseScore = (keywordMatches + titleMatch + descriptionMatch) / 5
      const relevanceScore = Math.min(0.95, baseScore + (lowerQuery.length <= 2 ? 0.1 : 0))
      
      if (relevanceScore > 0.05) { // Lowered threshold to allow shorter queries
        results.push({
          ...task,
          relevanceScore,
          url: this.generateResultUrl(task)
        })
      }
    })
    
    return results
  }

  private searchMessages(query: string, analysis: any): SearchResult[] {
    const lowerQuery = query.toLowerCase()
    const results: SearchResult[] = []
    
    const allMessages = [
      {
        id: 'msg-1',
        type: 'message' as const,
        title: 'Lab results discussion',
        description: 'Team discussion about patient lab results',
        metadata: { channel: 'general', author: 'Dr. Johnson', timestamp: '2024-12-19' },
        keywords: ['lab', 'results', 'discussion', 'team', 'patient']
      },
      {
        id: 'msg-2',
        type: 'message' as const,
        title: 'Prescription authorization needed',
        description: 'Insurance denied prior auth for expensive medication',
        metadata: { channel: 'clinical', author: 'Dr. Smith', timestamp: '2024-12-18' },
        keywords: ['prescription', 'authorization', 'insurance', 'medication', 'denied']
      },
      {
        id: 'msg-3',
        type: 'message' as const,
        title: 'Patient follow-up reminder',
        description: 'Reminder to call patient about test results',
        metadata: { channel: 'reminders', author: 'Nurse Mike', timestamp: '2024-12-17' },
        keywords: ['patient', 'follow-up', 'reminder', 'call', 'test', 'results']
      },
      {
        id: 'msg-4',
        type: 'message' as const,
        title: 'MRI scheduling update',
        description: 'Patient MRI scheduled for next Tuesday at 2 PM',
        metadata: { channel: 'scheduling', author: 'Dr. Williams', timestamp: '2024-12-16' },
        keywords: ['mri', 'scheduling', 'patient', 'tuesday', 'appointment']
      }
    ]
    
    allMessages.forEach(message => {
      const keywordMatches = message.keywords.filter(keyword => 
        lowerQuery.includes(keyword)
      ).length
      
      const titleMatch = message.title.toLowerCase().includes(lowerQuery) ? 2 : 0
      const descriptionMatch = message.description.toLowerCase().includes(lowerQuery) ? 1 : 0
      
      // More lenient scoring for shorter queries
      const baseScore = (keywordMatches + titleMatch + descriptionMatch) / 5
      const relevanceScore = Math.min(0.95, baseScore + (lowerQuery.length <= 2 ? 0.1 : 0))
      
      if (relevanceScore > 0.05) { // Lowered threshold to allow shorter queries
        results.push({
          ...message,
          relevanceScore,
          url: this.generateResultUrl(message)
        })
      }
    })
    
    return results
  }

  private searchUsers(query: string, analysis: any): SearchResult[] {
    const lowerQuery = query.toLowerCase()
    const results: SearchResult[] = []
    
    const allUsers = [
      {
        id: 'user-1',
        type: 'user' as const,
        title: 'Dr. Sarah Smith',
        description: 'Primary Care Physician',
        metadata: { role: 'provider', department: 'internal-medicine' },
        keywords: ['sarah', 'smith', 'primary', 'care', 'physician', 'dr']
      },
      {
        id: 'user-2',
        type: 'user' as const,
        title: 'Dr. Michael Johnson',
        description: 'Cardiologist',
        metadata: { role: 'provider', department: 'cardiology' },
        keywords: ['michael', 'johnson', 'cardiologist', 'heart', 'dr']
      },
      {
        id: 'user-3',
        type: 'user' as const,
        title: 'Nurse Jennifer Brown',
        description: 'Registered Nurse',
        metadata: { role: 'nurse', department: 'emergency' },
        keywords: ['jennifer', 'brown', 'nurse', 'registered', 'emergency']
      },
      {
        id: 'user-4',
        type: 'user' as const,
        title: 'Dr. Emily Davis',
        description: 'Pediatrician',
        metadata: { role: 'provider', department: 'pediatrics' },
        keywords: ['emily', 'davis', 'pediatrician', 'children', 'dr']
      }
    ]
    
    allUsers.forEach(user => {
      const keywordMatches = user.keywords.filter(keyword => 
        lowerQuery.includes(keyword)
      ).length
      
      const titleMatch = user.title.toLowerCase().includes(lowerQuery) ? 2 : 0
      const descriptionMatch = user.description.toLowerCase().includes(lowerQuery) ? 1 : 0
      
      // More lenient scoring for shorter queries
      const baseScore = (keywordMatches + titleMatch + descriptionMatch) / 5
      const relevanceScore = Math.min(0.95, baseScore + (lowerQuery.length <= 2 ? 0.1 : 0))
      
      if (relevanceScore > 0.05) { // Lowered threshold to allow shorter queries
        results.push({
          ...user,
          relevanceScore,
          url: this.generateResultUrl(user)
        })
      }
    })
    
    return results
  }

  private generateSuggestions(query: string, analysis: any): string[] {
    const suggestions: string[] = []
    const lowerQuery = query.toLowerCase()
    
    // Clinical process suggestions
    if (lowerQuery.includes('lab') || lowerQuery.includes('test') || lowerQuery.includes('result')) {
      suggestions.push('Lab results pending review', 'Test results follow-up', 'Lab authorization needed')
    }
    
    if (lowerQuery.includes('prescription') || lowerQuery.includes('medication') || lowerQuery.includes('refill')) {
      suggestions.push('Prescription refills', 'Medication authorization', 'Drug interaction check')
    }
    
    if (lowerQuery.includes('appointment') || lowerQuery.includes('schedule') || lowerQuery.includes('mri')) {
      suggestions.push('Upcoming appointments', 'Schedule MRI', 'Appointment reminders')
    }
    
    // Patient-related suggestions
    if (lowerQuery.includes('patient') || lowerQuery.includes('follow') || lowerQuery.includes('call')) {
      suggestions.push('Patient follow-up calls', 'Patient care tasks', 'Patient discharge planning')
    }
    
    // Priority-based suggestions
    if (lowerQuery.includes('urgent') || lowerQuery.includes('high') || lowerQuery.includes('emergency')) {
      suggestions.push('Urgent tasks', 'High priority items', 'Emergency cases')
    }
    
    if (lowerQuery.includes('overdue') || lowerQuery.includes('late') || lowerQuery.includes('past')) {
      suggestions.push('Overdue tasks', 'Past due items', 'Late follow-ups')
    }
    
    // Staff-related suggestions
    if (lowerQuery.includes('dr') || lowerQuery.includes('doctor') || lowerQuery.includes('nurse')) {
      suggestions.push('Doctor assignments', 'Nurse tasks', 'Staff schedules')
    }
    
    // Default suggestions if no specific matches
    if (suggestions.length === 0) {
      suggestions.push('Recent tasks', 'Today\'s appointments', 'Pending authorizations', 'Patient care items')
    }

    return suggestions.slice(0, 4)
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
