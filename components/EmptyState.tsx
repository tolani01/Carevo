'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  FileText, 
  Users, 
  Settings,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  type: 'tasks' | 'messages' | 'users' | 'locations' | 'search' | 'filters' | 'overdue' | 'waiting';
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  showIllustration?: boolean;
}

const emptyStateConfig = {
  tasks: {
    icon: FileText,
    title: 'No tasks found',
    description: 'Get started by creating your first task or adjusting your filters.',
    actionLabel: 'Create Task',
    illustration: '📋'
  },
  messages: {
    icon: MessageSquare,
    title: 'No messages yet',
    description: 'Start a conversation with your team or create a new channel.',
    actionLabel: 'Send Message',
    illustration: '💬'
  },
  users: {
    icon: Users,
    title: 'No team members',
    description: 'Invite your first team member to get started with Carevo.',
    actionLabel: 'Invite User',
    illustration: '👥'
  },
  locations: {
    icon: Settings,
    title: 'No locations configured',
    description: 'Add your first location to organize tasks by location.',
    actionLabel: 'Add Location',
    illustration: '🏥'
  },
  search: {
    icon: Search,
    title: 'No results found',
    description: 'Try adjusting your search terms or filters to find what you\'re looking for.',
    actionLabel: 'Clear Filters',
    illustration: '🔍'
  },
  filters: {
    icon: Filter,
    title: 'No tasks match your filters',
    description: 'Try adjusting your filters or clear them to see all tasks.',
    actionLabel: 'Clear Filters',
    illustration: '🎯'
  },
  overdue: {
    icon: AlertCircle,
    title: 'No overdue tasks',
    description: 'Great job! All your tasks are up to date.',
    actionLabel: 'View All Tasks',
    illustration: '✅'
  },
  waiting: {
    icon: Clock,
    title: 'No waiting tasks',
    description: 'All tasks are moving forward. Check back later for updates.',
    actionLabel: 'View All Tasks',
    illustration: '⏳'
  }
};

export function EmptyState({
  type,
  title,
  description,
  action,
  secondaryAction,
  className,
  showIllustration = true
}: EmptyStateProps) {
  const config = emptyStateConfig[type];
  const Icon = config.icon;

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        {showIllustration && (
          <div className="text-6xl mb-4">
            {config.illustration}
          </div>
        )}
        
        <div className="mb-4">
          <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title || config.title}
          </h3>
          <p className="text-gray-600 max-w-md">
            {description || config.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <Button onClick={action.onClick} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              {action.label}
            </Button>
          )}
          
          {secondaryAction && (
            <Button 
              variant="outline" 
              onClick={secondaryAction.onClick}
              className="w-full sm:w-auto"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton loader component
export function SkeletonLoader({ 
  type = 'card', 
  count = 3, 
  className 
}: { 
  type?: 'card' | 'list' | 'table';
  count?: number;
  className?: string;
}) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="animate-pulse">
            <div className="bg-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-16 bg-gray-300 rounded"></div>
                <div className="h-4 w-12 bg-gray-300 rounded"></div>
              </div>
              <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className="animate-pulse">
            <div className="bg-gray-200 rounded-lg p-4 space-y-3">
              <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
            </div>
          </div>
        );
      
      case 'table':
        return (
          <div className="animate-pulse">
            <div className="bg-gray-200 rounded-lg p-4">
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-300 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
}
