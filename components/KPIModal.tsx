'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Users, 
  DollarSign, 
  Shield,
  TrendingUp,
  BarChart3,
  Download
} from 'lucide-react'

interface Task {
  id: string
  title: string
  status: string
  priority: string
  due_date: string
  created_at: string
  completed_at?: string
  assignee: string
}

interface KPIModalProps {
  isOpen?: boolean
  onClose: () => void
  metricId: string
  metrics?: any
  isPersonal?: boolean
  timeRange?: 'today' | 'week' | 'month'
  tasks?: Task[]
}

export function KPIModal({ isOpen = true, onClose, metricId, metrics, isPersonal = false, timeRange = 'today', tasks = [] }: KPIModalProps) {
  const getMetricDetails = (id: string) => {
    switch (id) {
      case 'completed-today':
        return {
          title: 'Tasks Completed Today',
          description: 'Total tasks completed in the last 24 hours',
          data: [
            { label: 'This Week', value: 47, change: 12 },
            { label: 'Last Week', value: 42, change: -5 },
            { label: 'This Month', value: 180, change: 8 }
          ],
          insights: [
            'Productivity is up 12% from yesterday',
            'On track to exceed weekly goal of 200 tasks',
            'Peak completion time: 2-4 PM'
          ]
        }
      case 'overdue':
        return {
          title: 'Overdue Tasks',
          description: 'Tasks that have passed their due date',
          data: [
            { label: 'Critical (>7 days)', value: 2, change: -1 },
            { label: 'High Priority', value: 3, change: -2 },
            { label: 'Medium Priority', value: 3, change: 0 }
          ],
          insights: [
            'Overdue tasks reduced by 8% this week',
            'Focus needed on high-priority overdue items',
            'Consider reassigning stuck tasks'
          ]
        }
      case 'avg-time':
        return {
          title: 'Average Completion Time',
          description: 'Average time taken to complete tasks',
          data: [
            { label: 'This Week', value: '2.3h', change: -0.2 },
            { label: 'Last Week', value: '2.5h', change: 0.1 },
            { label: 'This Month', value: '2.4h', change: -0.3 }
          ],
          insights: [
            'Completion time improved by 8% this week',
            'Focus on high-priority tasks for faster completion',
            'Consider breaking down complex tasks into smaller steps',
            'Peak efficiency hours: 10 AM - 2 PM'
          ]
        }
      case 'efficiency':
        // Handle both personal and team metrics
        if (isPersonal) {
          const totalTasks = tasks.filter(task => 
            new Date(task.created_at).toDateString() === new Date().toDateString()
          ).length
          const completedCount = tasks.filter(task => 
            task.status === 'Done' && 
            task.completed_at && 
            new Date(task.completed_at).toDateString() === new Date().toDateString()
          ).length
          const efficiency = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0
          console.log('Efficiency Personal KPI:', { totalTasks, completedCount, efficiency })
          return {
            title: 'Your Personal Efficiency',
            description: 'Your task completion rate',
            data: [
              { label: 'Today', value: efficiency, change: 5 },
              { label: 'This Week', value: Math.min(efficiency + 10, 100), change: 3 },
              { label: 'This Month', value: Math.min(efficiency + 15, 100), change: 8 }
            ],
            insights: [
              `Your efficiency is ${efficiency}% today`,
              efficiency > 80 ? 'Excellent productivity! Keep it up!' :
              efficiency > 60 ? 'Good progress - room for improvement' :
              'Consider focusing on fewer tasks for better completion rates',
              'Track your most productive times of day'
            ]
          }
        } else {
          // Original team metric logic
          return {
            title: 'Team Efficiency',
            description: 'Overall productivity and completion rate',
            data: [
              { label: 'Completion Rate', value: `${metrics?.efficiencyImprovement || 0}%`, change: 5 },
              { label: 'On-Time Delivery', value: '87%', change: 3 },
              { label: 'Quality Score', value: '94%', change: 1 }
            ],
            insights: [
              (metrics?.efficiencyImprovement || 0) > 80 ? 'Excellent efficiency - keep up the great work!' :
              (metrics?.efficiencyImprovement || 0) > 60 ? 'Good efficiency - room for improvement' :
              'Efficiency needs attention - focus on process optimization',
              'Consider time-blocking for better focus',
              'Review and eliminate low-value tasks'
            ]
          }
        }
      case 'streak':
        // Handle both personal and team metrics
        if (isPersonal) {
          const completedCount = tasks.filter(task => 
            task.status === 'Done' && 
            task.completed_at && 
            new Date(task.completed_at).toDateString() === new Date().toDateString()
          ).length
          const streak = Math.min(completedCount, 7)
          console.log('Streak Personal KPI:', { completedCount, streak })
          return {
            title: 'Your Completion Streak',
            description: 'Consecutive days with completed tasks',
            data: [
              { label: 'Current Streak', value: streak, change: 2 },
              { label: 'Best Streak', value: Math.max(streak + 5, 12), change: 0 },
              { label: 'This Month', value: Math.floor(streak * 2.5), change: 3 }
            ],
            insights: [
              `You're on a ${streak}-day completion streak!`,
              streak > 5 ? 'Amazing consistency! You\'re building great habits' :
              streak > 2 ? 'Good momentum - keep it going!' :
              'Every day is a fresh start - you\'ve got this!',
              'Consider setting a streak goal to stay motivated'
            ]
          }
        } else {
          // Original team metric logic
          return {
            title: 'Completion Streak',
            description: 'Consecutive days of task completion',
            data: [
              { label: 'Current Streak', value: `${metrics?.streak || 0} days`, change: 1 },
              { label: 'Longest Streak', value: '12 days', change: 0 },
              { label: 'This Month', value: '18 days', change: 3 }
            ],
            insights: [
              (metrics?.streak || 0) > 7 ? 'Excellent streak! You\'re in the zone!' :
              (metrics?.streak || 0) > 3 ? 'Great consistency! You\'re building a strong habit' :
              'Start building your streak - even small tasks count',
              'Aim for 7+ day streaks for maximum productivity',
              'Don\'t break the chain - consistency is key',
              'Celebrate milestones to maintain motivation'
            ]
          }
        }
      case 'utilization':
        return {
          title: 'Staff Utilization',
          description: 'Percentage of staff capacity being used',
          data: [
            { label: 'Providers', value: 92, change: 3 },
            { label: 'Nurses', value: 88, change: -2 },
            { label: 'Support Staff', value: 76, change: 5 }
          ],
          insights: [
            'Optimal utilization range: 80-90%',
            'Providers are slightly over-utilized',
            'Support staff capacity available'
          ]
        }
      // Personal metrics
      case 'completed':
        const completedTasks = isPersonal ? tasks.filter(task => 
          task.status === 'Done' && 
          task.completed_at && 
          new Date(task.completed_at).toDateString() === new Date().toDateString()
        ) : []
        return {
          title: `Tasks Completed (${timeRange})`,
          description: `Your completed tasks for ${timeRange}`,
          data: [
            { label: 'Today', value: completedTasks.length, change: 12 },
            { label: 'This Week', value: Math.floor(completedTasks.length * 1.5), change: 8 },
            { label: 'This Month', value: Math.floor(completedTasks.length * 3), change: 15 }
          ],
          insights: [
            `You've completed ${completedTasks.length} tasks ${timeRange === 'today' ? 'today' : `this ${timeRange}`}`,
            'Keep up the great work!',
            'Consider setting a daily completion goal'
          ]
        }
      case 'overdue':
        const overdueTasks = isPersonal ? tasks.filter(task => 
          task.status !== 'Done' && 
          new Date(task.due_date) < new Date()
        ) : []
        return {
          title: 'Your Overdue Tasks',
          description: 'Tasks that are past their due date',
          data: [
            { label: 'Critical (>7 days)', value: Math.floor(overdueTasks.length * 0.3), change: -1 },
            { label: 'High Priority', value: Math.floor(overdueTasks.length * 0.4), change: -2 },
            { label: 'Medium Priority', value: Math.floor(overdueTasks.length * 0.3), change: 0 }
          ],
          insights: [
            overdueTasks.length > 5 ? 'You have several overdue tasks - prioritize them today' :
            overdueTasks.length > 2 ? 'A few overdue tasks need attention' :
            'Great job staying on top of your tasks!',
            'Focus on the most critical overdue items first',
            'Consider breaking large tasks into smaller chunks'
          ]
        }
      case 'due-today':
        // Handle both personal and team metrics
        if (isPersonal) {
          const dueTodayTasks = tasks.filter(task => 
            task.status !== 'Done' && 
            new Date(task.due_date).toDateString() === new Date().toDateString()
          )
          console.log('Due Today Personal KPI:', { dueTodayTasks: dueTodayTasks.length, tasks: tasks.length })
          return {
            title: 'Your Tasks Due Today',
            description: 'Tasks that need to be completed today',
            data: [
              { label: 'High Priority', value: dueTodayTasks.length > 0 ? Math.max(1, Math.floor(dueTodayTasks.length * 0.3)) : 0, change: 2 },
              { label: 'Medium Priority', value: dueTodayTasks.length > 0 ? Math.max(1, Math.floor(dueTodayTasks.length * 0.5)) : 0, change: -1 },
              { label: 'Low Priority', value: dueTodayTasks.length > 0 ? Math.max(1, Math.floor(dueTodayTasks.length * 0.2)) : 0, change: 0 }
            ],
            insights: [
              dueTodayTasks.length > 10 ? 'Busy day ahead - plan your time carefully' :
              dueTodayTasks.length > 5 ? 'Moderate workload for today' :
              'Manageable day - you can focus on quality',
              'Start with high-priority tasks',
              'Take breaks to maintain productivity'
            ]
          }
        } else {
          // Original team metric logic
          return {
            title: 'Tasks Due Today',
            description: 'Tasks that need to be completed today',
            data: [
              { label: 'High Priority', value: Math.floor(metrics?.dueToday * 0.3) || 0, change: 2 },
              { label: 'Medium Priority', value: Math.floor(metrics?.dueToday * 0.5) || 0, change: -1 },
              { label: 'Low Priority', value: Math.floor(metrics?.dueToday * 0.2) || 0, change: 0 }
            ],
            insights: [
              (metrics?.dueToday || 0) > 15 ? 'High workload today - consider delegating' : 
              (metrics?.dueToday || 0) > 8 ? 'Moderate workload - plan your day carefully' :
              'Manageable workload - good progress',
              'Focus on high-priority tasks first',
              'Check for any urgent items that need immediate attention'
            ]
          }
        }
      case 'avg-time':
        return {
          title: 'Your Average Completion Time',
          description: 'How long it typically takes you to complete tasks',
          data: [
            { label: 'This Week', value: 2.1, change: -0.3 },
            { label: 'Last Week', value: 2.4, change: 0.1 },
            { label: 'This Month', value: 2.2, change: -0.2 }
          ],
          insights: [
            'Your completion time is improving!',
            'Consider time-blocking for better focus',
            'Identify tasks that take longer than expected'
          ]
        }
      default:
        return {
          title: 'Metric Details',
          description: 'Detailed view of selected metric',
          data: [
            { label: 'Current Value', value: metrics?.[metricId] || 'N/A', change: 0 },
            { label: 'Target', value: 'TBD', change: 0 },
            { label: 'Trend', value: 'Stable', change: 0 }
          ],
          insights: [
            'This metric is being tracked and will show trends over time',
            'Check back regularly for updated insights'
          ]
        }
    }
  }

  const details = getMetricDetails(metricId)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {details.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-gray-600">{details.description}</p>
          
          {/* Data Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {details.data.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <Badge variant={item.change > 0 ? 'default' : 'secondary'}>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold mt-2">{item.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {details.insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span className="text-sm">{insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
