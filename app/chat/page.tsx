'use client'

import { useState, useEffect } from 'react'
import { RealTimeProvider, useRealTime } from '@/lib/providers/RealTimeProvider'
import { WhatsAppChatLayout } from '@/components/WhatsAppChatLayout'
import { MobileChatLayout } from '@/components/MobileChatLayout'

// Mock channels data
const mockChannels = [
  {
    id: '1',
    name: 'General',
    lastMessage: {
      content: 'Hey team, how are we doing today?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    unreadCount: 2
  },
  {
    id: '2',
    name: 'Development',
    lastMessage: {
      content: 'The new feature is ready for testing',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    unreadCount: 0
  },
  {
    id: '3',
    name: 'Design',
    lastMessage: {
      content: 'Can we review the new mockups?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
    },
    unreadCount: 5
  },
  {
    id: '4',
    name: 'Support',
    lastMessage: {
      content: 'Customer reported an issue with login',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
    },
    unreadCount: 0
  }
]

function ChatContent() {
  const [selectedChannel, setSelectedChannel] = useState<any>(null)
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

  const handleSearch = (query: string) => {
    console.log('Search query:', query)
    // TODO: Implement search functionality
  }

  const handleProfileClick = () => {
    console.log('Profile clicked')
    // TODO: Open profile modal
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
      channels={mockChannels}
      selectedChannel={selectedChannel}
      onChannelSelect={setSelectedChannel}
      onSearch={handleSearch}
      onProfileClick={handleProfileClick}
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