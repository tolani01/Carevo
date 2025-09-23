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

interface KPIModalProps {
  isOpen: boolean
  onClose: () => void
  metricId: string
  metrics: any
}

export function KPIModal({ isOpen, onClose, metricId, metrics }: KPIModalProps) {
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
      default:
        return {
          title: 'Metric Details',
          description: 'Detailed view of selected metric',
          data: [],
          insights: []
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
