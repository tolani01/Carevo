'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Filter, Search, Calendar, User, Tag, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FiltersBarProps {
  filters: {
    assignee: string;
    type: string;
    status: string;
    location: string;
    due: string;
  };
  onFiltersChange: (filters: any) => void;
  onSearch?: (query: string) => void;
}

const taskTypes = ['Refill', 'PA', 'Lab', 'Callback', 'Billing', 'Other'];
const taskStatuses = ['ToDo', 'InProgress', 'Waiting', 'Done'];
const dueFilters = ['Today', 'Overdue', 'This Week', 'Next Week', 'All'];
const locations = ['Main Clinic', 'North Branch', 'South Branch', 'Urgent Care'];

// Mock users - replace with actual data
const users = [
  { id: '1', name: 'Dr. Smith' },
  { id: '2', name: 'Dr. Johnson' },
  { id: '3', name: 'Nurse Williams' },
  { id: '4', name: 'MA Davis' },
];

export function FiltersBar({ filters, onFiltersChange, onSearch }: FiltersBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const activeFiltersCount = Object.values(filters).filter(value => value !== '' && value !== 'all').length;

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilter = (key: string) => {
    onFiltersChange({
      ...filters,
      [key]: 'all'
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      assignee: 'all',
      type: 'all',
      status: 'all',
      location: 'all',
      due: 'all'
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "relative",
            activeFiltersCount > 0 && "border-blue-500 bg-blue-50"
          )}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Filter Tasks</h3>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear all
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Assignee Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <User className="mr-1 h-4 w-4" />
                Assignee
              </label>
              <Select
                value={filters.assignee}
                onValueChange={(value) => handleFilterChange('assignee', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All assignees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All assignees</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Tag className="mr-1 h-4 w-4" />
                Type
              </label>
              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {taskTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {taskStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                Location
              </label>
              <Select
                value={filters.location}
                onValueChange={(value) => handleFilterChange('location', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Due Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                Due Date
              </label>
              <Select
                value={filters.due}
                onValueChange={(value) => handleFilterChange('due', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All dates</SelectItem>
                  {dueFilters.map((filter) => (
                    <SelectItem key={filter} value={filter}>
                      {filter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Active Filters:</h4>
              <div className="flex flex-wrap gap-2">
                {filters.assignee && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <span>Assignee: {users.find(u => u.id === filters.assignee)?.name}</span>
                    <button
                      onClick={() => clearFilter('assignee')}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.type && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <span>Type: {filters.type}</span>
                    <button
                      onClick={() => clearFilter('type')}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.status && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <span>Status: {filters.status}</span>
                    <button
                      onClick={() => clearFilter('status')}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.location && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <span>Location: {filters.location}</span>
                    <button
                      onClick={() => clearFilter('location')}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.due && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <span>Due: {filters.due}</span>
                    <button
                      onClick={() => clearFilter('due')}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

