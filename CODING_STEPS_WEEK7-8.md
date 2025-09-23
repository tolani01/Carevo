# Weeks 7-8 Coding Steps - Sprint 4: Chat Interface

## 🚀 **Sprint 4 Goals**
- WhatsApp-like chat redesign
- Working file attachment system
- Real-time messaging features
- Mobile-optimized chat experience

---

## Week 7: WhatsApp Layout & File Attachments

### Day 21: WhatsApp Desktop Layout
**Goal**: Create exact WhatsApp desktop interface

#### Step 21.1: Create WhatsAppChatLayout Component
```bash
touch components/WhatsAppChatLayout.tsx
```

**File: `components/WhatsAppChatLayout.tsx`**
```typescript
'use client'

import { useState } from 'react'
import { ChannelList } from './ChannelList'
import { ChatPane } from './ChatPane'
import { SearchBar } from './SearchBar'
import { UserProfile } from './UserProfile'

interface WhatsAppChatLayoutProps {
  channels: any[]
  selectedChannel: any
  onChannelSelect: (channel: any) => void
  onSearch: (query: string) => void
  onProfileClick: () => void
}

export function WhatsAppChatLayout({
  channels,
  selectedChannel,
  onChannelSelect,
  onSearch,
  onProfileClick
}: WhatsAppChatLayoutProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Panel - Channels */}
      <div className="w-1/3 bg-white border-r border-gray-300 flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-300">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-800">Carevo Chat</h1>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-200 rounded-full">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-full">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={onSearch}
              placeholder="Search or start new chat"
            />
          </div>
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto">
          <ChannelList
            channels={channels}
            selectedChannel={selectedChannel}
            onChannelSelect={onChannelSelect}
            searchQuery={searchQuery}
          />
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className="flex-1 flex flex-col">
        {selectedChannel ? (
          <ChatPane
            channel={selectedChannel}
            onSendMessage={(message) => console.log('Send:', message)}
            onSendFile={(file) => console.log('Send file:', file)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">WhatsApp Web</h3>
              <p className="text-gray-600">Send and receive messages without keeping your phone online.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

#### Step 21.2: Update ChannelList with WhatsApp Styling
**File: `components/ChannelList.tsx`** (update existing)

```typescript
'use client'

import { useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Plus, Search } from 'lucide-react'

interface ChannelListProps {
  channels: any[]
  selectedChannel: any
  onChannelSelect: (channel: any) => void
  searchQuery: string
}

export function ChannelList({ channels, selectedChannel, onChannelSelect, searchQuery }: ChannelListProps) {
  const [showNewChat, setShowNewChat] = useState(false)

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      {/* New Chat Button */}
      <div className="p-3 border-b border-gray-200">
        <Button
          onClick={() => setShowNewChat(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto">
        {filteredChannels.map((channel) => (
          <div
            key={channel.id}
            onClick={() => onChannelSelect(channel)}
            className={`
              flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100
              ${selectedChannel?.id === channel.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''}
            `}
          >
            {/* Avatar */}
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
              <span className="text-gray-600 font-medium">
                {channel.name.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Channel Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900 truncate">
                  {channel.name}
                </h3>
                <span className="text-xs text-gray-500">
                  {channel.lastMessage?.timestamp ? 
                    new Date(channel.lastMessage.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : ''
                  }
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 truncate">
                  {channel.lastMessage?.content || 'No messages yet'}
                </p>
                {channel.unreadCount > 0 && (
                  <Badge className="bg-green-500 text-white text-xs">
                    {channel.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Day 22: File Attachment System
**Goal**: Implement working file upload and preview

#### Step 22.1: Create FileUpload Component
```bash
touch components/FileUpload.tsx
```

**File: `components/FileUpload.tsx`**
```typescript
'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { 
  Paperclip, 
  Image, 
  File, 
  X, 
  Upload,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface FileUploadProps {
  onFileSelect: (files: File[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
}

export function FileUpload({ 
  onFileSelect, 
  maxFiles = 5, 
  maxSize = 10,
  acceptedTypes = ['image/*', 'application/pdf', 'text/*']
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }

    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1))
      }
      return file.type === type
    })

    if (!isValidType) {
      return `File type not supported. Allowed: ${acceptedTypes.join(', ')}`
    }

    return null
  }

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: File[] = []
    const newErrors: Record<string, string> = {}

    Array.from(selectedFiles).forEach((file) => {
      const error = validateFile(file)
      if (error) {
        newErrors[file.name] = error
      } else {
        newFiles.push(file)
      }
    })

    // Check max files limit
    if (files.length + newFiles.length > maxFiles) {
      newErrors['limit'] = `Maximum ${maxFiles} files allowed`
    }

    setErrors(newErrors)
    
    if (newFiles.length > 0) {
      const updatedFiles = [...files, ...newFiles]
      setFiles(updatedFiles)
      onFileSelect(updatedFiles)
    }
  }, [files, maxFiles, maxSize, acceptedTypes, onFileSelect])

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onFileSelect(updatedFiles)
  }

  const simulateUpload = async (file: File) => {
    return new Promise<void>((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          resolve()
        }
        setUploadProgress(prev => ({ ...prev, [file.name]: progress }))
      }, 200)
    })
  }

  const handleUpload = async () => {
    setUploading(true)
    setErrors({})

    try {
      for (const file of files) {
        await simulateUpload(file)
      }
      
      // Clear files after successful upload
      setFiles([])
      onFileSelect([])
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
      setUploadProgress({})
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />
    }
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Upload Button */}
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || files.length >= maxFiles}
        className="w-full"
      >
        <Paperclip className="h-4 w-4 mr-2" />
        Attach Files
        {files.length > 0 && (
          <Badge variant="secondary" className="ml-2">
            {files.length}
          </Badge>
        )}
      </Button>

      {/* Error Messages */}
      {Object.keys(errors).length > 0 && (
        <div className="space-y-1">
          {Object.entries(errors).map(([key, error]) => (
            <div key={key} className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          ))}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="text-gray-600">
                {getFileIcon(file)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
                
                {/* Upload Progress */}
                {uploading && uploadProgress[file.name] !== undefined && (
                  <div className="mt-2">
                    <Progress value={uploadProgress[file.name]} className="h-1" />
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                disabled={uploading}
                className="p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Upload Files
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
```

#### Step 22.2: Create MessageBubble Component
```bash
touch components/MessageBubble.tsx
```

**File: `components/MessageBubble.tsx`**
```typescript
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
              >
                ↩️
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReact?.(message.id, '👍')}
                className="h-8 w-8 p-0 bg-white shadow-md"
              >
                👍
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowActions(!showActions)}
                className="h-8 w-8 p-0 bg-white shadow-md"
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
```

### Day 23: Real-time Features
**Goal**: Add live messaging and presence indicators

#### Step 23.1: Create RealTimeProvider
```bash
touch lib/providers/RealTimeProvider.tsx
```

**File: `lib/providers/RealTimeProvider.tsx`**
```typescript
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface Message {
  id: string
  content: string
  timestamp: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  channelId: string
  type: 'text' | 'image' | 'file' | 'system'
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'
}

interface User {
  id: string
  name: string
  avatar?: string
  status: 'online' | 'away' | 'busy' | 'offline'
  lastSeen?: string
}

interface RealTimeContextType {
  messages: Message[]
  onlineUsers: User[]
  isConnected: boolean
  sendMessage: (channelId: string, content: string, type?: string) => void
  sendFile: (channelId: string, file: File) => void
  markAsRead: (channelId: string) => void
  setTyping: (channelId: string, isTyping: boolean) => void
  typingUsers: Record<string, string[]>
}

const RealTimeContext = createContext<RealTimeContextType | undefined>(undefined)

interface RealTimeProviderProps {
  children: ReactNode
}

export function RealTimeProvider({ children }: RealTimeProviderProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({})

  // Mock WebSocket connection
  useEffect(() => {
    // Simulate connection
    const timer = setTimeout(() => {
      setIsConnected(true)
      setOnlineUsers([
        { id: '1', name: 'Dr. Smith', status: 'online' },
        { id: '2', name: 'Nurse Johnson', status: 'away' },
        { id: '3', name: 'Admin User', status: 'online' }
      ])
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const sendMessage = (channelId: string, content: string, type: string = 'text') => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toISOString(),
      sender: {
        id: 'current-user',
        name: 'You'
      },
      channelId,
      type: type as any,
      status: 'sending'
    }

    setMessages(prev => [...prev, message])

    // Simulate sending
    setTimeout(() => {
      setMessages(prev => 
        prev.map(m => 
          m.id === message.id 
            ? { ...m, status: 'sent' }
            : m
        )
      )
    }, 500)

    // Simulate delivery
    setTimeout(() => {
      setMessages(prev => 
        prev.map(m => 
          m.id === message.id 
            ? { ...m, status: 'delivered' }
            : m
        )
      )
    }, 1000)
  }

  const sendFile = (channelId: string, file: File) => {
    const message: Message = {
      id: Date.now().toString(),
      content: `Sent ${file.name}`,
      timestamp: new Date().toISOString(),
      sender: {
        id: 'current-user',
        name: 'You'
      },
      channelId,
      type: 'file',
      status: 'sending',
      attachments: [{
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size
      }]
    }

    setMessages(prev => [...prev, message])

    // Simulate file upload
    setTimeout(() => {
      setMessages(prev => 
        prev.map(m => 
          m.id === message.id 
            ? { ...m, status: 'sent' }
            : m
        )
      )
    }, 2000)
  }

  const markAsRead = (channelId: string) => {
    setMessages(prev => 
      prev.map(m => 
        m.channelId === channelId && m.sender.id !== 'current-user'
          ? { ...m, status: 'read' }
          : m
      )
    )
  }

  const setTyping = (channelId: string, isTyping: boolean) => {
    setTypingUsers(prev => {
      const current = prev[channelId] || []
      const updated = isTyping 
        ? [...current, 'current-user']
        : current.filter(id => id !== 'current-user')
      
      return {
        ...prev,
        [channelId]: updated
      }
    })
  }

  return (
    <RealTimeContext.Provider value={{
      messages,
      onlineUsers,
      isConnected,
      sendMessage,
      sendFile,
      markAsRead,
      setTyping,
      typingUsers
    }}>
      {children}
    </RealTimeContext.Provider>
  )
}

export function useRealTime() {
  const context = useContext(RealTimeContext)
  if (context === undefined) {
    throw new Error('useRealTime must be used within a RealTimeProvider')
  }
  return context
}
```

### Day 24: Mobile Chat Optimization
**Goal**: Create mobile-first chat experience

#### Step 24.1: Create MobileChatLayout Component
```bash
touch components/MobileChatLayout.tsx
```

**File: `components/MobileChatLayout.tsx`**
```typescript
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

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
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
          <Button variant="ghost" size="sm" className="p-2">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
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
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
          <div className="bg-white w-full p-4 rounded-t-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Attach File</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAttach(false)}
              >
                ✕
              </Button>
            </div>
            <FileUpload
              onFileSelect={(files) => {
                onSendFile(files)
                setShowAttach(false)
              }}
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
            className="p-2"
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
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmoji(!showEmoji)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-2"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
```

### Day 25: Integration & Testing
**Goal**: Wire everything together and add comprehensive tests

#### Step 25.1: Update Chat Page
**File: `app/chat/page.tsx`** (update existing)

```typescript
import { RealTimeProvider } from '../lib/providers/RealTimeProvider'
import { WhatsAppChatLayout } from '../components/WhatsAppChatLayout'
import { MobileChatLayout } from '../components/MobileChatLayout'
import { useRealTime } from '../lib/providers/RealTimeProvider'

function ChatContent() {
  const [selectedChannel, setSelectedChannel] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const { messages, sendMessage, sendFile } = useRealTime()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSendMessage = (content: string) => {
    if (selectedChannel) {
      sendMessage(selectedChannel.id, content)
    }
  }

  const handleSendFile = (files: File[]) => {
    if (selectedChannel) {
      files.forEach(file => sendFile(selectedChannel.id, file))
    }
  }

  if (isMobile) {
    return selectedChannel ? (
      <MobileChatLayout
        channel={selectedChannel}
        messages={messages.filter(m => m.channelId === selectedChannel.id)}
        onBack={() => setSelectedChannel(null)}
        onSendMessage={handleSendMessage}
        onSendFile={handleSendFile}
      />
    ) : (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Select a chat</h2>
          <p className="text-gray-600">Choose a conversation to start messaging</p>
        </div>
      </div>
    )
  }

  return (
    <WhatsAppChatLayout
      channels={channels}
      selectedChannel={selectedChannel}
      onChannelSelect={setSelectedChannel}
      onSearch={(query) => console.log('Search:', query)}
      onProfileClick={() => console.log('Profile clicked')}
    />
  )
}

export default function ChatPage() {
  return (
    <RealTimeProvider>
      <ChatContent />
    </RealTimeProvider>
  )
}
```

#### Step 25.2: Add Integration Tests
```bash
touch tests/integration/chat-interface.spec.ts
```

**File: `tests/integration/chat-interface.spec.ts`**
```typescript
import { test, expect } from '@playwright/test'

test('WhatsApp chat interface', async ({ page }) => {
  await page.goto('/chat')
  
  // Should show channel list
  await expect(page.locator('text=Carevo Chat')).toBeVisible()
  await expect(page.locator('text=New Chat')).toBeVisible()
  
  // Click on a channel
  await page.click('[data-testid="channel-item"]:first-child')
  
  // Should show chat interface
  await expect(page.locator('text=Type a message')).toBeVisible()
  
  // Send a message
  await page.fill('[data-testid="message-input"]', 'Hello team!')
  await page.click('[data-testid="send-button"]')
  
  // Should show message in chat
  await expect(page.locator('text=Hello team!')).toBeVisible()
})

test('file attachment functionality', async ({ page }) => {
  await page.goto('/chat')
  
  // Select a channel
  await page.click('[data-testid="channel-item"]:first-child')
  
  // Click attach button
  await page.click('[data-testid="attach-button"]')
  
  // Should show file upload
  await expect(page.locator('text=Attach File')).toBeVisible()
  
  // Upload a file (mock)
  await page.setInputFiles('[data-testid="file-input"]', {
    name: 'test.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('test content')
  })
  
  // Should show file in upload list
  await expect(page.locator('text=test.pdf')).toBeVisible()
  
  // Click upload
  await page.click('text=Upload Files')
  
  // Should show file in chat
  await expect(page.locator('text=Sent test.pdf')).toBeVisible()
})

test('mobile chat interface', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/chat')
  
  // Should show mobile layout
  await expect(page.locator('[data-testid="mobile-chat"]')).toBeVisible()
  
  // Should have back button
  await expect(page.locator('[data-testid="back-button"]')).toBeVisible()
  
  // Should have mobile input
  await expect(page.locator('[data-testid="mobile-input"]')).toBeVisible()
})
```

---

## 🎯 **Week 7-8 Success Criteria**

By end of Day 25, you should have:
- [ ] Exact WhatsApp desktop layout
- [ ] Working file attachment system
- [ ] Real-time messaging features
- [ ] Mobile-optimized chat interface
- [ ] Message bubbles with status indicators
- [ ] File preview and download functionality
- [ ] Integration tests passing

## 🚀 **Ready for Sprint 5**

Next sprint we'll focus on:
1. **Profile System**: Role-based interface and security
2. **Notification Center**: Working preferences and controls
3. **Password Management**: Secure authentication flows

Sprint 4 chat interface is complete! 🎉
