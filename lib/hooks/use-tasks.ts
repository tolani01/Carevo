'use client';

import { useState, useEffect, useMemo } from 'react';
import { User, mockUsers } from '@/lib/types/users';

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

interface UseTasksProps {
  assignee: string;
  type: string;
  status: string;
  location: string;
  due: string;
}

export function useTasks(filters: UseTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, [
    filters.assignee,
    filters.type,
    filters.status,
    filters.location,
    filters.due
  ]);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock task data with current dates
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const twoDaysAgo = new Date(now);
        twoDaysAgo.setDate(now.getDate() - 2);
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        const nextWeek = new Date(now);
        nextWeek.setDate(now.getDate() + 7);

        const mockTasks: Task[] = [
          {
            id: '1',
            title: 'Patient follow-up for medication refill',
            type: 'Refill',
            status: 'InProgress',
            due_at: yesterday.toISOString(),
            assignee: { id: '1', name: 'Dr. Smith' },
            patient_ref: 'J.S. 08/14',
            location: 'Main Clinic',
            labels: ['urgent', 'medication'],
            created_at: '2024-01-10T10:00:00Z',
            updated_at: '2024-01-12T14:30:00Z'
          },
          {
            id: '2',
            title: 'Prior authorization for MRI',
            type: 'PA',
            status: 'Waiting',
            due_at: twoDaysAgo.toISOString(),
            assignee: { id: '2', name: 'Dr. Johnson' },
            patient_ref: 'M.R. 12/03',
            location: 'North Branch',
            waiting_reason: 'OnInsurer',
            labels: ['imaging'],
            created_at: '2024-01-08T09:15:00Z',
            updated_at: '2024-01-14T11:20:00Z'
          },
          {
            id: '3',
            title: 'Lab results review',
            type: 'Lab',
            status: 'ToDo',
            due_at: tomorrow.toISOString(),
            assignee: { id: '3', name: 'Nurse Williams' },
            patient_ref: 'A.L. 05/22',
            location: 'Main Clinic',
            labels: ['lab', 'review'],
            created_at: '2024-01-14T16:45:00Z',
            updated_at: '2024-01-14T16:45:00Z'
          },
          {
            id: '4',
            title: 'Patient callback - test results',
            type: 'Callback',
            status: 'Done',
            due_at: twoDaysAgo.toISOString(),
            assignee: { id: '4', name: 'MA Davis' },
            patient_ref: 'S.K. 09/18',
            location: 'South Branch',
            labels: ['callback', 'results'],
            created_at: '2024-01-10T13:30:00Z',
            updated_at: '2024-01-12T15:30:00Z',
            completed_at: '2024-01-12T15:30:00Z'
          },
          {
            id: '5',
            title: 'Insurance claim processing',
            type: 'Billing',
            status: 'InProgress',
            due_at: nextWeek.toISOString(),
            assignee: { id: '5', name: 'Billing Specialist' },
            patient_ref: 'R.T. 11/07',
            location: 'Main Clinic',
            labels: ['billing', 'insurance'],
            created_at: '2024-01-13T10:20:00Z',
            updated_at: '2024-01-15T09:15:00Z'
          },
          {
            id: '6',
            title: 'Urgent medication review',
            type: 'Refill',
            status: 'ToDo',
            due_at: twoDaysAgo.toISOString(),
            assignee: { id: '1', name: 'Dr. Smith' },
            patient_ref: 'L.M. 03/15',
            location: 'Main Clinic',
            labels: ['urgent', 'medication'],
            created_at: '2024-01-10T10:00:00Z',
            updated_at: '2024-01-12T14:30:00Z'
          }
        ];

        // Apply filters
        let filteredTasks = mockTasks;

        if (memoizedFilters.assignee && memoizedFilters.assignee !== 'me' && memoizedFilters.assignee !== 'all') {
          filteredTasks = filteredTasks.filter(task => 
            task.assignee?.id === memoizedFilters.assignee
          );
        }

        if (memoizedFilters.type && memoizedFilters.type !== 'all') {
          filteredTasks = filteredTasks.filter(task => 
            task.type === memoizedFilters.type
          );
        }

        if (memoizedFilters.status && memoizedFilters.status !== 'all') {
          filteredTasks = filteredTasks.filter(task => 
            task.status === memoizedFilters.status
          );
        }

        if (memoizedFilters.location && memoizedFilters.location !== 'all') {
          filteredTasks = filteredTasks.filter(task => 
            task.location === memoizedFilters.location
          );
        }

        if (memoizedFilters.due && memoizedFilters.due !== 'all') {
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          
          filteredTasks = filteredTasks.filter(task => {
            if (!task.due_at) return false;
            const dueDate = new Date(task.due_at);
            
            switch (memoizedFilters.due) {
              case 'Today':
                return dueDate.toDateString() === today.toDateString();
              case 'Overdue':
                return dueDate < now && task.status !== 'Done';
              case 'This Week':
                const weekEnd = new Date(today);
                weekEnd.setDate(today.getDate() + 7);
                return dueDate >= today && dueDate <= weekEnd;
              case 'Next Week':
                const nextWeekStart = new Date(today);
                nextWeekStart.setDate(today.getDate() + 7);
                const nextWeekEnd = new Date(today);
                nextWeekEnd.setDate(today.getDate() + 14);
                return dueDate >= nextWeekStart && dueDate <= nextWeekEnd;
              default:
                return true;
            }
          });
        }

        setTasks(filteredTasks);
        setError(null);
      } catch (err) {
        setError('Failed to load tasks');
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [memoizedFilters]);

  const assignTask = async (taskId: string, assignmentData: {
    userId: string;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    note?: string;
  }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = mockUsers.find(u => u.id === assignmentData.userId);
      if (!user) throw new Error('User not found');

      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? {
              ...task,
              assignee: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
              },
              assigned_by: {
                id: 'current-user',
                name: 'You'
              },
              assigned_at: new Date().toISOString(),
              priority: assignmentData.priority,
              assignment_note: assignmentData.note,
              due_at: assignmentData.dueDate || task.due_at,
              updated_at: new Date().toISOString()
            }
          : task
      ));

      console.log('Task assigned:', {
        taskId,
        assignee: user.name,
        priority: assignmentData.priority,
        dueDate: assignmentData.dueDate
      });
      
      return true;
    } catch (error) {
      console.error('Error assigning task:', error);
      throw error;
    }
  };

  const reassignTask = async (taskId: string, newUserId: string, reason?: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = mockUsers.find(u => u.id === newUserId);
      if (!user) throw new Error('User not found');

      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? {
              ...task,
              assignee: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
              },
              assigned_by: {
                id: 'current-user',
                name: 'You'
              },
              assigned_at: new Date().toISOString(),
              assignment_note: reason || task.assignment_note,
              updated_at: new Date().toISOString()
            }
          : task
      ));

      console.log('Task reassigned:', {
        taskId,
        newAssignee: user.name,
        reason
      });
      
      return true;
    } catch (error) {
      console.error('Error reassigning task:', error);
      throw error;
    }
  };

  const updateTaskStatus = async (taskId: string, status: 'ToDo' | 'InProgress' | 'Waiting' | 'Done') => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? {
              ...task,
              status,
              completed_at: status === 'Done' ? new Date().toISOString() : undefined,
              updated_at: new Date().toISOString()
            }
          : task
      ));

      console.log('Task status updated:', { taskId, status });
      return true;
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  };

  return { 
    tasks, 
    loading, 
    error, 
    assignTask, 
    reassignTask, 
    updateTaskStatus 
  };
}

