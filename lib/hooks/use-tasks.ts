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
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
  activeDateFilter?: string;
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
    filters.due,
    filters.dateRange?.start,
    filters.dateRange?.end,
    filters.activeDateFilter
  ]);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock task data with current dates and next 7 days
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const twoDaysAgo = new Date(now);
        twoDaysAgo.setDate(now.getDate() - 2);
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        const day2 = new Date(now);
        day2.setDate(now.getDate() + 2);
        const day3 = new Date(now);
        day3.setDate(now.getDate() + 3);
        const day4 = new Date(now);
        day4.setDate(now.getDate() + 4);
        const day5 = new Date(now);
        day5.setDate(now.getDate() + 5);
        const day6 = new Date(now);
        day6.setDate(now.getDate() + 6);
        const day7 = new Date(now);
        day7.setDate(now.getDate() + 7);

        const mockTasks: Task[] = [
          // Past tasks
          {
            id: '1',
            title: 'Patient follow-up for medication refill',
            type: 'Refill',
            status: 'InProgress',
            due_at: yesterday.toISOString(),
            assignee: { id: '1', name: 'Dr. Smith' },
            patient_ref: 'J.S. 08/14',
            location: 'Main Clinic',
            priority: 'high',
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
            priority: 'medium',
            waiting_reason: 'OnInsurer',
            labels: ['imaging'],
            created_at: '2024-01-08T09:15:00Z',
            updated_at: '2024-01-14T11:20:00Z'
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
            priority: 'low',
            labels: ['callback', 'results'],
            created_at: '2024-01-10T13:30:00Z',
            updated_at: '2024-01-12T15:30:00Z',
            completed_at: '2024-01-12T15:30:00Z'
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
            priority: 'urgent',
            labels: ['urgent', 'medication'],
            created_at: '2024-01-10T10:00:00Z',
            updated_at: '2024-01-12T14:30:00Z'
          },
          
          // Tomorrow (Day 1)
          {
            id: '3',
            title: 'Lab results review',
            type: 'Lab',
            status: 'ToDo',
            due_at: tomorrow.toISOString(),
            assignee: { id: '3', name: 'Nurse Williams' },
            patient_ref: 'A.L. 05/22',
            location: 'Main Clinic',
            priority: 'medium',
            labels: ['lab', 'review'],
            created_at: '2024-01-14T16:45:00Z',
            updated_at: '2024-01-14T16:45:00Z'
          },
          {
            id: '7',
            title: 'Diabetes medication adjustment',
            type: 'Refill',
            status: 'ToDo',
            due_at: tomorrow.toISOString(),
            assignee: { id: '1', name: 'Dr. Smith' },
            patient_ref: 'B.K. 07/12',
            location: 'Main Clinic',
            priority: 'high',
            labels: ['diabetes', 'medication'],
            created_at: '2024-01-15T09:00:00Z',
            updated_at: '2024-01-15T09:00:00Z'
          },
          {
            id: '8',
            title: 'Insurance pre-authorization for surgery',
            type: 'PA',
            status: 'ToDo',
            due_at: tomorrow.toISOString(),
            assignee: { id: '2', name: 'Dr. Johnson' },
            patient_ref: 'C.M. 04/08',
            location: 'North Branch',
            priority: 'urgent',
            labels: ['surgery', 'authorization'],
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-15T10:30:00Z'
          },

          // Day 2
          {
            id: '9',
            title: 'Blood pressure monitoring setup',
            type: 'Lab',
            status: 'ToDo',
            due_at: day2.toISOString(),
            assignee: { id: '3', name: 'Nurse Williams' },
            patient_ref: 'D.R. 11/25',
            location: 'Main Clinic',
            priority: 'medium',
            labels: ['monitoring', 'blood pressure'],
            created_at: '2024-01-15T11:00:00Z',
            updated_at: '2024-01-15T11:00:00Z'
          },
          {
            id: '10',
            title: 'Patient education - medication compliance',
            type: 'Callback',
            status: 'ToDo',
            due_at: day2.toISOString(),
            assignee: { id: '4', name: 'MA Davis' },
            patient_ref: 'E.S. 09/03',
            location: 'South Branch',
            priority: 'low',
            labels: ['education', 'compliance'],
            created_at: '2024-01-15T12:00:00Z',
            updated_at: '2024-01-15T12:00:00Z'
          },
          {
            id: '11',
            title: 'Insurance claim follow-up',
            type: 'Billing',
            status: 'ToDo',
            due_at: day2.toISOString(),
            assignee: { id: '5', name: 'Billing Specialist' },
            patient_ref: 'F.T. 06/18',
            location: 'Main Clinic',
            priority: 'medium',
            labels: ['billing', 'follow-up'],
            created_at: '2024-01-15T13:00:00Z',
            updated_at: '2024-01-15T13:00:00Z'
          },

          // Day 3
          {
            id: '12',
            title: 'Cardiology consultation referral',
            type: 'PA',
            status: 'ToDo',
            due_at: day3.toISOString(),
            assignee: { id: '2', name: 'Dr. Johnson' },
            patient_ref: 'G.W. 02/14',
            location: 'North Branch',
            priority: 'high',
            labels: ['cardiology', 'referral'],
            created_at: '2024-01-15T14:00:00Z',
            updated_at: '2024-01-15T14:00:00Z'
          },
          {
            id: '13',
            title: 'Medication reconciliation',
            type: 'Refill',
            status: 'ToDo',
            due_at: day3.toISOString(),
            assignee: { id: '1', name: 'Dr. Smith' },
            patient_ref: 'H.P. 12/09',
            location: 'Main Clinic',
            priority: 'medium',
            labels: ['reconciliation', 'medication'],
            created_at: '2024-01-15T15:00:00Z',
            updated_at: '2024-01-15T15:00:00Z'
          },
          {
            id: '14',
            title: 'Lab results notification',
            type: 'Callback',
            status: 'ToDo',
            due_at: day3.toISOString(),
            assignee: { id: '4', name: 'MA Davis' },
            patient_ref: 'I.L. 08/22',
            location: 'South Branch',
            priority: 'high',
            labels: ['lab', 'notification'],
            created_at: '2024-01-15T16:00:00Z',
            updated_at: '2024-01-15T16:00:00Z'
          },

          // Day 4
          {
            id: '15',
            title: 'Physical therapy referral',
            type: 'PA',
            status: 'ToDo',
            due_at: day4.toISOString(),
            assignee: { id: '2', name: 'Dr. Johnson' },
            patient_ref: 'J.M. 05/30',
            location: 'North Branch',
            priority: 'medium',
            labels: ['therapy', 'referral'],
            created_at: '2024-01-15T17:00:00Z',
            updated_at: '2024-01-15T17:00:00Z'
          },
          {
            id: '16',
            title: 'Chronic pain management review',
            type: 'Refill',
            status: 'ToDo',
            due_at: day4.toISOString(),
            assignee: { id: '1', name: 'Dr. Smith' },
            patient_ref: 'K.N. 10/15',
            location: 'Main Clinic',
            priority: 'high',
            labels: ['pain', 'management'],
            created_at: '2024-01-15T18:00:00Z',
            updated_at: '2024-01-15T18:00:00Z'
          },
          {
            id: '17',
            title: 'Insurance verification',
            type: 'Billing',
            status: 'ToDo',
            due_at: day4.toISOString(),
            assignee: { id: '5', name: 'Billing Specialist' },
            patient_ref: 'L.O. 03/27',
            location: 'Main Clinic',
            priority: 'low',
            labels: ['insurance', 'verification'],
            created_at: '2024-01-15T19:00:00Z',
            updated_at: '2024-01-15T19:00:00Z'
          },

          // Day 5
          {
            id: '18',
            title: 'Dermatology consultation',
            type: 'PA',
            status: 'ToDo',
            due_at: day5.toISOString(),
            assignee: { id: '2', name: 'Dr. Johnson' },
            patient_ref: 'M.P. 01/20',
            location: 'North Branch',
            priority: 'medium',
            labels: ['dermatology', 'consultation'],
            created_at: '2024-01-15T20:00:00Z',
            updated_at: '2024-01-15T20:00:00Z'
          },
          {
            id: '19',
            title: 'Antibiotic prescription review',
            type: 'Refill',
            status: 'ToDo',
            due_at: day5.toISOString(),
            assignee: { id: '1', name: 'Dr. Smith' },
            patient_ref: 'N.Q. 07/05',
            location: 'Main Clinic',
            priority: 'high',
            labels: ['antibiotic', 'prescription'],
            created_at: '2024-01-15T21:00:00Z',
            updated_at: '2024-01-15T21:00:00Z'
          },
          {
            id: '20',
            title: 'Patient satisfaction survey follow-up',
            type: 'Callback',
            status: 'ToDo',
            due_at: day5.toISOString(),
            assignee: { id: '4', name: 'MA Davis' },
            patient_ref: 'O.R. 11/12',
            location: 'South Branch',
            priority: 'low',
            labels: ['survey', 'satisfaction'],
            created_at: '2024-01-15T22:00:00Z',
            updated_at: '2024-01-15T22:00:00Z'
          },

          // Day 6
          {
            id: '21',
            title: 'Orthopedic consultation',
            type: 'PA',
            status: 'ToDo',
            due_at: day6.toISOString(),
            assignee: { id: '2', name: 'Dr. Johnson' },
            patient_ref: 'P.S. 04/18',
            location: 'North Branch',
            priority: 'high',
            labels: ['orthopedic', 'consultation'],
            created_at: '2024-01-15T23:00:00Z',
            updated_at: '2024-01-15T23:00:00Z'
          },
          {
            id: '22',
            title: 'Mental health medication adjustment',
            type: 'Refill',
            status: 'ToDo',
            due_at: day6.toISOString(),
            assignee: { id: '1', name: 'Dr. Smith' },
            patient_ref: 'Q.T. 09/28',
            location: 'Main Clinic',
            priority: 'urgent',
            labels: ['mental health', 'medication'],
            created_at: '2024-01-16T00:00:00Z',
            updated_at: '2024-01-16T00:00:00Z'
          },
          {
            id: '23',
            title: 'Lab results interpretation',
            type: 'Lab',
            status: 'ToDo',
            due_at: day6.toISOString(),
            assignee: { id: '3', name: 'Nurse Williams' },
            patient_ref: 'R.U. 06/11',
            location: 'Main Clinic',
            priority: 'medium',
            labels: ['lab', 'interpretation'],
            created_at: '2024-01-16T01:00:00Z',
            updated_at: '2024-01-16T01:00:00Z'
          },

          // Day 7
          {
            id: '24',
            title: 'Endocrinology referral',
            type: 'PA',
            status: 'ToDo',
            due_at: day7.toISOString(),
            assignee: { id: '2', name: 'Dr. Johnson' },
            patient_ref: 'S.V. 12/01',
            location: 'North Branch',
            priority: 'high',
            labels: ['endocrinology', 'referral'],
            created_at: '2024-01-16T02:00:00Z',
            updated_at: '2024-01-16T02:00:00Z'
          },
          {
            id: '25',
            title: 'Insurance claim processing',
            type: 'Billing',
            status: 'InProgress',
            due_at: day7.toISOString(),
            assignee: { id: '5', name: 'Billing Specialist' },
            patient_ref: 'T.W. 08/07',
            location: 'Main Clinic',
            priority: 'medium',
            labels: ['billing', 'insurance'],
            created_at: '2024-01-13T10:20:00Z',
            updated_at: '2024-01-15T09:15:00Z'
          },
          {
            id: '26',
            title: 'Patient discharge planning',
            type: 'Other',
            status: 'ToDo',
            due_at: day7.toISOString(),
            assignee: { id: '3', name: 'Nurse Williams' },
            patient_ref: 'U.X. 02/25',
            location: 'Main Clinic',
            priority: 'high',
            labels: ['discharge', 'planning'],
            created_at: '2024-01-16T03:00:00Z',
            updated_at: '2024-01-16T03:00:00Z'
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

        // Apply date range filtering
        if (memoizedFilters.dateRange && (memoizedFilters.dateRange.start || memoizedFilters.dateRange.end)) {
          filteredTasks = filteredTasks.filter(task => {
            if (!task.due_at) return false;
            
            const taskDate = new Date(task.due_at);
            const startDate = memoizedFilters.dateRange?.start;
            const endDate = memoizedFilters.dateRange?.end;
            
            // If only start date is provided, filter tasks from that date onwards
            if (startDate && !endDate) {
              return taskDate >= startDate;
            }
            
            // If only end date is provided, filter tasks up to that date
            if (!startDate && endDate) {
              return taskDate <= endDate;
            }
            
            // If both dates are provided, filter tasks within the range
            if (startDate && endDate) {
              return taskDate >= startDate && taskDate <= endDate;
            }
            
            return true;
          });
        }

        // Apply quick date filters
        if (memoizedFilters.activeDateFilter && memoizedFilters.activeDateFilter !== 'all') {
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          
          filteredTasks = filteredTasks.filter(task => {
            if (!task.due_at) return false;
            const taskDate = new Date(task.due_at);
            
            switch (memoizedFilters.activeDateFilter) {
              case 'today':
                return taskDate.toDateString() === today.toDateString();
              case 'week':
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - today.getDay());
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);
                return taskDate >= weekStart && taskDate <= weekEnd;
              case 'month':
                const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                return taskDate >= monthStart && taskDate <= monthEnd;
              case 'overdue':
                return taskDate < now && task.status !== 'Done';
              default:
                return true;
            }
          });
        }

        // Special filter for Done column: show only today's completions
        filteredTasks = filteredTasks.filter(task => {
          if (task.status === 'Done') {
            if (!task.completed_at) return false;
            
            const completionDate = new Date(task.completed_at);
            const today = new Date();
            const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const todayEnd = new Date(todayStart);
            todayEnd.setDate(todayStart.getDate() + 1);
            
            return completionDate >= todayStart && completionDate < todayEnd;
          }
          return true;
        });

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

