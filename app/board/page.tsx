'use client';

import { useState, useEffect } from 'react';
import { BoardColumns } from '@/components/BoardColumns';
import { FiltersBar } from '@/components/FiltersBar';
import { TaskDrawer } from '@/components/TaskDrawer';
import { WaitingReasonPrompt } from '@/components/WaitingReasonPrompt';
import { EmptyState } from '@/components/EmptyState';
import { SkeletonLoader } from '@/components/EmptyState';
import { useTasks } from '@/lib/hooks/use-tasks';
import { useUrlFilters } from '@/lib/hooks/use-url-filters';
import { useApp } from '@/components/AppProvider';

export default function BoardPage() {
  console.log('🎯 BoardPage component rendering...');
  
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showWaitingPrompt, setShowWaitingPrompt] = useState(false);
  const [waitingTaskId, setWaitingTaskId] = useState<string | null>(null);
  const [waitingTaskTitle, setWaitingTaskTitle] = useState<string>('');
  
  console.log('📊 BoardPage - Getting app context...');
  let appContext;
  try {
    appContext = useApp();
    console.log('📊 BoardPage - App context loaded successfully');
  } catch (error) {
    console.error('📊 BoardPage - App context error:', error);
    return <div className="p-4 text-red-600">Error loading app context</div>;
  }
  const { onNewTask } = appContext;
  
  console.log('📊 BoardPage - Getting filters...');
  const { filters, updateFilters, activeFiltersCount } = useUrlFilters();
  console.log('📊 BoardPage - Filters:', filters);
  
  console.log('📊 BoardPage - Getting tasks...');
  const { tasks, loading, error, assignTask, updateTaskStatus } = useTasks(filters);
  console.log('📊 BoardPage - Tasks state:', { tasks: tasks.length, loading, error });

  // Handle new task creation from URL or events
  useEffect(() => {
    const handleNewTask = () => {
      // Open TaskDrawer for new task creation
      console.log('Creating new task');
      setSelectedTask('new'); // Use 'new' as a special ID for new task creation
    };

    const handleUrlAction = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('action') === 'new-task') {
        handleNewTask();
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    };

    // Listen for new task events
    window.addEventListener('new-task', handleNewTask);
    handleUrlAction();

    return () => {
      window.removeEventListener('new-task', handleNewTask);
    };
  }, []);

  const handleTaskMove = (taskId: string, fromColumn: string, toColumn: string) => {
    if (toColumn === 'Waiting') {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        setWaitingTaskId(taskId);
        setWaitingTaskTitle(task.title);
        setShowWaitingPrompt(true);
      }
    } else {
      // Handle normal task move
      console.log('Moving task:', taskId, 'from', fromColumn, 'to', toColumn);
      // TODO: Implement actual task move
    }
  };

  const handleWaitingConfirm = (reason: string, note?: string) => {
    if (waitingTaskId) {
      console.log('Setting task to waiting:', waitingTaskId, 'reason:', reason, 'note:', note);
      // TODO: Implement actual waiting status update
      setShowWaitingPrompt(false);
      setWaitingTaskId(null);
      setWaitingTaskTitle('');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <SkeletonLoader type="card" count={6} />
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

  return (
    <div className="flex-1 flex flex-col board-page">
      {/* Filters Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <FiltersBar 
          filters={filters} 
          onFiltersChange={updateFilters}
          onSearch={(query) => updateFilters({ search: query })}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden p-6">
        {tasks.length === 0 ? (
          <EmptyState
            type={activeFiltersCount > 0 ? 'filters' : 'tasks'}
            action={activeFiltersCount > 0 ? {
              label: 'Clear Filters',
              onClick: () => updateFilters({
                assignee: 'all',
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
          <BoardColumns 
            tasks={tasks}
            onTaskSelect={setSelectedTask}
            onTaskMove={handleTaskMove}
            onTaskAssign={async (taskId, assignmentData) => {
              try {
                await assignTask(taskId, assignmentData);
                console.log('Task assigned successfully');
              } catch (error) {
                console.error('Failed to assign task:', error);
                // TODO: Show error toast
              }
            }}
            onStatusChange={async (taskId, status) => {
              try {
                await updateTaskStatus(taskId, status as any);
                console.log('Task status updated successfully');
              } catch (error) {
                console.error('Failed to update task status:', error);
                // TODO: Show error toast
              }
            }}
          />
        )}
      </main>

      {/* Task Drawer */}
      {selectedTask && (
        <TaskDrawer
          taskId={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {/* Waiting Reason Prompt */}
      <WaitingReasonPrompt
        isOpen={showWaitingPrompt}
        onClose={() => setShowWaitingPrompt(false)}
        onConfirm={handleWaitingConfirm}
        taskTitle={waitingTaskTitle}
      />
    </div>
  );
}
