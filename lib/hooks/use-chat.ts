'use client';

import { useState, useEffect } from 'react';

export interface Channel {
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

export function useChat() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannels = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock channel data
        const mockChannels: Channel[] = [
          {
            id: '1',
            name: 'general',
            unreadCount: 3,
            isActive: true,
            lastMessage: {
              author: 'Dr. Smith',
              content: 'Good morning team! Any updates on the Johnson case?',
              timestamp: '2024-01-15T09:00:00Z'
            }
          },
          {
            id: '2',
            name: 'front-desk',
            unreadCount: 0,
            isActive: true,
            lastMessage: {
              author: 'MA Davis',
              content: 'Patient J.S. called about medication refill',
              timestamp: '2024-01-15T09:30:00Z'
            }
          },
          {
            id: '3',
            name: 'billing',
            unreadCount: 1,
            isActive: true,
            lastMessage: {
              author: 'Billing Specialist',
              content: 'Insurance claim processed successfully',
              timestamp: '2024-01-15T08:45:00Z'
            }
          },
          {
            id: '4',
            name: 'providers',
            unreadCount: 0,
            isActive: true,
            lastMessage: {
              author: 'Dr. Johnson',
              content: 'Lab results are in for patient A.L.',
              timestamp: '2024-01-14T16:20:00Z'
            }
          },
          {
            id: '5',
            name: 'old-announcements',
            unreadCount: 0,
            isActive: false,
            lastMessage: {
              author: 'Admin',
              content: 'System maintenance completed',
              timestamp: '2024-01-01T00:00:00Z'
            }
          }
        ];

        setChannels(mockChannels);
      } catch (error) {
        console.error('Error fetching channels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  const createChannel = async (channelData: {
    name: string;
    description: string;
    type: 'public' | 'private';
    members: string[];
  }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newChannel: Channel = {
        id: Date.now().toString(), // Simple ID generation
        name: channelData.name.toLowerCase().replace(/\s+/g, '-'),
        unreadCount: 0,
        isActive: true,
        lastMessage: {
          author: 'You',
          content: `Created channel "${channelData.name}"`,
          timestamp: new Date().toISOString()
        }
      };

      setChannels(prev => [newChannel, ...prev]);
      
      console.log('Channel created:', {
        ...channelData,
        channelId: newChannel.id
      });
      
      return newChannel;
    } catch (error) {
      console.error('Error creating channel:', error);
      throw error;
    }
  };

  return { channels, loading, createChannel };
}

