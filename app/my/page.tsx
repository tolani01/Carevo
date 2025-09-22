'use client';

import { useState, useEffect } from 'react';
import { useTasks } from '@/lib/hooks/use-tasks';
import { useUrlFilters } from '@/lib/hooks/use-url-filters';
import { TaskCard } from '@/components/TaskCard';
import { TaskDrawer } from '@/components/TaskDrawer';
import { EmptyState } from '@/components/EmptyState';
import { SkeletonLoader } from '@/components/EmptyState';
import { useApp } from '@/components/AppProvider';

export default function MyTasksPage() {
  console.log('🎯 MyTasksPage rendering...');
  
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
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

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {sortedTasks.length === 0 ? (
          <EmptyState
            type={activeFiltersCount > 0 ? 'filters' : 'tasks'}
            title="No tasks assigned to you"
            description={activeFiltersCount > 0 
              ? "No tasks match your current filters. Try adjusting your search criteria."
              : "You don't have any tasks assigned to you yet. Ask your team to assign you some tasks or create your own."
            }
            action={activeFiltersCount > 0 ? {
              label: 'Clear Filters',
              onClick: () => updateFilters({
                assignee: 'me',
                type: 'all',
                status: 'all',
                location: 'all',
                due: 'all',
                search: ''
              })
            } : {
              label: 'Create Task',
              onClick: onNewTask
            }}
          />
        ) : (
          <div className="space-y-4">
            {sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => setSelectedTask(task.id)}
                showQuickActions
                onStatusChange={async (taskId, status) => {
                  try {
                    await updateTaskStatus(taskId, status as any);
                    console.log('Task status updated successfully');
                  } catch (error) {
                    console.error('Failed to update task status:', error);
                    // TODO: Show error toast
                  }
                }}
                onAssign={async (taskId, assignmentData) => {
                  try {
                    await assignTask(taskId, assignmentData);
                    console.log('Task assigned successfully');
                  } catch (error) {
                    console.error('Failed to assign task:', error);
                    // TODO: Show error toast
                  }
                }}
                onSetDue={(taskId) => {
                  console.log('Set due:', taskId);
                  // TODO: Implement actual due date setting
                }}
                onSetWaiting={(taskId) => {
                  console.log('Set waiting:', taskId);
                  // TODO: Implement actual waiting status
                }}
              />
            ))}
          </div>
        )}
      </main>

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
