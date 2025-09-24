'use client'

import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Users, 
  DollarSign, 
  Shield, 
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react'

interface KPIMetric {
  id: string
  label: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'stable'
  status?: 'good' | 'warning' | 'danger'
  icon: React.ReactNode
  color: string
}

interface KPIBarProps {
  metrics: {
    completedToday: number
    overdue: number
    dueToday: number
    avgCompletionTime: string
    staffUtilization: number
    revenueAtRisk: number
    hipaaIncidents: number
    efficiencyImprovement: number
    streak: number
  }
  onMetricClick?: (metricId: string) => void
}

export function KPIBar({ metrics, onMetricClick }: KPIBarProps) {
  const kpiMetrics: KPIMetric[] = [
    {
      id: 'completed-today',
      label: 'Completed',
      value: metrics.completedToday,
      change: 12,
      trend: 'up',
      status: 'good',
      icon: <CheckCircle className="h-3 w-3" />,
      color: 'text-green-600'
    },
    {
      id: 'overdue',
      label: 'Overdue',
      value: metrics.overdue,
      change: -8,
      trend: 'down',
      status: metrics.overdue > 5 ? 'danger' : 'good',
      icon: <AlertTriangle className="h-3 w-3" />,
      color: metrics.overdue > 5 ? 'text-red-600' : 'text-green-600'
    },
    {
      id: 'due-today',
      label: 'Due Today',
      value: metrics.dueToday,
      status: metrics.dueToday > 15 ? 'danger' : metrics.dueToday > 8 ? 'warning' : 'good',
      icon: <Calendar className="h-3 w-3" />,
      color: metrics.dueToday > 15 ? 'text-red-600' : metrics.dueToday > 8 ? 'text-yellow-600' : 'text-green-600'
    },
    {
      id: 'avg-time',
      label: 'Avg Time',
      value: metrics.avgCompletionTime,
      trend: 'down',
      status: 'good',
      icon: <Clock className="h-3 w-3" />,
      color: 'text-blue-600'
    },
    {
      id: 'efficiency',
      label: 'Efficiency',
      value: `${metrics.efficiencyImprovement}%`,
      trend: 'up',
      status: 'good',
      icon: <TrendingUp className="h-3 w-3" />,
      color: 'text-green-600'
    },
    {
      id: 'streak',
      label: 'Streak',
      value: `${metrics.streak || 0} days`,
      change: 1,
      trend: 'up',
      status: 'good',
      icon: <Target className="h-3 w-3" />,
      color: 'text-purple-600'
    }
  ]

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'good': return 'bg-green-50 border-green-200'
      case 'warning': return 'bg-yellow-50 border-yellow-200'
      case 'danger': return 'bg-red-50 border-red-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return '↗️'
      case 'down': return '↘️'
      default: return '→'
    }
  }

  const getWorkloadStatus = (value: number, type: string) => {
    if (type === 'due-today') {
      if (value > 15) return { status: 'danger', message: 'High workload' }
      if (value > 8) return { status: 'warning', message: 'Moderate workload' }
      return { status: 'good', message: 'Manageable' }
    }
    if (type === 'overdue') {
      if (value > 10) return { status: 'danger', message: 'Critical' }
      if (value > 5) return { status: 'warning', message: 'Attention needed' }
      return { status: 'good', message: 'Under control' }
    }
    return { status: 'good', message: 'Good' }
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2" data-testid="kpi-bar">
      <div className="flex items-center gap-4 overflow-x-auto">
        {kpiMetrics.map((metric) => (
          <div
            key={metric.id}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md border cursor-pointer hover:shadow-sm transition-shadow min-w-fit ${getStatusColor(metric.status)}`}
            onClick={() => onMetricClick?.(metric.id)}
            data-testid={`kpi-${metric.id}`}
          >
            <div className={`${metric.color} flex-shrink-0`}>
              {metric.icon}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600 truncate">{metric.label}</span>
                {metric.id === 'due-today' && (
                  <span className={`text-xs px-1 py-0.5 rounded-full ${
                    metric.status === 'danger' ? 'bg-red-100 text-red-700' :
                    metric.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {getWorkloadStatus(metric.value as number, metric.id).message}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-gray-900 text-sm">{metric.value}</span>
                {metric.change && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    metric.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {getTrendIcon(metric.trend)} {Math.abs(metric.change)}%
                  </span>
                )}
                {metric.id === 'due-today' && (
                  <span className="text-xs text-gray-500">
                    {metric.value === 0 ? 'All caught up!' : `${metric.value} remaining`}
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
