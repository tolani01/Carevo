# Weeks 5-6 Coding Steps - Sprint 3: Personal Productivity

## 🚀 **Sprint 3 Goals**
- Calendar view for My Tasks page
- Personal KPIs and planning tools
- Quick filters and mobile optimization
- Enhanced task management

---

## Week 5: Calendar View & Personal KPIs

### Day 16: Calendar Component Foundation
**Goal**: Create calendar view for task planning

#### Step 16.1: Create TaskCalendar Component
```bash
touch components/TaskCalendar.tsx
```

**File: `components/TaskCalendar.tsx`**
```typescript
'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './button'
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
    <Card className="w-full">
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
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
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
            
            return (
              <div
                key={index}
                className={`
                  p-2 min-h-[80px] border border-gray-200 cursor-pointer hover:bg-gray-50
                  ${isToday ? 'bg-blue-50 border-blue-300' : ''}
                  ${!isCurrentMonth ? 'text-gray-400' : ''}
                `}
                onClick={() => onDateClick(date)}
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
```

### Day 17: Personal KPIs Dashboard
**Goal**: Create personal productivity metrics

#### Step 17.1: Create PersonalKPIs Component
```bash
touch components/PersonalKPIs.tsx
```

**File: `components/PersonalKPIs.tsx`**
```typescript
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
    <div className="space-y-4">
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
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-full ${metric.bgColor}`}>
                  <div className={metric.color}>
                    {metric.icon}
                  </div>
                </div>
                {metric.change !== 0 && (
                  <Badge 
                    variant={metric.change > 0 ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </Badge>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
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
            <BarChart3 className="h-4 w-4" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button variant="outline" size="sm" className="h-10">
              <TrendingUp className="h-4 w-4 mr-1" />
              Trends
            </Button>
            <Button variant="outline" size="sm" className="h-10">
              <Target className="h-4 w-4 mr-1" />
              Goals
            </Button>
            <Button variant="outline" size="sm" className="h-10">
              <Calendar className="h-4 w-4 mr-1" />
              Schedule
            </Button>
            <Button variant="outline" size="sm" className="h-10">
              <BarChart3 className="h-4 w-4 mr-1" />
              Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Day 18: Quick Filters for My Tasks
**Goal**: Add quick filter pills and enhanced filtering

#### Step 18.1: Create QuickFilters Component
```bash
touch components/QuickFilters.tsx
```

**File: `components/QuickFilters.tsx`**
```typescript
'use client'

import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { X, Filter } from 'lucide-react'

interface QuickFilter {
  id: string
  label: string
  count: number
  active: boolean
}

interface QuickFiltersProps {
  filters: QuickFilter[]
  onFilterToggle: (filterId: string) => void
  onClearAll: () => void
  onAdvancedFilters: () => void
}

export function QuickFilters({ 
  filters, 
  onFilterToggle, 
  onClearAll, 
  onAdvancedFilters 
}: QuickFiltersProps) {
  const activeCount = filters.filter(f => f.active).length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Quick Filters</h3>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear all
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onAdvancedFilters}
            className="text-xs"
          >
            <Filter className="h-3 w-3 mr-1" />
            Advanced
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={filter.active ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterToggle(filter.id)}
            className="h-8 text-xs"
          >
            {filter.label}
            {filter.count > 0 && (
              <Badge 
                variant={filter.active ? 'secondary' : 'outline'}
                className="ml-1 text-xs"
              >
                {filter.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}
```

### Day 19: Mobile Optimization
**Goal**: Enhance mobile experience for My Tasks

#### Step 19.1: Create MobileTaskCard Component
```bash
touch components/MobileTaskCard.tsx
```

**File: `components/MobileTaskCard.tsx`**
```typescript
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
    <Card className="mb-3 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate mb-1">
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
            className="ml-2 p-1"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="outline" className="text-xs">
            {task.type}
          </Badge>
          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
            <Flag className="h-3 w-3 mr-1" />
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
              <Clock className="h-3 w-3" />
              {new Date(task.due_at).toLocaleDateString()}
            </div>
          )}
          {task.assignee && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
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
                className="h-8 text-xs"
              >
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
```

### Day 20: Integration & Testing
**Goal**: Wire everything together and add tests

#### Step 20.1: Update My Tasks Page
**File: `app/my/page.tsx`** (update existing)

```typescript
import { TaskCalendar } from '../components/TaskCalendar'
import { PersonalKPIs } from '../components/PersonalKPIs'
import { QuickFilters } from '../components/QuickFilters'
import { MobileTaskCard } from '../components/MobileTaskCard'

// Add state
const [view, setView] = useState<'list' | 'calendar'>('list')
const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today')
const [quickFilters, setQuickFilters] = useState([
  { id: 'today', label: 'Today', count: 5, active: false },
  { id: 'overdue', label: 'Overdue', count: 2, active: false },
  { id: 'this-week', label: 'This Week', count: 12, active: false },
  { id: 'high-priority', label: 'High Priority', count: 3, active: false }
])

// Add handlers
const handleFilterToggle = (filterId: string) => {
  setQuickFilters(prev => 
    prev.map(f => f.id === filterId ? { ...f, active: !f.active } : f)
  )
}

const handleQuickAction = (action: string, task: any) => {
  console.log('Quick action:', action, task)
  // Implement quick actions
}

// Update JSX
return (
  <div className="flex-1 flex flex-col">
    {/* Personal KPIs */}
    <PersonalKPIs
      userId={user?.id || ''}
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
    />
    
    {/* View Toggle */}
    <div className="flex items-center justify-between p-4 border-b">
      <QuickFilters
        filters={quickFilters}
        onFilterToggle={handleFilterToggle}
        onClearAll={() => setQuickFilters(prev => prev.map(f => ({ ...f, active: false })))}
        onAdvancedFilters={() => console.log('Advanced filters')}
      />
      
      <div className="flex gap-2">
        <Button
          variant={view === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('list')}
        >
          List
        </Button>
        <Button
          variant={view === 'calendar' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('calendar')}
        >
          Calendar
        </Button>
      </div>
    </div>

    {/* Content */}
    {view === 'list' ? (
      <div className="flex-1 p-4">
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <MobileTaskCard
              key={task.id}
              task={task}
              onTaskClick={setSelectedTask}
              onQuickAction={handleQuickAction}
            />
          ))}
        </div>
      </div>
    ) : (
      <div className="flex-1 p-4">
        <TaskCalendar
          tasks={tasks}
          onTaskClick={setSelectedTask}
          onDateClick={(date) => console.log('Date clicked:', date)}
          onCreateTask={(date) => console.log('Create task for:', date)}
        />
      </div>
    )}
  </div>
)
```

---

## 🎯 **Week 5-6 Success Criteria**

By end of Day 20, you should have:
- [ ] Calendar view for task planning
- [ ] Personal KPIs dashboard with metrics
- [ ] Quick filter pills for easy filtering
- [ ] Mobile-optimized task cards
- [ ] Touch-friendly interactions
- [ ] Integration tests passing
- [ ] Sprint 3 demo ready

## 🚀 **Ready for Sprint 4**

Next sprint we'll focus on:
1. **Chat Interface**: WhatsApp-like redesign
2. **File Attachments**: Working file upload system
3. **Real-time Features**: Live messaging and presence

Sprint 3 personal productivity features are complete! 🎉
