'use client'

import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { 
  CheckCircle, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  Zap,
  BarChart3
} from 'lucide-react'

interface Task {
  id: string
  title: string
  status: string
  priority?: string
  due_at?: string | null
  created_at: string
  completed_at?: string | null
  assignee?: {
    id: string
    name: string
  }
}

interface PersonalKPIsProps {
  userId: string
  timeRange: 'today' | 'week' | 'month'
  onTimeRangeChange: (range: 'today' | 'week' | 'month') => void
  tasks?: Task[]
  onKPIClick?: (metricId: string) => void
}

export function PersonalKPIs({ userId, timeRange, onTimeRangeChange, tasks = [], onKPIClick }: PersonalKPIsProps) {
  // Calculate real data from tasks
  const calculatePersonalKPIs = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

    const getDateRange = () => {
      switch (timeRange) {
        case 'today':
          return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
        case 'week':
          return { start: weekStart, end: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000) }
        case 'month':
          return { start: monthStart, end: new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1) }
        default:
          return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
      }
    }

    const { start, end } = getDateRange()
    
    // Filter tasks for the current user and time range
    const userTasks = tasks.filter(task => 
      (typeof task.assignee === 'string' && (task.assignee === userId || task.assignee === 'me')) ||
      (typeof task.assignee === 'object' && task.assignee?.id === userId)
    )
    
    // Calculate metrics
    const completed = userTasks.filter(task => 
      task.status === 'Done' && 
      task.completed_at && 
      new Date(task.completed_at) >= start && 
      new Date(task.completed_at) < end
    ).length

    const overdue = userTasks.filter(task => 
      task.status !== 'Done' && 
      task.due_at &&
      new Date(task.due_at) < today
    ).length

    const dueToday = userTasks.filter(task => 
      task.status !== 'Done' && 
      task.due_at &&
      new Date(task.due_at).toDateString() === today.toDateString()
    ).length

    // Calculate average completion time (mock calculation)
    const completedTasks = userTasks.filter(task => task.status === 'Done' && task.completed_at)
    const avgTime = completedTasks.length > 0 ? 
      (completedTasks.length * 1.5 + Math.random() * 1.0).toFixed(1) + 'h' : '0h'

    // Calculate efficiency (completion rate)
    const totalTasks = userTasks.filter(task => 
      new Date(task.created_at) >= start && new Date(task.created_at) < end
    ).length
    const efficiency = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0

    // Calculate streak (mock calculation)
    const streak = Math.min(completed, 7) // Simple streak based on completed tasks

    return {
      completed,
      overdue,
      dueToday,
      avgTime,
      efficiency,
      streak
    }
  }

  const data = calculatePersonalKPIs()

  // Calculate trend changes (mock for now)
  const getTrendChange = (metricId: string) => {
    const trends = {
      completed: timeRange === 'today' ? 12 : timeRange === 'week' ? 8 : 5,
      overdue: timeRange === 'today' ? -2 : timeRange === 'week' ? -1 : 0,
      'due-today': 0,
      'avg-time': timeRange === 'today' ? -15 : timeRange === 'week' ? -8 : -5,
      efficiency: timeRange === 'today' ? 5 : timeRange === 'week' ? 3 : 2,
      streak: 1
    }
    return trends[metricId as keyof typeof trends] || 0
  }

  const metrics = [
    {
      id: 'completed',
      label: 'Completed',
      value: data.completed,
      icon: <CheckCircle className="h-3 w-3" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: getTrendChange('completed')
    },
    {
      id: 'overdue',
      label: 'Overdue',
      value: data.overdue,
      icon: <Clock className="h-3 w-3" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: getTrendChange('overdue')
    },
    {
      id: 'due-today',
      label: 'Due Today',
      value: data.dueToday,
      icon: <Calendar className="h-3 w-3" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: getTrendChange('due-today')
    },
    {
      id: 'avg-time',
      label: 'Avg Time',
      value: data.avgTime,
      icon: <Clock className="h-3 w-3" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: getTrendChange('avg-time')
    },
    {
      id: 'efficiency',
      label: 'Efficiency',
      value: `${data.efficiency}%`,
      icon: <Zap className="h-3 w-3" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: getTrendChange('efficiency')
    },
    {
      id: 'streak',
      label: 'Streak',
      value: `${data.streak} days`,
      icon: <Target className="h-3 w-3" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      change: getTrendChange('streak')
    }
  ]

  const getStatusColor = (metric: any) => {
    if (metric.id === 'overdue' && metric.value > 0) return 'bg-red-50 border-red-200'
    if (metric.id === 'due-today' && metric.value > 10) return 'bg-yellow-50 border-yellow-200'
    if (metric.id === 'efficiency' && metric.value < 80) return 'bg-yellow-50 border-yellow-200'
    return 'bg-green-50 border-green-200'
  }

  const getTrendIcon = (change: number) => {
    if (change > 0) return '↗️'
    if (change < 0) return '↘️'
    return '→'
  }

  return (
    <div className="space-y-3" data-testid="personal-kpis">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your Performance</h2>
        <div className="flex gap-1">
          {(['today', 'week', 'month'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeRangeChange(range)}
              className="capitalize"
              aria-pressed={timeRange === range}
              aria-label={`View ${range} performance`}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Compact KPI Bar */}
      <div className="flex items-center gap-4 overflow-x-auto">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md border cursor-pointer hover:shadow-sm transition-shadow min-w-fit ${getStatusColor(metric)}`}
            data-testid={`kpi-personal-${metric.id}`}
            onClick={() => onKPIClick?.(metric.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onKPIClick?.(metric.id)
              }
            }}
            aria-label={`View details for ${metric.label}: ${metric.value}`}
          >
            <div className={`${metric.color} flex-shrink-0`}>
              {metric.icon}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-gray-600 truncate">{metric.label}</span>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-gray-900 text-sm">{metric.value}</span>
                {metric.change !== 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    metric.change > 0 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {getTrendIcon(metric.change)} {Math.abs(metric.change)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
