'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  User, 
  Calendar, 
  MessageSquare,
  Settings,
  FileText,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Command {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
  keywords: string[];
}

interface CommandPaletteProps {
  onClose: () => void;
  onTaskSelect: (taskId: string) => void;
}

export function CommandPalette({ onClose, onTaskSelect }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: Command[] = [
    {
      id: 'new-task',
      title: 'Create New Task',
      description: 'Add a new task to the board',
      icon: <Plus className="h-4 w-4" />,
      action: () => {
        console.log('Create new task');
        onClose();
      },
      category: 'Tasks',
      keywords: ['new', 'create', 'add', 'task']
    },
    {
      id: 'assign-task',
      title: 'Assign Task',
      description: 'Assign a task to a team member',
      icon: <User className="h-4 w-4" />,
      action: () => {
        console.log('Assign task');
        onClose();
      },
      category: 'Tasks',
      keywords: ['assign', 'user', 'member']
    },
    {
      id: 'set-due-date',
      title: 'Set Due Date',
      description: 'Set or update task due date',
      icon: <Calendar className="h-4 w-4" />,
      action: () => {
        console.log('Set due date');
        onClose();
      },
      category: 'Tasks',
      keywords: ['due', 'date', 'deadline', 'schedule']
    },
    {
      id: 'open-chat',
      title: 'Open Chat',
      description: 'Go to team chat',
      icon: <MessageSquare className="h-4 w-4" />,
      action: () => {
        window.location.href = '/chat';
        onClose();
      },
      category: 'Navigation',
      keywords: ['chat', 'message', 'team']
    },
    {
      id: 'my-tasks',
      title: 'My Tasks',
      description: 'View your assigned tasks',
      icon: <FileText className="h-4 w-4" />,
      action: () => {
        window.location.href = '/my';
        onClose();
      },
      category: 'Navigation',
      keywords: ['my', 'assigned', 'personal']
    },
    {
      id: 'admin-settings',
      title: 'Admin Settings',
      description: 'Open admin panel',
      icon: <Settings className="h-4 w-4" />,
      action: () => {
        window.location.href = '/admin';
        onClose();
      },
      category: 'Navigation',
      keywords: ['admin', 'settings', 'manage']
    }
  ];

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.description.toLowerCase().includes(query.toLowerCase()) ||
    command.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
  );

  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, Command[]>);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  let currentIndex = 0;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0">
        <div className="flex items-center border-b px-4 py-3">
          <Search className="mr-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 shadow-none focus-visible:ring-0 text-base"
            autoFocus
          />
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {Object.keys(groupedCommands).length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="mx-auto h-8 w-8 text-gray-300 mb-2" />
              <p>No commands found</p>
            </div>
          ) : (
            <div className="py-2">
              {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
                <div key={category} className="mb-4">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {category}
                  </div>
                  <div className="space-y-1">
                    {categoryCommands.map((command) => {
                      const isSelected = currentIndex === selectedIndex;
                      currentIndex++;
                      
                      return (
                        <button
                          key={command.id}
                          onClick={command.action}
                          className={cn(
                            "w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-100",
                            isSelected && "bg-blue-50"
                          )}
                        >
                          <div className={cn(
                            "flex-shrink-0 h-8 w-8 rounded-md flex items-center justify-center",
                            isSelected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                          )}>
                            {command.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900">{command.title}</div>
                            <div className="text-sm text-gray-500">{command.description}</div>
                          </div>
                          <div className="flex-shrink-0">
                            <Badge variant="secondary" className="text-xs">
                              ⌘K
                            </Badge>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="border-t px-4 py-3 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span>↑↓ to navigate</span>
              <span>↵ to select</span>
              <span>esc to close</span>
            </div>
            <div>
              {filteredCommands.length} command{filteredCommands.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

