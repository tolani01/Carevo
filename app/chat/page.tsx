'use client';

import { useState, useEffect } from 'react';
import { ChannelList } from '@/components/ChannelList';
import { ChatPane } from '@/components/ChatPane';
import { ChannelCreationModal } from '@/components/ChannelCreationModal';
import { EmptyState } from '@/components/EmptyState';
import { SkeletonLoader } from '@/components/EmptyState';
import { useChat } from '@/lib/hooks/use-chat';
import { useApp } from '@/components/AppProvider';

export default function ChatPage() {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { channels, loading, createChannel } = useChat();
  const { onNewTask } = useApp();

  useEffect(() => {
    if (channels.length > 0 && !selectedChannel) {
      setSelectedChannel(channels[0].id);
    }
  }, [channels, selectedChannel]);

  // Handle mentions filter from mention button
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('filter') === 'mentions') {
      // TODO: Filter to show only messages with mentions
      console.log('Filtering to mentions');
    }
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex">
        <div className="w-80 bg-white border-r border-gray-200">
          <SkeletonLoader type="list" count={5} />
        </div>
        <div className="flex-1">
          <SkeletonLoader type="list" count={8} />
        </div>
      </div>
    );
  }

  const handleTaskCreate = (taskData: { title: string; content: string }) => {
    console.log('Create task from message:', taskData);
    // TODO: Implement actual task creation
    onNewTask();
  };

  const handleCreateChannel = async (channelData: {
    name: string;
    description: string;
    type: 'public' | 'private';
    members: string[];
  }) => {
    try {
      const newChannel = await createChannel(channelData);
      setSelectedChannel(newChannel.id);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create channel:', error);
      // TODO: Show error toast
    }
  };

  return (
    <div className="flex-1 flex">
      {/* Channel List */}
      <div className="w-80 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Team Chat</h2>
          </div>
        </div>
        <ChannelList
          channels={channels}
          selectedChannel={selectedChannel}
          onChannelSelect={setSelectedChannel}
          onCreateChannel={() => setShowCreateModal(true)}
        />
      </div>

      {/* Chat Pane */}
      <div className="flex-1">
        {selectedChannel ? (
          <ChatPane
            channelId={selectedChannel}
            channelName={channels.find(c => c.id === selectedChannel)?.name}
            onTaskCreate={handleTaskCreate}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <EmptyState
              type="messages"
              title="Select a channel"
              description="Choose a channel from the list to start chatting with your team."
              action={{
                label: 'Create Channel',
                onClick: () => setShowCreateModal(true)
              }}
            />
          </div>
        )}
      </div>

      {/* Channel Creation Modal */}
      <ChannelCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateChannel={handleCreateChannel}
      />
    </div>
  );
}
