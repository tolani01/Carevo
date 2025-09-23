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
