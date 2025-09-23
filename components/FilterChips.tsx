'use client'

import { Badge } from './ui/badge'
import { X } from 'lucide-react'

interface FilterChip {
  key: string
  label: string
  value: string
}

interface FilterChipsProps {
  filters: FilterChip[]
  onRemoveFilter: (key: string) => void
  onClearAll: () => void
}

export function FilterChips({ filters, onRemoveFilter, onClearAll }: FilterChipsProps) {
  if (filters.length === 0) return null

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 border-b">
      <span className="text-sm text-gray-600">Active filters:</span>
      <div className="flex flex-wrap gap-1">
        {filters.map((filter) => (
          <Badge
            key={filter.key}
            variant="secondary"
            className="flex items-center gap-1 pr-1"
          >
            <span className="text-xs">{filter.label}: {filter.value}</span>
            <button
              onClick={() => onRemoveFilter(filter.key)}
              className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              data-testid="clear-filter-chip"
              aria-label={`Remove ${filter.label} filter`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <button
        onClick={onClearAll}
        className="text-xs text-blue-600 hover:text-blue-800 ml-auto"
        data-testid="clear-all-filters"
      >
        Clear all
      </button>
    </div>
  )
}
