'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Hash, 
  Users,
  Settings,
  Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Channel {
  id: string;
  name: string;
  unreadCount?: number;
  isActive?: boolean;
  lastMessage?: {
    author: string;
    content: string;
    timestamp: string;
  };
}

interface ChannelListProps {
  channels: Channel[];
  selectedChannel: string | null;
  onChannelSelect: (channelId: string) => void;
  onCreateChannel?: () => void;
}

export function ChannelList({ 
  channels, 
  selectedChannel, 
  onChannelSelect, 
  onCreateChannel 
}: ChannelListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!channel.isActive || showArchived)
  );

  const activeChannels = channels.filter(channel => channel.isActive !== false);
  const archivedChannels = channels.filter(channel => channel.isActive === false);

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Channels</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCreateChannel}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto">
        {/* Active Channels */}
        <div className="p-2">
          <div className="flex items-center justify-between px-2 py-1 mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Active Channels
            </h3>
            <span className="text-xs text-gray-400">{activeChannels.length}</span>
          </div>
          
          <div className="space-y-1">
            {activeChannels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onChannelSelect(channel.id)}
                className={cn(
                  "w-full flex items-center justify-between p-2 rounded-md text-left transition-colors",
                  selectedChannel === channel.id
                    ? "bg-blue-100 text-blue-900"
                    : "hover:bg-gray-100 text-gray-700"
                )}
              >
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <Hash className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {channel.name}
                  </span>
                </div>
                {channel.unreadCount && channel.unreadCount > 0 && (
                  <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Archived Channels */}
        {archivedChannels.length > 0 && (
          <div className="p-2 border-t border-gray-100">
            <div className="flex items-center justify-between px-2 py-1 mb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Archived
              </h3>
              <button
                onClick={() => setShowArchived(!showArchived)}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                {showArchived ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showArchived && (
              <div className="space-y-1">
                {archivedChannels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => onChannelSelect(channel.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded-md text-left transition-colors",
                      selectedChannel === channel.id
                        ? "bg-blue-100 text-blue-900"
                        : "hover:bg-gray-100 text-gray-500"
                    )}
                  >
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <Archive className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">
                        {channel.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>12 online</span>
          </div>
          <div className="flex-1" />
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

