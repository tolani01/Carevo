'use client'

import { useState } from 'react'
import { Calendar, Clock, X } from 'lucide-react'
import { Button } from './button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog'
import { Label } from './label'
import { Input } from './input'

interface DueDatePickerProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (dueDate: string) => void
  taskTitle?: string
  currentDueDate?: string | null
}

export function DueDatePicker({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
  currentDueDate
}: DueDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [customDate, setCustomDate] = useState<string>('')
  const [useCustomDate, setUseCustomDate] = useState<boolean>(false)

  // Initialize with current due date if provided
  useState(() => {
    if (currentDueDate) {
      const date = new Date(currentDueDate)
      setSelectedDate(date.toISOString().split('T')[0])
      setSelectedTime(date.toTimeString().slice(0, 5))
    }
  })

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const quickOptions = [
    {
      id: 'today',
      label: 'Today',
      date: formatDate(today),
      time: '17:00',
      description: formatDisplayDate(today)
    },
    {
      id: 'tomorrow',
      label: 'Tomorrow',
      date: formatDate(tomorrow),
      time: '09:00',
      description: formatDisplayDate(tomorrow)
    },
    {
      id: 'next-week',
      label: 'Next Week',
      date: formatDate(nextWeek),
      time: '09:00',
      description: formatDisplayDate(nextWeek)
    }
  ]

  const handleQuickSelect = (option: typeof quickOptions[0]) => {
    setSelectedDate(option.date)
    setSelectedTime(option.time)
    setUseCustomDate(false)
  }

  const handleCustomDateChange = (date: string) => {
    setCustomDate(date)
    setSelectedDate(date)
    setUseCustomDate(true)
  }

  const handleConfirm = () => {
    if (!selectedDate) return

    const dateTime = selectedTime 
      ? `${selectedDate}T${selectedTime}:00`
      : `${selectedDate}T17:00:00`

    // Validate that the date is not in the past
    const selectedDateTime = new Date(dateTime)
    if (selectedDateTime < today) {
      // For now, we'll use alert but this should be replaced with a toast
      alert('Please select a date in the future')
      return
    }

    onConfirm(dateTime)
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md"
        role="dialog"
        aria-labelledby="due-date-picker-title"
        aria-describedby="due-date-picker-description"
      >
        <DialogHeader>
          <DialogTitle id="due-date-picker-title" className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Set Due Date
          </DialogTitle>
          {taskTitle && (
            <p id="due-date-picker-description" className="text-sm text-gray-600">
              For task: "{taskTitle}"
            </p>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quick Options</Label>
            <div className="grid gap-2">
              {quickOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleQuickSelect(option)}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    selectedDate === option.date && !useCustomDate
                      ? 'border-primary-500 bg-primary-50 text-primary-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  aria-pressed={selectedDate === option.date && !useCustomDate}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Custom Date</Label>
            <div className="space-y-3">
              <div>
                <Label htmlFor="custom-date" className="text-xs text-gray-600">
                  Date
                </Label>
                <Input
                  id="custom-date"
                  type="date"
                  value={useCustomDate ? customDate : selectedDate}
                  onChange={(e) => handleCustomDateChange(e.target.value)}
                  min={formatDate(today)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="custom-time" className="text-xs text-gray-600">
                  Time (optional)
                </Label>
                <Input
                  id="custom-time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Selected Date Preview */}
          {selectedDate && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-sm font-medium text-gray-900">Selected Due Date:</div>
              <div className="text-sm text-gray-600">
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                {selectedTime && ` at ${selectedTime}`}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleCancel}
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedDate}
              type="button"
            >
              Set Due Date
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
