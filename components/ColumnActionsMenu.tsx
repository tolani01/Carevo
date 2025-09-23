'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { MoreHorizontal, Plus, Filter, CheckSquare, Download, BarChart, Settings } from 'lucide-react'

interface ColumnActionsMenuProps {
  columnId: string
  columnTitle: string
  taskCount: number
  onAddTask: (columnId: string) => void
  onFilterColumn: (columnId: string) => void
  onSelectAll: (columnId: string) => void
  onExportColumn: (columnId: string) => void
  onShowStats: (columnId: string) => void
  onColumnSettings: (columnId: string) => void
}

export function ColumnActionsMenu({
  columnId,
  columnTitle,
  taskCount,
  onAddTask,
  onFilterColumn,
  onSelectAll,
  onExportColumn,
  onShowStats,
  onColumnSettings
}: ColumnActionsMenuProps) {
  return (
    <div className="flex items-center gap-1">
      {/* Plus Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onAddTask(columnId)}
        className="h-6 w-6 p-0 hover:bg-gray-100"
        title={`Add task to ${columnTitle}`}
        data-testid="plus-button"
      >
        <Plus className="h-4 w-4" />
      </Button>

      {/* More Actions Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 hover:bg-gray-100"
            title={`More actions for ${columnTitle}`}
            data-testid="more-button"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => onFilterColumn(columnId)}>
            <Filter className="h-4 w-4 mr-2" />
            Filter Tasks
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSelectAll(columnId)}>
            <CheckSquare className="h-4 w-4 mr-2" />
            Select All ({taskCount})
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExportColumn(columnId)}>
            <Download className="h-4 w-4 mr-2" />
            Export Tasks
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onShowStats(columnId)}>
            <BarChart className="h-4 w-4 mr-2" />
            Column Stats
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onColumnSettings(columnId)}>
            <Settings className="h-4 w-4 mr-2" />
            Column Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
