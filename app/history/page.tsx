'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  TrendingUp,
  Target,
  Clock,
  Award,
  BarChart3,
  RefreshCw
} from 'lucide-react';

interface CompletedTask {
  id: string;
  title: string;
  type: 'Refill' | 'PA' | 'Lab' | 'Callback' | 'Billing' | 'Other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: {
    id: string;
    name: string;
  };
  completed_at: string;
  completion_time: number; // minutes to complete
  completion_notes?: string;
  satisfaction_rating?: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  created_at: string;
  due_at?: string;
}

interface HistoryFilters {
  search: string;
  dateRange: 'week' | 'month' | 'quarter' | 'year' | 'all';
  taskType: string;
  priority: string;
  assignee: string;
  sortBy: 'date' | 'priority' | 'type' | 'assignee';
  sortOrder: 'asc' | 'desc';
}

export default function HistoryPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<CompletedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<HistoryFilters>({
    search: '',
    dateRange: 'month',
    taskType: 'all',
    priority: 'all',
    assignee: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        setLoading(true);
        
        // Mock completed tasks data
        const mockTasks: CompletedTask[] = [
          {
            id: '1',
            title: 'Patient follow-up for medication refill',
            type: 'Refill',
            priority: 'high',
            assignee: { id: '1', name: 'Dr. Sarah Johnson' },
            completed_at: '2024-12-23T14:30:00Z',
            completion_time: 15,
            completion_notes: 'Patient satisfied with medication',
            satisfaction_rating: 5,
            tags: ['medication', 'follow-up'],
            created_at: '2024-12-22T09:00:00Z',
            due_at: '2024-12-23T17:00:00Z'
          },
          {
            id: '2',
            title: 'Insurance prior authorization',
            type: 'PA',
            priority: 'urgent',
            assignee: { id: '2', name: 'Dr. Michael Chen' },
            completed_at: '2024-12-23T11:15:00Z',
            completion_time: 45,
            completion_notes: 'Authorization approved',
            satisfaction_rating: 4,
            tags: ['insurance', 'authorization'],
            created_at: '2024-12-22T14:00:00Z',
            due_at: '2024-12-23T12:00:00Z'
          },
          {
            id: '3',
            title: 'Lab results review',
            type: 'Lab',
            priority: 'medium',
            assignee: { id: '1', name: 'Dr. Sarah Johnson' },
            completed_at: '2024-12-22T16:45:00Z',
            completion_time: 25,
            completion_notes: 'Results within normal range',
            satisfaction_rating: 5,
            tags: ['lab', 'results'],
            created_at: '2024-12-21T10:00:00Z',
            due_at: '2024-12-22T18:00:00Z'
          },
          {
            id: '4',
            title: 'Patient callback - test results',
            type: 'Callback',
            priority: 'high',
            assignee: { id: '3', name: 'Nurse Jennifer Lee' },
            completed_at: '2024-12-22T13:20:00Z',
            completion_time: 20,
            completion_notes: 'Patient informed of results',
            satisfaction_rating: 4,
            tags: ['callback', 'results'],
            created_at: '2024-12-21T15:30:00Z',
            due_at: '2024-12-22T14:00:00Z'
          },
          {
            id: '5',
            title: 'Billing inquiry resolution',
            type: 'Billing',
            priority: 'low',
            assignee: { id: '4', name: 'Billing Specialist' },
            completed_at: '2024-12-21T10:30:00Z',
            completion_time: 30,
            completion_notes: 'Billing issue resolved',
            satisfaction_rating: 3,
            tags: ['billing', 'inquiry'],
            created_at: '2024-12-20T11:00:00Z',
            due_at: '2024-12-21T17:00:00Z'
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setTasks(mockTasks);
      } catch (error) {
        console.error('Error fetching completed tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    // Search filter
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Date range filter
    const taskDate = new Date(task.completed_at);
    const now = new Date();
    const daysAgo = Math.floor((now.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24));

    switch (filters.dateRange) {
      case 'week':
        if (daysAgo > 7) return false;
        break;
      case 'month':
        if (daysAgo > 30) return false;
        break;
      case 'quarter':
        if (daysAgo > 90) return false;
        break;
      case 'year':
        if (daysAgo > 365) return false;
        break;
      case 'all':
      default:
        break;
    }

    // Task type filter
    if (filters.taskType !== 'all' && task.type !== filters.taskType) {
      return false;
    }

    // Priority filter
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }

    // Assignee filter
    if (filters.assignee !== 'all' && task.assignee.id !== filters.assignee) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    let comparison = 0;
    
    switch (filters.sortBy) {
      case 'date':
        comparison = new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime();
        break;
      case 'priority':
        const priorityOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'assignee':
        comparison = a.assignee.name.localeCompare(b.assignee.name);
        break;
    }

    return filters.sortOrder === 'desc' ? -comparison : comparison;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Refill': return 'bg-blue-100 text-blue-800';
      case 'PA': return 'bg-green-100 text-green-800';
      case 'Lab': return 'bg-purple-100 text-purple-800';
      case 'Callback': return 'bg-yellow-100 text-yellow-800';
      case 'Billing': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCompletionTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getSatisfactionStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const handleExport = () => {
    console.log('Exporting completed tasks...');
    // TODO: Implement export functionality
  };

  const handleRefresh = () => {
    console.log('Refreshing completed tasks...');
    // TODO: Implement refresh functionality
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task History</h1>
              <p className="text-gray-600">
                {filteredTasks.length} completed tasks found
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tasks..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Date Range</label>
                <Select value={filters.dateRange} onValueChange={(value) => setFilters({ ...filters, dateRange: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Task Type</label>
                <Select value={filters.taskType} onValueChange={(value) => setFilters({ ...filters, taskType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Refill">Refill</SelectItem>
                    <SelectItem value="PA">Prior Authorization</SelectItem>
                    <SelectItem value="Lab">Lab</SelectItem>
                    <SelectItem value="Callback">Callback</SelectItem>
                    <SelectItem value="Billing">Billing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Sort By</label>
                <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Completion Date</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="type">Task Type</SelectItem>
                    <SelectItem value="assignee">Assignee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed tasks found</h3>
                <p className="text-gray-600">
                  {filters.search || filters.dateRange !== 'all' 
                    ? 'Try adjusting your filters to see more results.'
                    : 'Complete some tasks to see them here!'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getTypeColor(task.type)}>
                          {task.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Completed {new Date(task.completed_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          {formatCompletionTime(task.completion_time)}
                        </span>
                        <span>Assigned to {task.assignee.name}</span>
                      </div>
                      
                      {task.completion_notes && (
                        <p className="text-sm text-gray-700 mb-2">{task.completion_notes}</p>
                      )}
                      
                      <div className="flex items-center gap-4">
                        {task.satisfaction_rating && (
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-gray-600">
                              {getSatisfactionStars(task.satisfaction_rating)}
                            </span>
                          </div>
                        )}
                        
                        {task.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-600">Tags:</span>
                            <div className="flex gap-1">
                              {task.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {new Date(task.completed_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
