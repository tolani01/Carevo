'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { TaskIntegration } from './TaskIntegration'
import { ContextViewer } from './ContextViewer'
import { NotificationContainer } from './NotificationToast'
import { useNotifications } from '../lib/hooks/use-notifications'
import { 
  MoreVertical, 
  Info, 
  Bell, 
  BellOff, 
  Pin, 
  PinOff, 
  Search, 
  Archive, 
  Calendar, 
  Users, 
  FileText,
  Phone,
  Video,
  Share2,
  Settings,
  CheckSquare
} from 'lucide-react'

interface ChatMenuProps {
  channel: any
  onClose: () => void
  onMuteToggle?: (channelId: string, muted: boolean) => void
  onPinToggle?: (channelId: string, pinned: boolean) => void
  onArchive?: (channelId: string) => void
  onStartCall?: (channelId: string, type: 'voice' | 'video') => void
  onScheduleMeeting?: (channelId: string, meetingData: any) => void
}

export function ChatMenu({ 
  channel, 
  onClose, 
  onMuteToggle, 
  onPinToggle, 
  onArchive,
  onStartCall,
  onScheduleMeeting 
}: ChatMenuProps) {
  const { notifications, removeNotification, showSuccess, showError } = useNotifications()
  const [showInfo, setShowInfo] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showMeeting, setShowMeeting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [meetingTitle, setMeetingTitle] = useState('')
  const [meetingDate, setMeetingDate] = useState('')
  const [meetingTime, setMeetingTime] = useState('')
  const [meetingDuration, setMeetingDuration] = useState('60')
  const [meetingDescription, setMeetingDescription] = useState('')
  const [isMuted, setIsMuted] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [selectedParticipants, setSelectedParticipants] = useState<any[]>([])
  const [showTasks, setShowTasks] = useState(false)
  const [scheduledMeeting, setScheduledMeeting] = useState<any>(null)
  const [showContext, setShowContext] = useState(false)
  const [selectedContext, setSelectedContext] = useState<any>(null)

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
    onMuteToggle?.(channel.id, !isMuted)
    // Keep menu open for mute/unmute
  }

  const handlePinToggle = () => {
    setIsPinned(!isPinned)
    onPinToggle?.(channel.id, !isPinned)
    // Keep menu open for pin/unpin
  }

  const handleArchive = () => {
    onArchive?.(channel.id)
    // Close menu after archive action
    onClose()
  }

  const handleStartCall = (type: 'voice' | 'video') => {
    onStartCall?.(channel.id, type)
    // Close menu when starting a call
    onClose()
  }

  const handleSearchMessages = () => {
    if (searchQuery.trim()) {
      // Enhanced mock search results with different content types
      const mockResults = [
        {
          id: 'msg-1',
          content: `Patient consultation notes: ${searchQuery} - Patient showed improvement in symptoms. Recommended follow-up in 2 weeks.`,
          sender: 'Dr. Sarah Johnson',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          type: 'message',
          attachments: [
            { name: 'patient-chart.pdf', type: 'PDF' },
            { name: 'lab-results.xlsx', type: 'Excel' }
          ]
        },
        {
          id: 'task-1',
          title: `Review ${searchQuery} patient files`,
          description: `Complete review of patient files for ${searchQuery} case. Check all documentation and prepare summary report.`,
          assignee: 'Nurse Mike Chen',
          assigneeName: 'Nurse Mike Chen',
          type: 'task',
          priority: 'high',
          status: 'in-progress',
          due_date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          tags: ['urgent', 'patient-care', 'documentation']
        },
        {
          id: 'doc-1',
          title: `${searchQuery} Treatment Protocol`,
          description: `Updated treatment protocol for ${searchQuery} cases. Includes new medication guidelines and follow-up procedures.`,
          documentType: 'Protocol',
          size: '2.4 MB',
          sharedBy: 'Dr. Emily Rodriguez',
          sharedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          type: 'document'
        },
        {
          id: 'msg-2', 
          content: `Meeting notes from ${searchQuery} discussion: Team agreed on new workflow. Action items assigned to each department.`,
          sender: 'Admin Lisa Park',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
          type: 'message'
        }
      ]
      setSearchResults(mockResults)
    }
  }

  const handleViewContext = (result: any) => {
    setSelectedContext(result)
    setShowContext(true)
  }

  const handleScheduleMeeting = () => {
    if (meetingTitle && meetingDate && meetingTime) {
      const meetingDateTime = new Date(`${meetingDate}T${meetingTime}`)
      const endDateTime = new Date(meetingDateTime.getTime() + parseInt(meetingDuration) * 60000)
      
      const meetingData = {
        id: `meeting-${Date.now()}`,
        title: meetingTitle,
        description: meetingDescription,
        startDate: meetingDate,
        startTime: meetingTime,
        duration: parseInt(meetingDuration),
        endTime: endDateTime.toTimeString().slice(0, 5),
        participants: selectedParticipants,
        channelId: channel.id,
        organizer: 'Current User', // In real app, get from auth context
        status: 'scheduled',
        createdAt: new Date().toISOString()
      }

      // Create tasks for all participants including organizer
      const allParticipants = selectedParticipants.length > 0 
        ? selectedParticipants.concat([{ id: 'organizer', name: 'Current User' }])
        : [{ id: 'organizer', name: 'Current User' }]
      
      const meetingTasks = allParticipants.map(participant => ({
        id: `task-${Date.now()}-${participant.id}`,
        title: `Attend: ${meetingTitle}`,
        description: `Meeting scheduled for ${meetingDate} at ${meetingTime} (${meetingDuration} minutes)\n\n${meetingDescription}`,
        assignee: participant.id,
        assigneeName: participant.name,
        type: 'meeting',
        priority: 'medium',
        status: 'todo',
        due_date: meetingDateTime.toISOString(),
        created_at: new Date().toISOString(),
        meeting_id: meetingData.id,
        channel_id: channel.id
      }))

      console.log('Creating meeting:', meetingData)
      console.log('Creating tasks for participants:', meetingTasks)
      
      // In a real implementation, this would:
      // 1. Create the meeting in the database
      // 2. Create tasks for all participants
      // 3. Send notifications
      // 4. Add to calendar
      
      const participantMessage = selectedParticipants.length > 0 
        ? `Tasks created for ${meetingTasks.length} participants.`
        : `Meeting created for organizer only.`
      
      showSuccess(
        'Meeting Scheduled Successfully',
        `"${meetingTitle}" has been scheduled!\n\n${participantMessage}\n\n📅 Date: ${meetingDate}\n⏰ Time: ${meetingTime}\n⏱️ Duration: ${meetingDuration} minutes`,
        0 // No auto-dismiss
      )
      
      onScheduleMeeting?.(channel.id, meetingData)
      setScheduledMeeting(meetingData)
      setShowMeeting(false)
      onClose()
    } else {
      showError(
        'Missing Required Fields',
        'Please fill in all required fields:\n• Meeting Title\n• Date\n• Start Time',
        0 // No auto-dismiss
      )
    }
  }

  const handleParticipantToggle = (participant: any) => {
    if (selectedParticipants.find(p => p.id === participant.id)) {
      setSelectedParticipants(selectedParticipants.filter(p => p.id !== participant.id))
    } else {
      setSelectedParticipants([...selectedParticipants, participant])
    }
  }

  const menuItems = [
    {
      label: 'Channel Info',
      icon: Info,
      action: () => setShowInfo(true),
      description: 'View channel details and participants'
    },
    {
      label: isMuted ? 'Unmute Notifications' : 'Mute Notifications',
      icon: isMuted ? Bell : BellOff,
      action: handleMuteToggle,
      description: isMuted ? 'Enable notifications for this channel' : 'Disable notifications for this channel'
    },
    {
      label: isPinned ? 'Unpin Chat' : 'Pin Chat',
      icon: isPinned ? PinOff : Pin,
      action: handlePinToggle,
      description: isPinned ? 'Remove from pinned chats' : 'Pin to top of chat list'
    },
    {
      label: 'Search Messages',
      icon: Search,
      action: () => setShowSearch(true),
      description: 'Find specific messages in this chat'
    },
    {
      label: 'Schedule Meeting',
      icon: Calendar,
      action: () => setShowMeeting(true),
      description: 'Create a meeting with participants'
    },
    {
      label: 'View Tasks',
      icon: CheckSquare,
      action: () => setShowTasks(true),
      description: 'View and manage channel tasks'
    },
    {
      label: 'Start Voice Call',
      icon: Phone,
      action: () => handleStartCall('voice'),
      description: 'Start a voice call with participants'
    },
    {
      label: 'Start Video Call',
      icon: Video,
      action: () => handleStartCall('video'),
      description: 'Start a video call with participants'
    },
    {
      label: 'Archive Chat',
      icon: Archive,
      action: handleArchive,
      description: 'Archive this chat conversation'
    }
  ]

  return (
    <>
      <div className="absolute right-2 top-2 z-50">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-64">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              data-menu-item
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <item.icon className="h-4 w-4 text-gray-600" />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.label}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Channel Info Modal */}
      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Channel Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Channel Name</label>
              <p className="text-gray-900 font-medium">{channel.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Type</label>
              <Badge variant={channel.type === 'group' ? 'default' : 'secondary'}>
                {channel.type === 'group' ? 'Group Chat' : 'Direct Message'}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Participants</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {(channel.members || []).map((member: any, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {member.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Created</label>
              <p className="text-gray-600 text-sm">
                {new Date(channel.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Search Modal */}
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Search Messages in {channel.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages in this chat..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSearchMessages()}
              />
              <Button onClick={handleSearchMessages} disabled={!searchQuery.trim()}>
                Search
              </Button>
            </div>
            
            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <h4 className="font-medium text-gray-900">Search Results ({searchResults.length})</h4>
                {searchResults.map((result) => (
                  <div key={result.id} className="p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {result.type === 'message' && (
                          <>
                            <p className="text-sm text-gray-900">{result.content}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">{result.sender}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">
                                {new Date(result.timestamp).toLocaleString()}
                              </span>
                              {result.attachments && result.attachments.length > 0 && (
                                <>
                                  <span className="text-xs text-gray-400">•</span>
                                  <span className="text-xs text-blue-600">
                                    {result.attachments.length} attachment(s)
                                  </span>
                                </>
                              )}
                            </div>
                          </>
                        )}
                        {result.type === 'task' && (
                          <>
                            <p className="text-sm font-medium text-gray-900">{result.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{result.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className="text-xs bg-red-100 text-red-800">
                                {result.priority}
                              </Badge>
                              <Badge className="text-xs bg-yellow-100 text-yellow-800">
                                {result.status}
                              </Badge>
                              <span className="text-xs text-gray-500">Assigned to: {result.assignee}</span>
                            </div>
                          </>
                        )}
                        {result.type === 'document' && (
                          <>
                            <p className="text-sm font-medium text-gray-900">{result.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{result.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">{result.documentType}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">{result.size}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">Shared by {result.sharedBy}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => handleViewContext(result)}
                      >
                        View Context
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {searchQuery && searchResults.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No messages found for "{searchQuery}"
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Meeting Scheduler Modal */}
      <Dialog open={showMeeting} onOpenChange={setShowMeeting}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Meeting</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Meeting Title *</label>
              <Input
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder="Enter meeting title..."
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={meetingDescription}
                onChange={(e) => setMeetingDescription(e.target.value)}
                placeholder="Meeting agenda, topics to discuss..."
                className="w-full p-3 border border-gray-300 rounded-md resize-none"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Date *</label>
                <Input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Start Time *</label>
                <select
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select time...</option>
                  {Array.from({ length: 96 }, (_, i) => {
                    const hours = Math.floor(i / 4);
                    const minutes = (i % 4) * 15;
                    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                    const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    });
                    return (
                      <option key={timeString} value={timeString}>
                        {displayTime}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Duration (min)</label>
                <select
                  value={meetingDuration}
                  onChange={(e) => setMeetingDuration(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Participants (Optional)</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowParticipants(!showParticipants)}
                >
                  {showParticipants ? 'Hide' : 'Add'} Participants
                </Button>
              </div>
              
              {showParticipants && (
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-3">
                  {(channel.members || []).map((member: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedParticipants.find(p => p.id === member.id) !== undefined}
                          onChange={() => handleParticipantToggle(member)}
                          className="rounded"
                        />
                        <span className="text-sm">{member.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedParticipants.map((member: any, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {member.name}
                  </Badge>
                ))}
                {selectedParticipants.length === 0 && (
                  <span className="text-xs text-gray-500 italic">
                    No participants selected (meeting will be created without specific attendees)
                  </span>
                )}
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Meeting Summary</h4>
              <div className="text-sm text-blue-800">
                <p><strong>Title:</strong> {meetingTitle || 'Not specified'}</p>
                <p><strong>Date:</strong> {meetingDate || 'Not specified'} at {meetingTime || 'Not specified'}</p>
                <p><strong>Duration:</strong> {meetingDuration} minutes</p>
                <p><strong>Participants:</strong> {selectedParticipants.length > 0 ? `${selectedParticipants.length} people` : 'No specific attendees'}</p>
                {meetingDescription && <p><strong>Description:</strong> {meetingDescription}</p>}
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowMeeting(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleScheduleMeeting} 
                className="flex-1"
                disabled={!meetingTitle || !meetingDate || !meetingTime}
              >
                Schedule Meeting
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Integration Modal */}
      <TaskIntegration
        isOpen={showTasks}
        onClose={() => setShowTasks(false)}
        channel={channel}
        meetingData={scheduledMeeting}
      />

      {/* Context Viewer Modal */}
      <ContextViewer
        isOpen={showContext}
        onClose={() => setShowContext(false)}
        contextData={selectedContext}
      />

      {/* Notifications */}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </>
  )
}
