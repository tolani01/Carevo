'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Paperclip, 
  Plus, 
  MoreVertical,
  User,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  isOwn?: boolean;
  taskLinks?: Array<{
    taskId: string;
    taskTitle: string;
  }>;
}

interface ChatPaneProps {
  channelId: string;
  channelName?: string;
  onTaskCreate?: (taskData: { title: string; content: string }) => void;
}

export function ChatPane({ channelId, channelName, onTaskCreate }: ChatPaneProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mock users for mentions
  const users = [
    { id: '1', name: 'Dr. Smith' },
    { id: '2', name: 'Dr. Johnson' },
    { id: '3', name: 'Nurse Williams' },
    { id: '4', name: 'MA Davis' },
  ];

  // Mock messages - replace with actual data
  useEffect(() => {
    // Different messages for different channels
    const channelMessages: { [key: string]: Message[] } = {
      '1': [
        {
          id: '1',
          author: { id: '1', name: 'Dr. Smith' },
          content: 'Good morning team! Any updates on the Johnson case?',
          timestamp: '2024-01-15T09:00:00Z',
          isOwn: false,
        },
        {
          id: '2',
          author: { id: '2', name: 'Dr. Johnson' },
          content: 'I\'ll check the lab results and get back to you by 2 PM.',
          timestamp: '2024-01-15T09:15:00Z',
          isOwn: false,
        },
        {
          id: '3',
          author: { id: '3', name: 'Nurse Williams' },
          content: 'Patient J.S. called about medication refill. Need to follow up.',
          timestamp: '2024-01-15T09:30:00Z',
          isOwn: true,
          taskLinks: [
            { taskId: 'task-1', taskTitle: 'Medication refill for J.S.' }
          ]
        },
      ],
      '2': [
        {
          id: '4',
          author: { id: '4', name: 'MA Davis' },
          content: 'Patient J.S. called about medication refill',
          timestamp: '2024-01-15T09:30:00Z',
          isOwn: false,
        },
        {
          id: '5',
          author: { id: '1', name: 'Dr. Smith' },
          content: 'I\'ll handle that refill request right away.',
          timestamp: '2024-01-15T09:35:00Z',
          isOwn: true,
        },
      ],
      '3': [
        {
          id: '6',
          author: { id: '5', name: 'Billing Specialist' },
          content: 'Insurance claim processed successfully',
          timestamp: '2024-01-15T08:45:00Z',
          isOwn: false,
        },
      ],
      '4': [
        {
          id: '7',
          author: { id: '2', name: 'Dr. Johnson' },
          content: 'Lab results are in for patient A.L.',
          timestamp: '2024-01-14T16:20:00Z',
          isOwn: false,
        },
      ],
    };
    
    setMessages(channelMessages[channelId] || []);
  }, [channelId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      author: { id: 'current-user', name: 'You' },
      content: newMessage,
      timestamp: new Date().toISOString(),
      isOwn: true,
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === '@') {
      setShowMentions(true);
    }
  };

  const handleMentionSelect = (user: any) => {
    const beforeCursor = newMessage.substring(0, textareaRef.current?.selectionStart || 0);
    const afterCursor = newMessage.substring(textareaRef.current?.selectionEnd || 0);
    const newText = beforeCursor + `@${user.name} ` + afterCursor;
    setNewMessage(newText);
    setShowMentions(false);
    setMentionQuery('');
  };

  const handleCreateTask = (message: Message) => {
    const taskData = {
      title: message.content.substring(0, 100) + (message.content.length > 100 ? '...' : ''),
      content: message.content,
    };
    onTaskCreate?.(taskData);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-900">#{channelName || channelId}</h2>
            <Badge variant="secondary" className="text-xs">
              12 members
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex space-x-3",
              message.isOwn && "flex-row-reverse space-x-reverse"
            )}
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            </div>

            {/* Message Content */}
            <div className={cn(
              "flex-1 min-w-0",
              message.isOwn && "flex flex-col items-end"
            )}>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-gray-900">
                  {message.author.name}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTimestamp(message.timestamp)}
                </span>
                {message.isOwn && (
                  <CheckCircle2 className="h-3 w-3 text-blue-500" />
                )}
              </div>

              <div className={cn(
                "rounded-lg px-3 py-2 max-w-md",
                message.isOwn 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-100 text-gray-900"
              )}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>

              {/* Task Links */}
              {message.taskLinks && message.taskLinks.length > 0 && (
                <div className="mt-2 space-y-1">
                  {message.taskLinks.map((link) => (
                    <div
                      key={link.taskId}
                      className="flex items-center space-x-2 p-2 bg-blue-50 border border-blue-200 rounded-md"
                    >
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-800">{link.taskTitle}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCreateTask(message)}
                        className="h-6 px-2 text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Create Task
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              if (e.target.value.includes('@')) {
                const atIndex = e.target.value.lastIndexOf('@');
                const query = e.target.value.substring(atIndex + 1).split(' ')[0];
                setMentionQuery(query);
                setShowMentions(query.length > 0);
              } else {
                setShowMentions(false);
              }
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type a message... (use @ to mention someone, Enter to send)"
            className="min-h-[60px] max-h-32 pr-20 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          
          {/* Mention Dropdown */}
          {showMentions && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div className="p-2">
                <div className="text-xs text-gray-500 mb-2">Mention someone:</div>
                <div className="space-y-1">
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleMentionSelect(user)}
                      className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                    >
                      {user.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="absolute bottom-2 right-2 flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="sm"
              className="h-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

