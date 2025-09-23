'use client'

import { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { 
  MoreVertical, 
  Clock, 
  User, 
  Flag, 
  CheckCircle,
  Calendar,
  Pause
} from 'lucide-react'

interface MobileTaskCardProps {
  task: any
  onTaskClick: (task: any) => void
  onQuickAction: (action: string, task: any) => void
}

export function MobileTaskCard({ task, onTaskClick, onQuickAction }: MobileTaskCardProps) {
  const [showActions, setShowActions] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'waiting': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const quickActions = [
    { id: 'complete', label: 'Complete', icon: <CheckCircle className="h-4 w-4" /> },
    { id: 'waiting', label: 'Set Waiting', icon: <Pause className="h-4 w-4" /> },
    { id: 'due-date', label: 'Set Due Date', icon: <Calendar className="h-4 w-4" /> },
    { id: 'assign', label: 'Reassign', icon: <User className="h-4 w-4" /> }
  ]

  return (
    <Card 
      className="mb-3 hover:shadow-md transition-shadow" 
      data-testid="mobile-task-card"
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 
              className="font-medium text-gray-900 truncate mb-1 cursor-pointer"
              onClick={() => onTaskClick(task)}
              tabIndex={0}
              role="button"
              aria-label={`View task: ${task.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onTaskClick(task)
                }
              }}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowActions(!showActions)}
            className="ml-2 p-1 min-h-[44px] min-w-[44px]"
            aria-expanded={showActions}
            aria-label={`${showActions ? 'Hide' : 'Show'} quick actions`}
            aria-haspopup="true"
          >
            <MoreVertical className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="outline" className="text-xs">
            {task.type}
          </Badge>
          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
            <Flag className="h-3 w-3 mr-1" aria-hidden="true" />
            {task.priority}
          </Badge>
          <Badge className={`text-xs ${getStatusColor(task.status)}`}>
            {task.status}
          </Badge>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          {task.due_at && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {new Date(task.due_at).toLocaleDateString()}
            </div>
          )}
          {task.assignee && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" aria-hidden="true" />
              {task.assignee.name}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {showActions && (
          <div className="grid grid-cols-2 gap-2 pt-3 border-t">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={() => {
                  onQuickAction(action.id, task)
                  setShowActions(false)
                }}
                className="h-10 text-xs min-h-[44px]"
                aria-label={`${action.label} task`}
                data-testid={`quick-action-${action.id}`}
              >
                <span className="sr-only">{action.label}</span>
                {action.icon}
                <span className="ml-1">{action.label}</span>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
