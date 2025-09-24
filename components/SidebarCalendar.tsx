'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  X,
  Clock,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  due_at?: string | null;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status: string;
  type: string;
}

interface SidebarCalendarProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onDateRangeSelect: (startDate: Date, endDate: Date) => void;
  onQuickFilter: (filter: 'today' | 'week' | 'month' | 'overdue') => void;
  onTaskClick?: (taskId: string) => void;
}

export function SidebarCalendar({
  isOpen,
  onClose,
  tasks,
  selectedDate,
  onDateSelect,
  onDateRangeSelect,
  onQuickFilter,
  onTaskClick
}: SidebarCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.due_at) return false;
      const taskDate = new Date(task.due_at);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const getTaskCountForDate = (date: Date) => {
    return getTasksForDate(date).length;
  };

  const getTaskStatusForDate = (date: Date) => {
    const dateTasks = getTasksForDate(date);
    if (dateTasks.length === 0) return 'none';
    
    const hasOverdue = dateTasks.some(task => 
      new Date(task.due_at!) < new Date() && task.status !== 'Done'
    );
    const hasCompleted = dateTasks.some(task => task.status === 'Done');
    
    if (hasOverdue) return 'overdue';
    if (hasCompleted) return 'completed';
    return 'pending';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const today = new Date();
  const isToday = (date: Date) => date.toDateString() === today.toDateString();
  const isSelected = (date: Date) => selectedDate && date.toDateString() === selectedDate.toDateString();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-gray-200 shadow-lg z-40 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarIcon className="h-5 w-5" />
            Calendar
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* View Toggle */}
        <div className="flex gap-1 mb-4">
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('month')}
            className="flex-1"
          >
            Month
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('week')}
            className="flex-1"
          >
            Week
          </Button>
        </div>

        {/* Quick Filters */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Quick Filters</div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onQuickFilter('today')}
              className="text-xs"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onQuickFilter('week')}
              className="text-xs"
            >
              This Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onQuickFilter('month')}
              className="text-xs"
            >
              This Month
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onQuickFilter('overdue')}
              className="text-xs text-red-600"
            >
              Overdue
            </Button>
          </div>
        </div>
      </div>

        {/* Calendar Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Task Statistics */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-900 mb-2">Task Overview</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Completed: {tasks.filter(t => t.status === 'Done').length}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Pending: {tasks.filter(t => t.status === 'ToDo' || t.status === 'InProgress').length}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Overdue: {tasks.filter(t => t.due_at && new Date(t.due_at) < new Date() && t.status !== 'Done').length}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Waiting: {tasks.filter(t => t.status === 'Waiting').length}</span>
              </div>
            </div>
          </div>
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateMonth('prev')}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateMonth('next')}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-2">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1">
            {dayNames.map(day => (
              <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) {
                return <div key={index} className="h-8"></div>;
              }
              
              const taskCount = getTaskCountForDate(date);
              const taskStatus = getTaskStatusForDate(date);
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const isTodayDate = isToday(date);
              const isSelectedDate = isSelected(date);
              
              return (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className={`
                    h-8 w-8 p-0 text-xs relative
                    ${!isCurrentMonth ? 'text-gray-300' : ''}
                    ${isTodayDate ? 'bg-blue-100 text-blue-700 font-bold' : ''}
                    ${isSelectedDate ? 'bg-blue-600 text-white' : ''}
                    hover:bg-gray-100
                  `}
                  onClick={() => onDateSelect(date)}
                >
                  <span>{date.getDate()}</span>
                  
                  {/* Task indicators */}
                  {taskCount > 0 && (
                    <div className="absolute -bottom-1 -right-1 flex items-center gap-1">
                      <div className={`
                        w-2 h-2 rounded-full
                        ${taskStatus === 'overdue' ? 'bg-red-500' : ''}
                        ${taskStatus === 'completed' ? 'bg-green-500' : ''}
                        ${taskStatus === 'pending' ? 'bg-yellow-500' : ''}
                      `} />
                      {taskCount > 1 && (
                        <span className="text-xs font-bold text-gray-600">
                          {taskCount}
                        </span>
                      )}
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Task Summary */}
        {selectedDate && (
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Tasks for {selectedDate.toLocaleDateString()}
            </div>
            <div className="space-y-1">
              {getTasksForDate(selectedDate).map(task => (
                <div
                  key={task.id}
                  className={`flex items-center gap-2 text-xs p-2 bg-white rounded border ${
                    onTaskClick ? 'cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-colors' : ''
                  }`}
                  onClick={() => onTaskClick?.(task.id)}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    task.status === 'Done' ? 'bg-green-500' :
                    new Date(task.due_at!) < new Date() ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{task.title}</div>
                    <div className="text-xs text-gray-500 truncate">{task.type}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className={getPriorityColor(task.priority || 'low')} variant="outline">
                      {task.priority}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {task.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {getTasksForDate(selectedDate).length === 0 && (
                <div className="text-xs text-gray-500 text-center py-2">
                  No tasks for this date
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
