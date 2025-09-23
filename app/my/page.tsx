'use client';

import { useState, useEffect } from 'react';
import { useTasks } from '@/lib/hooks/use-tasks';
import { useUrlFilters } from '@/lib/hooks/use-url-filters';
import { TaskCard } from '@/components/TaskCard';
import { TaskDrawer } from '@/components/TaskDrawer';
import { EmptyState } from '@/components/EmptyState';
import { SkeletonLoader } from '@/components/EmptyState';
import { TaskCalendar } from '@/components/TaskCalendar';
import { PersonalKPIs } from '@/components/PersonalKPIs';
import { QuickFilters } from '@/components/QuickFilters';
import { MobileTaskCard } from '@/components/MobileTaskCard';
import { Button } from '@/components/ui/button';
import { useApp } from '@/components/AppProvider';

export default function MyTasksPage() {
  console.log('🎯 MyTasksPage rendering...');
  
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');
  const [quickFilters, setQuickFilters] = useState([
    { id: 'today', label: 'Today', count: 5, active: false },
    { id: 'overdue', label: 'Overdue', count: 2, active: false },
    { id: 'this-week', label: 'This Week', count: 12, active: false },
    { id: 'high-priority', label: 'High Priority', count: 3, active: false }
  ]);
  
  const { filters, updateFilters, activeFiltersCount } = useUrlFilters();
  
  console.log('📊 MyTasksPage - Filters:', filters);
  
  const { tasks, loading, error, assignTask, updateTaskStatus } = useTasks({ ...filters, assignee: 'me' });
  
  console.log('📊 MyTasksPage - Tasks state:', { tasks: tasks.length, loading, error });
  
  let onNewTask;
  try {
    const appContext = useApp();
    onNewTask = appContext.onNewTask;
    console.log('📊 MyTasksPage - App context loaded successfully');
  } catch (error) {
    console.error('📊 MyTasksPage - App context error:', error);
    onNewTask = () => console.log('New task clicked');
  }

  // Handler functions
  const handleFilterToggle = (filterId: string) => {
    setQuickFilters(prev => 
      prev.map(f => f.id === filterId ? { ...f, active: !f.active } : f)
    )
  }

  const handleQuickAction = (action: string, task: any) => {
    console.log('Quick action:', action, task)
    // TODO: Implement quick actions
  }

  const handleDateClick = (date: Date) => {
    console.log('Date clicked:', date)
    // TODO: Filter tasks by date
  }

  const handleTaskClick = (task: any) => {
    setSelectedTask(task.id);
  }

  const handleCreateTask = (date: Date) => {
    console.log('Create task for:', date)
    // TODO: Open task creation modal with pre-filled date
  }


  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <SkeletonLoader type="card" count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 mb-2">Error loading tasks</div>
          <div className="text-sm text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  const overdueTasks = tasks.filter(task => 
    task.due_at && new Date(task.due_at) < new Date() && task.status !== 'Done'
  );

  const dueTodayTasks = tasks.filter(task => {
    if (!task.due_at) return false;
    const today = new Date();
    const dueDate = new Date(task.due_at);
    return dueDate.toDateString() === today.toDateString() && task.status !== 'Done';
  });

  // Sort tasks: Overdue → Due Today → Due Later → No Due, then last updated desc
  const sortedTasks = [...tasks].sort((a, b) => {
    const aOverdue = a.due_at && new Date(a.due_at) < new Date() && a.status !== 'Done';
    const bOverdue = b.due_at && new Date(b.due_at) < new Date() && b.status !== 'Done';
    
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    
    const aDueToday = a.due_at && new Date(a.due_at).toDateString() === new Date().toDateString() && a.status !== 'Done';
    const bDueToday = b.due_at && new Date(b.due_at).toDateString() === new Date().toDateString() && b.status !== 'Done';
    
    if (aDueToday && !bDueToday) return -1;
    if (!aDueToday && bDueToday) return 1;
    
    if (a.due_at && b.due_at) {
      return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
    }
    
    if (a.due_at && !b.due_at) return -1;
    if (!a.due_at && b.due_at) return 1;
    
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  return (
    <div className="flex-1 flex flex-col">
      {/* Personal KPIs */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <PersonalKPIs
          userId="current-user"
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
      </div>
      
      {/* View Toggle and Quick Filters */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
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
              data-testid="view-list"
            >
              List
            </Button>
            <Button
              variant={view === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('calendar')}
              data-testid="view-calendar"
            >
              Calendar
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {view === 'list' ? (
        <div className="flex-1 p-4">
          <div className="space-y-3">
            {sortedTasks.map((task) => (
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
            onTaskClick={handleTaskClick}
            onDateClick={handleDateClick}
            onCreateTask={handleCreateTask}
          />
        </div>
      )}

      {/* Header Stats */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">My Tasks</h1>
            <p className="text-sm text-gray-600">Your personal task overview</p>
          </div>
          <div className="flex items-center space-x-4">
            {overdueTasks.length > 0 && (
              <div className="text-sm text-red-600 font-medium">
                {overdueTasks.length} overdue
              </div>
            )}
            {dueTodayTasks.length > 0 && (
              <div className="text-sm text-orange-600 font-medium">
                {dueTodayTasks.length} due today
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Task Drawer */}
      {selectedTask && (
        <TaskDrawer
          taskId={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
