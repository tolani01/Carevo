'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BoardColumns } from '@/components/BoardColumns';
import { TaskDrawer } from '@/components/TaskDrawer';
import { WaitingReasonPrompt } from '@/components/WaitingReasonPrompt';
import { DueDatePicker } from '@/components/ui/due-date-picker';
import { StatusChangeModal } from '@/components/StatusChangeModal';
import { SidebarCalendar } from '@/components/SidebarCalendar';
import { DateRangeFilter } from '@/components/DateRangeFilter';
import { EmptyState } from '@/components/EmptyState';
import { SkeletonLoader } from '@/components/EmptyState';
import { KPIBar } from '@/components/KPIBar';
import { KPIModal } from '@/components/KPIModal';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useTasks } from '@/lib/hooks/use-tasks';
import { useApp } from '@/components/AppProvider';

export default function BoardPage() {
  console.log('🎯 BoardPage component rendering...');
  
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showWaitingPrompt, setShowWaitingPrompt] = useState(false);
  const [waitingTaskId, setWaitingTaskId] = useState<string | null>(null);
  const [waitingTaskTitle, setWaitingTaskTitle] = useState<string>('');
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [dueDateTaskId, setDueDateTaskId] = useState<string | null>(null);
  const [showKPIModal, setShowKPIModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [statusChangeTask, setStatusChangeTask] = useState<{
    id: string;
    title: string;
    fromStatus: string;
    toStatus: string;
  } | null>(null);
  const [showSidebarCalendar, setShowSidebarCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [activeDateFilter, setActiveDateFilter] = useState<string>('all');
  
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
  
  console.log('📊 BoardPage - Getting tasks...');


  // Calculate dynamic KPI metrics from actual task data
  const calculateKPIMetrics = (tasks: any[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(today);
    todayEnd.setDate(today.getDate() + 1);

    // Calculate completed today
    const completedToday = tasks.filter(task => 
      task.status === 'Done' && 
      task.completed_at && 
      new Date(task.completed_at) >= today && 
      new Date(task.completed_at) < todayEnd
    ).length;

    // Calculate overdue tasks
    const overdue = tasks.filter(task => 
      task.due_at && 
      new Date(task.due_at) < now && 
      task.status !== 'Done'
    ).length;

    // Calculate due today
    const dueToday = tasks.filter(task => 
      task.due_at && 
      new Date(task.due_at).toDateString() === today.toDateString() &&
      task.status !== 'Done'
    ).length;

    // Calculate average completion time (mock for now)
    const avgCompletionTime = '2.3h';

    // Calculate efficiency improvement based on completion rate
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Done').length;
    const efficiencyImprovement = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calculate completion streak (mock calculation for now)
    const calculateStreak = () => {
      // This would need actual completion history data
      // For now, return a mock streak based on completed tasks
      const completedTodayCount = completedToday;
      if (completedTodayCount > 0) return 5; // Mock streak
      return 0;
    };

    const streak = calculateStreak();

    return {
      completedToday,
      overdue,
      dueToday,
      avgCompletionTime,
      staffUtilization: 85,
      revenueAtRisk: 12400,
      hipaaIncidents: 0,
      efficiencyImprovement,
      streak
    };
  };

  // KPI click handler
  const handleKPIClick = (metricId: string) => {
    setSelectedMetric(metricId);
    setShowKPIModal(true);
  };
  
  console.log('📊 BoardPage - Getting tasks...');
  const { tasks, loading, error, assignTask, updateTaskStatus } = useTasks({
    assignee: 'all',
    type: 'all',
    status: 'all',
    location: 'all',
    due: 'all',
    dateRange: dateRange,
    activeDateFilter: activeDateFilter
  });
  console.log('📊 BoardPage - Tasks state:', { tasks: tasks.length, loading, error });

  // Calculate dynamic KPI metrics from actual task data
  const kpiMetrics = calculateKPIMetrics(tasks);

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

  const handleTaskMove = async (taskId: string, fromColumn: string, toColumn: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (toColumn === 'Waiting') {
      setWaitingTaskId(taskId);
      setWaitingTaskTitle(task.title);
      setShowWaitingPrompt(true);
    } else {
      // Show status change modal for all other moves
      setStatusChangeTask({
        id: taskId,
        title: task.title,
        fromStatus: fromColumn,
        toStatus: toColumn
      });
      setShowStatusChangeModal(true);
    }
  };

  const handleTaskClick = (taskId: string) => {
    // Navigate to the dynamic task page
    router.push(`/task/${taskId}`);
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

  const handleStatusChangeConfirm = async (comment: string) => {
    if (!statusChangeTask) return;

    try {
      await updateTaskStatus(statusChangeTask.id, statusChangeTask.toStatus as any);
      console.log(`Task ${statusChangeTask.id} moved from ${statusChangeTask.fromStatus} to ${statusChangeTask.toStatus}`, {
        comment: comment || 'No comment provided'
      });
      
      // TODO: Save the comment to the task's comment history
      // This would typically be saved to a backend API
      
      setShowStatusChangeModal(false);
      setStatusChangeTask(null);
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setActiveDateFilter('custom');
    setDateRange({ start: date, end: date });
    console.log('Selected date:', date);
  };

  const handleDateRangeSelect = (startDate: Date, endDate: Date) => {
    setDateRange({ start: startDate, end: endDate });
    setActiveDateFilter('custom');
    console.log('Selected date range:', startDate, 'to', endDate);
  };

  const handleQuickFilter = (filter: 'today' | 'week' | 'month' | 'overdue' | 'all') => {
    setActiveDateFilter(filter);
    const today = new Date();
    
    switch (filter) {
      case 'today':
        setSelectedDate(today);
        setDateRange({ start: today, end: today });
        break;
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        setDateRange({ start: weekStart, end: weekEnd });
        break;
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        setDateRange({ start: monthStart, end: monthEnd });
        break;
      case 'overdue':
        setDateRange({ start: null, end: today });
        break;
      case 'all':
        setDateRange({ start: null, end: null });
        break;
    }
    
    console.log('Quick filter applied:', filter);
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setDateRange({ start, end });
    setActiveDateFilter('custom');
    console.log('Date range changed:', start, 'to', end);
  };

  const handleSetDue = (taskId: string) => {
    setDueDateTaskId(taskId);
    setShowDueDatePicker(true);
  };

  const handleSetWaiting = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setWaitingTaskId(taskId);
      setWaitingTaskTitle(task.title);
      setShowWaitingPrompt(true);
    }
  };

  const handleDueDateConfirm = (dueDate: string) => {
    if (dueDateTaskId) {
      console.log('Setting due date for task:', dueDateTaskId, 'due date:', dueDate);
      // TODO: Implement actual due date update
      setShowDueDatePicker(false);
      setDueDateTaskId(null);
    }
  };

  // Column action handlers
  const handleAddTask = (columnId: string) => {
    console.log('Adding task to column:', columnId);
    // TODO: Open task creation modal with pre-filled column
  };

  const handleFilterColumn = (columnId: string) => {
    console.log('Filtering column:', columnId);
    // TODO: Open filter drawer with column-specific filters
  };

  const handleSelectAll = (columnId: string) => {
    console.log('Selecting all tasks in column:', columnId);
    // TODO: Select all tasks in the column
  };

  const handleExportColumn = (columnId: string) => {
    console.log('Exporting column:', columnId);
    // TODO: Export tasks from the column
  };

  const handleShowStats = (columnId: string) => {
    console.log('Showing stats for column:', columnId);
    // TODO: Show column statistics modal
  };

  const handleColumnSettings = (columnId: string) => {
    console.log('Opening settings for column:', columnId);
    // TODO: Open column settings modal
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
      {/* KPI Bar */}
      <KPIBar 
        metrics={kpiMetrics} 
        onMetricClick={handleKPIClick}
      />
      
      {/* Header with Date Filters */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
            <p className="text-sm text-gray-600 mt-1">
              {tasks.length} tasks • {tasks.filter(t => t.status === 'Done').length} completed
            </p>
          </div>
          <div className="flex items-center gap-3">
            <DateRangeFilter
              selectedRange={dateRange}
              onRangeChange={handleDateRangeChange}
              onQuickFilter={handleQuickFilter}
              activeQuickFilter={activeDateFilter}
            />
            <Button
              onClick={() => setShowSidebarCalendar(!showSidebarCalendar)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Calendar
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden p-6">
        {tasks.length === 0 ? (
          <EmptyState
            type="tasks"
            action={{
              label: 'Create Task',
              onClick: onNewTask
            }}
          />
        ) : (
          <BoardColumns 
            tasks={tasks}
            onTaskSelect={handleTaskClick}
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
            onSetDue={handleSetDue}
            onSetWaiting={handleSetWaiting}
            onAddTask={handleAddTask}
            onFilterColumn={handleFilterColumn}
            onSelectAll={handleSelectAll}
            onExportColumn={handleExportColumn}
            onShowStats={handleShowStats}
            onColumnSettings={handleColumnSettings}
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

      {/* Due Date Picker */}
      <DueDatePicker
        isOpen={showDueDatePicker}
        onClose={() => setShowDueDatePicker(false)}
        onConfirm={handleDueDateConfirm}
        taskTitle={dueDateTaskId ? tasks.find(t => t.id === dueDateTaskId)?.title : undefined}
        currentDueDate={dueDateTaskId ? tasks.find(t => t.id === dueDateTaskId)?.due_at : undefined}
      />

      {/* KPI Modal */}
      <KPIModal
        isOpen={showKPIModal}
        onClose={() => setShowKPIModal(false)}
        metricId={selectedMetric}
        metrics={kpiMetrics}
      />

      {/* Status Change Modal */}
      {statusChangeTask && (
        <StatusChangeModal
          isOpen={showStatusChangeModal}
          onClose={() => {
            setShowStatusChangeModal(false);
            setStatusChangeTask(null);
          }}
          onConfirm={handleStatusChangeConfirm}
          taskTitle={statusChangeTask.title}
          fromStatus={statusChangeTask.fromStatus}
          toStatus={statusChangeTask.toStatus}
        />
      )}

      {/* Sidebar Calendar */}
      <SidebarCalendar
        isOpen={showSidebarCalendar}
        onClose={() => setShowSidebarCalendar(false)}
        tasks={tasks}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        onDateRangeSelect={handleDateRangeSelect}
        onQuickFilter={handleQuickFilter}
        onTaskClick={handleTaskClick}
      />
    </div>
  );
}
