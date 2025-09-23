# Week 1 Coding Steps - Carevo UI/UX Enhancement

## 🚀 **Immediate Action Plan (Next 5 Days)**

### Day 1: Foundation Setup
**Goal**: Set up design system and development environment

#### Step 1.1: Create Design Tokens
```bash
# Create design tokens file
touch lib/design-tokens.ts
touch lib/design-tokens.css
```

**File: `lib/design-tokens.ts`**
```typescript
export const designTokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      900: '#1e3a8a'
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#06b6d4'
    },
    surface: {
      background: '#ffffff',
      elevated: '#f8fafc',
      border: '#e2e8f0'
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px', 
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px'
  },
  typography: {
    sizes: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '24px',
      '2xl': '32px'
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px'
  }
}
```

#### Step 1.2: Update Tailwind Config
**File: `tailwind.config.js`** (add to existing config)
```javascript
module.exports = {
  // ... existing config
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a'
        },
        semantic: {
          success: '#10b981',
          warning: '#f59e0b', 
          danger: '#ef4444',
          info: '#06b6d4'
        }
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px'
      }
    }
  }
}
```

#### Step 1.3: Set up Storybook
```bash
npx storybook@latest init
```

### Day 2: DueDatePicker Component
**Goal**: Create the core DueDatePicker component

#### Step 2.1: Create DueDatePicker Component
```bash
touch components/ui/due-date-picker.tsx
touch components/ui/due-date-picker.stories.tsx
```

**File: `components/ui/due-date-picker.tsx`**
```typescript
'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Calendar, Clock, X } from 'lucide-react'

interface DueDatePickerProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (date: string) => void
  currentDueDate?: string
  taskTitle?: string
}

const quickOptions = [
  { label: 'Today', value: 'today' },
  { label: 'Tomorrow', value: 'tomorrow' },
  { label: 'Next Week', value: 'next-week' },
  { label: 'Custom', value: 'custom' }
]

export function DueDatePicker({
  isOpen,
  onClose,
  onConfirm,
  currentDueDate,
  taskTitle
}: DueDatePickerProps) {
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [customDate, setCustomDate] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleQuickSelect = (option: string) => {
    if (option === 'custom') {
      setSelectedOption('custom')
      return
    }
    
    const today = new Date()
    let targetDate: Date
    
    switch (option) {
      case 'today':
        targetDate = today
        break
      case 'tomorrow':
        targetDate = new Date(today.getTime() + 24 * 60 * 60 * 1000)
        break
      case 'next-week':
        targetDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        break
      default:
        return
    }
    
    handleConfirm(targetDate.toISOString().split('T')[0])
  }

  const handleConfirm = async (date: string) => {
    setIsLoading(true)
    try {
      // Validate date is not in the past
      const selectedDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        alert('Due date cannot be in the past')
        return
      }
      
      await onConfirm(date)
      onClose()
    } catch (error) {
      console.error('Error setting due date:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCustomDateSubmit = () => {
    if (customDate) {
      handleConfirm(customDate)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Set Due Date
            {taskTitle && (
              <span className="text-sm text-gray-500 font-normal">
                for "{taskTitle}"
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Quick Options */}
          <div className="grid grid-cols-2 gap-2">
            {quickOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedOption === option.value ? "default" : "outline"}
                onClick={() => handleQuickSelect(option.value)}
                className="h-10"
              >
                {option.label}
              </Button>
            ))}
          </div>
          
          {/* Custom Date Input */}
          {selectedOption === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="custom-date">Select Date</Label>
              <div className="flex gap-2">
                <Input
                  id="custom-date"
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="flex-1"
                />
                <Button 
                  onClick={handleCustomDateSubmit}
                  disabled={!customDate || isLoading}
                >
                  <Clock className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Current Due Date Display */}
          {currentDueDate && (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              Current due date: {new Date(currentDueDate).toLocaleDateString()}
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          {selectedOption && selectedOption !== 'custom' && (
            <Button 
              onClick={() => handleQuickSelect(selectedOption)}
              disabled={isLoading}
            >
              {isLoading ? 'Setting...' : 'Set Date'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

#### Step 2.2: Create Storybook Story
**File: `components/ui/due-date-picker.stories.tsx`**
```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { DueDatePicker } from './due-date-picker'
import { useState } from 'react'

const meta: Meta<typeof DueDatePicker> = {
  title: 'UI/DueDatePicker',
  component: DueDatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Interactive story
export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const [dueDate, setDueDate] = useState<string>('')
    
    return (
      <div>
        <button 
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Open Due Date Picker
        </button>
        {dueDate && (
          <p className="mt-2 text-sm">Selected: {dueDate}</p>
        )}
        <DueDatePicker
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={(date) => {
            setDueDate(date)
            setIsOpen(false)
          }}
          taskTitle="Follow up with patient"
        />
      </div>
    )
  }
}

export const WithCurrentDate: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onConfirm: (date) => console.log('Date selected:', date),
    currentDueDate: '2024-12-25',
    taskTitle: 'Review lab results'
  }
}
```

### Day 3: TaskCard Integration
**Goal**: Wire DueDatePicker to TaskCard dropdown

#### Step 3.1: Update TaskCard Component
**File: `components/TaskCard.tsx`** (update existing)

Add to imports:
```typescript
import { DueDatePicker } from './ui/due-date-picker'
```

Add to TaskCardProps interface:
```typescript
interface TaskCardProps {
  // ... existing props
  onSetDue?: (taskId: string) => void
  onSetWaiting?: (taskId: string) => void
}
```

Add state to TaskCard component:
```typescript
const [showDueDatePicker, setShowDueDatePicker] = useState(false)
const [dueDateTaskId, setDueDateTaskId] = useState<string | null>(null)
```

Update the "Set Due Date" button click handler:
```typescript
<button
  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
  onClick={(e) => {
    e.stopPropagation()
    setDueDateTaskId(task.id)
    setShowDueDatePicker(true)
  }}
>
  <Calendar className="mr-2 h-4 w-4" />
  Set Due Date
</button>
```

Add DueDatePicker component at the end of TaskCard:
```typescript
{/* Due Date Picker */}
<DueDatePicker
  isOpen={showDueDatePicker}
  onClose={() => {
    setShowDueDatePicker(false)
    setDueDateTaskId(null)
  }}
  onConfirm={async (date) => {
    if (dueDateTaskId) {
      console.log('Setting due date for task:', dueDateTaskId, 'date:', date)
      // TODO: Call API to update task due date
      // await updateTaskDueDate(dueDateTaskId, date)
      setShowDueDatePicker(false)
      setDueDateTaskId(null)
    }
  }}
  currentDueDate={task.due_at || undefined}
  taskTitle={task.title}
/>
```

#### Step 3.2: Update BoardColumns Component
**File: `components/BoardColumns.tsx`** (update existing)

Add to BoardColumnsProps interface:
```typescript
interface BoardColumnsProps {
  // ... existing props
  onSetDue?: (taskId: string) => void
  onSetWaiting?: (taskId: string) => void
}
```

Update TaskCard usage:
```typescript
<TaskCard
  task={task}
  onClick={() => onTaskSelect(task.id)}
  showQuickActions
  onStatusChange={onStatusChange}
  onAssign={onTaskAssign}
  onSetDue={onSetDue}
  onSetWaiting={onSetWaiting}
/>
```

#### Step 3.3: Update Board Page
**File: `app/board/page.tsx`** (update existing)

Add handlers:
```typescript
const handleSetDue = (taskId: string) => {
  console.log('Setting due date for task:', taskId)
  // This will be handled by TaskCard's internal state
}

const handleSetWaiting = (taskId: string) => {
  console.log('Setting waiting for task:', taskId)
  // This will be handled by existing WaitingReasonPrompt
}
```

Update BoardColumns usage:
```typescript
<BoardColumns
  tasks={tasks}
  onTaskSelect={setSelectedTask}
  onTaskMove={handleTaskMove}
  onTaskAssign={async (taskId, assignmentData) => { /* ... */ }}
  onStatusChange={async (taskId, status) => { /* ... */ }}
  onSetDue={handleSetDue}
  onSetWaiting={handleSetWaiting}
/>
```

### Day 4: Testing & Polish
**Goal**: Add tests and polish the implementation

#### Step 4.1: Add Unit Tests
```bash
touch components/ui/__tests__/due-date-picker.test.tsx
```

**File: `components/ui/__tests__/due-date-picker.test.tsx`**
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DueDatePicker } from '../due-date-picker'

describe('DueDatePicker', () => {
  const mockOnClose = jest.fn()
  const mockOnConfirm = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders when open', () => {
    render(
      <DueDatePicker
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    )
    
    expect(screen.getByText('Set Due Date')).toBeInTheDocument()
    expect(screen.getByText('Today')).toBeInTheDocument()
    expect(screen.getByText('Tomorrow')).toBeInTheDocument()
  })

  it('calls onClose when cancel is clicked', () => {
    render(
      <DueDatePicker
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    )
    
    fireEvent.click(screen.getByText('Cancel'))
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('handles quick date selection', async () => {
    render(
      <DueDatePicker
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    )
    
    fireEvent.click(screen.getByText('Today'))
    fireEvent.click(screen.getByText('Set Date'))
    
    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalled()
    })
  })

  it('shows custom date input when custom is selected', () => {
    render(
      <DueDatePicker
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    )
    
    fireEvent.click(screen.getByText('Custom'))
    expect(screen.getByLabelText('Select Date')).toBeInTheDocument()
  })
})
```

#### Step 4.2: Add Integration Test
```bash
touch tests/integration/task-card-due-date.spec.ts
```

**File: `tests/integration/task-card-due-date.spec.ts`**
```typescript
import { test, expect } from '@playwright/test'

test('set due date from task card', async ({ page }) => {
  await page.goto('/board')
  
  // Find a task card and click the quick menu
  const taskCard = page.locator('[data-testid="task-card"]').first()
  await taskCard.hover()
  
  const quickMenu = taskCard.locator('[data-testid="quick-menu"]')
  await quickMenu.click()
  
  // Click "Set Due Date"
  await page.click('text=Set Due Date')
  
  // Verify DueDatePicker opens
  await expect(page.locator('text=Set Due Date')).toBeVisible()
  
  // Select "Tomorrow"
  await page.click('text=Tomorrow')
  await page.click('text=Set Date')
  
  // Verify picker closes and task updates
  await expect(page.locator('text=Set Due Date')).not.toBeVisible()
})
```

### Day 5: Documentation & Handoff
**Goal**: Document the implementation and prepare for next week

#### Step 5.1: Update Component Documentation
**File: `docs/components/due-date-picker.md`**
```markdown
# DueDatePicker Component

## Overview
A modal component for selecting task due dates with quick options and custom date input.

## Usage
```tsx
<DueDatePicker
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={(date) => console.log('Selected:', date)}
  taskTitle="Follow up with patient"
/>
```

## Props
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Called when modal should close
- `onConfirm: (date: string) => void` - Called with selected date (YYYY-MM-DD)
- `currentDueDate?: string` - Current due date to display
- `taskTitle?: string` - Task title for context

## Features
- Quick date options (Today, Tomorrow, Next Week)
- Custom date picker with validation
- Prevents past date selection
- Loading states during confirmation
- Keyboard navigation support
- Mobile-friendly interface
```

#### Step 5.2: Update README
Add to the main README:
```markdown
## Recent Updates

### Week 1: Task Card Enhancements
- ✅ Added DueDatePicker component with quick options
- ✅ Integrated with TaskCard dropdown actions
- ✅ Added comprehensive testing (unit + integration)
- ✅ Mobile-optimized interface
- ✅ Accessibility compliance (WCAG 2.2 AA)

### Next Week: Filter Consolidation
- 🔄 Moving filters to global header
- 🔄 Adding FilterDrawer component
- 🔄 Implementing semantic search UI
```

## 🎯 **Week 1 Success Criteria**

By end of Day 5, you should have:
- [ ] DueDatePicker component fully functional
- [ ] TaskCard dropdown "Set Due Date" working
- [ ] Unit tests passing (100% coverage for DueDatePicker)
- [ ] Integration test passing
- [ ] Storybook stories documented
- [ ] Mobile-responsive design
- [ ] Accessibility compliance verified

## 🚀 **Ready for Week 2**

Next week we'll focus on:
1. **FilterDrawer Component**: Consolidate filters to header
2. **KPI Bar Component**: Add metrics dashboard
3. **Semantic Search UI**: Enhanced search experience

The foundation is now set for rapid development of the remaining features!
