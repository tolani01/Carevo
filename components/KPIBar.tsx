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
  }
  onMetricClick?: (metricId: string) => void
}

export function KPIBar({ metrics, onMetricClick }: KPIBarProps) {
  const kpiMetrics: KPIMetric[] = [
    {
      id: 'completed-today',
      label: 'Completed Today',
      value: metrics.completedToday,
      change: 12,
      trend: 'up',
      status: 'good',
      icon: <CheckCircle className="h-4 w-4" />,
      color: 'text-green-600'
    },
    {
      id: 'overdue',
      label: 'Overdue',
      value: metrics.overdue,
      change: -8,
      trend: 'down',
      status: metrics.overdue > 5 ? 'danger' : 'good',
      icon: <AlertTriangle className="h-4 w-4" />,
      color: metrics.overdue > 5 ? 'text-red-600' : 'text-green-600'
    },
    {
      id: 'due-today',
      label: 'Due Today',
      value: metrics.dueToday,
      status: metrics.dueToday > 20 ? 'warning' : 'good',
      icon: <Calendar className="h-4 w-4" />,
      color: metrics.dueToday > 20 ? 'text-yellow-600' : 'text-blue-600'
    },
    {
      id: 'avg-time',
      label: 'Avg Time',
      value: metrics.avgCompletionTime,
      trend: 'down',
      status: 'good',
      icon: <Clock className="h-4 w-4" />,
      color: 'text-blue-600'
    },
    {
      id: 'utilization',
      label: 'Staff Utilization',
      value: `${metrics.staffUtilization}%`,
      status: metrics.staffUtilization > 90 ? 'warning' : 'good',
      icon: <Users className="h-4 w-4" />,
      color: metrics.staffUtilization > 90 ? 'text-yellow-600' : 'text-green-600'
    },
    {
      id: 'revenue-risk',
      label: 'Revenue at Risk',
      value: `$${(metrics.revenueAtRisk / 1000).toFixed(1)}K`,
      status: metrics.revenueAtRisk > 10000 ? 'danger' : 'good',
      icon: <DollarSign className="h-4 w-4" />,
      color: metrics.revenueAtRisk > 10000 ? 'text-red-600' : 'text-green-600'
    },
    {
      id: 'hipaa',
      label: 'HIPAA Incidents',
      value: metrics.hipaaIncidents,
      status: metrics.hipaaIncidents > 0 ? 'danger' : 'good',
      icon: <Shield className="h-4 w-4" />,
      color: metrics.hipaaIncidents > 0 ? 'text-red-600' : 'text-green-600'
    },
    {
      id: 'efficiency',
      label: 'Efficiency',
      value: `+${metrics.efficiencyImprovement}%`,
      trend: 'up',
      status: 'good',
      icon: <TrendingUp className="h-4 w-4" />,
      color: 'text-green-600'
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

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3" data-testid="kpi-bar">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 overflow-x-auto">
          {kpiMetrics.map((metric) => (
            <div
              key={metric.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow min-w-fit ${getStatusColor(metric.status)}`}
              onClick={() => onMetricClick?.(metric.id)}
              data-testid={`kpi-${metric.id}`}
            >
              <div className={metric.color}>
                {metric.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-600">{metric.label}</span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">{metric.value}</span>
                  {metric.change && (
                    <Badge 
                      variant={metric.trend === 'up' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {getTrendIcon(metric.trend)} {Math.abs(metric.change)}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Target className="h-4 w-4 mr-1" />
            Goals
          </Button>
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            Trends
          </Button>
        </div>
      </div>
    </div>
  )
}
