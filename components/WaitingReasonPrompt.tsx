'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Pause, AlertCircle } from 'lucide-react';

interface WaitingReasonPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, note?: string) => void;
  taskTitle?: string;
}

const waitingReasons = [
  { value: 'OnProvider', label: 'Waiting on Provider', description: 'Need provider approval or decision' },
  { value: 'OnInsurer', label: 'Waiting on Insurance', description: 'Prior authorization or insurance response' },
  { value: 'OnPatient', label: 'Waiting on Patient', description: 'Patient response or action required' },
  { value: 'OnRecords', label: 'Waiting on Records', description: 'Medical records or documentation needed' },
  { value: 'OnLab', label: 'Waiting on Lab Results', description: 'Laboratory results pending' },
  { value: 'OnPharmacy', label: 'Waiting on Pharmacy', description: 'Pharmacy response or medication issue' },
  { value: 'OnExternal', label: 'Waiting on External', description: 'External provider or facility' },
  { value: 'Other', label: 'Other', description: 'Other reason not listed' }
];

export function WaitingReasonPrompt({ 
  isOpen, 
  onClose, 
  onConfirm, 
  taskTitle 
}: WaitingReasonPromptProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!selectedReason) return;
    
    setIsSubmitting(true);
    try {
      await onConfirm(selectedReason, note.trim() || undefined);
      setSelectedReason('');
      setNote('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setNote('');
    onClose();
  };

  const selectedReasonData = waitingReasons.find(r => r.value === selectedReason);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Pause className="h-5 w-5 text-orange-600" />
            <span>Set Task to Waiting</span>
          </DialogTitle>
          <DialogDescription>
            {taskTitle && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                <strong>Task:</strong> {taskTitle}
              </div>
            )}
            Please select why this task is waiting and add any additional notes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Reason Selection */}
          <div className="space-y-2">
            <Label htmlFor="reason">Waiting Reason *</Label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason..." />
              </SelectTrigger>
              <SelectContent>
                {waitingReasons.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{reason.label}</span>
                      <span className="text-sm text-gray-500">{reason.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="note">Additional Notes (Optional)</Label>
            <Textarea
              id="note"
              placeholder="Add any additional context or details..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          {/* Selected Reason Info */}
          {selectedReasonData && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800">
                    {selectedReasonData.label}
                  </p>
                  <p className="text-sm text-orange-700">
                    {selectedReasonData.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedReason || isSubmitting}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isSubmitting && (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            Set to Waiting
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
