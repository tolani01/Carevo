'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  User, 
  MapPin, 
  Tag, 
  MessageSquare, 
  Paperclip,
  Save,
  X,
  Clock,
  CheckCircle2,
  Pause
} from 'lucide-react';
import { PHIProtection } from '@/components/PHIProtection';
import { PHIAlert } from '@/components/PHIAlert';
import { cn } from '@/lib/utils';

interface TaskDrawerProps {
  taskId: string | null;
  onClose: () => void;
  onSave?: (taskData: any) => void;
}

const taskTypes = ['Refill', 'PA', 'Lab', 'Callback', 'Billing', 'Other'];
const taskStatuses = ['ToDo', 'InProgress', 'Waiting', 'Done'];
const waitingReasons = ['OnProvider', 'OnInsurer', 'OnPatient', 'OnRecords'];

export function TaskDrawer({ taskId, onClose, onSave }: TaskDrawerProps) {
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [showPHIAlert, setShowPHIAlert] = useState(false);

  // Mock task data - replace with actual API call
  useEffect(() => {
    if (taskId) {
      setLoading(true);
      
      if (taskId === 'new') {
        // Create new task template
        setTimeout(() => {
          setTask({
            id: 'new',
            title: '',
            type: 'Refill',
            status: 'ToDo',
            due_at: '',
            assignee: { id: '1', name: 'Dr. Smith' },
            patient_ref: '',
            location: 'Main Clinic',
            waiting_reason: null,
            labels: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            comments: [],
            files: []
          });
          setLoading(false);
          // Show PHI alert for new task creation
          setShowPHIAlert(true);
        }, 100);
      } else {
        // Load existing task
        setTimeout(() => {
          setTask({
            id: taskId,
            title: 'Patient follow-up for medication refill',
            type: 'Refill',
            status: 'InProgress',
            due_at: '2024-01-15',
            assignee: { id: '1', name: 'Dr. Smith' },
            patient_ref: 'J.S. 08/14',
            location: 'Main Clinic',
            waiting_reason: null,
            labels: ['urgent', 'medication'],
            created_at: '2024-01-10',
            updated_at: '2024-01-12',
            comments: [
              {
                id: '1',
                author: { name: 'Dr. Smith' },
                body: 'Patient called about refill request',
                created_at: '2024-01-10T10:00:00Z'
              }
            ],
            files: [
              {
                id: '1',
                name: 'prescription.pdf',
                size: 245760,
                created_at: '2024-01-10T10:30:00Z'
              }
            ]
          });
          setLoading(false);
        }, 500);
      }
    }
  }, [taskId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave?.(task);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now().toString(),
      author: { name: 'Current User' },
      body: newComment,
      created_at: new Date().toISOString()
    };
    
    setTask({
      ...task,
      comments: [...(task.comments || []), comment]
    });
    setNewComment('');
  };

  const handleAddLabel = () => {
    if (!newLabel.trim() || task.labels.includes(newLabel)) return;
    
    setTask({
      ...task,
      labels: [...task.labels, newLabel]
    });
    setNewLabel('');
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    setTask({
      ...task,
      labels: task.labels.filter((label: string) => label !== labelToRemove)
    });
  };

  if (!task) {
    return (
      <Sheet open={!!taskId} onOpenChange={onClose}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={!!taskId} onOpenChange={onClose}>
      <SheetContent className="w-[100vw] sm:w-[400px] md:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>{taskId === 'new' ? 'New Task' : 'Task Details'}</span>
            <div className="flex items-center space-x-2">
              <Badge className={cn(
                task.status === 'ToDo' && 'bg-gray-100 text-gray-800',
                task.status === 'InProgress' && 'bg-blue-100 text-blue-800',
                task.status === 'Waiting' && 'bg-orange-100 text-orange-800',
                task.status === 'Done' && 'bg-green-100 text-green-800'
              )}>
                {task.status}
              </Badge>
            </div>
          </SheetTitle>
          <SheetDescription>
            {taskId === 'new' ? 'Create a new task' : `Created ${new Date(task.created_at).toLocaleDateString()}`}
          </SheetDescription>
        </SheetHeader>

        {/* PHI Alert - only show for new tasks */}
        {taskId === 'new' && (
          <PHIAlert 
            isVisible={showPHIAlert} 
            onDismiss={() => setShowPHIAlert(false)} 
          />
        )}

        <div className="space-y-6 py-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              placeholder="Task title"
            />
            <PHIProtection 
              text={task.title} 
              onTextChange={(text) => setTask({ ...task, title: text })}
            />
          </div>

          {/* Type and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={task.type} onValueChange={(value) => setTask({ ...task, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {taskTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={task.status} onValueChange={(value) => setTask({ ...task, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {taskStatuses.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Due Date</label>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Input
                type="date"
                value={task.due_at ? task.due_at.split('T')[0] : ''}
                onChange={(e) => setTask({ ...task, due_at: e.target.value || null })}
              />
            </div>
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Assignee</label>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <Input
                value={task.assignee?.name || ''}
                onChange={(e) => setTask({ 
                  ...task, 
                  assignee: e.target.value ? { id: '1', name: e.target.value } : null 
                })}
                placeholder="Assign to..."
              />
            </div>
          </div>

          {/* Patient Reference */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Patient Reference (PHI-lite)</label>
            <Input
              value={task.patient_ref || ''}
              onChange={(e) => setTask({ ...task, patient_ref: e.target.value })}
              placeholder="e.g., J.S. 08/14"
            />
            <PHIProtection 
              text={task.patient_ref || ''} 
              onTextChange={(text) => setTask({ ...task, patient_ref: text })}
            />
            <p className="text-xs text-gray-500">
              Use initials and DOB only (e.g., J.S. 08/14)
            </p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <Input
                value={task.location || ''}
                onChange={(e) => setTask({ ...task, location: e.target.value })}
                placeholder="Location"
              />
            </div>
          </div>

          {/* Waiting Reason */}
          {task.status === 'Waiting' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Waiting Reason</label>
              <Select 
                value={task.waiting_reason || ''} 
                onValueChange={(value) => setTask({ ...task, waiting_reason: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {waitingReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Labels */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Labels</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {task.labels.map((label: string, index: number) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{label}</span>
                  <button
                    onClick={() => handleRemoveLabel(label)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Add label"
                onKeyPress={(e) => e.key === 'Enter' && handleAddLabel()}
              />
              <Button onClick={handleAddLabel} size="sm">
                <Tag className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <h3 className="font-medium">Comments</h3>
            </div>
            
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {task.comments?.map((comment: any) => (
                <div key={comment.id} className="border-l-2 border-gray-200 pl-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{comment.author.name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{comment.body}</p>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={2}
              />
              <Button onClick={handleAddComment} size="sm">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Files */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Paperclip className="h-4 w-4" />
              <h3 className="font-medium">Attachments</h3>
            </div>
            
            <div className="space-y-2">
              {task.files?.map((file: any) => (
                <div key={file.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-2">
                    <Paperclip className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full">
              <Paperclip className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

