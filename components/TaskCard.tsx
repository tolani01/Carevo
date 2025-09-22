'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TaskAssignmentModal } from '@/components/TaskAssignmentModal';
import { 
  Calendar, 
  User, 
  Clock, 
  MoreVertical, 
  CheckCircle2, 
  Pause, 
  Edit,
  FileText,
  AlertTriangle,
  Zap,
  Shield,
  UserCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { User as UserType } from '@/lib/types/users';

export interface Task {
  id: string;
  title: string;
  type: 'Refill' | 'PA' | 'Lab' | 'Callback' | 'Billing' | 'Other';
  status: 'ToDo' | 'InProgress' | 'Waiting' | 'Done';
  due_at?: string | null;
  assignee?: {
    id: string;
    name: string;
    email?: string;
    role?: string;
    department?: string;
  };
  assigned_by?: {
    id: string;
    name: string;
  };
  assigned_at?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignment_note?: string;
  patient_ref?: string | null;
  location?: string | null;
  waiting_reason?: string | null;
  labels: string[];
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
}

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  showQuickActions?: boolean;
  onStatusChange?: (taskId: string, status: string) => void;
  onAssign?: (taskId: string, assignmentData: {
    userId: string;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    note?: string;
  }) => void;
  onSetDue?: (taskId: string) => void;
  onSetWaiting?: (taskId: string) => void;
}

const typeColors = {
  Refill: 'bg-blue-100 text-blue-800',
  PA: 'bg-green-100 text-green-800',
  Lab: 'bg-purple-100 text-purple-800',
  Callback: 'bg-orange-100 text-orange-800',
  Billing: 'bg-red-100 text-red-800',
  Other: 'bg-gray-100 text-gray-800',
};

const statusColors = {
  ToDo: 'bg-gray-100 text-gray-800',
  InProgress: 'bg-blue-100 text-blue-800',
  Waiting: 'bg-orange-100 text-orange-800',
  Done: 'bg-green-100 text-green-800',
};

export function TaskCard({ 
  task, 
  onClick, 
  showQuickActions = false, 
  onStatusChange, 
  onAssign, 
  onSetDue, 
  onSetWaiting 
}: TaskCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const isOverdue = task.due_at && new Date(task.due_at) < new Date() && task.status !== 'Done';
  const isDueToday = task.due_at && new Date(task.due_at).toDateString() === new Date().toDateString();

  const handleQuickAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const handleAssign = (assignmentData: {
    userId: string;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    note?: string;
  }) => {
    onAssign?.(task.id, assignmentData);
    setShowAssignmentModal(false);
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return <Zap className="h-3 w-3" />;
      case 'high':
        return <AlertTriangle className="h-3 w-3" />;
      case 'medium':
        return <Clock className="h-3 w-3" />;
      case 'low':
        return <Calendar className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'admin':
      case 'owner':
        return <Shield className="h-3 w-3" />;
      default:
        return <UserCircle className="h-3 w-3" />;
    }
  };

  return (
    <Card 
      className={cn(
        "task-card cursor-pointer transition-all duration-200 hover:shadow-md",
        isOverdue && "border-red-200 bg-red-50",
        isDueToday && !isOverdue && "border-orange-200 bg-orange-50"
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Task: ${task.title}. Status: ${task.status}. Due: ${task.due_at ? new Date(task.due_at).toLocaleDateString() : 'No due date'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header with type and status */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <Badge className={typeColors[task.type]}>
                {task.type}
              </Badge>
              <Badge variant="outline" className={statusColors[task.status]}>
                {task.status}
              </Badge>
            </div>
            {showQuickActions && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(!showActions);
                  }}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
                {showActions && (
                  <div className="absolute right-0 top-8 z-10 w-48 rounded-md border bg-white shadow-lg">
                    <div className="py-1">
                      <button
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={(e) => handleQuickAction(e, () => setShowAssignmentModal(true))}
                      >
                        <User className="mr-2 h-4 w-4" />
                        {task.assignee ? 'Reassign' : 'Assign'}
                      </button>
                      <button
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={(e) => handleQuickAction(e, () => onSetDue?.(task.id))}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Set Due Date
                      </button>
                      {task.status === 'InProgress' && (
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={(e) => handleQuickAction(e, () => onSetWaiting?.(task.id))}
                        >
                          <Pause className="mr-2 h-4 w-4" />
                          Set Waiting
                        </button>
                      )}
                      {task.status !== 'Done' && (
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={(e) => handleQuickAction(e, () => onStatusChange?.(task.id, 'Done'))}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark Done
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="font-medium text-gray-900 line-clamp-2">
            {task.title}
          </h3>

          {/* Patient reference */}
          {task.patient_ref && (
            <div className="flex items-center text-sm text-gray-600">
              <FileText className="mr-1 h-4 w-4" />
              {task.patient_ref}
            </div>
          )}

          {/* Due date */}
          {task.due_at && (
            <div className={cn(
              "flex items-center text-sm",
              isOverdue ? "text-red-600" : isDueToday ? "text-orange-600" : "text-gray-600"
            )}>
              <Calendar className="mr-1 h-4 w-4" />
              {new Date(task.due_at).toLocaleDateString()}
              {isOverdue && " (Overdue)"}
              {isDueToday && !isOverdue && " (Due Today)"}
            </div>
          )}

          {/* Assignee and Priority */}
          <div className="flex items-center justify-between">
            {task.assignee && (
              <div className="flex items-center text-sm text-gray-600">
                <User className="mr-1 h-4 w-4" />
                <span className="truncate">{task.assignee.name}</span>
                {task.assignee.role && (
                  <Badge className="ml-2 text-xs bg-gray-100 text-gray-600">
                    {getRoleIcon(task.assignee.role)}
                    <span className="ml-1">{task.assignee.role}</span>
                  </Badge>
                )}
              </div>
            )}
            {task.priority && (
              <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
                {getPriorityIcon(task.priority)}
                <span className="ml-1 capitalize">{task.priority}</span>
              </Badge>
            )}
          </div>

          {/* Location */}
          {task.location && (
            <div className="text-sm text-gray-600">
              📍 {task.location}
            </div>
          )}

          {/* Waiting reason */}
          {task.status === 'Waiting' && task.waiting_reason && (
            <div className="text-sm text-orange-700 bg-orange-100 px-2 py-1 rounded">
              Waiting: {task.waiting_reason}
            </div>
          )}

          {/* Labels */}
          {task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.labels.map((label, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {label}
                </Badge>
              ))}
            </div>
          )}

          {/* Footer with creation time */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              {new Date(task.created_at).toLocaleDateString()}
            </div>
            {task.completed_at && (
              <div className="text-green-600">
                Completed {new Date(task.completed_at).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Task Assignment Modal */}
      <TaskAssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        onAssign={handleAssign}
        taskTitle={task.title}
        currentAssignee={task.assignee ? {
          id: task.assignee.id,
          name: task.assignee.name,
          email: task.assignee.email || '',
          role: task.assignee.role as any || 'provider',
          department: task.assignee.department || ''
        } : undefined}
      />
    </Card>
  );
}

