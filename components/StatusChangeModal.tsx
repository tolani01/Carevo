'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, CheckCircle, AlertCircle, Pause } from 'lucide-react';

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
  taskTitle: string;
  fromStatus: string;
  toStatus: string;
  isLoading?: boolean;
}

const statusIcons = {
  ToDo: <AlertCircle className="h-4 w-4" />,
  InProgress: <Clock className="h-4 w-4" />,
  Waiting: <Pause className="h-4 w-4" />,
  Done: <CheckCircle className="h-4 w-4" />
};

const statusColors = {
  ToDo: 'bg-gray-100 text-gray-800',
  InProgress: 'bg-blue-100 text-blue-800',
  Waiting: 'bg-yellow-100 text-yellow-800',
  Done: 'bg-green-100 text-green-800'
};

export function StatusChangeModal({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
  fromStatus,
  toStatus,
  isLoading = false
}: StatusChangeModalProps) {
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onConfirm(comment.trim());
      setComment('');
    } else {
      onConfirm(''); // Allow empty comments
    }
  };

  const handleClose = () => {
    setComment('');
    onClose();
  };

  const getStatusChangeMessage = () => {
    switch (toStatus) {
      case 'InProgress':
        return 'Starting work on this task';
      case 'Waiting':
        return 'Task is waiting for external input';
      case 'Done':
        return 'Task has been completed';
      case 'ToDo':
        return 'Task moved back to todo';
      default:
        return 'Status changed';
    }
  };

  const getSuggestedComments = () => {
    switch (toStatus) {
      case 'InProgress':
        return [
          'Started working on this task',
          'Beginning implementation',
          'Reviewing requirements'
        ];
      case 'Waiting':
        return [
          'Waiting for client response',
          'Pending approval',
          'Awaiting external input'
        ];
      case 'Done':
        return [
          'Task completed successfully',
          'All requirements met',
          'Ready for review'
        ];
      case 'ToDo':
        return [
          'Moving back to todo',
          'Requires more information',
          'Blocked, needs clarification'
        ];
      default:
        return [];
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Status Change</span>
            <Badge variant="outline" className="text-xs">
              {taskTitle.length > 30 ? `${taskTitle.substring(0, 30)}...` : taskTitle}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Change Display */}
          <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              {statusIcons[fromStatus as keyof typeof statusIcons]}
              <Badge className={statusColors[fromStatus as keyof typeof statusColors]}>
                {fromStatus}
              </Badge>
            </div>
            
            <ArrowRight className="h-4 w-4 text-gray-400" />
            
            <div className="flex items-center gap-2">
              {statusIcons[toStatus as keyof typeof statusIcons]}
              <Badge className={statusColors[toStatus as keyof typeof statusColors]}>
                {toStatus}
              </Badge>
            </div>
          </div>

          {/* Change Message */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {getStatusChangeMessage()}
            </p>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="comment" className="text-sm font-medium">
                Add a comment (optional)
              </Label>
              <Textarea
                id="comment"
                placeholder="Explain the status change..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Suggested Comments */}
            {getSuggestedComments().length > 0 && (
              <div>
                <Label className="text-xs text-gray-500 mb-2 block">
                  Quick suggestions:
                </Label>
                <div className="flex flex-wrap gap-2">
                  {getSuggestedComments().map((suggestion, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setComment(suggestion)}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[80px]"
              >
                {isLoading ? 'Saving...' : 'Confirm'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
