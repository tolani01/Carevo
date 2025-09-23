'use client'

import { useState, useEffect } from 'react'
import { Input } from './ui/input'
import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: (query: string) => void
  placeholder?: string
  debounceMs?: number
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  debounceMs = 300
}: SearchBarProps) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [value, debounceMs])

  useEffect(() => {
    if (debouncedValue !== value) {
      onSearch(debouncedValue)
    }
  }, [debouncedValue, onSearch, value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-10 bg-gray-100 border-0 focus:bg-white focus:ring-2 focus:ring-green-500"
        data-testid="search-input"
        aria-label="Search channels and messages"
      />
    </div>
  )
}
