'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { GlobalHeader } from '@/components/GlobalHeader';
import { MobileNavigation } from '@/components/MobileNavigation';
import { CommandPalette } from '@/components/CommandPalette';
import { useKeyboardShortcuts } from '@/lib/hooks/use-keyboard-shortcuts';
import { useRolePermissions, UserRole } from '@/lib/hooks/use-role-permissions';
import { createClient } from '@/lib/supabase/client';
import { AuthUser, getCurrentUser } from '@/lib/auth/auth-utils';

interface AppContextType {
  user: AuthUser | null;
  overdueCount: number;
  mentionCount: number;
  showCommandPalette: boolean;
  showMobileMenu: boolean;
  setShowCommandPalette: (show: boolean) => void;
  setShowMobileMenu: (show: boolean) => void;
  onNewTask: () => void;
  onSearch: (query: string) => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Supabase auth state
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fallback for test users
  const [testUser, setTestUser] = useState<AuthUser | null>(null);

  const [overdueCount] = useState(3);
  const [mentionCount] = useState(1);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      console.log('AppProvider - Initializing auth...');
      
      // Only check localStorage for test user - no async operations
      if (typeof window !== 'undefined') {
        const testUserData = localStorage.getItem('test_user');
        if (testUserData) {
          try {
            const parsedTestUser = JSON.parse(testUserData);
            console.log('AppProvider - Found test user in localStorage:', parsedTestUser.id);
            setUser(parsedTestUser);
          } catch (parseError) {
            console.error('AppProvider - Error parsing test user:', parseError);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const permissions = user ? useRolePermissions(user.role as UserRole) : null;

  const onNewTask = useCallback(() => {
    if (pathname === '/board') {
      // Trigger new task creation on board
      const event = new CustomEvent('new-task');
      window.dispatchEvent(event);
    } else {
      router.push('/board?action=new-task');
    }
  }, [pathname, router]);

  const onSearch = useCallback((query: string) => {
    if (query.trim()) {
      // Implement search functionality
      console.log('Searching for:', query);
      // For now, just log - implement actual search later
    }
  }, []);

  const onProfile = useCallback(() => {
    router.push('/profile');
  }, [router]);

  const onSettings = useCallback(() => {
    router.push('/admin');
  }, [router]);

  const onLogout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }, [router]);

  // Keyboard shortcuts
  const handleSearchFocus = useCallback(() => {
    // Focus search input
    const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }, []);

  const handleCommandPalette = useCallback(() => {
    setShowCommandPalette(true);
  }, [setShowCommandPalette]);

  useKeyboardShortcuts({
    onNewTask,
    onCommandPalette: handleCommandPalette,
    onSearch: handleSearchFocus
  });

  // Always provide the context, even if no user
  const contextValue = useMemo(() => ({
    user,
    overdueCount,
    mentionCount,
    showCommandPalette,
    showMobileMenu,
    setShowCommandPalette,
    setShowMobileMenu,
    onNewTask,
    onSearch,
    loading
  }), [user, overdueCount, mentionCount, showCommandPalette, showMobileMenu, setShowCommandPalette, setShowMobileMenu, onNewTask, onSearch, loading]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <AppContext.Provider value={contextValue}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AppContext.Provider>
    );
  }

  // Don't show header/navigation on login page
  const isLoginPage = pathname === '/login';
  
  // Only show minimal layout on login page
  if (isLoginPage) {
    console.log('AppProvider - Rendering login page');
    return (
      <AppContext.Provider value={contextValue}>
        {children}
      </AppContext.Provider>
    );
  }

  // If we have a user, render the full app
  if (user) {
    console.log('AppProvider - Rendering full app for user:', user.id);
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-50">
        {/* Global Header - only show if user exists */}
        {user && (
          <GlobalHeader
            onSearch={onSearch}
            onNewTask={onNewTask}
            onCommandPalette={() => setShowCommandPalette(true)}
            onProfile={onProfile}
            onSettings={onSettings}
            onLogout={onLogout}
            overdueCount={overdueCount}
            mentionCount={mentionCount}
            userRole={user.role}
            userName={`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email}
            userPhone={user.phone || ''}
            showMobileMenu={showMobileMenu}
            onToggleMobileMenu={() => setShowMobileMenu(!showMobileMenu)}
          />
        )}

        {/* Main Content */}
        <main className="pb-20 md:pb-0">
          {children}
        </main>

        {/* Mobile Navigation - only show if user exists */}
        {user && (
          <MobileNavigation
            overdueCount={overdueCount}
            mentionCount={mentionCount}
            userRole={user.role}
            onNewTask={onNewTask}
          />
        )}

        {/* Command Palette */}
        {showCommandPalette && (
          <CommandPalette
            onClose={() => setShowCommandPalette(false)}
            onTaskSelect={(taskId) => {
              setShowCommandPalette(false);
              router.push(`/board?task=${taskId}`);
            }}
          />
        )}
      </div>
    </AppContext.Provider>
  );
}
