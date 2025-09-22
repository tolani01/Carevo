'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface FilterState {
  assignee: string;
  type: string;
  status: string;
  location: string;
  due: string;
  search?: string;
}

const defaultFilters: FilterState = {
  assignee: 'all',
  type: 'all',
  status: 'all',
  location: 'all',
  due: 'all',
  search: ''
};

export function useUrlFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Initialize filters from URL on mount
  useEffect(() => {
    const urlFilters: FilterState = {
      assignee: searchParams.get('assignee') || 'all',
      type: searchParams.get('type') || 'all',
      status: searchParams.get('status') || 'all',
      location: searchParams.get('location') || 'all',
      due: searchParams.get('due') || 'all',
      search: searchParams.get('search') || ''
    };
    setFilters(urlFilters);
  }, [searchParams]);

  // Update URL when filters change
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters, ...newFilters };

      // Build new URL with filters
      const params = new URLSearchParams();
      
      Object.entries(updatedFilters).forEach(([key, value]) => {
        if (value && value !== 'all' && value !== '') {
          params.set(key, value);
        }
      });

      // Update URL without causing a page reload
      const newUrl = params.toString() 
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
      
      router.replace(newUrl, { scroll: false });
      
      return updatedFilters;
    });
  }, [router]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
    router.replace(window.location.pathname, { scroll: false });
  }, [router]);

  // Clear specific filter
  const clearFilter = useCallback((key: keyof FilterState) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, [key]: defaultFilters[key] };

      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([k, value]) => {
        if (value && value !== 'all' && value !== '') {
          params.set(k, value);
        }
      });

      const newUrl = params.toString() 
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
      
      router.replace(newUrl, { scroll: false });
      
      return newFilters;
    });
  }, [router]);

  // Get active filters count
  const activeFiltersCount = Object.values(filters).filter(
    value => value && value !== 'all' && value !== ''
  ).length;

  // Check if specific filter is active
  const isFilterActive = useCallback((key: keyof FilterState) => {
    const value = filters[key];
    return value && value !== 'all' && value !== '';
  }, [filters]);

  return {
    filters,
    updateFilters,
    clearFilters,
    clearFilter,
    activeFiltersCount,
    isFilterActive
  };
}
