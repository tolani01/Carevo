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
