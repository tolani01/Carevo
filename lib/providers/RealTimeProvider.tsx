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
  attachments?: Array<{
    id: string
    name: string
    type: string
    size: number
    url?: string
  }>
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
