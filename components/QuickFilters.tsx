'use client'

import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { X, Filter } from 'lucide-react'

interface QuickFilter {
  id: string
  label: string
  count: number
  active: boolean
}

interface QuickFiltersProps {
  filters: QuickFilter[]
  onFilterToggle: (filterId: string) => void
  onClearAll: () => void
  onAdvancedFilters: () => void
}

export function QuickFilters({ 
  filters, 
  onFilterToggle, 
  onClearAll, 
  onAdvancedFilters 
}: QuickFiltersProps) {
  const activeCount = filters.filter(f => f.active).length

  return (
    <div className="space-y-3" data-testid="quick-filters">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Quick Filters</h3>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-xs text-gray-500 hover:text-gray-700"
              data-testid="quick-filters-clear"
              aria-label="Clear all active filters"
            >
              Clear all
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onAdvancedFilters}
            className="text-xs"
            aria-label="Open advanced filters"
          >
            <Filter className="h-3 w-3 mr-1" aria-hidden="true" />
            Advanced
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={filter.active ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterToggle(filter.id)}
            className="h-8 text-xs"
            aria-pressed={filter.active}
            aria-label={`${filter.active ? 'Remove' : 'Apply'} ${filter.label} filter${filter.count > 0 ? ` (${filter.count} items)` : ''}`}
            data-testid={`quick-filter-${filter.id}`}
          >
            {filter.label}
            {filter.count > 0 && (
              <Badge 
                variant={filter.active ? 'secondary' : 'outline'}
                className="ml-1 text-xs"
                aria-label={`${filter.count} items`}
              >
                {filter.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}
