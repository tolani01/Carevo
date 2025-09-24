'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, X, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface DateRangeFilterProps {
  selectedRange: {
    start: Date | null;
    end: Date | null;
  };
  onRangeChange: (start: Date | null, end: Date | null) => void;
  onQuickFilter: (filter: 'today' | 'week' | 'month' | 'all' | 'overdue') => void;
  activeQuickFilter: string;
}

export function DateRangeFilter({
  selectedRange,
  onRangeChange,
  onQuickFilter,
  activeQuickFilter
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const quickFilters = [
    { key: 'all', label: 'All Dates', icon: null },
    { key: 'today', label: 'Today', icon: null },
    { key: 'week', label: 'This Week', icon: null },
    { key: 'month', label: 'This Month', icon: null },
    { key: 'overdue', label: 'Overdue', icon: null }
  ];

  const handleStartDateChange = (value: string) => {
    const date = value ? new Date(value) : null;
    onRangeChange(date, selectedRange.end);
  };

  const handleEndDateChange = (value: string) => {
    const date = value ? new Date(value) : null;
    onRangeChange(selectedRange.start, date);
  };

  const handleQuickFilter = (filter: string) => {
    onQuickFilter(filter as any);
    setIsOpen(false);
  };

  const clearRange = () => {
    onRangeChange(null, null);
    onQuickFilter('all');
  };

  const getDisplayText = () => {
    if (activeQuickFilter !== 'all') {
      const filter = quickFilters.find(f => f.key === activeQuickFilter);
      return filter?.label || 'Custom Range';
    }
    
    if (selectedRange.start && selectedRange.end) {
      return `${format(selectedRange.start, 'MMM dd')} - ${format(selectedRange.end, 'MMM dd')}`;
    }
    
    if (selectedRange.start) {
      return `From ${format(selectedRange.start, 'MMM dd')}`;
    }
    
    if (selectedRange.end) {
      return `Until ${format(selectedRange.end, 'MMM dd')}`;
    }
    
    return 'All Dates';
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-9 px-3 text-sm"
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            {getDisplayText()}
            <Filter className="h-4 w-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filter by Date</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearRange}
                className="h-8 px-2 text-xs"
              >
                Clear
              </Button>
            </div>

            {/* Quick Filters */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Quick Filters</Label>
              <div className="grid grid-cols-2 gap-2">
                {quickFilters.map((filter) => (
                  <Button
                    key={filter.key}
                    variant={activeQuickFilter === filter.key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleQuickFilter(filter.key)}
                    className="text-xs justify-start"
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Date Range */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Custom Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="start-date" className="text-xs text-gray-600">
                    Start Date
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={selectedRange.start ? format(selectedRange.start, 'yyyy-MM-dd') : ''}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="end-date" className="text-xs text-gray-600">
                    End Date
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={selectedRange.end ? format(selectedRange.end, 'yyyy-MM-dd') : ''}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 px-3 text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 px-3 text-xs"
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filter Indicator */}
      {activeQuickFilter !== 'all' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearRange}
          className="h-8 px-2 text-xs text-gray-600 hover:text-gray-800"
        >
          <X className="h-3 w-3 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
