'use client'

import { useState, useEffect, useRef } from 'react'
import * as React from 'react'
import { ChannelList } from './ChannelList'
import { ChatPane } from './ChatPane'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'

interface CarevoChatLayoutProps {
  channels: any[]
  selectedChannel: any
  onChannelSelect: (channel: any) => void
  onSearch: (query: string) => void
  onProfileClick: () => void
  messages?: any[]
  onSendMessage?: (content: string) => void
  onSendFile?: (files: File[]) => void
  onCreateChannel?: (channel: any) => void
}

export function CarevoChatLayout({
  channels,
  selectedChannel,
  onChannelSelect,
  onSearch,
  onProfileClick,
  messages = [],
  onSendMessage = () => {},
  onSendFile = () => {},
  onCreateChannel = () => {}
}: CarevoChatLayoutProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<'online' | 'away' | 'busy' | 'invisible'>('online')
  const statusMenuRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const statusOptions = [
    {
      value: 'online' as const,
      label: 'Online',
      color: 'bg-green-500',
      description: 'Available for chat'
    },
    {
      value: 'away' as const,
      label: 'Away',
      color: 'bg-yellow-500',
      description: 'Away from keyboard'
    },
    {
      value: 'busy' as const,
      label: 'Busy',
      color: 'bg-red-500',
      description: 'Do not disturb'
    },
    {
      value: 'invisible' as const,
      label: 'Invisible',
      color: 'bg-gray-400',
      description: 'Appear offline'
    }
  ]

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    onSearch(query)
    
    // Enable search mode when user starts typing
    if (query.trim().length > 0) {
      setIsSearching(true)
      
      // Mock search results for chat messages (simulate API delay)
      setTimeout(() => {
        const mockResults = [
          {
            id: 'msg-1',
            content: `Found message containing "${query}": Patient consultation completed successfully. We discussed the treatment plan and next steps.`,
            sender: 'Dr. Sarah Johnson',
            channel: 'General',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            type: 'message',
            avatar: 'SJ'
          },
          {
            id: 'msg-2',
            content: `Meeting notes about "${query}": Team discussed new protocols and implementation timeline. All departments are aligned.`,
            sender: 'Nurse Mike Chen',
            channel: 'Development',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            type: 'message',
            avatar: 'MC'
          },
          {
            id: 'msg-3',
            content: `Task update regarding "${query}": All documentation has been reviewed and approved by the compliance team.`,
            sender: 'Admin Lisa Park',
            channel: 'Design',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
            type: 'message',
            avatar: 'LP'
          },
          {
            id: 'msg-4',
            content: `Patient follow-up for "${query}": Scheduled next appointment and updated medical records accordingly.`,
            sender: 'Dr. Emily Rodriguez',
            channel: 'Support',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
            type: 'message',
            avatar: 'ER'
          }
        ]
        setSearchResults(mockResults)
      }, 300)
    } else {
      setIsSearching(false)
      setSearchResults([])
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setIsSearching(false)
    setSearchResults([])
    searchInputRef.current?.blur()
  }

  const handleSearchResultClick = (result: any) => {
    // Find and select the channel
    const channel = channels.find(c => c.name === result.channel)
    if (channel) {
      onChannelSelect(channel)
      handleClearSearch()
    }
  }

  const handleStatusChange = (status: 'online' | 'away' | 'busy' | 'invisible') => {
    setCurrentStatus(status)
    setShowStatusMenu(false)
    
    // Save to localStorage so it persists
    localStorage.setItem('chatStatus', status)
    
    // In a real implementation, this would:
    // 1. Update user status in database
    // 2. Broadcast status change to other users
    // 3. Update presence in real-time
    console.log('Status changed to:', status)
  }

  // Load status from localStorage on mount
  useEffect(() => {
    const savedStatus = localStorage.getItem('chatStatus') as 'online' | 'away' | 'busy' | 'invisible'
    if (savedStatus) {
      setCurrentStatus(savedStatus)
    }
  }, [])

  // Close status menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) {
        console.log('Clicking outside status menu, closing it')
        setShowStatusMenu(false)
      }
    }

    if (showStatusMenu) {
      // Add a small delay to prevent immediate closing when opening
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)
      
      return () => {
        clearTimeout(timer)
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showStatusMenu])

  return (
    <div className="flex h-screen bg-gray-100 pt-3">
      {/* Left Panel - Channels */}
      <div className="w-1/3 bg-white border-r border-gray-300 flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-300">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-gray-800">Carevo Chat</h1>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-xs ml-4 mr-4 relative">
              <Input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search chats..."
                className="h-8 text-sm bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full pr-8"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    handleClearSearch()
                  }
                }}
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Status Dropdown */}
            <div className="relative flex-shrink-0" ref={statusMenuRef}>
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <div className={`w-2.5 h-2.5 rounded-full ${statusOptions.find(s => s.value === currentStatus)?.color}`}></div>
                <span className="text-gray-700">{statusOptions.find(s => s.value === currentStatus)?.label}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Status Menu */}
              {showStatusMenu && (
                <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-1">
                    {statusOptions.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => handleStatusChange(status.value)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left hover:bg-gray-50 transition-colors ${
                          currentStatus === status.value ? 'bg-blue-50 text-blue-900' : 'text-gray-700'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                        <div className="flex-1">
                          <div className="font-medium">{status.label}</div>
                          <div className="text-xs text-gray-500">{status.description}</div>
                        </div>
                        {currentStatus === status.value && (
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            </div>
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto">
          <ChannelList
            channels={channels}
            selectedChannel={selectedChannel}
            onChannelSelect={onChannelSelect}
            searchQuery=""
            onCreateChannel={onCreateChannel}
          />
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className="flex-1 flex flex-col">
        {isSearching ? (
          /* Search Results View */
          <div className="flex-1 flex flex-col bg-white">
            {/* Search Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Search Results
                  </h2>
                  <p className="text-sm text-gray-500">
                    {searchResults.length > 0 
                      ? `Found ${searchResults.length} messages for "${searchQuery}"`
                      : searchQuery.trim() 
                        ? `Searching for "${searchQuery}"...`
                        : 'Start typing to search messages'
                    }
                  </p>
                </div>
                <button
                  onClick={handleClearSearch}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Clear Search
                </button>
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto p-6">
              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      onClick={() => handleSearchResultClick(result)}
                      className="p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {result.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{result.sender}</span>
                            <span className="text-xs text-gray-500">in #{result.channel}</span>
                            <span className="text-xs text-gray-400">
                              {new Date(result.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">{result.content}</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery.trim() ? (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-900 mb-2">No messages found</p>
                  <p className="text-sm text-gray-500">No messages found for "{searchQuery}" across all chats.</p>
                  <p className="text-xs text-gray-400 mt-2">Try different keywords or check your spelling.</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-900 mb-2">Search Messages</p>
                  <p className="text-sm text-gray-500">Start typing in the search bar to find messages across all your chats.</p>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    <button
                      onClick={() => handleSearchChange('patient')}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
                    >
                      patient
                    </button>
                    <button
                      onClick={() => handleSearchChange('meeting')}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200 transition-colors"
                    >
                      meeting
                    </button>
                    <button
                      onClick={() => handleSearchChange('task')}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs hover:bg-purple-200 transition-colors"
                    >
                      task
                    </button>
                    <button
                      onClick={() => handleSearchChange('urgent')}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs hover:bg-red-200 transition-colors"
                    >
                      urgent
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : selectedChannel ? (
          <ChatPane
            channel={selectedChannel}
            messages={messages.filter(m => m.channelId === selectedChannel?.id)}
            onSendMessage={onSendMessage}
            onSendFile={onSendFile}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
            <div className="text-center max-w-lg mx-auto px-8">
              {/* Carevo Logo */}
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <span className="text-white font-bold text-3xl">C</span>
              </div>
              
              {/* Welcome Message */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Carevo</h1>
              <h2 className="text-xl font-semibold text-gray-700 mb-6">Healthcare Operations Excellence Platform</h2>
              
              {/* Key Value Propositions */}
              <div className="space-y-4 mb-8">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <p className="text-lg text-gray-800 font-medium mb-2">"Less chaos, more patient care"</p>
                  <p className="text-sm text-gray-600">Streamline your healthcare operations with intelligent task management and seamless team collaboration.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-blue-600 font-semibold mb-1">Boost Productivity</div>
                    <div className="text-blue-500 text-xs">Work smarter, not harder</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-green-600 font-semibold mb-1">Enhance Collaboration</div>
                    <div className="text-green-500 text-xs">Team communication made easy</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <div className="text-purple-600 font-semibold mb-1">Improve Outcomes</div>
                    <div className="text-purple-500 text-xs">Better patient care delivery</div>
                  </div>
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-6 text-white">
                <p className="text-lg font-semibold mb-2">Ready to get started?</p>
                <p className="text-blue-100 mb-4">Select a channel from the left to begin collaborating with your team.</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">General Discussion</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Development Updates</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Design Reviews</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Support Issues</span>
                </div>
              </div>
              
              {/* Footer */}
              <p className="text-xs text-gray-400 mt-6">
                Powered by AiPPcC • Healthcare Operations Excellence Platform
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
