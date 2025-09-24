'use client'

import { useState } from 'react'
import { ChannelList } from './ChannelList'
import { ChatPane } from './ChatPane'
import { SearchBar } from './SearchBar'

interface CarevoChatLayoutProps {
  channels: any[]
  selectedChannel: any
  onChannelSelect: (channel: any) => void
  onSearch: (query: string) => void
  onProfileClick: () => void
}

export function CarevoChatLayout({
  channels,
  selectedChannel,
  onChannelSelect,
  onSearch,
  onProfileClick
}: CarevoChatLayoutProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch(query)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Panel - Channels */}
      <div className="w-1/3 bg-white border-r border-gray-300 flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-300">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-800">Carevo Chat</h1>
            <div className="flex items-center gap-2">
              <button 
                className="p-2 hover:bg-gray-200 rounded-full"
                aria-label="Search"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button 
                className="p-2 hover:bg-gray-200 rounded-full"
                aria-label="More options"
                onClick={onProfileClick}
              >
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
              onSearch={handleSearch}
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
        <ChatPane
          channel={selectedChannel}
          messages={[]} // Will be populated by RealTimeProvider
          onSendMessage={(message) => console.log('Send:', message)}
          onSendFile={(files) => console.log('Send file:', files)}
        />
      </div>
    </div>
  )
}
