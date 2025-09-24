'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UserDropdown } from '@/components/UserDropdown';
import { SearchResults } from '@/components/SearchResults';
import { FilterDrawer } from '@/components/FilterDrawer';
import { FilterChips } from '@/components/FilterChips';
import { useGlobalSearch } from '@/lib/hooks/use-global-search';
import { 
  Search, 
  Plus, 
  Bell, 
  User, 
  Settings,
  Menu,
  X,
  MessageSquare,
  Command,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterState {
  search: string
  assignee: string
  status: string
  type: string
  dueDate: string
  priority: string
}

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
  const pathname = usePathname();
  // Debug logging
  useEffect(() => {
    console.log('GlobalHeader props:', { overdueCount, mentionCount, userRole, pathname });
  }, [overdueCount, mentionCount, userRole, pathname]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchMode, setSearchMode] = useState<'search' | 'command'>('search');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    search: '',
    assignee: '',
    status: '',
    type: '',
    dueDate: '',
    priority: ''
  });
  
  const {
    results,
    isSearching,
    hasSearched,
    selectedIndex,
    showResults,
    handleSearch: performSearch,
    clearSearch
  } = useGlobalSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchMode === 'search') {
      performSearch(searchQuery);
    } else {
      onCommandPalette?.();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      performSearch(value);
    } else {
      clearSearch();
    }
  };

  const handleSearchFocus = () => {
    setShowSearch(true);
    if (searchQuery.trim()) {
      // showResults is managed by useGlobalSearch hook
    }
  };

  const handleSearchBlur = (e: React.FocusEvent) => {
    // Don't close if clicking inside the search results overlay
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && relatedTarget.closest('[data-search-results]')) {
      return;
    }
    
    // Delay closing to allow for clicks on results
    setTimeout(() => {
      setShowSearch(false);
      // showResults is managed by useGlobalSearch hook
    }, 150);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setSearchMode('command');
      setShowSearch(true);
      onCommandPalette?.();
    }
  };

  const handleResultClick = (result: any) => {
    if (result.type === 'command') {
      // Handle command execution
      switch (result.id) {
        case 'new-task':
          onNewTask?.();
          break;
        case 'open-chat':
          window.location.href = '/chat';
          break;
        default:
          break;
      }
    } else {
      // Navigate to result with search context
      const url = new URL(result.url, window.location.origin);
      url.searchParams.set('from', 'search');
      if (searchQuery.trim()) {
        url.searchParams.set('query', searchQuery.trim());
      }
      window.location.href = url.toString();
    }
    setShowSearch(false);
    clearSearch();
  };


  // Filter helper functions
  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => value !== '').length;
  };

  const getFilterChips = (): Array<{key: string, label: string, value: string}> => {
    const chips = [];
    if (activeFilters.status) {
      const statusLabels: Record<string, string> = {
        'todo': 'To Do',
        'in-progress': 'In Progress',
        'waiting': 'Waiting',
        'done': 'Done'
      };
      chips.push({
        key: 'status',
        label: 'Status',
        value: statusLabels[activeFilters.status] || activeFilters.status
      });
    }
    if (activeFilters.type) {
      const typeLabels: Record<string, string> = {
        'refill': 'Refill',
        'pa': 'PA',
        'lab': 'Lab',
        'callback': 'Callback',
        'billing': 'Billing',
        'other': 'Other'
      };
      chips.push({
        key: 'type',
        label: 'Type',
        value: typeLabels[activeFilters.type] || activeFilters.type
      });
    }
    if (activeFilters.priority) {
      const priorityLabels: Record<string, string> = {
        'low': 'Low',
        'medium': 'Medium',
        'high': 'High',
        'urgent': 'Urgent'
      };
      chips.push({
        key: 'priority',
        label: 'Priority',
        value: priorityLabels[activeFilters.priority] || activeFilters.priority
      });
    }
    if (activeFilters.dueDate) {
      chips.push({
        key: 'dueDate',
        label: 'Due Date',
        value: new Date(activeFilters.dueDate).toLocaleDateString()
      });
    }
    return chips;
  };

  const handleRemoveFilter = (key: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: ''
    }));
  };

  const handleClearAllFilters = () => {
    setActiveFilters({
      search: '',
      assignee: '',
      status: '',
      type: '',
      dueDate: '',
      priority: ''
    });
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
        <div className="flex-1 max-w-2xl mx-4 relative z-50">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchMode === 'search' 
                ? "Search tasks, messages, or type ⌘K for commands..." 
                : "Type a command or search..."
              }
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className="pl-10 pr-16 relative z-0"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onCommandPalette}
                className="h-8 w-10 p-0 hover:bg-blue-50 rounded-md"
                aria-label="Add new task or action"
                title="Add new task or action"
              >
                <div className="relative">
                  {/* Clipboard with visible lines */}
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    {/* Clipboard background */}
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3-7.5H21a3 3 0 013 3V15a3 3 0 01-3 3h-1.5M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z"/>
                    {/* Clipboard body */}
                    <rect x="6" y="6" width="12" height="14" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor"/>
                    {/* Clipboard clip */}
                    <rect x="8" y="2" width="8" height="4" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor"/>
                    {/* Document lines */}
                    <line x1="9" y1="10" x2="15" y2="10" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="9" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="9" y1="16" x2="13" y2="16" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  {/* Plus icon overlay */}
                  <div className="absolute -top-1 -right-1 bg-green-500 rounded-full w-3.5 h-3.5 flex items-center justify-center border border-white">
                    <svg className="h-2.5 w-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                    </svg>
                  </div>
                </div>
              </Button>
            </div>
          </form>
          
          {/* Search Results - Overlay */}
          {showSearch && showResults && (
            <div 
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
              data-search-results
              onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
              onClick={(e) => e.stopPropagation()} // Prevent event bubbling
            >
              <SearchResults
                query={searchQuery}
                scope="all"
                onResultClick={handleResultClick}
              />
            </div>
          )}
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

          {/* New Task Button - REMOVED ACROSS THE BOARD */}
          {/* {!isAuditor && (pathname === '/my' || pathname === '/profile') && (
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
          )} */}
          <div id="new-task-description" className="sr-only">
            Create a new task. You can also press N key for quick access.
          </div>


          {/* Filter Button - REMOVED ACROSS THE BOARD */}
          {/* {(pathname === '/my' || pathname === '/profile') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilterDrawer(true)}
              className="flex items-center gap-2 min-h-[44px]"
              data-testid="filter-button"
              aria-label="Open filters"
              aria-describedby="filters-description"
            >
              <Filter className="h-4 w-4" />
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          )} */}
          <div id="filters-description" className="sr-only">
            Open filter drawer to filter tasks by status, type, priority, and more.
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
        
        {/* Mobile New Task Button - REMOVED ACROSS THE BOARD */}
        {/* {!isAuditor && (pathname === '/my' || pathname === '/profile') && (
          <Button
            onClick={onNewTask}
            size="sm"
            className="flex-1 max-w-xs"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Task
          </Button>
        )} */}
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        activeFilters={activeFilters}
        onFilterChange={setActiveFilters}
        onClearAll={handleClearAllFilters}
      />

      {/* Filter Chips - REMOVED ACROSS THE BOARD */}
      {/* {(pathname === '/my' || pathname === '/profile') && (
        <FilterChips
          filters={getFilterChips()}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />
      )} */}
    </header>
  );
}
