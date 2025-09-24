'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Badge } from './ui/badge'
import { Search, Users, User, Plus, X } from 'lucide-react'

interface NewChatModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateChannel: (channel: any) => void
}

// Mock users data
const mockUsers = [
  { id: '1', name: 'Dr. Sarah Johnson', role: 'Physician', department: 'Cardiology', avatar: 'SJ' },
  { id: '2', name: 'Nurse Mike Chen', role: 'Nurse', department: 'Emergency', avatar: 'MC' },
  { id: '3', name: 'Dr. Emily Rodriguez', role: 'Physician', department: 'Pediatrics', avatar: 'ER' },
  { id: '4', name: 'Admin Lisa Park', role: 'Administrator', department: 'Operations', avatar: 'LP' },
  { id: '5', name: 'Tech John Smith', role: 'IT Support', department: 'Technology', avatar: 'JS' },
  { id: '6', name: 'Dr. David Kim', role: 'Physician', department: 'Surgery', avatar: 'DK' }
]

export function NewChatModal({ isOpen, onClose, onCreateChannel }: NewChatModalProps) {
  const [chatType, setChatType] = useState<'group' | 'direct'>('group')
  const [groupName, setGroupName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<any[]>([])

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUserSelect = (user: any) => {
    if (selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id))
    } else {
      setSelectedUsers([...selectedUsers, user])
    }
  }

  const handleCreateChat = () => {
    if (chatType === 'group') {
      if (!groupName.trim() || selectedUsers.length === 0) {
        alert('Please enter a group name and select at least one member')
        return
      }
      
      const newChannel = {
        id: `group-${Date.now()}`,
        name: groupName,
        type: 'group',
        members: selectedUsers,
        lastMessage: {
          content: 'Group created',
          timestamp: new Date().toISOString()
        },
        unreadCount: 0
      }
      onCreateChannel(newChannel)
    } else {
      if (selectedUsers.length !== 1) {
        alert('Please select exactly one person for direct message')
        return
      }
      
      const newChannel = {
        id: `dm-${Date.now()}`,
        name: selectedUsers[0].name,
        type: 'direct',
        members: selectedUsers,
        lastMessage: {
          content: 'Direct message started',
          timestamp: new Date().toISOString()
        },
        unreadCount: 0
      }
      onCreateChannel(newChannel)
    }
    
    // Reset form
    setGroupName('')
    setSelectedUsers([])
    setSearchQuery('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Start New Chat</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Chat Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Chat Type</label>
            <div className="flex gap-2">
              <Button
                variant={chatType === 'group' ? 'default' : 'outline'}
                onClick={() => setChatType('group')}
                className="flex-1"
              >
                <Users className="h-4 w-4 mr-2" />
                Group Chat
              </Button>
              <Button
                variant={chatType === 'direct' ? 'default' : 'outline'}
                onClick={() => setChatType('direct')}
                className="flex-1"
              >
                <User className="h-4 w-4 mr-2" />
                Direct Message
              </Button>
            </div>
          </div>

          {/* Group Name (for group chats) */}
          {chatType === 'group' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Group Name</label>
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full"
              />
            </div>
          )}

          {/* User Search */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              {chatType === 'group' ? 'Add Members' : 'Select Person'}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or department..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Selected</label>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                    {user.name}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleUserSelect(user)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* User List */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedUsers.find(u => u.id === user.id)
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium text-sm">{user.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.role} • {user.department}</div>
                </div>
                {selectedUsers.find(u => u.id === user.id) && (
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleCreateChat} className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Create Chat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
