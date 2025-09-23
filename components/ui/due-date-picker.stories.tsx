import type { Meta, StoryObj } from '@storybook/nextjs'
import { DueDatePicker } from './due-date-picker'
import { useState } from 'react'

const meta: Meta<typeof DueDatePicker> = {
  title: 'UI/DueDatePicker',
  component: DueDatePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A modal component for selecting task due dates with quick options and custom date/time selection.',
      },
    },
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the picker modal is open',
    },
    onClose: {
      action: 'closed',
      description: 'Callback when the picker is closed',
    },
    onConfirm: {
      action: 'confirmed',
      description: 'Callback when a due date is confirmed',
    },
    taskTitle: {
      control: 'text',
      description: 'Title of the task for context',
    },
    currentDueDate: {
      control: 'text',
      description: 'Current due date of the task (ISO string)',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DueDatePicker>

// Interactive wrapper component for Storybook
const DueDatePickerWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(args.isOpen || false)
  
  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
      >
        Open Due Date Picker
      </button>
      <DueDatePicker
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={(date) => {
          console.log('Due date confirmed:', date)
          setIsOpen(false)
        }}
      />
    </div>
  )
}

export const Default: Story = {
  render: DueDatePickerWrapper,
  args: {
    taskTitle: 'Follow up with patient about lab results',
    currentDueDate: null,
  },
}

export const WithCurrentDueDate: Story = {
  render: DueDatePickerWrapper,
  args: {
    taskTitle: 'Review patient chart',
    currentDueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
  },
}

export const WithoutTaskTitle: Story = {
  render: DueDatePickerWrapper,
  args: {
    taskTitle: undefined,
    currentDueDate: null,
  },
}

export const AccessibilityTest: Story = {
  render: DueDatePickerWrapper,
  args: {
    taskTitle: 'Accessibility test task',
    currentDueDate: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'Test keyboard navigation, screen reader support, and focus management.',
      },
    },
  },
}

export const QuickOptions: Story = {
  render: DueDatePickerWrapper,
  args: {
    taskTitle: 'Quick options test',
    currentDueDate: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'Test the quick selection options (Today, Tomorrow, Next Week).',
      },
    },
  },
}

export const CustomDateSelection: Story = {
  render: DueDatePickerWrapper,
  args: {
    taskTitle: 'Custom date test',
    currentDueDate: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'Test custom date and time selection functionality.',
      },
    },
  },
}
