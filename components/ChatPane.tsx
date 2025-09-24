'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { MessageBubble } from './MessageBubble'
import { FileUpload } from './FileUpload'
import { EmojiPicker } from './EmojiPicker'
import { ChatMenu } from './ChatMenu'
import { CallInterface } from './CallInterface'
import { NotificationContainer } from './NotificationToast'
import { useNotifications } from '../lib/hooks/use-notifications'
import { Paperclip, Send, Smile, MoreVertical } from 'lucide-react'

interface ChatPaneProps {
  channel: any
  messages: any[]
  onSendMessage: (content: string) => void
  onSendFile: (files: File[]) => void
}

export function ChatPane({ channel, messages, onSendMessage, onSendFile }: ChatPaneProps) {
  const [message, setMessage] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showCall, setShowCall] = useState(false)
  const [callType, setCallType] = useState<'voice' | 'video'>('voice')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const { notifications, removeNotification, showSuccess, showInfo } = useNotifications()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Close menu when clicking outside (but not on menu items or modals)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      // Don't close if clicking on menu items, modals, or their content
      const isMenuClick = menuRef.current?.contains(target)
      const isModalClick = document.querySelector('[role="dialog"]')?.contains(target)
      const isMenuButtonClick = (target as Element)?.closest('[data-menu-item]')
      const isModalOpen = document.querySelector('[role="dialog"]') !== null
      
      // Only close if no modals are open and click is truly outside
      if (!isMenuClick && !isModalClick && !isMenuButtonClick && !isModalOpen) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (files: File[]) => {
    onSendFile(files)
    setShowFileUpload(false)
  }

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji)
    setShowEmoji(false)
  }

  const handleStartCall = (channelId: string, type: 'voice' | 'video') => {
    setCallType(type)
    setShowCall(true)
    setShowMenu(false)
  }

  const handleScheduleMeeting = (channelId: string, meetingData: any) => {
    console.log('Scheduling meeting:', meetingData)
    
    // Create tasks for all participants
    const meetingTasks = meetingData.participants.map((participant: any) => ({
      id: `task-${Date.now()}-${participant.id}`,
      title: `Attend: ${meetingData.title}`,
      description: `Meeting scheduled for ${meetingData.startDate} at ${meetingData.startTime} (${meetingData.duration} minutes)\n\n${meetingData.description || 'No description provided'}`,
      assignee: participant.id,
      assigneeName: participant.name,
      type: 'meeting',
      priority: 'medium',
      status: 'todo',
      due_date: new Date(`${meetingData.startDate}T${meetingData.startTime}`).toISOString(),
      created_at: new Date().toISOString(),
      meeting_id: meetingData.id,
      channel_id: channelId,
      tags: ['meeting', 'scheduled']
    }))

    // Add organizer task
    const organizerTask = {
      id: `task-${Date.now()}-organizer`,
      title: `Organize: ${meetingData.title}`,
      description: `You are organizing this meeting scheduled for ${meetingData.startDate} at ${meetingData.startTime} (${meetingData.duration} minutes)\n\n${meetingData.description || 'No description provided'}`,
      assignee: 'current-user',
      assigneeName: 'Current User',
      type: 'meeting',
      priority: 'high',
      status: 'todo',
      due_date: new Date(`${meetingData.startDate}T${meetingData.startTime}`).toISOString(),
      created_at: new Date().toISOString(),
      meeting_id: meetingData.id,
      channel_id: channelId,
      tags: ['meeting', 'organizer', 'scheduled']
    }

    const allTasks = [...meetingTasks, organizerTask]
    
    console.log('Created tasks for meeting:', allTasks)
    
    // In a real implementation, this would:
    // 1. Save meeting to database
    // 2. Create tasks for all participants
    // 3. Send notifications
    // 4. Add to calendar
    // 5. Update task board
    
    showSuccess(
      'Meeting Scheduled Successfully',
      `"${meetingData.title}" has been scheduled!\n\n✅ Tasks created for ${allTasks.length} people\n📅 Meeting: ${meetingData.startDate} at ${meetingData.startTime}\n⏱️ Duration: ${meetingData.duration} minutes\n👥 Participants: ${meetingData.participants.length + 1} people`,
      0 // No auto-dismiss
    )
  }

  const handleMuteToggle = (channelId: string, muted: boolean) => {
    console.log('Channel muted:', channelId, muted)
    // In a real implementation, this would:
    // 1. Update user preferences
    // 2. Disable/enable notifications for this channel
    // 3. Update UI state
    
    if (muted) {
      showSuccess(
        'Channel Muted',
        'You will not receive notifications from this channel.',
        0 // No auto-dismiss
      )
    } else {
      showInfo(
        'Channel Unmuted',
        'You will now receive notifications from this channel.',
        0 // No auto-dismiss
      )
    }
  }

  const handlePinToggle = (channelId: string, pinned: boolean) => {
    console.log('Channel pinned:', channelId, pinned)
    // In a real implementation, this would:
    // 1. Update channel pin status
    // 2. Move channel to top of list
    // 3. Update UI state
    
    if (pinned) {
      showSuccess(
        'Channel Pinned',
        'This channel will appear at the top of your chat list.',
        0 // No auto-dismiss
      )
    } else {
      showInfo(
        'Channel Unpinned',
        'This channel will appear in its normal position.',
        0 // No auto-dismiss
      )
    }
  }

  const handleArchive = (channelId: string) => {
    console.log('Channel archived:', channelId)
    // In a real implementation, this would:
    // 1. Move channel to archived state
    // 2. Hide from active chat list
    // 3. Preserve message history
    // 4. Update UI state
    
    // Show confirmation notification first
    showInfo(
      'Archive Channel?',
      `Are you sure you want to archive "${channel.name}"? You can unarchive it later from Settings → Archived Chats.\n\nClick OK to confirm archiving.`,
      0 // No auto-dismiss
    )
    
    // Show success notification after user clicks OK (simulated with timeout)
    // In a real app, this would be triggered by a confirmation callback
    setTimeout(() => {
      showSuccess(
        'Channel Archived Successfully',
        `"${channel.name}" has been moved to your archived chats.\n\nTo retrieve it:\n1. Go to Settings → Archived Chats\n2. Find this channel\n3. Click "Unarchive" to restore it\n\nAll message history is preserved.`,
        0 // No auto-dismiss
      )
    }, 3000) // 3 second delay to allow user to click OK on first notification
  }

  if (!channel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center max-w-md mx-auto px-6">
          {/* Carevo Logo/Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          
          {/* Main Branding */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Carevo</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Healthcare Operations Excellence Platform</h2>
          
          {/* Key Phrases */}
          <div className="space-y-3 mb-8">
            <p className="text-lg text-gray-600 font-medium">"Less chaos, more patient care"</p>
            <p className="text-base text-gray-500">Boost your collective productivity</p>
            <p className="text-sm text-gray-400">Streamline operations • Enhance collaboration • Improve outcomes</p>
          </div>
          
          {/* Call to Action */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Select a channel to start collaborating:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">General</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Development</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Design</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">Support</span>
            </div>
          </div>
          
          {/* Footer Message */}
          <p className="text-xs text-gray-400 mt-6">
            Powered by AiPPcC • Healthcare Operations Excellence
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium">
              {channel.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="font-medium text-gray-900">{channel.name}</h2>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2"
            onClick={() => handleStartCall(channel.id, 'voice')}
            title="Start Voice Call"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2"
            onClick={() => handleStartCall(channel.id, 'video')}
            title="Start Video Call"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </Button>
          <div className="relative" ref={menuRef}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2"
              onClick={() => setShowMenu(!showMenu)}
              title="More Options"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
            
            {/* Three Dots Menu */}
            {showMenu && (
              <ChatMenu
                channel={channel}
                onClose={() => setShowMenu(false)}
                onMuteToggle={handleMuteToggle}
                onPinToggle={handlePinToggle}
                onArchive={handleArchive}
                onStartCall={handleStartCall}
                onScheduleMeeting={handleScheduleMeeting}
              />
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.sender.id === 'current-user'}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* File Upload Overlay */}
      {showFileUpload && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end z-10">
          <div className="bg-white w-full p-4 rounded-t-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Attach File</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFileUpload(false)}
              >
                ✕
              </Button>
            </div>
            <FileUpload
              onFileSelect={handleFileSelect}
              maxFiles={5}
              maxSize={10}
            />
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFileUpload(true)}
            className="p-2"
            data-testid="attach-button"
            aria-label="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="pr-10"
              data-testid="message-input"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmoji(!showEmoji)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
              aria-label="Add emoji"
            >
              <Smile className="h-4 w-4" />
            </Button>
            
            {/* Emoji Picker */}
            <EmojiPicker
              isOpen={showEmoji}
              onClose={() => setShowEmoji(false)}
              onEmojiSelect={handleEmojiSelect}
            />
          </div>
          
          <Button
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-2"
            data-testid="send-button"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Call Interface */}
      <CallInterface
        isOpen={showCall}
        onClose={() => setShowCall(false)}
        channel={channel}
        callType={callType}
        onEndCall={() => setShowCall(false)}
      />

      {/* Notifications */}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  )
}