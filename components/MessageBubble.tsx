'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Download, 
  Eye, 
  MoreVertical, 
  Check, 
  CheckCheck,
  Clock,
  AlertCircle
} from 'lucide-react'

interface MessageBubbleProps {
  message: {
    id: string
    content: string
    timestamp: string
    sender: {
      id: string
      name: string
      avatar?: string
    }
    type: 'text' | 'image' | 'file' | 'system'
    status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'
    attachments?: Array<{
      id: string
      name: string
      type: string
      size: number
      url?: string
    }>
  }
  isOwn: boolean
  onReply?: (message: any) => void
  onReact?: (messageId: string, emoji: string) => void
}

export function MessageBubble({ message, isOwn, onReply, onReact }: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400" />
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      case 'failed':
        return <AlertCircle className="h-3 w-3 text-red-500" />
      default:
        return null
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️'
    if (type.includes('pdf')) return '📄'
    if (type.includes('word')) return '📝'
    if (type.includes('excel')) return '📊'
    return '📎'
  }

  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-2">
        <Badge variant="secondary" className="text-xs">
          {message.content}
        </Badge>
      </div>
    )
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        {/* Sender name for group chats */}
        {!isOwn && (
          <p className="text-xs text-gray-600 mb-1 px-2">
            {message.sender.name}
          </p>
        )}
        
        {/* Message bubble */}
        <div
          className={`
            relative px-3 py-2 rounded-lg
            ${isOwn 
              ? 'bg-green-500 text-white' 
              : 'bg-white text-gray-900 border border-gray-200'
            }
            ${showActions ? 'shadow-lg' : ''}
          `}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          {/* Message content */}
          {message.type === 'text' && (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}
          
          {message.type === 'image' && message.attachments?.[0] && (
            <div className="space-y-2">
              <img
                src={message.attachments[0].url || '/placeholder-image.jpg'}
                alt={message.attachments[0].name}
                className="rounded max-w-full h-auto"
              />
              {message.content && (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          )}
          
          {message.type === 'file' && message.attachments?.[0] && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                <span className="text-lg">{getFileIcon(message.attachments[0].type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {message.attachments[0].name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(message.attachments[0].size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (message.attachments?.[0]?.url) {
                      window.open(message.attachments[0].url, '_blank')
                    }
                  }}
                  className="p-1"
                  aria-label={`Download ${message.attachments[0].name}`}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              {message.content && (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          )}

          {/* Message actions */}
          {showActions && (
            <div className="absolute top-0 right-0 transform translate-x-full -translate-y-2 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply?.(message)}
                className="h-8 w-8 p-0 bg-white shadow-md"
                aria-label="Reply to message"
              >
                ↩️
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReact?.(message.id, '👍')}
                className="h-8 w-8 p-0 bg-white shadow-md"
                aria-label="React with thumbs up"
              >
                👍
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowActions(!showActions)}
                className="h-8 w-8 p-0 bg-white shadow-md"
                aria-label="More actions"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Timestamp and status */}
        <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-500">
            {formatTime(message.timestamp)}
          </span>
          {isOwn && getStatusIcon(message.status)}
        </div>
      </div>
    </div>
  )
}
