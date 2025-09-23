'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react'

interface Task {
  id: string
  title: string
  due_at?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: string
  type: string
}

interface TaskCalendarProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onDateClick: (date: Date) => void
  onCreateTask: (date: Date) => void
}

export function TaskCalendar({ tasks, onTaskClick, onDateClick, onCreateTask }: TaskCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.due_at) return false
      const taskDate = new Date(task.due_at)
      return taskDate.toDateString() === date.toDateString()
    })
  }

  const getTaskCountForDate = (date: Date) => {
    return getTasksForDate(date).length
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const days = getDaysInMonth(currentDate)
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <Card className="w-full" data-testid="task-calendar">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Task Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('month')}
            >
              Month
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('week')}
            >
              Week
            </Button>
            <Button
              variant={view === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('day')}
            >
              Day
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateMonth('prev')}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateMonth('next')}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-7 gap-1" role="grid" aria-label="Calendar">
          {/* Day headers */}
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500" role="columnheader">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="p-2"></div>
            }
            
            const taskCount = getTaskCountForDate(date)
            const isToday = date.toDateString() === new Date().toDateString()
            const isCurrentMonth = date.getMonth() === currentDate.getMonth()
            const dateString = date.toISOString().split('T')[0]
            
            return (
              <div
                key={index}
                className={`
                  p-2 min-h-[80px] border border-gray-200 cursor-pointer hover:bg-gray-50
                  ${isToday ? 'bg-blue-50 border-blue-300' : ''}
                  ${!isCurrentMonth ? 'text-gray-400' : ''}
                `}
                onClick={() => onDateClick(date)}
                role="gridcell"
                tabIndex={0}
                aria-label={`${date.toLocaleDateString()}${taskCount > 0 ? `, ${taskCount} tasks` : ''}`}
                data-testid={`calendar-day-${dateString}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onDateClick(date)
                  }
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm ${isToday ? 'font-bold text-blue-600' : ''}`}>
                    {date.getDate()}
                  </span>
                  {taskCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {taskCount}
                    </Badge>
                  )}
                </div>
                
                {/* Task previews */}
                <div className="space-y-1">
                  {getTasksForDate(date).slice(0, 2).map(task => (
                    <div
                      key={task.id}
                      className={`
                        text-xs p-1 rounded truncate cursor-pointer
                        ${getPriorityColor(task.priority)}
                      `}
                      onClick={(e) => {
                        e.stopPropagation()
                        onTaskClick(task)
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Task: ${task.title}, priority: ${task.priority}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          e.stopPropagation()
                          onTaskClick(task)
                        }
                      }}
                    >
                      {task.title}
                    </div>
                  ))}
                  {getTasksForDate(date).length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{getTasksForDate(date).length - 2} more
                    </div>
                  )}
                </div>
                
                {/* Add task button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-6 mt-1 opacity-0 hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    onCreateTask(date)
                  }}
                  aria-label={`Add task for ${date.toLocaleDateString()}`}
                  data-testid={`calendar-add-${dateString}`}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
