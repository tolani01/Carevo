'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { MessageBubble } from './MessageBubble'
import { FileUpload } from './FileUpload'
import { 
  ArrowLeft, 
  MoreVertical, 
  Phone, 
  Video, 
  Search,
  Paperclip,
  Send,
  Smile
} from 'lucide-react'

interface MobileChatLayoutProps {
  channel: any
  messages: any[]
  onBack: () => void
  onSendMessage: (content: string) => void
  onSendFile: (files: File[]) => void
}

export function MobileChatLayout({
  channel,
  messages,
  onBack,
  onSendMessage,
  onSendFile
}: MobileChatLayoutProps) {
  const [message, setMessage] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [showAttach, setShowAttach] = useState(false)

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
    setShowAttach(false)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50" data-testid="mobile-chat">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
            data-testid="back-button"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">
                {channel?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="font-medium text-gray-900">{channel?.name}</h1>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 min-h-[44px] min-w-[44px]"
            aria-label="Video call"
          >
            <Video className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 min-h-[44px] min-w-[44px]"
            aria-label="Voice call"
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 min-h-[44px] min-w-[44px]"
            aria-label="More options"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.sender.id === 'current-user'}
          />
        ))}
      </div>

      {/* File Upload Overlay */}
      {showAttach && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end z-10">
          <div className="bg-white w-full p-4 rounded-t-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Attach File</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAttach(false)}
                className="p-2 min-h-[44px] min-w-[44px]"
                aria-label="Close file upload"
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

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAttach(true)}
            className="p-2 min-h-[44px] min-w-[44px]"
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
              className="pr-10 min-h-[44px]"
              data-testid="mobile-input"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmoji(!showEmoji)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 min-h-[32px] min-w-[32px]"
              aria-label="Add emoji"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-2 min-h-[44px] min-w-[44px]"
            data-testid="send-button"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
