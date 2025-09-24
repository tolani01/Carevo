'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface SearchResult {
  id: string;
  type: 'task' | 'message' | 'command' | 'user';
  title: string;
  description: string;
  url: string;
  metadata?: {
    assignee?: string;
    status?: string;
    priority?: string;
    channel?: string;
    timestamp?: string;
  };
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
  hasSearched: boolean;
  selectedIndex: number;
  showResults: boolean;
}

export function useGlobalSearch() {
  const router = useRouter();
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    results: [],
    isSearching: false,
    hasSearched: false,
    selectedIndex: -1,
    showResults: false
  });

  // Mock data for search - in production, this would come from API
  const mockTasks = [
    {
      id: '1',
      title: 'Patient follow-up call',
      description: 'Call patient regarding lab results',
      assignee: 'Dr. Sarah Johnson',
      status: 'InProgress',
      priority: 'high',
      type: 'task' as const
    },
    {
      id: '2',
      title: 'Insurance verification',
      description: 'Verify patient insurance coverage',
      assignee: 'Maria Garcia',
      status: 'ToDo',
      priority: 'medium',
      type: 'task' as const
    },
    {
      id: '3',
      title: 'Lab results review',
      description: 'Review blood work results for patient',
      assignee: 'Dr. Emily Rodriguez',
      status: 'Waiting',
      priority: 'urgent',
      type: 'task' as const
    }
  ];

  const mockMessages = [
    {
      id: '1',
      title: 'Patient update discussion',
      description: 'Dr. Johnson: Patient showed improvement in symptoms',
      channel: 'General',
      timestamp: '2 hours ago',
      type: 'message' as const
    },
    {
      id: '2',
      title: 'Lab results available',
      description: 'Nurse Mike: Lab results are ready for review',
      channel: 'Lab Updates',
      timestamp: '1 hour ago',
      type: 'message' as const
    }
  ];

  const mockCommands = [
    {
      id: 'new-task',
      title: 'Create New Task',
      description: 'Add a new task to the board',
      type: 'command' as const
    },
    {
      id: 'assign-task',
      title: 'Assign Task',
      description: 'Assign a task to a team member',
      type: 'command' as const
    },
    {
      id: 'open-chat',
      title: 'Open Chat',
      description: 'Go to team chat',
      type: 'command' as const
    }
  ];

  const mockUsers = [
    {
      id: '1',
      title: 'Dr. Sarah Johnson',
      description: 'Cardiology • Online',
      type: 'user' as const
    },
    {
      id: '2',
      title: 'Nurse Mike Chen',
      description: 'Nursing • Online',
      type: 'user' as const
    }
  ];

  const searchData = useMemo(() => [
    ...mockTasks.map(task => ({
      ...task,
      url: `/board?task=${task.id}`,
      metadata: {
        assignee: task.assignee,
        status: task.status,
        priority: task.priority
      }
    })),
    ...mockMessages.map(message => ({
      ...message,
      url: `/chat?message=${message.id}`,
      metadata: {
        channel: message.channel,
        timestamp: message.timestamp
      }
    })),
    ...mockCommands.map(command => ({
      ...command,
      url: `#${command.id}`,
      metadata: {}
    })),
    ...mockUsers.map(user => ({
      ...user,
      url: `/profile?user=${user.id}`,
      metadata: {}
    }))
  ], []);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchState(prev => ({
        ...prev,
        query: '',
        results: [],
        isSearching: false,
        hasSearched: false,
        showResults: false
      }));
      return;
    }

    setSearchState(prev => ({ ...prev, isSearching: true, query }));

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const searchQuery = query.toLowerCase();
    const results: SearchResult[] = searchData
      .filter(item => 
        item.title.toLowerCase().includes(searchQuery) ||
        item.description.toLowerCase().includes(searchQuery) ||
        (item.metadata && 'assignee' in item.metadata && item.metadata.assignee && item.metadata.assignee.toLowerCase().includes(searchQuery)) ||
        (item.metadata && 'channel' in item.metadata && item.metadata.channel && item.metadata.channel.toLowerCase().includes(searchQuery))
      )
      .map(item => ({
        id: item.id,
        type: item.type,
        title: item.title,
        description: item.description,
        url: item.url,
        metadata: item.metadata
      }))
      .slice(0, 10); // Limit to 10 results

    setSearchState(prev => ({
      ...prev,
      results,
      isSearching: false,
      hasSearched: true,
      showResults: true,
      selectedIndex: -1
    }));
  }, [searchData]);

  const handleSearch = useCallback((query: string) => {
    performSearch(query);
  }, [performSearch]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!searchState.showResults) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSearchState(prev => ({
          ...prev,
          selectedIndex: Math.min(prev.selectedIndex + 1, prev.results.length - 1)
        }));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSearchState(prev => ({
          ...prev,
          selectedIndex: Math.max(prev.selectedIndex - 1, -1)
        }));
        break;
      case 'Enter':
        e.preventDefault();
        if (searchState.selectedIndex >= 0 && searchState.results[searchState.selectedIndex]) {
          const result = searchState.results[searchState.selectedIndex];
          if (result.type === 'command') {
            // Handle command execution
            handleCommandExecution(result.id);
          } else {
            router.push(result.url);
          }
          setSearchState(prev => ({ ...prev, showResults: false }));
        }
        break;
      case 'Escape':
        e.preventDefault();
        setSearchState(prev => ({ ...prev, showResults: false }));
        break;
    }
  }, [searchState, router]);

  const handleCommandExecution = useCallback((commandId: string) => {
    switch (commandId) {
      case 'new-task':
        router.push('/board?action=new-task');
        break;
      case 'assign-task':
        // Open task assignment modal
        break;
      case 'open-chat':
        router.push('/chat');
        break;
      default:
        break;
    }
  }, [router]);

  const clearSearch = useCallback(() => {
    setSearchState({
      query: '',
      results: [],
      isSearching: false,
      hasSearched: false,
      selectedIndex: -1,
      showResults: false
    });
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    ...searchState,
    handleSearch,
    clearSearch,
    performSearch
  };
}
