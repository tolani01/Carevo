'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UserDropdown } from '@/components/UserDropdown';
import { 
  Search, 
  Plus, 
  Bell, 
  User, 
  Settings,
  Menu,
  X,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlobalHeaderProps {
  onSearch?: (query: string) => void;
  onNewTask?: () => void;
  onCommandPalette?: () => void;
  onProfile?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
  overdueCount?: number;
  mentionCount?: number;
  userRole?: string;
  userName?: string;
  userPhone?: string;
  showMobileMenu?: boolean;
  onToggleMobileMenu?: () => void;
}

export function GlobalHeader({
  onSearch,
  onNewTask,
  onCommandPalette,
  onProfile,
  onSettings,
  onLogout,
  overdueCount = 0,
  mentionCount = 0,
  userRole = 'provider',
  userName = 'User',
  userPhone = '',
  showMobileMenu = false,
  onToggleMobileMenu
}: GlobalHeaderProps) {
  // Debug logging
  useEffect(() => {
    console.log('GlobalHeader props:', { overdueCount, mentionCount, userRole });
  }, [overdueCount, mentionCount, userRole]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onCommandPalette?.();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isAuditor = userRole === 'auditor';

  return (
    <header className="glass-card border-b border-gray-200/20 px-4 py-3 relative z-10">
      <div className="flex items-center justify-between">
        {/* Left Section - Logo and Navigation */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onToggleMobileMenu}
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo - Clickable */}
          <button 
            onClick={() => window.location.href = '/board'}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Go to dashboard"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-mono-500 to-blue-mono-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900">Carevo</h1>
              <p className="text-xs text-gray-600">Command Center</p>
            </div>
          </button>

          {/* Role Badge */}
          {isAuditor && (
            <Badge variant="outline" className="text-xs">
              Read-Only
            </Badge>
          )}
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-4 relative z-0">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks, messages, or type ⌘K for commands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearch(true)}
              onBlur={() => setShowSearch(false)}
              className="pl-10 pr-4 relative z-0"
            />
            {showSearch && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-0">
                <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">⌘K</kbd>
              </div>
            )}
          </form>
        </div>

        {/* Right Section - Actions and Notifications */}
        <div className="flex items-center space-x-2 relative z-20">
          {/* Overdue Badge */}
          <Button
            variant="outline"
            size="sm"
            className="relative text-red-600 border-red-200 hover:bg-red-50 min-h-[44px] min-w-[44px]"
            onClick={() => {
              console.log('Overdue button clicked, navigating to /my?due=Overdue');
              // Navigate to My Tasks filtered by overdue
              window.location.href = '/my?due=Overdue';
            }}
            aria-label={`View ${overdueCount} overdue tasks`}
            aria-describedby="overdue-tasks-description"
          >
            <Bell className="h-4 w-4 mr-1" aria-hidden="true" />
            {overdueCount}
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              aria-hidden="true"
            >
              {overdueCount}
            </Badge>
          </Button>
          <div id="overdue-tasks-description" className="sr-only">
            Click to view tasks that are past their due date
          </div>

          {/* Chat Messages Badge */}
          {mentionCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="relative text-blue-600 border-blue-200 hover:bg-blue-50 min-h-[44px] min-w-[44px]"
              onClick={() => {
                // Navigate to Chat filtered by mentions
                window.location.href = '/chat?filter=mentions';
              }}
              aria-label={`View ${mentionCount} unread messages`}
              aria-describedby="messages-description"
            >
              <MessageSquare className="h-4 w-4 mr-1" aria-hidden="true" />
              {mentionCount}
              <Badge 
                variant="default" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-blue-500"
                aria-hidden="true"
              >
                {mentionCount}
              </Badge>
            </Button>
          )}
          <div id="messages-description" className="sr-only">
            Click to view unread messages and mentions
          </div>

          {/* New Task Button */}
          {!isAuditor && (
            <Button
              onClick={onNewTask}
              size="sm"
              className="hidden sm:flex min-h-[44px]"
              aria-label="Create new task"
              aria-describedby="new-task-description"
            >
              <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
              New Task
            </Button>
          )}
          <div id="new-task-description" className="sr-only">
            Create a new task. You can also press N key for quick access.
          </div>

          {/* Command Palette Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onCommandPalette}
            className="hidden sm:flex min-h-[44px]"
            aria-label="Open command palette"
            aria-describedby="command-palette-description"
          >
            <Search className="h-4 w-4 mr-1" aria-hidden="true" />
            <kbd className="text-xs" aria-hidden="true">⌘K</kbd>
          </Button>
          <div id="command-palette-description" className="sr-only">
            Open command palette to search and navigate. Press Cmd+K or Ctrl+K.
          </div>

          {/* User Dropdown */}
          <UserDropdown
            userName={userName}
            userRole={userRole}
            userPhone={userPhone}
            onProfile={onProfile}
            onSettings={onSettings}
            onLogout={onLogout}
          />
        </div>
      </div>

      {/* Mobile Actions */}
      <div className="md:hidden mt-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {overdueCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {overdueCount} overdue
            </Badge>
          )}
          {mentionCount > 0 && (
            <Badge variant="default" className="text-xs bg-blue-500">
              {mentionCount} mentions
            </Badge>
          )}
        </div>
        
        {!isAuditor && (
          <Button
            onClick={onNewTask}
            size="sm"
            className="flex-1 max-w-xs"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Task
          </Button>
        )}
      </div>
    </header>
  );
}
