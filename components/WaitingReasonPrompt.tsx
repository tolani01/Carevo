'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Clock, AlertCircle } from 'lucide-react'

interface WaitingReasonPromptProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string, note?: string) => void
  taskTitle?: string
}

const waitingReasons = [
  { value: 'waiting-for-patient', label: 'Waiting for Patient Response' },
  { value: 'waiting-for-provider', label: 'Waiting for Provider' },
  { value: 'waiting-for-lab', label: 'Waiting for Lab Results' },
  { value: 'waiting-for-insurance', label: 'Waiting for Insurance' },
  { value: 'waiting-for-approval', label: 'Waiting for Approval' },
  { value: 'waiting-for-resources', label: 'Waiting for Resources' },
  { value: 'other', label: 'Other (specify in notes)' }
]

export function WaitingReasonPrompt({
  isOpen,
  onClose,
  onConfirm,
  taskTitle
}: WaitingReasonPromptProps) {
  const [selectedReason, setSelectedReason] = useState<string>('')
  const [note, setNote] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const handleConfirm = async () => {
    if (!selectedReason) {
      setError('Please select a waiting reason')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await onConfirm(selectedReason, note.trim() || undefined)
      // Reset form
      setSelectedReason('')
      setNote('')
      onClose()
    } catch (err) {
      setError('Failed to update task status. Please try again.')
      console.error('Error setting waiting reason:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setSelectedReason('')
      setNote('')
      setError('')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Set Waiting Reason
            {taskTitle && (
              <span className="text-sm text-gray-500 font-normal">
                for "{taskTitle}"
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md" role="alert">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Reason Selection */}
          <div className="space-y-2">
            <Label htmlFor="waiting-reason">Why is this task waiting?</Label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason..." />
              </SelectTrigger>
              <SelectContent>
                {waitingReasons.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="waiting-note">Additional Notes (Optional)</Label>
            <Textarea
              id="waiting-note"
              placeholder="Add any additional context..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            variant="outline" 
            onClick={handleClose} 
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!selectedReason || isLoading}
          >
            {isLoading ? 'Setting...' : 'Set Waiting'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
