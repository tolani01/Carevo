'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { X, Search, Filter, Calendar } from 'lucide-react'

interface FilterState {
  search: string
  assignee: string
  status: string
  type: string
  dueDate: string
  priority: string
}

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  activeFilters: FilterState
  onFilterChange: (filters: FilterState) => void
  onClearAll: () => void
}

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'waiting', label: 'Waiting' },
  { value: 'done', label: 'Done' }
]

const typeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'refill', label: 'Refill' },
  { value: 'pa', label: 'PA' },
  { value: 'lab', label: 'Lab' },
  { value: 'callback', label: 'Callback' },
  { value: 'billing', label: 'Billing' },
  { value: 'other', label: 'Other' }
]

const priorityOptions = [
  { value: 'all', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
]

export function FilterDrawer({
  isOpen,
  onClose,
  activeFilters,
  onFilterChange,
  onClearAll
}: FilterDrawerProps) {
  const [filters, setFilters] = useState<FilterState>(activeFilters)

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleClearAll = () => {
    const clearedFilters = {
      search: '',
      assignee: 'all',
      status: 'all',
      type: 'all',
      dueDate: '',
      priority: 'all'
    }
    setFilters(clearedFilters)
    onClearAll()
  }

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== '' && value !== 'all').length
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-80 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary">{getActiveFilterCount()}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 py-6">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Tasks</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
                data-testid="search-filter"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger data-testid="status-filter">
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
              <SelectTrigger data-testid="type-filter">
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
              <SelectTrigger data-testid="priority-filter">
                <SelectValue placeholder="Select priority..." />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Due Date Filter */}
          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="due-date"
                type="date"
                value={filters.dueDate}
                onChange={(e) => handleFilterChange('dueDate', e.target.value)}
                className="pl-10"
                data-testid="due-date-filter"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={handleClearAll}>
            Clear All
          </Button>
          <Button onClick={onClose}>
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
