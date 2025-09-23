# DueDatePicker Component

## Overview

The `DueDatePicker` is a modal component that allows users to set due dates for tasks with both quick selection options and custom date/time input. It provides an accessible, user-friendly interface for date selection with validation and keyboard navigation support.

## Usage

```tsx
import { DueDatePicker } from '@/components/ui/due-date-picker'

function TaskCard({ task }) {
  const [showDueDatePicker, setShowDueDatePicker] = useState(false)

  return (
    <>
      <button onClick={() => setShowDueDatePicker(true)}>
        Set Due Date
      </button>
      
      <DueDatePicker
        isOpen={showDueDatePicker}
        onClose={() => setShowDueDatePicker(false)}
        onConfirm={(dueDate) => {
          console.log('Due date set:', dueDate)
          setShowDueDatePicker(false)
        }}
        taskTitle={task.title}
        currentDueDate={task.due_at}
      />
    </>
  )
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isOpen` | `boolean` | Yes | - | Whether the picker modal is open |
| `onClose` | `() => void` | Yes | - | Callback when the picker is closed |
| `onConfirm` | `(dueDate: string) => void` | Yes | - | Callback when a due date is confirmed |
| `taskTitle` | `string` | No | - | Title of the task for context |
| `currentDueDate` | `string \| null` | No | - | Current due date of the task (ISO string) |

## Features

### Quick Selection Options
- **Today**: Sets due date to today at 5:00 PM
- **Tomorrow**: Sets due date to tomorrow at 9:00 AM  
- **Next Week**: Sets due date to one week from today at 9:00 AM

### Custom Date Selection
- Date picker with minimum date validation (prevents past dates)
- Optional time selection (defaults to 5:00 PM if not specified)
- Real-time preview of selected date

### Accessibility Features
- Full keyboard navigation support
- Screen reader compatible with proper ARIA labels
- Focus management and trap
- High contrast support
- Clear focus indicators

### Validation
- Prevents selection of past dates
- Shows user-friendly error messages
- Real-time validation feedback

## Accessibility

The component follows WCAG 2.2 AA guidelines:

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Focus Management**: Focus trap within modal, clear focus indicators
- **Color Contrast**: Meets minimum contrast requirements
- **Semantic HTML**: Uses proper dialog role and structure

### Keyboard Shortcuts
- `Tab`: Navigate between options
- `Enter`: Select focused option
- `Escape`: Close modal
- `Space`: Select focused option

## Styling

The component uses Tailwind CSS classes and follows the design token system:

- **Colors**: Uses semantic color tokens (`primary-500`, `success-500`, etc.)
- **Spacing**: Uses design token spacing scale (`sm`, `md`, `lg`, etc.)
- **Typography**: Uses design token font sizes and weights
- **Shadows**: Uses design token shadow scale

## Examples

### Basic Usage
```tsx
<DueDatePicker
  isOpen={true}
  onClose={() => {}}
  onConfirm={(date) => console.log(date)}
  taskTitle="Review patient chart"
/>
```

### With Current Due Date
```tsx
<DueDatePicker
  isOpen={true}
  onClose={() => {}}
  onConfirm={(date) => console.log(date)}
  taskTitle="Follow up with patient"
  currentDueDate="2024-12-25T10:00:00Z"
/>
```

### Custom Date Selection
```tsx
// User can select custom date and time
// Component validates date is not in the past
// Shows preview of selected date
```

## Testing

The component includes comprehensive tests:

- **Unit Tests**: Component behavior, props, and interactions
- **Integration Tests**: Full user workflow testing
- **Accessibility Tests**: Screen reader and keyboard navigation
- **Visual Tests**: Storybook stories for different states

### Running Tests
```bash
# Unit tests
npm test

# Integration tests  
npm run test:e2e

# Storybook (visual testing)
npm run storybook
```

## Implementation Notes

### State Management
- Uses local state for form inputs
- Validates dates in real-time
- Provides immediate feedback to users

### Error Handling
- Shows user-friendly error messages
- Prevents invalid date selection
- Graceful fallbacks for edge cases

### Performance
- Lightweight component with minimal re-renders
- Efficient date calculations
- Optimized for mobile devices

## Future Enhancements

- [ ] Recurring date options (daily, weekly, monthly)
- [ ] Time zone support
- [ ] Integration with calendar systems
- [ ] Bulk date setting for multiple tasks
- [ ] Date range selection
- [ ] Custom date presets

## Related Components

- `TaskCard`: Uses DueDatePicker for task due date management
- `TaskDrawer`: May use DueDatePicker for task editing
- `Calendar`: Could integrate with DueDatePicker for date selection

## Design Tokens Used

```css
/* Colors */
--color-primary-500: #3b82f6
--color-success-500: #22c55e
--color-warning-500: #f59e0b
--color-danger-500: #ef4444

/* Spacing */
--spacing-sm: 0.5rem
--spacing-md: 1rem
--spacing-lg: 1.5rem

/* Typography */
--font-size-sm: 0.875rem
--font-size-base: 1rem
--font-weight-medium: 500
```
