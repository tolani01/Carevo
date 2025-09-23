import { searchService } from '../search-service'

describe('SearchService', () => {
  describe('parseQuery', () => {
    it('should parse basic keywords', () => {
      const result = searchService.parseQuery('urgent patient follow-up')
      expect(result.keywords).toEqual(['urgent', 'patient', 'follow-up'])
      expect(result.intent).toBe('search')
    })

    it('should detect filter intent', () => {
      const result = searchService.parseQuery('show me urgent tasks')
      expect(result.intent).toBe('filter')
    })

    it('should detect action intent', () => {
      const result = searchService.parseQuery('create new task')
      expect(result.intent).toBe('action')
    })

    it('should extract status entities', () => {
      const result = searchService.parseQuery('urgent in-progress tasks')
      expect(result.entities).toContain('status:in-progress')
    })

    it('should extract type entities', () => {
      const result = searchService.parseQuery('lab refill tasks')
      expect(result.entities).toContain('type:lab')
      expect(result.entities).toContain('type:refill')
    })

    it('should extract priority entities', () => {
      const result = searchService.parseQuery('high priority urgent tasks')
      expect(result.entities).toContain('priority:high')
      expect(result.entities).toContain('priority:urgent')
    })

    it('should detect today time range', () => {
      const result = searchService.parseQuery('tasks due today')
      expect(result.timeRange).toBeDefined()
      expect(result.timeRange?.start).toBeInstanceOf(Date)
      expect(result.timeRange?.end).toBeInstanceOf(Date)
    })

    it('should detect this week time range', () => {
      const result = searchService.parseQuery('tasks this week')
      expect(result.timeRange).toBeDefined()
      expect(result.timeRange?.start).toBeInstanceOf(Date)
      expect(result.timeRange?.end).toBeInstanceOf(Date)
    })
  })

  describe('search', () => {
    it('should return search results with suggestions', async () => {
      const result = await searchService.search({
        query: 'urgent patient follow-up',
        scope: 'all',
        limit: 10
      })

      expect(result.results).toBeDefined()
      expect(result.suggestions).toBeDefined()
      expect(result.queryAnalysis).toBeDefined()
      expect(Array.isArray(result.results)).toBe(true)
      expect(Array.isArray(result.suggestions)).toBe(true)
    })

    it('should limit results based on limit parameter', async () => {
      const result = await searchService.search({
        query: 'test query',
        scope: 'all',
        limit: 5
      })

      expect(result.results.length).toBeLessThanOrEqual(5)
    })

    it('should generate suggestions for urgent queries', async () => {
      const result = await searchService.search({
        query: 'urgent tasks',
        scope: 'all'
      })

      expect(result.suggestions).toContain('Show me all urgent tasks')
      expect(result.suggestions).toContain('Find overdue high priority tasks')
    })

    it('should generate suggestions for patient queries', async () => {
      const result = await searchService.search({
        query: 'patient care',
        scope: 'all'
      })

      expect(result.suggestions).toContain('Tasks related to patient care')
      expect(result.suggestions).toContain('Patient follow-up tasks')
    })

    it('should generate suggestions for lab queries', async () => {
      const result = await searchService.search({
        query: 'lab results',
        scope: 'all'
      })

      expect(result.suggestions).toContain('Lab result tasks')
      expect(result.suggestions).toContain('Pending lab results')
    })
  })
})
