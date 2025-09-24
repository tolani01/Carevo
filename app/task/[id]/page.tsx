'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Calendar, User, Clock, MessageSquare, CheckCircle, AlertCircle, Edit, Plus, Pause } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'ToDo' | 'InProgress' | 'Waiting' | 'Done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'Refill' | 'PA' | 'Lab' | 'Callback' | 'Billing';
  assignee?: string;
  due_at?: string;
  created_at: string;
  updated_at: string;
  note?: string;
}

interface TaskDetailPageProps {
  params: { id: string };
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showWaitingModal, setShowWaitingModal] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '', priority: 'medium' as Task['priority'] });
  const [commentText, setCommentText] = useState('');
  const [waitingReason, setWaitingReason] = useState('');

  // Get search context from URL params
  const fromSearch = searchParams.get('from') === 'search';
  const searchQuery = searchParams.get('query') || '';

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        // Mock task data - in real app, fetch from API
        const mockTask: Task = {
          id: params.id,
          title: 'Review Lab Results',
          description: 'Patient John Smith - Blood work results ready for review. Please check CBC, CMP, and lipid panel results.',
          status: 'InProgress',
          priority: 'high',
          type: 'Lab',
          assignee: 'Dr. Sarah Johnson',
          due_at: '2024-12-24T10:00:00Z',
          created_at: '2024-12-23T09:00:00Z',
          updated_at: '2024-12-23T14:30:00Z',
          note: 'Patient has history of diabetes. Please review glucose levels carefully.'
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setTask(mockTask);
      } catch (err) {
        setError('Failed to load task details');
        console.error('Error fetching task:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [params.id]);

  const handleBack = () => {
    if (fromSearch && searchQuery) {
      // Return to search with query
      router.push(`/board?search=${encodeURIComponent(searchQuery)}`);
    } else {
      // Return to board
      router.push('/board');
    }
  };

  const handleStatusChange = (newStatus: Task['status']) => {
    if (task) {
      setTask({ ...task, status: newStatus, updated_at: new Date().toISOString() });
    }
  };

  const handleMarkComplete = () => {
    if (task) {
      setTask({ 
        ...task, 
        status: 'Done', 
        updated_at: new Date().toISOString() 
      });
      // Show success message or redirect
      console.log('Task marked as complete');
    }
  };

  const handleSetWaiting = () => {
    setShowWaitingModal(true);
  };

  const handleWaitingConfirm = () => {
    if (task && waitingReason) {
      setTask({ 
        ...task, 
        status: 'Waiting', 
        note: waitingReason,
        updated_at: new Date().toISOString() 
      });
      setShowWaitingModal(false);
      setWaitingReason('');
      console.log('Task set to waiting:', waitingReason);
    }
  };

  const handleEditTask = () => {
    if (task) {
      setEditForm({
        title: task.title,
        description: task.description,
        priority: task.priority
      });
      setShowEditModal(true);
    }
  };

  const handleEditSave = () => {
    if (task) {
      setTask({
        ...task,
        title: editForm.title,
        description: editForm.description,
        priority: editForm.priority,
        updated_at: new Date().toISOString()
      });
      setShowEditModal(false);
      console.log('Task updated');
    }
  };

  const handleAddComment = () => {
    setShowCommentModal(true);
  };

  const handleCommentSave = () => {
    if (commentText.trim()) {
      // In a real app, this would save to the backend
      console.log('Comment added:', commentText);
      setCommentText('');
      setShowCommentModal(false);
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'ToDo': return 'bg-gray-100 text-gray-800';
      case 'InProgress': return 'bg-blue-100 text-blue-800';
      case 'Waiting': return 'bg-orange-100 text-orange-800';
      case 'Done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: Task['type']) => {
    switch (type) {
      case 'Refill': return 'bg-blue-100 text-blue-800';
      case 'PA': return 'bg-green-100 text-green-800';
      case 'Lab': return 'bg-purple-100 text-purple-800';
      case 'Callback': return 'bg-yellow-100 text-yellow-800';
      case 'Billing': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Task not found</h2>
            <p className="text-gray-600 mb-4">The task you're looking for doesn't exist or has been removed.</p>
            <Button onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {fromSearch ? 'Search' : 'Board'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {fromSearch ? 'Search Results' : 'Board'}
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Task ID: {task.id}</span>
                <span>•</span>
                <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                {task.updated_at !== task.created_at && (
                  <>
                    <span>•</span>
                    <span>Updated: {new Date(task.updated_at).toLocaleDateString()}</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Badge className={getStatusColor(task.status)}>
                {task.status}
              </Badge>
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <Badge className={getTypeColor(task.type)}>
                {task.type}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{task.description}</p>
                {task.note && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> {task.note}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border-yellow-200 bg-yellow-50/30">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {/* Top Row */}
                  <div className="col-span-2 flex gap-2">
                    {task.status !== 'Done' && (
                      <Button
                        onClick={handleMarkComplete}
                        className="bg-green-600 hover:bg-green-700 text-white flex-1"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                    {task.status === 'InProgress' && (
                      <Button
                        onClick={handleSetWaiting}
                        variant="outline"
                        className="border-yellow-300 hover:bg-yellow-50 flex-1"
                        size="sm"
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Set Waiting
                      </Button>
                    )}
                    <Button
                      onClick={handleEditTask}
                      variant="outline"
                      className="border-yellow-300 hover:bg-yellow-50 flex-1"
                      size="sm"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Task
                    </Button>
                  </div>
                  
                  {/* Bottom Row */}
                  <div className="col-span-2">
                    <Button
                      onClick={handleAddComment}
                      variant="outline"
                      className="border-yellow-300 hover:bg-yellow-50 w-full"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Comment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Task Info */}
            <Card>
              <CardHeader>
                <CardTitle>Task Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Assignee:</span>
                  <span className="text-sm font-medium">{task.assignee || 'Unassigned'}</span>
                </div>
                
                {task.due_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Due:</span>
                    <span className="text-sm font-medium">
                      {new Date(task.due_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Type:</span>
                  <span className="text-sm font-medium">{task.type}</span>
                </div>
              </CardContent>
            </Card>

            {/* Related Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Related Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    <a href="/task/task-2" className="text-blue-600 hover:underline">
                      Follow-up with Patient
                    </a>
                    <span className="text-gray-400 ml-2">• High Priority</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <a href="/task/task-3" className="text-blue-600 hover:underline">
                      Schedule Lab Appointment
                    </a>
                    <span className="text-gray-400 ml-2">• Medium Priority</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals */}
        {/* Edit Task Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Title</label>
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <Textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="mt-1"
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Priority</label>
                <select
                  value={editForm.priority}
                  onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as Task['priority'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Comment Modal */}
        <Dialog open={showCommentModal} onOpenChange={setShowCommentModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Comment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Comment</label>
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment about this task..."
                  className="mt-1"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCommentModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCommentSave} disabled={!commentText.trim()}>
                  Add Comment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Set Waiting Modal */}
        <Dialog open={showWaitingModal} onOpenChange={setShowWaitingModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Task to Waiting</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Waiting Reason</label>
                <select
                  value={waitingReason}
                  onChange={(e) => setWaitingReason(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select a reason...</option>
                  <option value="OnProvider">Waiting on Provider</option>
                  <option value="OnInsurer">Waiting on Insurer</option>
                  <option value="OnPatient">Waiting on Patient</option>
                  <option value="OnRecords">Waiting on Records</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowWaitingModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleWaitingConfirm} disabled={!waitingReason}>
                  Set to Waiting
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
