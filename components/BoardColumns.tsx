'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal } from 'lucide-react';
import { TaskCard, Task } from './TaskCard';
import { ColumnActionsMenu } from './ColumnActionsMenu';
import { cn } from '@/lib/utils';

interface BoardColumnsProps {
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
  onTaskCreate?: (column: string) => void;
  onTaskMove?: (taskId: string, fromColumn: string, toColumn: string) => void;
  onTaskAssign?: (taskId: string, assignmentData: {
    userId: string;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    note?: string;
  }) => void;
  onStatusChange?: (taskId: string, status: string) => void;
  onSetDue?: (taskId: string) => void;
  onSetWaiting?: (taskId: string) => void;
  onAddTask?: (columnId: string) => void;
  onFilterColumn?: (columnId: string) => void;
  onSelectAll?: (columnId: string) => void;
  onExportColumn?: (columnId: string) => void;
  onShowStats?: (columnId: string) => void;
  onColumnSettings?: (columnId: string) => void;
}

const columns = [
  { id: 'ToDo', title: 'To Do', color: 'bg-gray-100' },
  { id: 'InProgress', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'Waiting', title: 'Waiting', color: 'bg-orange-100' },
  { id: 'Done', title: 'Done', color: 'bg-green-100' },
];

export function BoardColumns({ 
  tasks, 
  onTaskSelect, 
  onTaskCreate, 
  onTaskMove, 
  onTaskAssign, 
  onStatusChange, 
  onSetDue, 
  onSetWaiting,
  onAddTask,
  onFilterColumn,
  onSelectAll,
  onExportColumn,
  onShowStats,
  onColumnSettings
}: BoardColumnsProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const getTasksForColumn = (columnId: string) => {
    return tasks.filter(task => task.status === columnId);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    
    if (draggedTask && onTaskMove) {
      const task = tasks.find(t => t.id === draggedTask);
      if (task && task.status !== columnId) {
        // Call the task move handler which should update the task status
        onTaskMove(draggedTask, task.status, columnId);
        
        // Also call the status change handler if available
        if (onStatusChange) {
          await onStatusChange(draggedTask, columnId);
        }
      }
    }
    
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const getColumnStats = (columnId: string) => {
    const columnTasks = getTasksForColumn(columnId);
    const overdue = columnTasks.filter(task => 
      task.due_at && new Date(task.due_at) < new Date() && task.status !== 'Done'
    ).length;
    const dueToday = columnTasks.filter(task => {
      if (!task.due_at) return false;
      const today = new Date();
      const dueDate = new Date(task.due_at);
      return dueDate.toDateString() === today.toDateString() && task.status !== 'Done';
    }).length;

    return { total: columnTasks.length, overdue, dueToday };
  };

  return (
    <div className="flex h-full space-x-6 p-6">
      {columns.map((column) => {
        const columnTasks = getTasksForColumn(column.id);
        const stats = getColumnStats(column.id);
        
        return (
          <div
            key={column.id}
            className={cn(
              "flex-1 min-w-80",
              "task-column"
            )}
            data-testid={`column-${column.id.toLowerCase()}`}
          >
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-sm font-medium text-gray-700">
                      {column.title}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {stats.total}
                    </Badge>
                    {stats.overdue > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {stats.overdue} overdue
                      </Badge>
                    )}
                    {stats.dueToday > 0 && (
                      <Badge variant="warning" className="text-xs">
                        {stats.dueToday} due today
                      </Badge>
                    )}
                  </div>
                  <ColumnActionsMenu
                    columnId={column.id}
                    columnTitle={column.title}
                    taskCount={stats.total}
                    onAddTask={onAddTask || (() => {})}
                    onFilterColumn={onFilterColumn || (() => {})}
                    onSelectAll={onSelectAll || (() => {})}
                    onExportColumn={onExportColumn || (() => {})}
                    onShowStats={onShowStats || (() => {})}
                    onColumnSettings={onColumnSettings || (() => {})}
                  />
                </div>
              </CardHeader>
              
              <CardContent
                className={cn(
                  "flex-1 space-y-3 min-h-96",
                  dragOverColumn === column.id && "drop-zone drag-over",
                  column.color
                )}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className={cn(
                      draggedTask === task.id && "dragging opacity-50"
                    )}
                  >
                    <TaskCard
                      task={task}
                      onClick={() => onTaskSelect(task.id)}
                      showQuickActions
                      onStatusChange={onStatusChange}
                      onAssign={onTaskAssign}
                      onSetDue={onSetDue}
                      onSetWaiting={onSetWaiting}
                    />
                  </div>
                ))}
                
                {columnTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                    <div className="text-sm">No tasks in {column.title.toLowerCase()}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onTaskCreate?.(column.id)}
                      className="mt-2"
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add task
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

