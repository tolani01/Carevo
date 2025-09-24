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
