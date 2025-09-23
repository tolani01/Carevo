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

interface PersonalKPIsProps {
  userId: string
  timeRange: 'today' | 'week' | 'month'
  onTimeRangeChange: (range: 'today' | 'week' | 'month') => void
}

export function PersonalKPIs({ userId, timeRange, onTimeRangeChange }: PersonalKPIsProps) {
  // Mock data - replace with real API calls
  const kpiData = {
    today: {
      completed: 8,
      overdue: 2,
      dueToday: 5,
      avgTime: '1.8h',
      efficiency: 92,
      streak: 5
    },
    week: {
      completed: 47,
      overdue: 3,
      dueToday: 12,
      avgTime: '2.1h',
      efficiency: 88,
      streak: 5
    },
    month: {
      completed: 180,
      overdue: 8,
      dueToday: 45,
      avgTime: '2.3h',
      efficiency: 85,
      streak: 5
    }
  }

  const data = kpiData[timeRange]

  const metrics = [
    {
      id: 'completed',
      label: 'Completed',
      value: data.completed,
      icon: <CheckCircle className="h-4 w-4" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: timeRange === 'today' ? 12 : timeRange === 'week' ? 8 : 5
    },
    {
      id: 'overdue',
      label: 'Overdue',
      value: data.overdue,
      icon: <Clock className="h-4 w-4" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: timeRange === 'today' ? -2 : timeRange === 'week' ? -1 : 0
    },
    {
      id: 'due-today',
      label: 'Due Today',
      value: data.dueToday,
      icon: <Calendar className="h-4 w-4" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: 0
    },
    {
      id: 'avg-time',
      label: 'Avg Time',
      value: data.avgTime,
      icon: <Clock className="h-4 w-4" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: timeRange === 'today' ? -15 : timeRange === 'week' ? -8 : -5
    },
    {
      id: 'efficiency',
      label: 'Efficiency',
      value: `${data.efficiency}%`,
      icon: <Zap className="h-4 w-4" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: timeRange === 'today' ? 5 : timeRange === 'week' ? 3 : 2
    },
    {
      id: 'streak',
      label: 'Streak',
      value: `${data.streak} days`,
      icon: <Target className="h-4 w-4" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      change: 1
    }
  ]

  return (
    <div className="space-y-4" data-testid="personal-kpis">
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

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card 
            key={metric.id} 
            className="hover:shadow-md transition-shadow"
            data-testid={`kpi-personal-${metric.id}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-full ${metric.bgColor}`}>
                  <div className={metric.color} aria-hidden="true">
                    {metric.icon}
                  </div>
                </div>
                {metric.change !== 0 && (
                  <Badge 
                    variant={metric.change > 0 ? 'default' : 'secondary'}
                    className="text-xs"
                    aria-label={`${metric.change > 0 ? 'Increase' : 'Decrease'} of ${Math.abs(metric.change)}%`}
                  >
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </Badge>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900" aria-label={`${metric.value} ${metric.label.toLowerCase()}`}>
                  {metric.value}
                </p>
                <p className="text-sm text-gray-600">{metric.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button variant="outline" size="sm" className="h-10" aria-label="View performance trends">
              <TrendingUp className="h-4 w-4 mr-1" aria-hidden="true" />
              Trends
            </Button>
            <Button variant="outline" size="sm" className="h-10" aria-label="Set personal goals">
              <Target className="h-4 w-4 mr-1" aria-hidden="true" />
              Goals
            </Button>
            <Button variant="outline" size="sm" className="h-10" aria-label="View schedule">
              <Calendar className="h-4 w-4 mr-1" aria-hidden="true" />
              Schedule
            </Button>
            <Button variant="outline" size="sm" className="h-10" aria-label="Generate reports">
              <BarChart3 className="h-4 w-4 mr-1" aria-hidden="true" />
              Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
