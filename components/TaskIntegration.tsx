'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Calendar, Clock, Users, FileText, CheckCircle, AlertCircle } from 'lucide-react'

interface TaskIntegrationProps {
  isOpen: boolean
  onClose: () => void
  channel: any
  meetingData?: any
}

export function TaskIntegration({ isOpen, onClose, channel, meetingData }: TaskIntegrationProps) {
  const [tasks, setTasks] = useState<any[]>([])
  const [showTaskDetails, setShowTaskDetails] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)

  // Mock task data - in real implementation, this would come from the database
  const mockTasks = [
    {
      id: 'task-1',
      title: 'Attend: Team Standup',
      description: 'Daily standup meeting to discuss progress and blockers',
      assignee: 'Dr. Sarah Johnson',
      assigneeId: 'user-1',
      type: 'meeting',
      priority: 'medium',
      status: 'todo',
      due_date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      created_at: new Date().toISOString(),
      meeting_id: 'meeting-1',
      channel_id: channel.id,
      tags: ['meeting', 'scheduled'],
      estimated_duration: '30 minutes',
      location: 'Conference Room A',
      organizer: 'Dr. Emily Rodriguez'
    },
    {
      id: 'task-2',
      title: 'Review Patient Charts',
      description: 'Review and update patient charts for upcoming appointments',
      assignee: 'Nurse Mike Chen',
      assigneeId: 'user-2',
      type: 'clinical',
      priority: 'high',
      status: 'in-progress',
      due_date: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
      created_at: new Date().toISOString(),
      channel_id: channel.id,
      tags: ['clinical', 'urgent'],
      estimated_duration: '2 hours',
      location: 'Nursing Station',
      organizer: 'Dr. Sarah Johnson'
    },
    {
      id: 'task-3',
      title: 'Update Medication Inventory',
      description: 'Check and update medication inventory levels',
      assignee: 'Admin Lisa Park',
      assigneeId: 'user-3',
      type: 'administrative',
      priority: 'low',
      status: 'done',
      due_date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      created_at: new Date().toISOString(),
      channel_id: channel.id,
      tags: ['admin', 'inventory'],
      estimated_duration: '1 hour',
      location: 'Pharmacy',
      organizer: 'Dr. David Kim'
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'done': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Calendar className="h-4 w-4" />
      case 'clinical': return <FileText className="h-4 w-4" />
      case 'administrative': return <Users className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const handleTaskClick = (task: any) => {
    setSelectedTask(task)
    setShowTaskDetails(true)
  }

  const handleTaskStatusChange = (taskId: string, newStatus: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
  }

  const handleCreateTask = () => {
    // In a real implementation, this would open a task creation modal
    alert('Task creation feature would open here. This would integrate with the main task management system.')
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Task Integration - {channel.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Task Summary */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{mockTasks.length}</div>
                <div className="text-sm text-blue-800">Total Tasks</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {mockTasks.filter(t => t.status === 'todo').length}
                </div>
                <div className="text-sm text-yellow-800">Pending</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {mockTasks.filter(t => t.status === 'in-progress').length}
                </div>
                <div className="text-sm text-orange-800">In Progress</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {mockTasks.filter(t => t.status === 'done').length}
                </div>
                <div className="text-sm text-green-800">Completed</div>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Channel Tasks</h3>
                <Button onClick={handleCreateTask} size="sm">
                  Create Task
                </Button>
              </div>
              
              {mockTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(task.type)}
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>👤 {task.assignee}</span>
                        <span>📅 {new Date(task.due_date).toLocaleDateString()}</span>
                        <span>⏱️ {task.estimated_duration}</span>
                        <span>📍 {task.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.status === 'todo' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleTaskStatusChange(task.id, 'in-progress')
                          }}
                        >
                          Start
                        </Button>
                      )}
                      {task.status === 'in-progress' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleTaskStatusChange(task.id, 'done')
                          }}
                        >
                          Complete
                        </Button>
                      )}
                      {task.status === 'done' && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Meeting Integration */}
            {meetingData && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Meeting Integration</h4>
                <div className="text-sm text-blue-800">
                  <p><strong>Meeting:</strong> {meetingData.title}</p>
                  <p><strong>Date:</strong> {meetingData.startDate} at {meetingData.startTime}</p>
                  <p><strong>Duration:</strong> {meetingData.duration} minutes</p>
                  <p><strong>Participants:</strong> {meetingData.participants.length} people</p>
                  <p><strong>Tasks Created:</strong> {meetingData.participants.length + 1} tasks</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Details Modal */}
      <Dialog open={showTaskDetails} onOpenChange={setShowTaskDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">{selectedTask.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedTask.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Assignee</label>
                  <p className="text-sm text-gray-900">{selectedTask.assignee}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  <Badge className={getPriorityColor(selectedTask.priority)}>
                    {selectedTask.priority}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <Badge className={getStatusColor(selectedTask.status)}>
                    {selectedTask.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Due Date</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedTask.due_date).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Duration</label>
                  <p className="text-sm text-gray-900">{selectedTask.estimated_duration}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <p className="text-sm text-gray-900">{selectedTask.location}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Tags</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedTask.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowTaskDetails(false)} className="flex-1">
                  Close
                </Button>
                <Button onClick={() => setShowTaskDetails(false)} className="flex-1">
                  Edit Task
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
