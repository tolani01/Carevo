'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  MessageSquare, 
  Search, 
  User,
  Bell,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavigationProps {
  overdueCount?: number;
  mentionCount?: number;
  userRole?: string;
  onNewTask?: () => void;
}

export function MobileNavigation({ 
  overdueCount = 0, 
  mentionCount = 0, 
  userRole = 'provider',
  onNewTask 
}: MobileNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showNewTaskMenu, setShowNewTaskMenu] = useState(false);

  const isAuditor = userRole === 'auditor';

  const navigationItems = [
    {
      id: 'my',
      label: 'My Tasks',
      icon: Home,
      href: '/my',
      badge: overdueCount > 0 ? overdueCount : undefined
    },
    {
      id: 'board',
      label: 'Board',
      icon: MessageSquare,
      href: '/board'
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageSquare,
      href: '/chat',
      badge: mentionCount > 0 ? mentionCount : undefined
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      href: '/search'
    }
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const handleNewTask = () => {
    if (onNewTask) {
      onNewTask();
    } else {
      // Default behavior - go to board and trigger new task
      router.push('/board?action=new-task');
    }
  };

  return (
    <>
      {/* Mobile Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "flex flex-col items-center space-y-1 h-auto py-3 px-4 min-h-[44px] min-w-[44px]",
                  isActive 
                    ? "text-indigo-600 bg-indigo-50" 
                    : "text-gray-600 hover:text-gray-900"
                )}
                aria-label={`Navigate to ${item.label}`}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {item.badge && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
                      aria-hidden="true"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            );
          })}
          
          {/* New Task FAB */}
          {!isAuditor && (
            <Button
              onClick={handleNewTask}
              className="flex flex-col items-center space-y-1 h-auto py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full"
            >
              <Plus className="h-5 w-5" />
              <span className="text-xs font-medium">New</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Header - Compact version for mobile */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Carevo</h1>
              <p className="text-xs text-gray-600">Command Center</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {overdueCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {overdueCount}
              </Badge>
            )}
            {mentionCount > 0 && (
              <Badge variant="default" className="text-xs bg-blue-500">
                {mentionCount}
              </Badge>
            )}
            {isAuditor && (
              <Badge variant="outline" className="text-xs">
                Read-Only
              </Badge>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
