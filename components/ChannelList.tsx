'use client'

import { useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'

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
          <button
            key={channel.id}
            onClick={() => onChannelSelect(channel)}
            className={`
              w-full flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 text-left
              ${selectedChannel?.id === channel.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''}
            `}
            data-testid="channel-item"
            aria-label={`Select ${channel.name} channel`}
            role="button"
          >
            {/* Avatar */}
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
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
                <span className="text-xs text-gray-500 ml-2">
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
                  <Badge className="bg-green-500 text-white text-xs ml-2 flex-shrink-0">
                    {channel.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </button>
        ))}
        
        {filteredChannels.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            <p className="text-sm">No channels found</p>
            {searchQuery && (
              <p className="text-xs mt-1">Try a different search term</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}